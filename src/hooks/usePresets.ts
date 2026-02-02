import { useState, useCallback } from 'react';
import { Preset, SuperellipseState } from '@/types';

const STORAGE_KEY = 'superellipse-presets';

/**
 * Hook for managing presets
 */
export const usePresets = () => {
  const [presets, setPresets] = useState<Preset[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const savePresets = useCallback((newPresets: Preset[]) => {
    setPresets(newPresets);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPresets));
  }, []);

  const savePreset = useCallback((name: string, state: SuperellipseState) => {
    const newPreset: Preset = {
      id: Date.now().toString(),
      name,
      state,
      createdAt: Date.now(),
    };
    savePresets([...presets, newPreset]);
  }, [presets, savePresets]);

  const deletePreset = useCallback((id: string) => {
    savePresets(presets.filter(p => p.id !== id));
  }, [presets, savePresets]);

  const duplicatePreset = useCallback((id: string) => {
    const preset = presets.find(p => p.id === id);
    if (!preset) return;

    const newPreset: Preset = {
      ...preset,
      id: Date.now().toString(),
      name: `${preset.name} Copy`,
      createdAt: Date.now(),
    };
    savePresets([...presets, newPreset]);
  }, [presets, savePresets]);

  const exportPresets = useCallback(() => {
    const dataStr = JSON.stringify(presets, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = 'superellipse-presets.json';
    link.click();
  }, [presets]);

  const importPresets = useCallback((data: Preset[]) => {
    savePresets([...presets, ...data]);
  }, [presets, savePresets]);

  return {
    presets,
    savePreset,
    deletePreset,
    duplicatePreset,
    exportPresets,
    importPresets,
  };
};
