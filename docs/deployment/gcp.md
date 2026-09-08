# Google Cloud Platform Deployment

Use the GCP deployment when PhenoWorks needs managed infrastructure for the API, UI, background worker, metadata database, object storage, and queueing. The deployment in `deployment/gcp/` uses Cloud Run, Cloud SQL, GCS, Pub/Sub, Artifact Registry, Cloud Build, and Terraform.

## Current Versions

| Component | Version or setting |
| --- | --- |
| PhenoWorks backend package | `1.0.0` |
| PhenoWorks UI package | `1.0.0` |
| API/worker Python image | `ghcr.io/astral-sh/uv:python3.11-bookworm` |
| Terraform | `>= 1.6.0` |
| Google Terraform provider | `~> 6.0` |
| Cloud SQL database version | `POSTGRES_16` |
| Default Cloud SQL edition | `ENTERPRISE` |
| Default Cloud SQL tier | `db-custom-2-7680` |
| TiTiler image | `ghcr.io/developmentseed/titiler:latest` |

## Architecture

The GCP stack maps the local Compose services to managed services:

| PhenoWorks responsibility | GCP service |
| --- | --- |
| API | Cloud Run service built from `deployment/gcp/Dockerfile.api` |
| UI | Cloud Run service built from `deployment/gcp/Dockerfile.ui` |
| Celery worker | Cloud Run service using the API image and a worker command |
| Metadata database | Cloud SQL for PostgreSQL 16 |
| File and upload storage | GCS bucket |
| Celery broker | Pub/Sub through Celery's `gcpubsub://` transport |
| Container images | Artifact Registry |
| Infrastructure | Terraform under `deployment/gcp/terraform` |

The GCP API image installs the `cloud-gcp` extra, so it includes the GCS and Pub/Sub dependencies needed by the hosted runtime.

## Prerequisites

Install and authenticate:

- `gcloud`
- Terraform `1.6.0` or newer
- Access to create Artifact Registry, Cloud Build, Cloud Run, Cloud SQL, GCS, Pub/Sub, Secret Manager, and IAM resources in the target project

Set the active project:

```bash
gcloud config set project <your-gcp-project-id>
```

## Configure Terraform

From the repository root:

```bash
cd deployment/gcp/terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`. At minimum, set:

```hcl
project_id        = "<your-gcp-project-id>"
database_password = "<database-password>"
secret_key        = "<phenoworks-secret-key>"
admin_email       = "admin@phenoworks.local"
admin_password    = "<admin-password>"
nextauth_secret   = "<auth-secret>"
image_tag         = "latest"
```

Image names are centralized in Terraform:

```hcl
region                 = "us-central1"
artifact_repository_id = "phenoworks"
api_image_name         = "phenoworks-api"
ui_image_name          = "phenoworks-ui"
```

Terraform derives deployed images in this shape:

```text
<region>-docker.pkg.dev/<project_id>/<artifact_repository_id>/<api_image_name>:<image_tag>
<region>-docker.pkg.dev/<project_id>/<artifact_repository_id>/<ui_image_name>:<image_tag>
```

If an older `terraform.tfvars` file still has full `api_image = ...` or `ui_image = ...` entries, remove them and use the centralized image settings above.

## Build and Deploy

Initialize Terraform:

```bash
terraform init
```

Create Artifact Registry first:

```bash
terraform apply -target=google_artifact_registry_repository.phenoworks
```

Build and push the API and UI images:

```bash
cd ../../..

gcloud builds submit \
  --config deployment/gcp/cloudbuild.api.yaml \
  --substitutions _REGION=us-central1,_REPOSITORY=phenoworks,_IMAGE_NAME=phenoworks-api,_TAG=latest \
  .

gcloud builds submit \
  --config deployment/gcp/cloudbuild.ui.yaml \
  --substitutions _REGION=us-central1,_REPOSITORY=phenoworks,_IMAGE_NAME=phenoworks-ui,_TAG=latest \
  .
```

Deploy the infrastructure and Cloud Run services:

```bash
cd deployment/gcp/terraform
terraform apply
```

After the first full apply, read the generated service URLs:

```bash
terraform output api_url
terraform output ui_url
```

Copy those outputs back into `terraform.tfvars`:

```hcl
public_api_base_url = "https://<api-cloud-run-url>/api"
public_ui_origin    = "https://<ui-cloud-run-url>"
```

Apply again:

```bash
terraform apply
```

The second apply lets the API generate public TiTiler COG URLs with the final API base URL and lets GCS resumable upload sessions accept the final UI origin.

## Hosted Runtime Settings

The Terraform deployment configures the hosted stack with managed GCP backends:

```bash
PHENOWORKS_UPLOAD_STORE_URI=gs://<bucket>
PHENOWORKS_RESUMABLE_UPLOAD_BACKEND=gcs
PHENOWORKS_OPERATION_QUEUE_BACKEND=celery
PHENOWORKS_CELERY_BROKER_URL=gcpubsub://projects/<project-id>
PHENOWORKS_CELERY_PUBSUB_QUEUE_NAME_PREFIX=phenoworks-
```

The worker is a Cloud Run service with `worker_min_instances = 1`, always-allocated CPU, and Celery `--concurrency=1` so one worker instance processes one heavy raster task at a time. The default worker sizing is `worker_cpu = "4"` and `worker_memory = "16Gi"`.

Cloud SQL uses the Cloud Run Cloud SQL connector. The starter Terraform enables public IPv4 because Cloud SQL requires at least one connectivity mode. For private-only production deployments, replace that with private IP or PSC before setting `cloud_sql_ipv4_enabled = false`.

## Updating Images

Rebuild images with an immutable tag:

```bash
TAG=$(git rev-parse --short HEAD)

gcloud builds submit \
  --config deployment/gcp/cloudbuild.api.yaml \
  --substitutions _REGION=us-central1,_REPOSITORY=phenoworks,_IMAGE_NAME=phenoworks-api,_TAG=$TAG \
  .

gcloud builds submit \
  --config deployment/gcp/cloudbuild.ui.yaml \
  --substitutions _REGION=us-central1,_REPOSITORY=phenoworks,_IMAGE_NAME=phenoworks-ui,_TAG=$TAG \
  .
```

Set the same tag in `terraform.tfvars`:

```hcl
image_tag = "<tag>"
```

Then apply:

```bash
cd deployment/gcp/terraform
terraform apply
```

## Outputs

After deployment, inspect:

```bash
terraform output api_url
terraform output ui_url
terraform output worker_url
terraform output titiler_url
terraform output storage_bucket
terraform output cloud_sql_connection_name
terraform output celery_pubsub_queue
```

## Teardown

Preview the destroy plan:

```bash
cd deployment/gcp/terraform
terraform plan -destroy
```

By default, `deletion_protection = true`, so Terraform will not delete Cloud Run services, the Cloud SQL instance, or force-delete the GCS bucket. For a disposable environment, set:

```hcl
deletion_protection = false
```

Apply that change, then destroy:

```bash
terraform apply
terraform destroy
```

Do not disable deletion protection for environments that contain production research data.
