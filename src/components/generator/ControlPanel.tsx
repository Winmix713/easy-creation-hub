import { useState } from 'react';
import { SuperellipseState, GradientStop, Preset, Layer } from '@/types/layers';
import { ShapeTab } from './tabs/ShapeTab';
import { ColorTab } from './tabs/ColorTab';
import { GlowTab } from './tabs/GlowTab';
import { EffectsTab } from './tabs/EffectsTab';
import { PresetsTab } from './tabs/PresetsTab';
import { CssTab } from './tabs/CssTab';
import { ExportTab } from './tabs/ExportTab';
import { TransformTab } from './tabs/TransformTab';
import { useAppContext } from '@/contexts/AppContext';

type TabType = 'shape' | 'color' | 'glow' | 'effects' | 'transform' | 'presets' | 'css' | 'export';

export function ControlPanel() {
  const { superellipse, layers, presets, glow } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabType>('shape');

  const state = superellipse.state;
  const pathData = superellipse.pathData;
  const onUpdateState = superellipse.updateState;
  const onUpdateGradientStop = superellipse.updateGradientStop;
  const onAddGradientStop = superellipse.addGradientStop;
  const onRemoveGradientStop = superellipse.removeGradientStop;
  const onRandomizeGlow = superellipse.randomizeGlow;
  const selectedLayer = layers.selected;
  const onUpdateTransform = layers.updateTransform;

  const tabs: { id: TabType; label: string }[] = [
    { id: 'shape', label: 'Shape' },
    { id: 'color', label: 'Color' },
    { id: 'glow', label: 'Glow' },
    { id: 'effects', label: 'Effects' },
    { id: 'transform', label: 'Transform' },
    { id: 'presets', label: 'Presets' },
    { id: 'css', label: 'CSS' },
    { id: 'export', label: 'Export' },
  ];

  return (
    <div className="w-80 bg-neutral-900 border-l border-neutral-800 flex flex-col">
      {/* Header */}
      <div className="h-12 border-b border-neutral-800 flex items-center px-4">
        <h2 className="font-semibold text-white">Controls</h2>
        <span className="ml-auto text-xs text-neutral-500">
          {selectedLayer ? 'Layer selected' : 'No layer selected'}
        </span>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-800 flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-500 text-white'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'shape' && <ShapeTab state={state} onUpdate={onUpdateState} />}
        
        {activeTab === 'color' && (
          <ColorTab
            state={state}
            onUpdate={onUpdateState}
            onUpdateGradientStop={onUpdateGradientStop}
            onAddGradientStop={onAddGradientStop}
            onRemoveGradientStop={onRemoveGradientStop}
          />
        )}
        
        {activeTab === 'glow' && (
          <GlowTab
            state={state}
            onUpdate={onUpdateState}
            onRandomizeGlow={onRandomizeGlow}
            glowEnabled={glow.enabled}
            setGlowEnabled={glow.setEnabled}
            maskSize={glow.maskSize}
            setMaskSize={glow.setMaskSize}
            glowScale={glow.scale}
            setGlowScale={glow.setScale}
            positionX={glow.positionX}
            setPositionX={glow.setPositionX}
            positionY={glow.positionY}
            setPositionY={glow.setPositionY}
            noiseEnabled={glow.noiseEnabled}
            setNoiseEnabled={glow.setNoiseEnabled}
            noiseIntensity={glow.noiseIntensity}
            setNoiseIntensity={glow.setNoiseIntensity}
          />
        )}
        
        {activeTab === 'effects' && (
          <EffectsTab state={state} onUpdate={onUpdateState} />
        )}
        
        {activeTab === 'transform' && (
          <TransformTab
            selectedLayer={selectedLayer}
            onUpdateTransform={onUpdateTransform}
          />
        )}
        
        {activeTab === 'presets' && (
          <PresetsTab
            presets={presets.items}
            currentState={state}
            onSavePreset={presets.save}
            onLoadPreset={superellipse.loadState}
            onDeletePreset={presets.delete}
            onDuplicatePreset={presets.duplicate}
            onExportPresets={presets.export}
            onImportPresets={presets.import}
          />
        )}
        
        {activeTab === 'css' && <CssTab state={state} pathData={pathData} />}
        
        {activeTab === 'export' && <ExportTab state={state} pathData={pathData} />}
      </div>
    </div>
  );
}