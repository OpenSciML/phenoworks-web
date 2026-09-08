import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import TeamDirectory from '@site/src/components/TeamDirectory';

/** Render the public PhenoWorks team page with site navigation and metadata. */
export default function Team(): ReactNode {
  return (
    <Layout title="Team" description="Meet the developers, contributors, project leadership, and scientific advisors behind PhenoWorks.">
      <TeamDirectory />
    </Layout>
  );
}
