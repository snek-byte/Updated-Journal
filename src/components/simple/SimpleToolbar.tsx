import React from 'react';
import { useEditorStore } from '../../store/editorStore';
import { Button } from '../ui/Button';
import { ToolbarGroup } from '../ui/ToolbarGroup';
import { FONTS, FONT_SIZES } from '../../config/constants';
import { useReactToPrint } from 'react-to-print';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $getRoot,
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Printer,
  PencilRuler
} from 'lucide-react';

export const SimpleToolbar: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  const { 
    fontFamily, 
    fontSize, 
    setFont, 
    setFontSize, 
    setSimpleMode,
    backgroundType,
    backgroundColor,
    backgroundValue
  } = useEditorStore();

  const handlePrint = useReactToPrint({
    content: () => document.querySelector('.editor-content'),
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        html, body {
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
          -webkit-filter: opacity(1) !important;
        }
        .editor-content {
          padding: 20mm !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          min-height: auto !important;
          background-color: ${backgroundColor} !important;
          ${backgroundType === 'gradient' ? `background-image: ${backgroundValue} !important;` : ''}
          ${backgroundType === 'gradient' ? 'background-size: cover !important;' : ''}
          ${backgroundType === 'gradient' ? 'background-repeat: no-repeat !important;' : ''}
          ${backgroundType === 'paper' ? `background-image: ${backgroundValue} !important;` : ''}
          ${backgroundType === 'paper' ? 'background-repeat: repeat !important;' : ''}
          ${backgroundType === 'paper' ? 'background-size: auto !important;' : ''}
          ${backgroundType === 'paper' ? '-webkit-print-color-adjust: exact !important;' : ''}
          ${backgroundType === 'paper' ? 'print-color-adjust: exact !important;' : ''}
          ${backgroundType === 'paper' ? 'color-adjust: exact !important;' : ''}
        }
        .toolbar, .right-panel, .mode-switch {
          display: none !important;
        }
      }
    `,
  });

  const formatText = (format: 'bold' | 'italic' | 'underline') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatAlignment = (alignment: 'left' | 'center' | 'right') => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
  };

  const handleUndo = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  };

  const handleRedo = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const font = e.target.value;
    setFont(font);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const nodes = selection.getNodes();
        nodes.forEach(node => {
          if (node.setStyle) {
            node.setStyle(`font-family: ${font}`);
          }
        });
      } else {
        const root = $getRoot();
        root.getChildren().forEach(node => {
          if (node.setStyle) {
            node.setStyle(`font-family: ${font}`);
          }
        });
      }
    });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setFontSize(size);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const nodes = selection.getNodes();
        nodes.forEach(node => {
          if (node.setStyle) {
            node.setStyle(`font-size: ${size}px`);
          }
        });
      } else {
        const root = $getRoot();
        root.getChildren().forEach(node => {
          if (node.setStyle) {
            node.setStyle(`font-size: ${size}px`);
          }
        });
      }
    });
  };

  return (
    <div className="flex items-center bg-white border-b p-2 gap-2">
      <ToolbarGroup>
        <Button 
          variant="ghost" 
          size="sm" 
          icon={<Bold size={18} />} 
          onClick={() => formatText('bold')}
        />
        <Button 
          variant="ghost" 
          size="sm" 
          icon={<Italic size={18} />} 
          onClick={() => formatText('italic')}
        />
        <Button 
          variant="ghost" 
          size="sm" 
          icon={<Underline size={18} />} 
          onClick={() => formatText('underline')}
        />
      </ToolbarGroup>

      <ToolbarGroup>
        <select
          value={fontFamily}
          onChange={handleFontChange}
          className="h-8 px-2 rounded border border-gray-200 text-sm"
        >
          {FONTS.map((font) => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>

        <select
          value={fontSize}
          onChange={handleFontSizeChange}
          className="h-8 w-20 px-2 rounded border border-gray-200 text-sm"
        >
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>
      </ToolbarGroup>

      <ToolbarGroup>
        <Button 
          variant="ghost" 
          size="sm" 
          icon={<AlignLeft size={18} />} 
          onClick={() => formatAlignment('left')}
        />
        <Button 
          variant="ghost" 
          size="sm" 
          icon={<AlignCenter size={18} />} 
          onClick={() => formatAlignment('center')}
        />
        <Button 
          variant="ghost" 
          size="sm" 
          icon={<AlignRight size={18} />} 
          onClick={() => formatAlignment('right')}
        />
      </ToolbarGroup>

      <ToolbarGroup>
        <Button 
          variant="ghost" 
          size="sm" 
          icon={<Undo size={18} />} 
          onClick={handleUndo}
        />
        <Button 
          variant="ghost" 
          size="sm" 
          icon={<Redo size={18} />} 
          onClick={handleRedo}
        />
      </ToolbarGroup>

      <ToolbarGroup>
        <Button variant="ghost" size="sm" icon={<Printer size={18} />} onClick={handlePrint} />
      </ToolbarGroup>

      <div className="ml-auto">
        <Button
          variant="ghost"
          size="sm"
          icon={<PencilRuler size={18} />}
          onClick={() => setSimpleMode(false)}
        >
          Custom
        </Button>
      </div>
    </div>
  );
};