import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { RotateCw, Trash2, GripVertical } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

interface DraggableBlockProps {
  id: string;
  type: 'text' | 'image';
  content: string;
  initialPosition: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
}

export const DraggableBlock: React.FC<DraggableBlockProps> = ({
  id,
  type,
  content,
  initialPosition,
  onPositionChange,
}) => {
  const [rotation, setRotation] = useState(0);
  const [isEditing, setIsEditing] = useState(type === 'text' && !content);
  const [editableContent, setEditableContent] = useState(content);
  const { removeOverlay, updateOverlayContent, fontFamily, fontSize, textColor, textStyle } = useEditorStore();
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
          updateOverlayContent(id, editableContent);
        }
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isEditing, editableContent, id, updateOverlayContent]);

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
    removeOverlay(id);
  };

  const getTextStyles = () => ({
    fontFamily,
    fontSize: `${fontSize}px`,
    color: textColor,
    fontWeight: textStyle.isBold ? 'bold' : 'normal',
    fontStyle: textStyle.isItalic ? 'italic' : 'normal',
    textDecoration: textStyle.isUnderline ? 'underline' : 'none',
  });

  return (
    <Draggable
      handle=".handle"
      defaultPosition={initialPosition}
      onStop={(e, data) => onPositionChange({ x: data.x, y: data.y })}
      bounds="parent"
      nodeRef={dragRef}
    >
      <div
        ref={dragRef}
        className="absolute draggable-overlay group"
        style={{
          transform: `rotate(${rotation}deg)`,
          width: type === 'text' ? '200px' : 'auto',
          zIndex: isEditing ? 50 : 10
        }}
      >
        {type === 'text' ? (
          <div className="relative">
            <div className={`backdrop-blur-sm rounded transition-all duration-200 ${isEditing ? 'bg-white/50 shadow-lg' : 'bg-transparent group-hover:bg-white/30'}`}>
              {isEditing ? (
                <textarea
                  ref={textareaRef}
                  value={editableContent}
                  onChange={handleTextareaChange}
                  className="w-full resize-none bg-transparent p-2 outline-none min-h-[1em]"
                  placeholder="Start typing..."
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  style={getTextStyles()}
                />
              ) : (
                <div 
                  className="p-2 whitespace-pre-wrap min-h-[1em] cursor-text"
                  onClick={() => setIsEditing(true)}
                  style={getTextStyles()}
                >
                  {editableContent || 'Click to edit'}
                </div>
              )}
            </div>
            
            <div className={`absolute -top-6 flex items-center gap-0.5 right-0 bg-white/30 backdrop-blur-sm rounded-t border border-white/20 ${isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
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
        ) : (
          <div className="relative">
            <img src={content} alt="" className="max-w-[300px] rounded shadow-lg" />
            <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 right-0 bg-white/30 backdrop-blur-sm rounded-t border border-white/20">
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
        )}
      </div>
    </Draggable>
  );
};