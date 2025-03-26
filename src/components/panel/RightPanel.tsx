import React from 'react'; 
import { useEditorStore } from '../../store/editorStore';
import { GRADIENTS, PAPERS } from '../../config/constants';
import { ChevronRight, ChevronLeft, RotateCw } from 'lucide-react';
import { BackgroundPreview } from './BackgroundPreview';
import { IconLibrary } from './IconLibrary';
import { ColorPicker } from '../ui/ColorPicker';
import { generateRandomPattern } from '../../utils/patternGenerator';

type Tab = 'backgrounds' | 'patterns' | 'icons';

const RightPanelContent = React.memo(() => {
  const [activeTab, setActiveTab] = React.useState<Tab>('backgrounds');

  const {
    backgroundColor,
    backgroundType,
    backgroundValue,
    setBackground,
    setBackgroundColor,
    regeneratePattern,
    patternUrl,
    setPatternUrl,
  } = useEditorStore();

  const handleRandomGradient = () => {
    const values = Object.values(GRADIENTS);
    const random = values[Math.floor(Math.random() * values.length)];
    setBackground('gradient', random);
  };

  const regenerate = () => {
    if (backgroundType === 'gradient') {
      handleRandomGradient();
    } else if (backgroundType === 'paper') {
      regeneratePattern();
    } else if (backgroundType === 'pattern') {
      const pattern = generateRandomPattern();
      setPatternUrl(pattern);
      setBackground('pattern', pattern);
    }
  };

  const renderBackgroundsTab = () => (
    <div className="space-y-4 p-2 overflow-y-auto flex-1">
      <div>
        <h3 className="text-sm font-medium mb-2">Background Color</h3>
        <ColorPicker
          value={backgroundColor}
          onChange={(color) => {
            setBackgroundColor(color);
            setBackground('color', color);
          }}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Gradients</h3>
        <div className="grid gap-2">
          {Object.entries(GRADIENTS).map(([name, value]) => (
            <BackgroundPreview
              key={name}
              type="gradient"
              value={value}
              onClick={() => setBackground('gradient', value)}
            />
          ))}
          <BackgroundPreview
            type="gradient"
            value="random"
            onClick={handleRandomGradient}
          />
        </div>
      </div>
    </div>
  );

  const renderPatternsTab = () => (
    <div className="grid gap-2 p-2 overflow-y-auto flex-1">
      {patternUrl && (
        <BackgroundPreview
          key="generated-pattern"
          type="pattern"
          value={patternUrl}
          backgroundColor={backgroundColor}
          onClick={() => setBackground('pattern', patternUrl)}
        />
      )}
      {Object.entries(PAPERS)
        .filter(([name]) => name !== 'white')
        .slice(0, 6)
        .map(([name, value]) => (
          <BackgroundPreview
            key={name}
            type="paper"
            value={value}
            backgroundColor={backgroundColor}
            onClick={() => setBackground('paper', value)}
          />
        ))}
    </div>
  );

  const renderIconsTab = () => <IconLibrary />;

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex items-center justify-between p-1.5 border-b border-white/20">
        <div className="flex gap-1">
          {(['backgrounds', 'patterns', 'icons'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                activeTab === tab
                  ? 'bg-white/20 text-gray-800'
                  : 'text-gray-600 hover:bg-white/10'
              }`}
            >
              {tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {(backgroundType === 'gradient' || backgroundType === 'paper' || backgroundType === 'pattern') && (
          <button
            onClick={regenerate}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            title="Regenerate pattern"
          >
            <RotateCw size={14} className="text-gray-600" />
          </button>
        )}
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === 'backgrounds' && renderBackgroundsTab()}
        {activeTab === 'patterns' && renderPatternsTab()}
        {activeTab === 'icons' && renderIconsTab()}
      </div>
    </div>
  );
});

RightPanelContent.displayName = 'RightPanelContent';

export const RightPanel: React.FC = () => {
  const { isPanelDocked, setPanelDocked } = useEditorStore((state) => ({
    isPanelDocked: state.isPanelDocked,
    setPanelDocked: state.setPanelDocked,
  }));

  return (
    <div className="relative" style={{ height: 'calc(297mm + 32px)' }}>
      <button
        onClick={() => setPanelDocked(!isPanelDocked)}
        className="glass-button absolute -left-6 -top-6 h-6 w-12 flex items-center justify-center rounded-l-lg hover:bg-white/30 transition-all duration-200 z-50"
      >
        {isPanelDocked ? (
          <ChevronRight size={16} className="text-gray-600" />
        ) : (
          <ChevronLeft size={16} className="text-gray-600" />
        )}
      </button>

      <div
        className={`glass-panel w-72 h-full overflow-hidden transition-all duration-300 flex flex-col rounded-bl-xl ${
          isPanelDocked
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full opacity-0'
        }`}
      >
        <RightPanelContent />
      </div>
    </div>
  );
};
