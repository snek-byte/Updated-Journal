import React from 'react';
import { useEditorStore } from './store/editorStore';
import { SimpleEditor } from './components/simple/SimpleEditor';
import { EditorPage } from './components/editor/EditorPage';

function App() {
  const { isSimpleMode } = useEditorStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {isSimpleMode ? <SimpleEditor /> : <EditorPage />}
    </div>
  );
}

export default App;