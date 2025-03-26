import React from 'react';
import { useEditorStore } from '../store/editorStore';
import { Pencil, PencilRuler } from 'lucide-react';

export const ModeSwitch: React.FC = () => {
  const { isSimpleMode, setSimpleMode } = useEditorStore();

  return (
    <div className="fixed top-4 right-4 z-[100]">
      <button
        onClick={() => setSimpleMode(!isSimpleMode)}
        className="glass-button h-8 px-3 text-sm flex items-center gap-1.5 hover:bg-white/30 transition-all duration-200"
        title={isSimpleMode ? "Switch to Custom Editor" : "Switch to Simple Editor"}
      >
        {isSimpleMode ? (
          <>
            <PencilRuler className="w-3.5 h-3.5" />
            <span className="text-xs">Custom</span>
          </>
        ) : (
          <>
            <Pencil className="w-3.5 h-3.5" />
            <span className="text-xs">Simple</span>
          </>
        )}
      </button>
    </div>
  );
};