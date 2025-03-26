import React, { useEffect } from 'react';
import { SimpleToolbar } from './SimpleToolbar';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEditorStore } from '../../store/editorStore';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { $getRoot } from 'lexical';

function FormattingPlugin() {
  const [editor] = useLexicalComposerContext();
  const { fontFamily, fontSize } = useEditorStore();

  useEffect(() => {
    editor.focus();
  }, [editor]);

  useEffect(() => {
    editor.update(() => {
      const root = $getRoot();
      const style = `font-family: ${fontFamily}; font-size: ${fontSize}px`;
      root.getChildren().forEach(node => {
        if (node.setStyle) {
          node.setStyle(style);
        }
      });
    });
  }, [editor, fontFamily, fontSize]);

  return null;
}

const theme = {
  paragraph: 'mb-2',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
  },
  align: {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }
};

const initialConfig = {
  namespace: 'SimpleEditor',
  theme,
  onError: (error: Error) => {
    console.error(error);
  },
};

export const SimpleEditor: React.FC = () => {
  const { backgroundType, backgroundValue, fontFamily } = useEditorStore();

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
    <div className="h-screen flex flex-col">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="flex-1 flex flex-col">
          <SimpleToolbar />
          <div className="flex-1 overflow-auto p-4">
            <div 
              className={`editor-content max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 min-h-[calc(100vh-8rem)] ${getFontClass()}`}
              style={{
                background: backgroundType === 'gradient' ? backgroundValue : '',
                backgroundImage: backgroundType === 'paper' ? backgroundValue : '',
              }}
            >
              <RichTextPlugin
                contentEditable={
                  <ContentEditable 
                    className="outline-none min-h-full"
                  />
                }
                placeholder={null}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <FormattingPlugin />
            </div>
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
};