import React from 'react';
import { GRADIENTS } from '../../config/constants';
import { ChevronRight, ChevronLeft, RotateCw } from 'lucide-react';
import { BackgroundPreview } from './BackgroundPreview';
import { IconLibrary } from './IconLibrary';
import { ColorPicker } from '../ui/ColorPicker';
import { GlassDropdown } from '../ui/GlassDropdown';
import { generateRandomPattern, PatternMode } from '../../utils/patternGenerator';
import { useEditorStore } from '../../store/editorStore';

type Tab = 'backgrounds' | 'patterns' | 'icons';
type Pattern = { thumbnail: string; full: string };

const RightPanelComponent = React.memo(() => {
  const [activeTab, setActiveTab] = React.useState<Tab>('backgrounds');
  const [patternMode, setPatternMode] = React.useState<PatternMode>('triangles');
  const [patternSet, setPatternSet] = React.useState<Pattern[]>([]);

  const {
    backgroundColor,
    setBackground,
    setBackgroundColor,
  } = useEditorStore();

  React.useEffect(() => {
    if (activeTab === 'patterns') {
      setPatternSet(Array.from({ length: 6 }, () =>
        generateRandomPattern(patternMode, backgroundColor)
      ));
    }
  }, [activeTab, patternMode, backgroundColor]);

  const regenerate = () => {
    setPatternSet(Array.from({ length: 6 }, () =>
      generateRandomPattern(patternMode, backgroundColor)
    ));
  };

  const handleRandomGradient = () => {
    const values = Object.values(GRADIENTS);
    const random = values[Math.floor(Math.random() * values.length)];
    setBackground('gradient', random);
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
    <div className="space-y-3 p-2 overflow-y-auto flex-1">
      <GlassDropdown
        options={['triangles', 'simplex', 'rough-circles', 'rough-grid', 'rough-waves']}
        value={patternMode}
        onChange={(val) => setPatternMode(val as PatternMode)}
      />

      <button
        onClick={regenerate}
        className="glass-button px-4 py-1 text-sm flex items-center gap-2"
      >
        <RotateCw size={16} /> Regenerate Patterns
      </button>

      <div className="grid gap-2">
        {patternSet.map(({ thumbnail, full }, i) => (
          <div
            key={i}
            className="w-full aspect-[5/2] rounded border cursor-pointer overflow-hidden"
            style={{
              backgroundImage: `url("${thumbnail}")`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
            onClick={() => setBackground('paper', `url("${full}")`)}
          />
        ))}
      </div>
    </div>
  );

  const renderIconsTab = () => <IconLibrary />;

  return (
    <div className="flex flex-col h-full w-72 min-w-[18rem]">
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
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === 'backgrounds' && renderBackgroundsTab()}
        {activeTab === 'patterns' && renderPatternsTab()}
        {activeTab === 'icons' && renderIconsTab()}
      </div>
    </div>
  );
});

RightPanelComponent.displayName = 'RightPanel';

export const RightPanel = RightPanelComponent;
