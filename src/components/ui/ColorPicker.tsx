import React, { useRef, useEffect, useState } from 'react';
import chroma from 'chroma-js';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, label }) => {
  const spectrumRef = useRef<HTMLCanvasElement>(null);
  const shadeRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentHue, setCurrentHue] = useState(0);
  const [currentSaturation, setCurrentSaturation] = useState(1);
  const [currentValue, setCurrentValue] = useState(1);
  const [hexInput, setHexInput] = useState(value);

  // Initialize HSV values from the current color when mounted
  useEffect(() => {
    try {
      const color = chroma(value);
      const [h, s, v] = color.hsv();
      setCurrentHue(h || 0);
      setCurrentSaturation(s || 1);
      setCurrentValue(v || 1);
      setHexInput(value);
    } catch (error) {
      // Invalid color, use defaults
      setCurrentHue(0);
      setCurrentSaturation(1);
      setCurrentValue(1);
    }
  }, [value]);

  useEffect(() => {
    // Handle click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    // Always draw the spectrum since it's always visible
    const spectrum = spectrumRef.current;
    if (!spectrum) return;
    const spectrumCtx = spectrum.getContext('2d');
    if (!spectrumCtx) return;

    // Draw hue gradient
    const hueGradient = spectrumCtx.createLinearGradient(0, 0, spectrum.width, 0);
    for (let i = 0; i <= 360; i += 30) {
      hueGradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
    }
    spectrumCtx.fillStyle = hueGradient;
    spectrumCtx.fillRect(0, 0, spectrum.width, spectrum.height);

    if (!isOpen) return;

    // Draw shade picker only when open
    const shade = shadeRef.current;
    if (!shade) return;
    const shadeCtx = shade.getContext('2d');
    if (!shadeCtx) return;

    // Clear previous content
    shadeCtx.clearRect(0, 0, shade.width, shade.height);

    // Create base color from current hue
    const baseColor = chroma.hsv(currentHue, 1, 1);

    // Create saturation gradient (white to pure hue)
    const satGradient = shadeCtx.createLinearGradient(0, 0, shade.width, 0);
    satGradient.addColorStop(0, 'white');
    satGradient.addColorStop(1, baseColor.hex());
    shadeCtx.fillStyle = satGradient;
    shadeCtx.fillRect(0, 0, shade.width, shade.height);

    // Create brightness gradient (transparent to black)
    const brightGradient = shadeCtx.createLinearGradient(0, 0, 0, shade.height);
    brightGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    brightGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    shadeCtx.fillStyle = brightGradient;
    shadeCtx.fillRect(0, 0, shade.width, shade.height);

    // Draw current position indicator
    const x = currentSaturation * shade.width;
    const y = (1 - currentValue) * shade.height;
    
    shadeCtx.beginPath();
    shadeCtx.arc(x, y, 6, 0, 2 * Math.PI);
    shadeCtx.strokeStyle = 'white';
    shadeCtx.lineWidth = 2;
    shadeCtx.stroke();
    shadeCtx.beginPath();
    shadeCtx.arc(x, y, 5, 0, 2 * Math.PI);
    shadeCtx.strokeStyle = 'black';
    shadeCtx.lineWidth = 1;
    shadeCtx.stroke();
  }, [isOpen, currentHue, currentSaturation, currentValue]);

  const handleSpectrumClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = spectrumRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const hue = (x / canvas.width) * 360;
    setCurrentHue(hue);
    updateColor(hue, currentSaturation, currentValue);
    setIsOpen(true);
  };

  const handleShadeClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = shadeRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const s = Math.max(0, Math.min(1, x / canvas.width));
    const v = Math.max(0, Math.min(1, 1 - (y / canvas.height)));
    setCurrentSaturation(s);
    setCurrentValue(v);
    updateColor(currentHue, s, v);
  };

  const updateColor = (h: number, s: number, v: number) => {
    const color = chroma.hsv(h, s, v).hex();
    onChange(color);
    setHexInput(color);
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setHexInput(newValue);
    
    try {
      if (newValue.match(/^#[0-9A-Fa-f]{6}$/)) {
        const color = chroma(newValue);
        const [h, s, v] = color.hsv();
        setCurrentHue(h || 0);
        setCurrentSaturation(s || 1);
        setCurrentValue(v || 1);
        onChange(newValue);
      }
    } catch (error) {
      // Invalid color, do nothing
    }
  };

  const commonColors = [
    '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#808080', '#c0c0c0'
  ];

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center gap-2">
        <button
          className="w-8 h-8 rounded border border-gray-200 shadow-sm"
          style={{ backgroundColor: value }}
          onClick={() => setIsOpen(!isOpen)}
          title={label}
        />
        <canvas
          ref={spectrumRef}
          width="100"
          height="24"
          onClick={handleSpectrumClick}
          className="rounded cursor-crosshair border border-gray-200"
        />
        <input
          type="text"
          value={hexInput}
          onChange={handleHexInput}
          className="w-20 px-2 py-1 text-sm border rounded"
          placeholder="#000000"
        />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-white rounded-lg shadow-xl border border-gray-200">
          <div className="space-y-4">
            <canvas
              ref={shadeRef}
              width="200"
              height="150"
              onClick={handleShadeClick}
              className="rounded cursor-crosshair"
            />
            <div>
              <div className="text-sm font-medium mb-2">Quick Colors</div>
              <div className="grid grid-cols-5 gap-1">
                {commonColors.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded border border-gray-200 transition-transform hover:scale-110"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      onChange(color);
                      setHexInput(color);
                      setIsOpen(false);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};