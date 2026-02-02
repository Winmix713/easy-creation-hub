import { useState, useCallback, useRef } from 'react';
import { Layer, LayerType, BlendMode, Transform, SuperellipseState, GradientStop } from '@/types/layers';
import { HISTORY, DEFAULT_SUPERELLIPSE_STATE } from '@/constants';
import { validateOpacity } from '@/utils/validation';

interface HistoryState {
  layers: Layer[];
  selectedLayerId: string | null;
}

/**
 * Layer Manager Hook
 * Manages layers, selection, and history with proper undo/redo
 */
export function useLayerManager() {
  // Initialize with empty state in history to allow undo to initial state
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryState[]>([{ layers: [], selectedLayerId: null }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Use ref to avoid stale closure issues with historyIndex
  const historyIndexRef = useRef(historyIndex);
  historyIndexRef.current = historyIndex;

  const saveHistory = useCallback((newLayers: Layer[], newSelectedId: string | null) => {
    setHistory((prev) => {
      // Use ref for current index to avoid stale closure
      const currentIndex = historyIndexRef.current;
      // Slice history up to current position (discard any "future" states after undo)
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push({ layers: newLayers, selectedLayerId: newSelectedId });
      // Keep only last MAX_HISTORY entries
      return newHistory.slice(-HISTORY.MAX_ENTRIES);
    });
    setHistoryIndex((prev) => Math.min(prev + 1, HISTORY.MAX_ENTRIES - 1));
  }, []);

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
    const newSelectedId = selectedLayerId === id ? null : selectedLayerId;
    setLayers(newLayers);
    setSelectedLayerId(newSelectedId);
    saveHistory(newLayers, newSelectedId);
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
      // Deep clone content to avoid reference issues
      content: layer.content ? { ...layer.content } : undefined,
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
    if (fromIndex === toIndex) return;
    if (fromIndex < 0 || toIndex < 0) return;
    if (fromIndex >= layers.length || toIndex >= layers.length) return;

    const newLayers = [...layers];
    const [removed] = newLayers.splice(fromIndex, 1);
    newLayers.splice(toIndex, 0, removed);
    
    // Update zIndex for all layers
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
    const validatedOpacity = validateOpacity(opacity);
    updateLayer(id, { opacity: validatedOpacity });
  }, [updateLayer]);

  const updateTransform = useCallback((id: string, transform: Partial<Transform>) => {
    const layer = layers.find((l) => l.id === id);
    if (!layer) return;

    updateLayer(id, {
      transform: { ...layer.transform, ...transform },
    });
  }, [layers, updateLayer]);

  const updateLayerName = useCallback((id: string, name: string) => {
    if (!name.trim()) return; // Don't allow empty names
    updateLayer(id, { name: name.trim() });
  }, [updateLayer]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      if (state) {
        setLayers(state.layers);
        setSelectedLayerId(state.selectedLayerId);
        setHistoryIndex(newIndex);
      }
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      if (state) {
        setLayers(state.layers);
        setSelectedLayerId(state.selectedLayerId);
        setHistoryIndex(newIndex);
      }
    }
  }, [history, historyIndex]);

  const selectedLayer = layers.find((l) => l.id === selectedLayerId) ?? null;

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
