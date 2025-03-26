import React from 'react';

interface BackgroundPreviewProps {
  type: 'gradient' | 'paper' | 'pattern';
  value: string;
  backgroundColor?: string;
  onClick: () => void;
}

export const BackgroundPreview: React.FC<BackgroundPreviewProps> = ({
  type,
  value,
  backgroundColor,
  onClick
}) => {
  const style: React.CSSProperties =
    type === 'gradient'
      ? {
          background: value,
        }
      : {
          backgroundColor: backgroundColor || '#ffffff',
          backgroundImage: `url(${value})`,
          backgroundRepeat: 'repeat',
          backgroundSize: type === 'pattern' ? 'cover' : 'auto',
          backgroundPosition: 'center',
          border: '1px solid rgba(0, 0, 0, 0.1)',
        };

  return (
    <div
      className="h-20 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105"
      style={style}
      onClick={onClick}
    />
  );
};
