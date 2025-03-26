import React from 'react';
import { Toolbar } from '../toolbar/Toolbar';
import { RightPanel } from '../panel/RightPanel';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { ListItemNode, ListNode } from '@lexical/list';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { LinkNode } from '@lexical/link';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { CodeNode } from '@lexical/code';
import { useEditorStore } from '../../store/editorStore';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { TextBox } from './TextBox';
import { editorTheme } from '../../config/editorTheme';

const initialConfig = {
  namespace: 'CustomEditor',
  theme: editorTheme,
  nodes: [
    ListNode,
    ListItemNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    LinkNode,
    HeadingNode,
    QuoteNode,
    CodeNode
  ],
  onError: (error: Error) => {
    console.error(error);
  },
};

export const EditorPage: React.FC = () => {
  const { 
    backgroundType, 
    backgroundColor, 
    backgroundValue, 
    textBoxes,
    updateTextBox,
    fontFamily 
  } = useEditorStore();

  const getBackgroundStyles = () => {
    const styles: React.CSSProperties = {
      backgroundColor
    };

    if (backgroundType === 'gradient') {
      styles.backgroundImage = backgroundValue;
      styles.backgroundSize = '100% 100%';
      styles.backgroundRepeat = 'no-repeat';
    } else if (backgroundType === 'paper' && backgroundValue !== 'none') {
      styles.backgroundImage = backgroundValue;
      styles.backgroundRepeat = 'repeat';
      styles.backgroundSize = 'auto';
    }

    return styles;
  };

  const getFontClass = () => {
    const fontMap: { [key: string]: string } = {
      'Inter': 'font-inter',
      'Playfair Display': 'font-playfair',
      'Montserrat': 'font-montserrat',
      'Lora': 'font-lora',
      'Roboto': 'font-roboto',
      'Open Sans': 'font-opensans',
      'Source Sans Pro': 'font-sourcesans',
      'Merriweather': 'font-merriweather',
      'Poppins': 'font-poppins',
      'Raleway': 'font-raleway',
      'Nunito': 'font-nunito',
      'Quicksand': 'font-quicksand',
      'Fira Sans': 'font-firasans',
      'Ubuntu': 'font-ubuntu',
      'Josefin Sans': 'font-josefin'
    };
    return fontMap[fontFamily] || 'font-inter';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="flex-1 flex flex-col">
          <Toolbar />
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex items-center justify-center p-8">
              <div 
                className={`editor-content w-[210mm] h-[297mm] glass rounded-xl overflow-hidden shadow-lg relative ${getFontClass()}`}
                style={getBackgroundStyles()}
              >
                <div className="relative h-full">
                  <RichTextPlugin
                    contentEditable={
                      <ContentEditable 
                        className="outline-none h-full p-6 min-h-[297mm] pointer-events-none"
                      />
                    }
                    placeholder={null}
                    ErrorBoundary={LexicalErrorBoundary}
                  />
                  <HistoryPlugin />
                  <ListPlugin />
                  <LinkPlugin />
                  <TablePlugin />
                  
                  <div className="absolute inset-0">
                    {textBoxes.map((textBox) => (
                      <TextBox
                        key={textBox.id}
                        id={textBox.id}
                        content={textBox.content}
                        position={textBox.position}
                        style={textBox.style}
                        onPositionChange={(position) => updateTextBox(textBox.id, { position })}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <RightPanel />
            </div>
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
};