"""Extract text-free artwork from the original workflow for the native React map.

Run with a Python environment containing Pillow. The original PNG is read-only;
small RGBA assets are written to website/static/img/workflow.
"""
from collections import deque
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'static/img/phenolab-scientific-workflow.png'
OUTPUT = ROOT / 'static/img/workflow'

# Bounds use the original 1672 x 941 canvas. Modes distinguish dark glyphs,
# white glyphs on the database cylinder, and full-color illustrations.
CROPS: dict[str, tuple[tuple[int, int, int, int], str]] = {
    'field-trials': ((55, 243, 120, 316), 'dark'),
    'imagery': ((55, 328, 120, 403), 'dark'),
    'sensors': ((55, 414, 120, 488), 'dark'),
    'lab': ((55, 500, 120, 576), 'dark'),
    'metadata': ((55, 584, 120, 658), 'dark'),
    'ingestion': ((493, 249, 567, 326), 'color'),
    'quality': ((493, 362, 567, 442), 'color'),
    'modeling': ((493, 474, 567, 556), 'color'),
    'products': ((493, 597, 567, 670), 'color'),
    'datasets': ((861, 299, 890, 343), 'light'),
    'figures': ((859, 370, 891, 409), 'light'),
    'models': ((857, 439, 892, 482), 'light'),
    'provenance': ((858, 510, 892, 555), 'light'),
    'literature': ((858, 587, 893, 630), 'light'),
    'search': ((1130, 239, 1168, 278), 'dark'),
    'trace': ((1130, 348, 1168, 391), 'dark'),
    'compare': ((1121, 461, 1174, 502), 'dark'),
    'export': ((1128, 572, 1169, 610), 'dark'),
    'agent-overview': ((1260, 362, 1385, 487), 'color'),
    'process': ((1439, 290, 1490, 334), 'dark'),
    'interpret': ((1440, 401, 1489, 458), 'dark'),
    'support': ((1440, 515, 1489, 575), 'dark'),
    'downstream': ((208, 801, 277, 876), 'dark'),
    'discovery': ((552, 798, 610, 877), 'dark'),
    'manuscripts': ((885, 795, 947, 877), 'dark'),
    'grants': ((1208, 794, 1279, 878), 'dark'),
    'field-stack': ((304, 255, 444, 607), 'color'),
}


def extract_glyph(image: Image.Image, *, light: bool) -> Image.Image:
    """Return a transparent glyph mask, selecting light or dark source marks.

    Args:
        image: Cropped source artwork without text.
        light: Select white foreground marks from a dark colored background.

    Returns:
        White RGBA glyph whose alpha preserves the source's antialiased edges.
    """
    rgba = Image.new('RGBA', image.size)
    alpha = []
    pixels = image.convert('RGB').load()
    for red, green, blue in (pixels[x, y] for y in range(image.height) for x in range(image.width)):
        strength = min(red, green, blue) if light else 255 - min(red, green, blue)
        floor = 100 if light else 35
        alpha.append(max(0, min(255, round((strength - floor) * 255 / (255 - floor)))))
    mask = Image.new('L', image.size)
    mask.putdata(alpha)
    rgba.paste((255, 255, 255, 255), (0, 0, *image.size))
    rgba.putalpha(mask)
    return rgba


def extract_color(image: Image.Image, *, background_floor: int = 200) -> Image.Image:
    """Remove edge-connected pale background while retaining enclosed white marks.

    Args:
        image: A tightly cropped colored icon or field illustration.
        background_floor: Minimum channel intensity treated as a neutral backdrop.

    Returns:
        RGBA cutout with transparent exterior and original foreground colors.
    """
    result = image.convert('RGBA')
    width, height = result.size
    pixels = result.load()
    pending = deque([(x, y) for x in range(width) for y in (0, height - 1)] +
                    [(x, y) for y in range(height) for x in (0, width - 1)])
    visited: set[tuple[int, int]] = set()
    while pending:
        x, y = pending.popleft()
        if (x, y) in visited or not (0 <= x < width and 0 <= y < height):
            continue
        visited.add((x, y))
        red, green, blue, _ = pixels[x, y]
        if min(red, green, blue) < background_floor or max(red, green, blue) - min(red, green, blue) > 32:
            continue
        pixels[x, y] = (red, green, blue, 0)
        pending.extend(((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)))
    return result


def main() -> None:
    """Write reproducible, text-free RGBA assets from the original diagram."""
    source = Image.open(SOURCE)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for name, (bounds, mode) in CROPS.items():
        crop = source.crop(bounds)
        result = (extract_color(crop, background_floor=130 if name == 'field-stack' else 200)
                  if mode == 'color' else extract_glyph(crop, light=mode == 'light'))
        if name == 'agent-overview':
            # Keep the circular portrait; the surrounding dotted rings belong to
            # the original layout, not the reusable agent artwork.
            mask = Image.new('L', (result.width * 4, result.height * 4))
            ImageDraw.Draw(mask).ellipse((12, 12, mask.width - 12, mask.height - 12), fill=255)
            mask = mask.resize(result.size, Image.Resampling.LANCZOS)
            result.putalpha(ImageChops.multiply(result.getchannel('A'), mask))
        result.save(OUTPUT / f'{name}.png', optimize=True)
    print(f'Extracted {len(CROPS)} transparent assets to {OUTPUT}')


if __name__ == '__main__':
    main()
