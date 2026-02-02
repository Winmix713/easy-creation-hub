import { useState, useCallback } from 'react';
import { Preset, SuperellipseState } from '@/types/layers';
import { DEFAULT_SUPERELLIPSE_STATE, FILE_IMPORT } from '@/constants';
import { validateImportFile } from '@/utils/validation';
import { isValidPreset, validatePresetImport } from '@/utils/type-guards';

const BUILT_IN_PRESETS: Preset[] = [
  {
    id: 'ios-icon',
    name: 'iOS Icon',
    createdAt: new Date().toISOString(),
    state: {
      ...DEFAULT_SUPERELLIPSE_STATE,
      exponent: 4.5,
      cornerExponents: { topLeft: 4.5, topRight: 4.5, bottomRight: 4.5, bottomLeft: 4.5 },
      lockAspectRatio: true,
      glowIntensity: 60,
    },
  },
  {
    id: 'rounded',
    name: 'Rounded Square',
    createdAt: new Date().toISOString(),
    state: {
      ...DEFAULT_SUPERELLIPSE_STATE,
      exponent: 6,
      cornerExponents: { topLeft: 6, topRight: 6, bottomRight: 6, bottomLeft: 6 },
      lockAspectRatio: true,
      fillType: 'solid' as const,
      solidColor: '#FF6B6B',
      glowEnabled: false,
      glowIntensity: 0,
      strokeWidth: 2,
    },
  },
];

/**
 * Presets Management Hook
 * Handles saving, loading, importing, and exporting presets
 */
export function usePresets() {
  const [presets, setPresets] = useState<Preset[]>(BUILT_IN_PRESETS);
  const [importError, setImportError] = useState<string | null>(null);

  const savePreset = useCallback((name: string, state: SuperellipseState) => {
    if (!name.trim()) {
      console.error('Preset name cannot be empty');
      return null;
    }

    const newPreset: Preset = {
      id: Date.now().toString(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      state: { ...state }, // Clone to prevent mutation
    };
    
    setPresets((prev) => [...prev, newPreset]);
    return newPreset;
  }, []);

  const deletePreset = useCallback((id: string) => {
    // Don't allow deleting built-in presets
    if (['ios-icon', 'rounded'].includes(id)) {
      console.warn('Cannot delete built-in presets');
      return;
    }
    
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
      state: { ...preset.state }, // Clone state
    };
    
    setPresets((prev) => [...prev, newPreset]);
  }, [presets]);

  const exportPresets = useCallback(() => {
    try {
      // Only export user-created presets
      const userPresets = presets.filter((p) => !['ios-icon', 'rounded'].includes(p.id));
      const json = JSON.stringify(userPresets, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'superellipse-presets.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export presets:', error);
    }
  }, [presets]);

  const importPresets = useCallback((file: File) => {
    setImportError(null);
    
    // Validate file
    const fileValidation = validateImportFile(file, FILE_IMPORT.MAX_SIZE_MB);
    if (!fileValidation.valid) {
      setImportError(fileValidation.error || 'Invalid file');
      console.error('Import validation failed:', fileValidation.error);
      return;
    }

    const reader = new FileReader();
    
    reader.onerror = () => {
      setImportError('Failed to read file');
      console.error('FileReader error');
    };
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (!content) {
          setImportError('File is empty');
          return;
        }
        
        const data = JSON.parse(content);
        
        // Validate preset structure
        const validation = validatePresetImport(data);
        
        if (!validation.valid) {
          setImportError(validation.errors.join(', ') || 'Invalid preset format');
          return;
        }
        
        // Add only valid presets
        setPresets((prev) => [...prev, ...validation.presets]);
        
        if (validation.errors.length > 0) {
          console.warn('Some presets were skipped:', validation.errors);
        }
      } catch (error) {
        setImportError('Invalid JSON format');
        console.error('Failed to parse preset file:', error);
      }
    };
    
    reader.readAsText(file);
  }, []);

  const clearImportError = useCallback(() => {
    setImportError(null);
  }, []);

  return {
    presets,
    savePreset,
    deletePreset,
    duplicatePreset,
    exportPresets,
    importPresets,
    importError,
    clearImportError,
  };
}
