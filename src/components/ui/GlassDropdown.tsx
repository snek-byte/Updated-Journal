import React from 'react';

interface GlassDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export const GlassDropdown: React.FC<GlassDropdownProps> = ({ options, value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="glass-button px-3 py-1 rounded text-sm bg-white/10 backdrop-blur text-gray-800 border border-white/30 focus:outline-none"
    >
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-gray-100 text-gray-800">
          {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </option>
      ))}
    </select>
  );
};
