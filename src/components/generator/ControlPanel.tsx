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

interface ControlPanelProps {
  state: SuperellipseState;
  pathData: string;
  presets: Preset[];
  selectedLayer?: Layer | null;
  onUpdateState: (updates: Partial<SuperellipseState>) => void;
  onUpdateGradientStop: (id: string, updates: Partial<GradientStop>) => void;
  onAddGradientStop: (color: string, position: number) => void;
  onRemoveGradientStop: (id: string) => void;
  onRandomizeGlow: () => void;
  onSavePreset: (name: string, state: SuperellipseState) => void;
  onLoadPreset: (state: SuperellipseState) => void;
  onDeletePreset: (id: string) => void;
  onDuplicatePreset: (id: string) => void;
  onExportPresets: () => void;
  onImportPresets: (file: File) => void;
  onUpdateTransform?: (layerId: string, transform: Partial<Layer['transform']>) => void;
  // New glow editor props
  glowEnabled?: boolean;
  setGlowEnabled?: (v: boolean) => void;
  maskSize?: number;
  setMaskSize?: (v: number) => void;
  glowScale?: number;
  setGlowScale?: (v: number) => void;
  positionX?: number;
  setPositionX?: (v: number) => void;
  positionY?: number;
  setPositionY?: (v: number) => void;
  noiseEnabled?: boolean;
  setNoiseEnabled?: (v: boolean) => void;
  noiseIntensity?: number;
  setNoiseIntensity?: (v: number) => void;
}

type TabType = 'shape' | 'color' | 'glow' | 'effects' | 'transform' | 'presets' | 'css' | 'export';

export function ControlPanel({
  state,
  pathData,
  presets,
  selectedLayer,
  onUpdateState,
  onUpdateGradientStop,
  onAddGradientStop,
  onRemoveGradientStop,
  onRandomizeGlow,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
  onDuplicatePreset,
  onExportPresets,
  onImportPresets,
  onUpdateTransform,
  glowEnabled,
  setGlowEnabled,
  maskSize,
  setMaskSize,
  glowScale,
  setGlowScale,
  positionX,
  setPositionX,
  positionY,
  setPositionY,
  noiseEnabled,
  setNoiseEnabled,
  noiseIntensity,
  setNoiseIntensity,
}: ControlPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('shape');

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
          {state ? 'Layer selected' : 'No layer selected'}
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
            glowEnabled={glowEnabled}
            setGlowEnabled={setGlowEnabled}
            maskSize={maskSize}
            setMaskSize={setMaskSize}
            glowScale={glowScale}
            setGlowScale={setGlowScale}
            positionX={positionX}
            setPositionX={setPositionX}
            positionY={positionY}
            setPositionY={setPositionY}
            noiseEnabled={noiseEnabled}
            setNoiseEnabled={setNoiseEnabled}
            noiseIntensity={noiseIntensity}
            setNoiseIntensity={setNoiseIntensity}
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
            presets={presets}
            currentState={state}
            onSavePreset={onSavePreset}
            onLoadPreset={onLoadPreset}
            onDeletePreset={onDeletePreset}
            onDuplicatePreset={onDuplicatePreset}
            onExportPresets={onExportPresets}
            onImportPresets={onImportPresets}
          />
        )}
        
        {activeTab === 'css' && <CssTab state={state} pathData={pathData} />}
        
        {activeTab === 'export' && <ExportTab state={state} pathData={pathData} />}
      </div>
    </div>
  );
}