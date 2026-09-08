"""Prepare the imagegen drone and preserve the original multi-layer cube.

The source illustration is retained in website/artwork. Only the drone is taken
from the generated image; the cube is cropped without repainting its pixels.
"""
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'static/img/workflow'


def prepare_drone() -> Image.Image:
    """Extract the generated drone, retaining its silver shell and soft rotor edges."""
    source = Image.open(ROOT / 'artwork/drone-field-v2-source.png').convert('RGB')
    # Protect the light silver shell from white-background removal. Coordinates
    # follow its silhouette in the 1536 x 1024 generated source.
    shell = Image.new('1', source.size)
    ImageDraw.Draw(shell).polygon([
        (459, 109), (467, 96), (505, 88), (532, 90), (573, 109),
        (599, 133), (616, 153), (637, 168), (650, 187), (650, 211),
        (641, 220), (625, 225), (597, 230), (580, 239), (540, 232),
        (513, 223), (492, 216), (471, 201), (451, 183), (443, 159),
        (445, 133), (452, 121),
    ], fill=1)
    result = Image.new('RGBA', (1000, 325))
    pixels, keep, target = source.load(), shell.load(), result.load()
    for y in range(20, 345):
        for x in range(20, 1020):
            red, green, blue = pixels[x, y]
            if y >= 306 and 550 <= x <= 880:
                continue  # Sensor rays are rebuilt as native SVG, not white cutouts.
            if keep[x, y]:
                target[x - 20, y - 20] = (red, green, blue, 255)
                continue
            alpha = min(1.0, (255 - min(red, green, blue)) / 105)
            if alpha <= 0.04:
                continue
            rgb = tuple(max(0, min(255, round((c - 255 * (1 - alpha)) / alpha)))
                        for c in (red, green, blue))
            target[x - 20, y - 20] = (*rgb, round(alpha * 255))
    return result


def main() -> None:
    """Write the new drone and an unchanged crop of the existing data cube."""
    prepare_drone().save(OUTPUT / 'research-drone-v2.png', optimize=True)
    original = Image.open(OUTPUT / 'field-stack.png')
    cube = original.crop((0, 100, original.width, original.height))
    pixels = cube.load()
    # Remove the old beam's pale backdrop above the canopy. Retain every RGB
    # pixel of the original cube; only backdrop alpha is cleared.
    for y in range(40):
        for x in range(cube.width):
            red, green, blue, alpha = pixels[x, y]
            if min(red, green, blue) >= 135:
                pixels[x, y] = (red, green, blue, 0)
    cube.save(OUTPUT / 'data-cube-original.png', optimize=True)


if __name__ == '__main__':
    main()
