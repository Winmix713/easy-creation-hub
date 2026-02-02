import { Preset, SuperellipseState } from '@/types/layers';
import { Save, Trash2, Copy, Download, Upload } from 'lucide-react';
import { useState, useRef } from 'react';
import { QuickPresets } from '../QuickPresets';

interface PresetsTabProps {
  presets: Preset[];
  currentState?: SuperellipseState;
  onSavePreset: (name: string, state: SuperellipseState) => void;
  onLoadPreset: (state: SuperellipseState) => void;
  onDeletePreset: (id: string) => void;
  onDuplicatePreset: (id: string) => void;
  onExportPresets: () => void;
  onImportPresets: (file: File) => void;
}

export function PresetsTab({
  presets,
  currentState,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
  onDuplicatePreset,
  onExportPresets,
  onImportPresets,
}: PresetsTabProps) {
  const [presetName, setPresetName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentState) {
    return (
      <div className="text-center py-8 text-neutral-500 text-sm">
        <p>No state available</p>
      </div>
    );
  }

  const handleSave = () => {
    if (presetName.trim()) {
      onSavePreset(presetName, currentState);
      setPresetName('');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportPresets(file);
    }
  };

  const handleQuickPresetLoad = (state: Partial<SuperellipseState>) => {
    onLoadPreset({ ...currentState, ...state } as SuperellipseState);
  };

  return (
    <div className="space-y-6">
      {/* Quick Presets Grid */}
      <QuickPresets onLoadPreset={handleQuickPresetLoad} />

      <div className="border-t border-neutral-700 pt-6">
        <h3 className="text-sm font-semibold text-white mb-3">Save Current State</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="Preset name..."
            className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <button
            onClick={handleSave}
            disabled={!presetName.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white rounded transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      <div className="border-t border-neutral-700 pt-6">
        {/* Import/Export */}
        <div className="flex gap-2">
          <button
            onClick={onExportPresets}
            className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            Export All
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>

      <div className="border-t border-neutral-700 pt-6">
        {/* Preset List */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">
            Presets ({presets.length})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className="bg-neutral-800 rounded-lg p-3 border border-neutral-700 hover:border-neutral-600 transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white">{preset.name}</h4>
                    <p className="text-xs text-neutral-500">
                      {new Date(preset.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onDuplicatePreset(preset.id)}
                      className="p-1 hover:bg-neutral-700 rounded transition-colors text-neutral-400 hover:text-white"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {!preset.id.startsWith('ios-') && !preset.id.startsWith('rounded') && (
                      <button
                        onClick={() => onDeletePreset(preset.id)}
                        className="p-1 hover:bg-neutral-700 rounded transition-colors text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => onLoadPreset(preset.state)}
                  className="w-full px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm rounded transition-colors"
                >
                  Load Preset
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}