import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useEditorStore } from '../../store/editorStore';

export const PrintPreview: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const { backgroundType, backgroundValue, textBoxes } = useEditorStore();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <>
      <div ref={printRef} className="editor-content">
        <div
          className="w-[210mm] h-[297mm] relative"
          style={{
            background: backgroundType === 'gradient' ? backgroundValue : '',
            backgroundImage: backgroundType === 'paper' ? backgroundValue : '',
          }}
        >
          {textBoxes.map((box) => (
            <div
              key={box.id}
              className="print-text"
              style={{
                '--print-color': box.style.textColor,
                position: 'absolute',
                left: box.position.x,
                top: box.position.y,
                fontFamily: box.style.fontFamily,
                fontSize: `${box.style.fontSize}px`,
                fontWeight: box.style.isBold ? 'bold' : 'normal',
                fontStyle: box.style.isItalic ? 'italic' : 'normal',
                textDecoration: box.style.isUnderline ? 'underline' : 'none',
                whiteSpace: 'pre-wrap',
              } as React.CSSProperties}
            >
              {box.content}
            </div>
          ))}
        </div>
      </div>
      <button onClick={handlePrint} className="hidden">Print</button>
    </>
  );
};