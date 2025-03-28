import trianglify from 'trianglify';
import { noise } from './noise';
import rough from 'roughjs/bundled/rough.esm.js';

export type PatternMode =
  | 'triangles'
  | 'simplex'
  | 'rough-circles'
  | 'rough-grid'
  | 'rough-waves';

export function generateRandomPattern(
  mode: PatternMode = 'triangles',
  backgroundColor: string = '#ffffff'
) {
  const seed = Math.random().toString();
  console.log('Pattern mode selected:', mode);

  try {
    if (mode === 'triangles') {
      const thumbnail = trianglify({ width: 300, height: 100, seed }).toCanvas().toDataURL();
      const full = trianglify({ width: 1240, height: 1748, seed }).toCanvas().toDataURL();
      return { thumbnail, full };
    }

    if (mode === 'simplex') {
      const thumbnail = generateSubtleSimplexTexture(300, 100, seed);
      const full = generateSubtleSimplexTexture(1240, 1748, seed);
      return { thumbnail, full };
    }

    if (mode.startsWith('rough')) {
      const shape = mode.split('-')[1]; // circles, grid, waves, etc.
      const thumbnail = generateRoughTexture(300, 100, shape as RoughStyle, backgroundColor);
      const full = generateRoughTexture(1240, 1748, shape as RoughStyle, backgroundColor);
      return { thumbnail, full };
    }
  } catch (err) {
    console.error('Pattern generation failed:', err);
  }

  return fallbackBlank();
}

function fallbackBlank() {
  return {
    thumbnail:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100" fill="#f9f9f9"/>',
    full:
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1240" height="1748" fill="#ffffff"/>',
  };
}

function generateSubtleSimplexTexture(width: number, height: number, seed: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  noise.seed(Number(seed));

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const value = noise.simplex2(x / 100, y / 100);
      const normalized = (value + 1) / 2;
      const red = 255;
      const green = 240 + Math.floor(normalized * 15);
      const blue = 250;
      const alpha = 25 + Math.floor(normalized * 30);

      const i = (y * width + x) * 4;
      data[i] = red;
      data[i + 1] = green;
      data[i + 2] = blue;
      data[i + 3] = alpha;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

type RoughStyle = 'circles' | 'grid' | 'waves';

function generateRoughTexture(
  width: number,
  height: number,
  style: RoughStyle,
  backgroundColor: string
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  const rc = rough.canvas(canvas);

  if (style === 'circles') {
    for (let x = 20; x < width; x += 40) {
      for (let y = 20; y < height; y += 40) {
        rc.circle(x, y, 30, {
          stroke: 'rgba(0, 0, 0, 0.06)',
          fill: 'rgba(0, 0, 0, 0.02)',
          fillStyle: 'solid',
        });
      }
    }
  }

  if (style === 'grid') {
    for (let x = 0; x <= width; x += 40) {
      rc.line(x, 0, x, height, { stroke: 'rgba(0, 0, 0, 0.04)' });
    }
    for (let y = 0; y <= height; y += 40) {
      rc.line(0, y, width, y, { stroke: 'rgba(0, 0, 0, 0.04)' });
    }
  }

  if (style === 'waves') {
    const step = 20;
    for (let y = 0; y <= height; y += step * 2) {
      const path = [];
      for (let x = 0; x <= width; x += step) {
        const waveY = y + Math.sin((x / width) * 2 * Math.PI) * step;
        path.push([x, waveY]);
      }
      for (let i = 0; i < path.length - 1; i++) {
        rc.line(path[i][0], path[i][1], path[i + 1][0], path[i + 1][1], {
          stroke: 'rgba(0, 0, 0, 0.05)',
        });
      }
    }
  }

  return canvas.toDataURL();
}
