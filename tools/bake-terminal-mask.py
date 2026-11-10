"""Optional regeneration of the terminal alpha mask: Pillow and NumPy required."""
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
# 2x resolution retains subpixel contours. +/-2.5 samples reproduce the
# original shader's +/-1.25 source-pixel stroke dilation.
alpha = np.asarray(
    Image.open(ROOT / "src/assets/terminal-logo.png")
    .getchannel("A")
    .resize((2008, 1004), Image.Resampling.BILINEAR),
    dtype=np.float32,
)
padded = np.pad(alpha, 4, mode="edge")
height, width = alpha.shape
samples = [alpha]
for dy, dx in [(0, 2), (0, -3), (2, 0), (-3, 0)]:
    if dx:
        sample = (
            padded[4:4 + height, 4 + dx:4 + dx + width]
            + padded[4:4 + height, 5 + dx:5 + dx + width]
        ) * 0.5
    else:
        sample = (
            padded[4 + dy:4 + dy + height, 4:4 + width]
            + padded[5 + dy:5 + dy + height, 4:4 + width]
        ) * 0.5
    samples.append(sample)

# A white palette with one entry per alpha value is lossless and smaller
# than RGBA on disk. The shader only reads alpha; tint stays a live uniform.
mask = Image.fromarray(np.rint(np.maximum.reduce(samples)).astype(np.uint8))
mask = mask.convert("P")
mask.putpalette([255, 255, 255] * 256)
mask.info["transparency"] = bytes(range(256))
mask.save(ROOT / "src/assets/terminal-logo-mask.png", optimize=True)
