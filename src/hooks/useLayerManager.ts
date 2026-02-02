import { useState, useCallback } from 'react';
import { Layer, LayerType, BlendMode, Transform } from '@/types';

const createDefaultTransform = (): Transform => ({
  x: 0,
  y: 0,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
});

const createLayer = (type: LayerType, name: string): Layer => ({
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  name,
  type,
  visible: true,
  locked: false,
  opacity: 100,
  blendMode: 'normal',
  transform: createDefaultTransform(),
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

/**
 * Hook for managing layers with undo/redo history
 */
export const useLayerManager = () => {
  const [layers, setLayers] = useState<Layer[]>([
    createLayer('shape', 'Shape 1'),
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [history, setHistory] = useState<Layer[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveToHistory = useCallback((newLayers: Layer[]) => {
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newLayers]);
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const selectedLayer = layers.find(l => l.id === selectedLayerId) || null;

  const addLayer = useCallback((type: LayerType) => {
    const newLayer = createLayer(type, `${type.charAt(0).toUpperCase() + type.slice(1)} ${layers.length + 1}`);
    const newLayers = [...layers, newLayer];
    setLayers(newLayers);
    setSelectedLayerId(newLayer.id);
    saveToHistory(newLayers);
  }, [layers, saveToHistory]);

  const removeLayer = useCallback((id: string) => {
    const newLayers = layers.filter(l => l.id !== id);
    setLayers(newLayers);
    if (selectedLayerId === id) {
      setSelectedLayerId(newLayers.length > 0 ? newLayers[0].id : null);
    }
    saveToHistory(newLayers);
  }, [layers, selectedLayerId, saveToHistory]);

  const updateLayer = useCallback((id: string, updates: Partial<Layer>) => {
    const newLayers = layers.map(l =>
      l.id === id ? { ...l, ...updates, updatedAt: Date.now() } : l
    );
    setLayers(newLayers);
  }, [layers]);

  const duplicateLayer = useCallback((id: string) => {
    const layer = layers.find(l => l.id === id);
    if (!layer) return;

    const newLayer: Layer = {
      ...layer,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: `${layer.name} Copy`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const newLayers = [...layers, newLayer];
    setLayers(newLayers);
    setSelectedLayerId(newLayer.id);
    saveToHistory(newLayers);
  }, [layers, saveToHistory]);

  const toggleVisibility = useCallback((id: string) => {
    setLayers(prev =>
      prev.map(l => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  }, []);

  const toggleLock = useCallback((id: string) => {
    setLayers(prev =>
      prev.map(l => (l.id === id ? { ...l, locked: !l.locked } : l))
    );
  }, []);

  const reorderLayers = useCallback((startIndex: number, endIndex: number) => {
    const result = Array.from(layers);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setLayers(result);
    saveToHistory(result);
  }, [layers, saveToHistory]);

  const setBlendMode = useCallback((id: string, mode: string) => {
    updateLayer(id, { blendMode: mode as BlendMode });
  }, [updateLayer]);

  const setOpacity = useCallback((id: string, opacity: number) => {
    updateLayer(id, { opacity });
  }, [updateLayer]);

  const updateTransform = useCallback((id: string, transform: Partial<Transform>) => {
    const layer = layers.find(l => l.id === id);
    if (!layer) return;
    updateLayer(id, { transform: { ...layer.transform, ...transform } });
  }, [layers, updateLayer]);

  const updateLayerName = useCallback((id: string, name: string) => {
    updateLayer(id, { name });
  }, [updateLayer]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setLayers(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setLayers(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

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
    canUndo,
    canRedo,
  };
};
