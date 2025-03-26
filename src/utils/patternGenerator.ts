import Trianglify from 'trianglify';

export function generateRandomPattern(): string {
  const pattern = Trianglify({
    width: 2480,   // A4 at 300 DPI
    height: 3508,
    cell_size: Math.floor(Math.random() * 80 + 40),
    x_colors: 'random',
    y_colors: 'match',
    variance: Math.random(),
  });

  return pattern.toDataUrl(); // base64 SVG for use in CSS background-image
}
