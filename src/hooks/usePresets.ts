import { useState, useCallback } from 'react';
import { Preset, SuperellipseState } from '@/types/layers';

const BUILT_IN_PRESETS: Preset[] = [
  {
    id: 'ios-icon',
    name: 'iOS Icon',
    createdAt: new Date().toISOString(),
    state: {
      width: 200,
      height: 200,
      exponent: 4.5,
      cornerExponents: { topLeft: 4.5, topRight: 4.5, bottomRight: 4.5, bottomLeft: 4.5 },
      useIndividualCorners: false,
      lockAspectRatio: true,
      fillType: 'linear',
      solidColor: '#667eea',
      gradientStops: [
        { id: '1', color: '#667eea', position: 0 },
        { id: '2', color: '#764ba2', position: 100 },
      ],
      gradientAngle: 135,
      glowEnabled: true,
      glowIntensity: 60,
      glowColor: '#667eea',
      glowLayers: [
        { id: '1', blur: 8, opacity: 80, enabled: true },
        { id: '2', blur: 24, opacity: 60, enabled: true },
        { id: '3', blur: 48, opacity: 40, enabled: true },
        { id: '4', blur: 96, opacity: 20, enabled: true },
      ],
      blur: 0,
      backdropBlur: 0,
      strokeWidth: 0,
      strokeColor: '#000000',
      noiseOpacity: 0,
      backgroundColor: '#1a1a1a',
    },
  },
  {
    id: 'rounded',
    name: 'Rounded Square',
    createdAt: new Date().toISOString(),
    state: {
      width: 200,
      height: 200,
      exponent: 6,
      cornerExponents: { topLeft: 6, topRight: 6, bottomRight: 6, bottomLeft: 6 },
      useIndividualCorners: false,
      lockAspectRatio: true,
      fillType: 'solid',
      solidColor: '#FF6B6B',
      gradientStops: [{ id: '1', color: '#FF6B6B', position: 0 }],
      gradientAngle: 135,
      glowEnabled: false,
      glowIntensity: 0,
      glowColor: '#FF6B6B',
      glowLayers: [
        { id: '1', blur: 8, opacity: 80, enabled: false },
        { id: '2', blur: 24, opacity: 60, enabled: false },
        { id: '3', blur: 48, opacity: 40, enabled: false },
        { id: '4', blur: 96, opacity: 20, enabled: false },
      ],
      blur: 0,
      backdropBlur: 0,
      strokeWidth: 2,
      strokeColor: '#000000',
      noiseOpacity: 0,
      backgroundColor: '#1a1a1a',
    },
  },
];

export function usePresets() {
  const [presets, setPresets] = useState<Preset[]>(BUILT_IN_PRESETS);

  const savePreset = useCallback((name: string, state: SuperellipseState) => {
    const newPreset: Preset = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      state,
    };
    setPresets((prev) => [...prev, newPreset]);
    return newPreset;
  }, []);

  const deletePreset = useCallback((id: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const duplicatePreset = useCallback((id: string) => {
    const preset = presets.find((p) => p.id === id);
    if (!preset) return;

    const newPreset: Preset = {
      ...preset,
      id: Date.now().toString(),
      name: `${preset.name} Copy`,
      createdAt: new Date().toISOString(),
    };
    setPresets((prev) => [...prev, newPreset]);
  }, [presets]);

  const exportPresets = useCallback(() => {
    const json = JSON.stringify(presets, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'superellipse-presets.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [presets]);

  const importPresets = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setPresets((prev) => [...prev, ...imported]);
      } catch (error) {
        console.error('Failed to import presets:', error);
      }
    };
    reader.readAsText(file);
  }, []);

  return {
    presets,
    savePreset,
    deletePreset,
    duplicatePreset,
    exportPresets,
    importPresets,
  };
}
