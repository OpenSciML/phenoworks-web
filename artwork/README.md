# Improved research drone

Generated with the built-in imagegen tool from the original workflow's field-stack
illustration. Only the generated drone is used. The data cube retains the original extracted pixels, including its canopy,
multicolor data layers, grayscale layer, and soil. Only the pale backdrop of the
old sensing beam above the canopy is made transparent.

- Generated source: `drone-field-v2-source.png`
- Website drone: `../static/img/workflow/research-drone-v2.png`
- Original cube: `../static/img/workflow/data-cube-original.png`
- Reproduce cutouts: `python3 website/scripts/prepare-workflow-drone.py` from the repository root with Pillow installed.

## Generation prompt

Use case: illustration-story. Create a substantially improved replacement illustration for a professional crop-phenotyping scientific software website, using the supplied small diagram crop only as a subject reference. Deliver ONLY the artwork, no UI, no labels, no lettering. Subject: a clearly recognizable premium silver-white research quadcopter with four rotors, visible camera gimbal and dark mechanical accents, hovering above a beautiful isometric rectangular sample of a real agricultural field. Neat dense green crop rows on top, one slim teal/blue false-color spectral measurement layer below, then a rich brown soil cross-section with subtle roots. Avoid the toy Lego appearance and rainbow block stack of the old image; use refined scientific editorial 3D illustration, precise geometry, natural leaves, realistic but clean materials. Layout: compact LANDSCAPE 3:2 composition suitable for a wide image above a card's feature list. Drone large enough to read at small sizes, upper-left/upper-middle, field below and slightly right; less empty air between them. Thin subtle cyan sensor rays connecting gimbal to crop rows, NOT a solid opaque white cone. Balanced restrained detail, crisp high-resolution edges, bright readable drone silhouette on dark themes. Entire drone and field fully inside the canvas with modest padding. Isolate the artwork on a perfectly uniform solid WHITE background for subsequent asset extraction; no checkerboard, no grey backdrop, no floor plane, no background shadow, no scene surrounding the isolated subject. No icons, text, borders, logos, or watermark.

The request to preserve the multi-layer cube arrived after generation. The generated
field was therefore excluded from the website composition; the original cube was
kept and the sensor rays were drawn in SVG between the two separate assets.
