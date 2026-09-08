# Workflow artwork

These transparent PNGs are extracted from `../phenolab-scientific-workflow.png`.
All visible labels and descriptions are rendered by React; these assets contain
only icons and illustrations.

- Colored cutouts preserve the field illustration, analysis icons, and agent.
- White RGBA glyphs are used as CSS alpha masks, so their color follows the theme.
- The knowledge-base cylinder is drawn with CSS and uses extracted glyphs.

To reproduce the assets from the repository root, using Python with Pillow:

```sh
python3 website/scripts/extract-workflow-artwork.py
```

The extraction script records crop bounds and preserves the original source PNG.
