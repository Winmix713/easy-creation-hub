import { useState, useCallback } from 'react';
import { Layer, LayerType, BlendMode, Transform, SuperellipseState, GradientStop } from '@/types/layers';

interface HistoryState {
  layers: Layer[];
  selectedLayerId: string | null;
}

const MAX_HISTORY = 50;

// Default SuperellipseState for new layers
const DEFAULT_SUPERELLIPSE_STATE: SuperellipseState = {
  width: 200,
  height: 200,
  exponent: 4,
  cornerExponents: {
    topLeft: 4,
    topRight: 4,
    bottomRight: 4,
    bottomLeft: 4,
  },
  useIndividualCorners: false,
  lockAspectRatio: false,
  fillType: 'linear',
  solidColor: '#667eea',
  gradientStops: [
    { id: '1', color: '#667eea', position: 0 },
    { id: '2', color: '#764ba2', position: 100 },
  ],
  gradientAngle: 135,
  glowEnabled: true,
  glowIntensity: 100,
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
};

export function useLayerManager() {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  // Initialize history with empty state so there's always something to undo to
  const [history, setHistory] = useState<HistoryState[]>([
    { layers: [], selectedLayerId: null },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  /**
   * Saves the current state to history
   * Removes any redo history when a new action is performed
   */
  const saveHistory = useCallback((newLayers: Layer[], newSelectedId: string | null) => {
    setHistory((prev) => {
      // Slice off the redo history (everything after current index)
      const newHistory = prev.slice(0, historyIndex + 1);
      // Add new state
      newHistory.push({ layers: newLayers, selectedLayerId: newSelectedId });
      // Keep only MAX_HISTORY entries
      return newHistory.slice(-HISTORY.MAX_ENTRIES);
    });
    setHistoryIndex((prev) => Math.min(prev + 1, HISTORY.MAX_ENTRIES - 1));
  }, [historyIndex]);

  const addLayer = useCallback((type: LayerType) => {
    const newLayer: Layer = {
      id: Date.now().toString(),
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${layers.length + 1}`,
      type,
      visible: true,
      locked: false,
      solo: false,
      opacity: 100,
      blendMode: 'normal',
      transform: {
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 100,
        scaleY: 100,
        anchor: 'center',
      },
      effects: [],
      parentId: null,
      zIndex: layers.length,
      content: {
        superellipseState: type === 'shape' ? { ...DEFAULT_SUPERELLIPSE_STATE } : undefined,
      },
    };

    const newLayers = [...layers, newLayer];
    setLayers(newLayers);
    setSelectedLayerId(newLayer.id);
    saveHistory(newLayers, newLayer.id);
  }, [layers, saveHistory]);

  const removeLayer = useCallback((id: string) => {
    const newLayers = layers.filter((layer) => layer.id !== id);
    setLayers(newLayers);
    if (selectedLayerId === id) {
      setSelectedLayerId(null);
    }
    saveHistory(newLayers, selectedLayerId === id ? null : selectedLayerId);
  }, [layers, selectedLayerId, saveHistory]);

  const updateLayer = useCallback((id: string, updates: Partial<Layer>) => {
    const newLayers = layers.map((layer) =>
      layer.id === id ? { ...layer, ...updates } : layer
    );
    setLayers(newLayers);
    saveHistory(newLayers, selectedLayerId);
  }, [layers, selectedLayerId, saveHistory]);

  const duplicateLayer = useCallback((id: string) => {
    const layer = layers.find((l) => l.id === id);
    if (!layer) return;

    const newLayer: Layer = {
      ...layer,
      id: Date.now().toString(),
      name: `${layer.name} Copy`,
      zIndex: layers.length,
    };

    const newLayers = [...layers, newLayer];
    setLayers(newLayers);
    setSelectedLayerId(newLayer.id);
    saveHistory(newLayers, newLayer.id);
  }, [layers, saveHistory]);

  const toggleVisibility = useCallback((id: string) => {
    const newLayers = layers.map((layer) =>
      layer.id === id ? { ...layer, visible: !layer.visible } : layer
    );
    setLayers(newLayers);
    saveHistory(newLayers, selectedLayerId);
  }, [layers, selectedLayerId, saveHistory]);

  const toggleLock = useCallback((id: string) => {
    const newLayers = layers.map((layer) =>
      layer.id === id ? { ...layer, locked: !layer.locked } : layer
    );
    setLayers(newLayers);
    saveHistory(newLayers, selectedLayerId);
  }, [layers, selectedLayerId, saveHistory]);

  const reorderLayers = useCallback((fromIndex: number, toIndex: number) => {
    const newLayers = [...layers];
    const [removed] = newLayers.splice(fromIndex, 1);
    newLayers.splice(toIndex, 0, removed);
    
    // Update zIndex
    newLayers.forEach((layer, index) => {
      layer.zIndex = index;
    });

    setLayers(newLayers);
    saveHistory(newLayers, selectedLayerId);
  }, [layers, selectedLayerId, saveHistory]);

  const setBlendMode = useCallback((id: string, mode: BlendMode) => {
    updateLayer(id, { blendMode: mode });
  }, [updateLayer]);

  const setOpacity = useCallback((id: string, opacity: number) => {
    updateLayer(id, { opacity });
  }, [updateLayer]);

  const updateTransform = useCallback((id: string, transform: Partial<Transform>) => {
    const layer = layers.find((l) => l.id === id);
    if (!layer) return;

    updateLayer(id, {
      transform: { ...layer.transform, ...transform },
    });
  }, [layers, updateLayer]);

  const updateLayerName = useCallback((id: string, name: string) => {
    updateLayer(id, { name });
  }, [updateLayer]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      setLayers(state.layers);
      setSelectedLayerId(state.selectedLayerId);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      setLayers(state.layers);
      setSelectedLayerId(state.selectedLayerId);
      setHistoryIndex(newIndex);
    }
  }, [history, historyIndex]);

  const selectedLayer = layers.find((l) => l.id === selectedLayerId);

  return {
    layers,
    selectedLayerId,
    selectedLayer,
    setSelectedLayerId,
    addLayer,
    removeLayer,
    updateLayer,
    duplicateLayer,
    toggleVisibility,
    toggleLock,
    reorderLayers,
    setBlendMode,
    setOpacity,
    updateTransform,
    updateLayerName,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
}
