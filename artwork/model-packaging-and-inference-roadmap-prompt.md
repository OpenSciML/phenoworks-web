# Model packaging and inference infographic

Generated with the built-in image generation tool.

## Initial prompt

Create a polished wide landscape scientific software architecture infographic for a PhenoWorks roadmap blog, approximately 2:1 aspect ratio, high resolution. Visual style: elegant white background with extremely faint topographic contour lines, subtle aerial crop-field photograph fading into white in upper left, soft shadows, rounded white cards, emerald green, teal, cyan, navy-blue text and restrained golden amber accents. Use appealing isometric 3D interlocking toy-like building blocks for LgoPy, clean dimensional package/server/database icons. Professional academic infographic, crisp generous readable typography, uncluttered hierarchy, not a screenshot. No invented third-party logos.

Title at top: "From trained models to reusable workflows"
Small subtitle: "PhenoWorks + BentoML + LgoPy"
Clearly visible status pill: "Proposed architecture"

Main upper flow left to right with unambiguous arrows and four numbered cards:
1 "Train externally" — laptop with minimal plots and small illustrative crop segmentation mask. Labels "scikit-learn", "YOLO", "LLMs". Tiny secondary line "Model + preprocessing + dependencies".
2 "Package with BentoML" — emerald archive/package illustration marked ".bento". Secondary label "Inference service". Show small adjacent weight cylinder labeled "Weights" connected to package with subtle line, note "Bundled or referenced".
3 "PhenoWorks Models" — large central stylish conceptual white model catalog panel, NOT a real screenshot; two clean rows "Leaf segmentation   v1.2" and "Biomass predictor   v0.3". Buttons "Upload" and "Deploy". Small caption "Versions and access".
4 "Deploy inference" — server enclosing one emerald container and small GPU chip. Secondary line "Build → Start → Ready". At card base endpoint pill "Authorized endpoint". This is runtime serving, not registry.

Lower band: clear runtime flow LEFT TO RIGHT across page, separate from upper packaging flow, with heading "Use in a LgoPy workflow". Card "Dataset" with crop image and table icon → stack of three isometric blocks named "Prepare inputs", "Model inference", "Save outputs". Beside stack show concise code card containing EXACT line:
self.models.get("leaf_segmentation", version="1.2.0")
Arrow from Model inference to a white card titled "Injected model resolver", with sublabel "BaseModelRegistry" and three concise lines "Authorize", "Resolve exact version", "Return inference client". Resolver arrow toward upper "Authorized endpoint"; a separate labeled return arrow "Predictions" leads down from endpoint to final lower-right "Results" card showing mask imagery, a small measurement table, labels "Masks • Measurements • Artifacts".
Dataset arrow should connect to Prepare inputs. Results card should connect naturally to Save outputs or label as resulting artifacts. Ensure narrative reads data -> block -> resolver -> endpoint -> predictions -> output. Do not draw package upload into block as inference.
Along very bottom narrow provenance strip: "Reproducibility: model version • Bento checksum • image digest • parameters • outputs".
Use no extra text or unrequested actors. Exact casing PhenoWorks, BentoML, LgoPy, BaseModelRegistry. Make diagram readable and attractive like an established crop phenotyping platform infographic, with balanced breathing space and vivid realistic green crop details.

## Refinement prompt

Edit this infographic only to remove the extraneous decorative margin slogans: remove 'MEASURE UNDERSTAND GROW' on the left, 'Plants data for a brighter tomorrow' at upper right, 'HIGHER THROUGHPUT HEALTHIER CROPS BRIGHTER TOMORROWS' on right, and 'From phenotypes to progress' at lower right. Replace with continuation of existing natural background. Preserve all other text, architecture labels, code, arrows, imagery, layout, proportions, and colors exactly. Do not add any text.

