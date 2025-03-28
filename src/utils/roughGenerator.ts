import rough from 'roughjs/bin/rough';

export function generateRoughTexture(width: number, height: number): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = width;
  canvas.height = height;

  // Pale background
  ctx.fillStyle = '#fefefe';
  ctx.fillRect(0, 0, width, height);

  const rc = rough.canvas(canvas);

  // Draw subtle hand-drawn circles as texture
  for (let i = 0; i < 20; i++) {
    rc.circle(
      Math.random() * width,
      Math.random() * height,
      20 + Math.random() * 40,
      {
        stroke: '#e0e0e0',
        strokeWidth: 0.4,
        fill: 'rgba(240,240,240,0.3)',
        fillStyle: 'hachure',
        hachureAngle: Math.random() * 180,
        hachureGap: 8,
      }
    );
  }

  return canvas.toDataURL();
}
