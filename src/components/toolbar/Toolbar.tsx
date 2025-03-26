import React from 'react';
import { useEditorStore } from '../../store/editorStore';
import { Button } from '../ui/Button';
import { ToolbarGroup } from '../ui/ToolbarGroup';
import { ColorPicker } from '../ui/ColorPicker';
import { FONTS, FONT_SIZES } from '../../config/constants';
import { useReactToPrint } from 'react-to-print';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Printer,
  Pencil,
  Plus
} from 'lucide-react';

export const Toolbar: React.FC = () => {
  const { 
    fontFamily, 
    fontSize, 
    textColor,
    textStyle,
    backgroundType,
    backgroundColor,
    backgroundValue,
    addTextBox,
    setSimpleMode,
    setFont,
    setFontSize,
    setTextColor,
    setTextStyle,
    selectedTextBoxId
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
        }
        .editor-content {
          width: 210mm !important;
          height: 297mm !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
          box-shadow: none !important;
          border-radius: 0 !important;
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
        .draggable-overlay {
          position: absolute !important;
          page-break-inside: avoid !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        .toolbar, .right-panel, .mode-switch, .handle, .glass-button, .print\\:hidden {
          display: none !important;
        }
        .draggable-overlay > div {
          background: none !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
        }
        .draggable-overlay div[contenteditable],
        .draggable-overlay textarea,
        .draggable-overlay div {
          color: inherit !important;
          background: none !important;
          border: none !important;
          box-shadow: none !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      }
    `,
  });

  const toggleTextStyle = (style: keyof typeof textStyle) => {
    setTextStyle({ [style]: !textStyle[style as keyof typeof textStyle] });
  };

  return (
    <div className="flex flex-wrap items-center justify-between bg-white border-b p-2 gap-2">
      <div className="flex items-center gap-2">
        <ToolbarGroup>
          <Button 
            variant="ghost" 
            size="sm" 
            icon={<Bold size={18} />}
            onClick={() => toggleTextStyle('isBold')}
            className={textStyle.isBold ? 'bg-white/30' : ''}
            disabled={!selectedTextBoxId}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            icon={<Italic size={18} />}
            onClick={() => toggleTextStyle('isItalic')}
            className={textStyle.isItalic ? 'bg-white/30' : ''}
            disabled={!selectedTextBoxId}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            icon={<Underline size={18} />}
            onClick={() => toggleTextStyle('isUnderline')}
            className={textStyle.isUnderline ? 'bg-white/30' : ''}
            disabled={!selectedTextBoxId}
          />
          <Button 
            variant="ghost" 
            size="sm" 
            icon={<Strikethrough size={18} />}
            disabled={!selectedTextBoxId}
          />
        </ToolbarGroup>

        <ToolbarGroup>
          <select
            value={fontFamily}
            onChange={(e) => setFont(e.target.value)}
            className="h-8 px-2 rounded border border-gray-200 text-sm"
            disabled={!selectedTextBoxId}
          >
            {FONTS.map((font) => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>

          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="h-8 w-20 px-2 rounded border border-gray-200 text-sm"
            disabled={!selectedTextBoxId}
          >
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>{size}px</option>
            ))}
          </select>

          <ColorPicker
            value={textColor}
            onChange={setTextColor}
            label="Text Color"
          />
        </ToolbarGroup>

        <ToolbarGroup>
          <Button 
            variant="ghost" 
            size="sm" 
            icon={<Plus size={18} />} 
            onClick={() => addTextBox()}
            title="Add Text Box"
          >
            Add Text
          </Button>
        </ToolbarGroup>

        <ToolbarGroup>
          <Button variant="ghost" size="sm" icon={<Printer size={18} />} onClick={handlePrint} />
        </ToolbarGroup>
      </div>

      <ToolbarGroup>
        <Button
          variant="ghost"
          size="sm"
          icon={<Pencil size={18} />}
          onClick={() => setSimpleMode(true)}
        >
          Simple
        </Button>
      </ToolbarGroup>
    </div>
  );
};