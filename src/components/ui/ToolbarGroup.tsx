import React from 'react';

interface ToolbarGroupProps {
  children: React.ReactNode;
}

export const ToolbarGroup: React.FC<ToolbarGroupProps> = ({ children }) => {
  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg">
      {children}
    </div>
  );
};