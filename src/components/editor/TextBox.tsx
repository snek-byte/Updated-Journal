import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { RotateCw, Trash2, GripVertical } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

interface TextBoxProps {
  id: string;
  content: string;
  position: { x: number; y: number };
  style: {
    fontFamily: string;
    fontSize: number;
    textColor: string;
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
  };
  onPositionChange: (position: { x: number; y: number }) => void;
}

export const TextBox: React.FC<TextBoxProps> = ({
  id,
  content,
  position,
  style,
  onPositionChange,
}) => {
  const [rotation, setRotation] = useState(0);
  const [isEditing, setIsEditing] = useState(!content);
  const [editableContent, setEditableContent] = useState(content);
  const { updateTextBox, removeTextBox, setSelectedTextBox, selectedTextBoxId } = useEditorStore();
  const dragRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dragRef.current && !dragRef.current.contains(event.target as Node)) {
        setIsEditing(false);
        if (editableContent.trim()) {
          updateTextBox(id, { content: editableContent });
        }
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isEditing, editableContent, id, updateTextBox]);

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotation((prev) => (prev + 15) % 360);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableContent(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeTextBox(id);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTextBox(id);
  };

  const getTextStyles = () => ({
    fontFamily: style.fontFamily,
    fontSize: `${style.fontSize}px`,
    color: style.textColor,
    WebkitTextFillColor: style.textColor,
    fontWeight: style.isBold ? 'bold' : 'normal',
    fontStyle: style.isItalic ? 'italic' : 'normal',
    textDecoration: style.isUnderline ? 'underline' : 'none',
    WebkitPrintColorAdjust: 'exact',
    printColorAdjust: 'exact',
    colorAdjust: 'exact',
    forcedColorAdjust: 'none'
  });

  return (
    <Draggable
      handle=".handle"
      defaultPosition={position}
      onStop={(e, data) => onPositionChange({ x: data.x, y: data.y })}
      bounds="parent"
      nodeRef={dragRef}
    >
      <div
        ref={dragRef}
        className={`absolute draggable-overlay group print:ring-0 print:shadow-none ${
          selectedTextBoxId === id ? 'ring-1 ring-white/20 shadow-sm' : ''
        }`}
        style={{
          transform: `rotate(${rotation}deg)`,
          width: '200px',
          zIndex: isEditing || selectedTextBoxId === id ? 50 : 10
        }}
        onClick={handleClick}
      >
        <div className="relative">
          <div 
            className={`rounded transition-all duration-200 print:bg-transparent print:backdrop-blur-none print:shadow-none ${
              isEditing || selectedTextBoxId === id 
                ? 'backdrop-blur-[2px] bg-white/5' 
                : 'group-hover:backdrop-blur-[2px] group-hover:bg-white/5'
            }`}
          >
            {isEditing ? (
              <textarea
                ref={textareaRef}
                value={editableContent}
                onChange={handleTextareaChange}
                className="w-full resize-none bg-transparent p-2 outline-none min-h-[1em] print:!p-0"
                placeholder=""
                autoFocus
                onClick={(e) => e.stopPropagation()}
                style={getTextStyles()}
              />
            ) : (
              <div 
                className="p-2 whitespace-pre-wrap min-h-[1em] cursor-text print:!p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                style={getTextStyles()}
              >
                {editableContent}
              </div>
            )}
          </div>
          
          <div className={`absolute -top-6 flex items-center gap-0.5 right-0 bg-white/30 backdrop-blur-sm rounded-t border border-white/20 ${isEditing || selectedTextBoxId === id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity print:hidden`}>
            <button
              onClick={handleRotate}
              className="p-1 hover:bg-white/20 rounded-sm"
            >
              <RotateCw size={12} className="text-gray-600" />
            </button>
            <div className="handle cursor-move p-1 hover:bg-white/20 rounded-sm">
              <GripVertical size={12} className="text-gray-600" />
            </div>
            <button
              onClick={handleDelete}
              className="p-1 hover:bg-white/20 rounded-sm"
            >
              <Trash2 size={12} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </Draggable>
  );
};