import chroma from 'chroma-js';

interface GradientStop {
  color: string;
  position: number;
}

export const generateRandomGradient = (): string => {
  // Generate between 2 and 4 color stops
  const numStops = Math.floor(Math.random() * 3) + 2;
  const stops: GradientStop[] = [];

  // Generate a random hue to base the color scheme on
  const baseHue = Math.random() * 360;
  
  for (let i = 0; i < numStops; i++) {
    // Create harmonious colors by shifting the hue
    const hue = (baseHue + (i * (360 / numStops))) % 360;
    
    // Generate vibrant colors with good saturation and lightness
    const saturation = 0.6 + Math.random() * 0.4; // 60-100%
    const lightness = 0.4 + Math.random() * 0.3; // 40-70%
    
    const color = chroma.hsl(hue, saturation, lightness).hex();
    const position = i / (numStops - 1);
    
    stops.push({ color, position });
  }

  // Sort stops by position
  stops.sort((a, b) => a.position - b.position);

  // Generate different types of gradients
  const gradientTypes = [
    'to right',
    'to bottom right',
    'to bottom',
    'to bottom left',
    '135deg',
    '-45deg',
    '45deg',
  ];

  const direction = gradientTypes[Math.floor(Math.random() * gradientTypes.length)];
  
  // Create the gradient string
  const gradient = `linear-gradient(${direction}, ${stops
    .map(stop => `${stop.color} ${stop.position * 100}%`)
    .join(', ')})`;

  return gradient;
};