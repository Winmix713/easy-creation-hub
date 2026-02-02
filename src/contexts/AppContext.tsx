import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useSuperellipse } from '@/hooks/useSuperellipse';
import { useLayerManager } from '@/hooks/useLayerManager';
import { useCanvasNavigation } from '@/hooks/useCanvasNavigation';
import { usePresets } from '@/hooks/usePresets';
import { useGlowEditor } from '@/hooks/useGlowEditor';
import { useAnimation } from '@/hooks/useAnimation';
import { useSceneSettings } from '@/hooks/useSceneSettings';
import { useModals } from '@/hooks/useModals';
import { SuperellipseState, Layer, GradientStop } from '@/types';

/**
 * Comprehensive Application Context
 * Centralizes all state management to avoid prop drilling
 */
interface AppContextValue {
  // Superellipse
  superellipse: {
    state: SuperellipseState;
    pathData: string;
    updateState: (updates: Partial<SuperellipseState>) => void;
    updateGradientStop: (id: string, updates: Partial<GradientStop>) => void;
    addGradientStop: (color: string, position: number) => void;
    removeGradientStop: (id: string) => void;
    resetState: () => void;
    loadState: (state: SuperellipseState) => void;
    randomizeGlow: () => void;
  };

  // Layer Management
  layers: {
    items: Layer[];
    selectedId: string | null;
    selected: Layer | null;
    select: (id: string | null) => void;
    add: (type: Layer['type']) => void;
    remove: (id: string) => void;
    update: (id: string, updates: Partial<Layer>) => void;
    duplicate: (id: string) => void;
    toggleVisibility: (id: string) => void;
    toggleLock: (id: string) => void;
    reorder: (startIndex: number, endIndex: number) => void;
    setBlendMode: (id: string, mode: string) => void;
    setOpacity: (id: string, opacity: number) => void;
    updateTransform: (id: string, transform: any) => void;
    updateName: (id: string, name: string) => void;
  };

  // History
  history: {
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
  };

  // Canvas Navigation
  canvas: {
    zoom: number;
    panX: number;
    panY: number;
    isPanning: boolean;
    containerRef: React.RefObject<HTMLDivElement>;
    zoomIn: () => void;
    zoomOut: () => void;
    resetView: () => void;
    zoomTo100: () => void;
    handleMouseDown: (e: React.MouseEvent) => void;
    handleMouseMove: (e: React.MouseEvent) => void;
  };

  // Presets
  presets: {
    items: any[];
    save: (name: string, state: SuperellipseState) => void;
    delete: (id: string) => void;
    duplicate: (id: string) => void;
    export: () => void;
    import: (data: any) => void;
  };

  // Glow Editor
  glow: {
    enabled: boolean;
    maskSize: number;
    scale: number;
    positionX: number;
    positionY: number;
    noiseEnabled: boolean;
    noiseIntensity: number;
    setEnabled: (enabled: boolean) => void;
    setMaskSize: (size: number) => void;
    setScale: (scale: number) => void;
    setPositionX: (x: number) => void;
    setPositionY: (y: number) => void;
    setNoiseEnabled: (enabled: boolean) => void;
    setNoiseIntensity: (intensity: number) => void;
    randomizeColor: () => void;
  };

  // Animation
  animation: {
    enabled: boolean;
    type: 'pulse' | 'rotate' | 'wave';
    speed: number;
    setEnabled: (enabled: boolean) => void;
    setType: (type: 'pulse' | 'rotate' | 'wave') => void;
    setSpeed: (speed: number) => void;
  };

  // Scene Settings
  scene: {
    globalScale: number;
    gradientMaskIntensity: number;
    noiseOverlay: boolean;
    setGlobalScale: (scale: number) => void;
    setGradientMaskIntensity: (intensity: number) => void;
    setNoiseOverlay: (enabled: boolean) => void;
  };

  // Modals
  modals: {
    export: {
      isOpen: boolean;
      open: () => void;
      close: () => void;
    };
    shortcuts: {
      isOpen: boolean;
      open: () => void;
      close: () => void;
    };
  };
}

const AppContext = createContext<AppContextValue | null>(null);

/**
 * Custom hook to access app context
 * Throws error if used outside provider
 */
export const useAppContext = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Application Context Provider
 * Initializes and provides all app-wide state
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Initialize all hooks
  const superellipseHook = useSuperellipse();
  const layerHook = useLayerManager();
  const canvasHook = useCanvasNavigation();
  const presetsHook = usePresets();
  const glowHook = useGlowEditor(superellipseHook.updateState);
  const animationHook = useAnimation();
  const sceneHook = useSceneSettings();
  const modalsHook = useModals();

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<AppContextValue>(
    () => ({
      superellipse: {
        state: superellipseHook.state,
        pathData: superellipseHook.pathData,
        updateState: superellipseHook.updateState,
        updateGradientStop: superellipseHook.updateGradientStop,
        addGradientStop: superellipseHook.addGradientStop,
        removeGradientStop: superellipseHook.removeGradientStop,
        resetState: superellipseHook.resetState,
        loadState: superellipseHook.loadState,
        randomizeGlow: superellipseHook.randomizeGlow,
      },
      layers: {
        items: layerHook.layers,
        selectedId: layerHook.selectedLayerId,
        selected: layerHook.selectedLayer,
        select: layerHook.setSelectedLayerId,
        add: layerHook.addLayer,
        remove: layerHook.removeLayer,
        update: layerHook.updateLayer,
        duplicate: layerHook.duplicateLayer,
        toggleVisibility: layerHook.toggleVisibility,
        toggleLock: layerHook.toggleLock,
        reorder: layerHook.reorderLayers,
        setBlendMode: layerHook.setBlendMode,
        setOpacity: layerHook.setOpacity,
        updateTransform: layerHook.updateTransform,
        updateName: layerHook.updateLayerName,
      },
      history: {
        undo: layerHook.undo,
        redo: layerHook.redo,
        canUndo: layerHook.canUndo,
        canRedo: layerHook.canRedo,
      },
      canvas: {
        zoom: canvasHook.zoom,
        panX: canvasHook.panX,
        panY: canvasHook.panY,
        isPanning: canvasHook.isPanning,
        containerRef: canvasHook.containerRef,
        zoomIn: canvasHook.zoomIn,
        zoomOut: canvasHook.zoomOut,
        resetView: canvasHook.resetView,
        zoomTo100: canvasHook.zoomTo100,
        handleMouseDown: canvasHook.handleMouseDown,
        handleMouseMove: canvasHook.handleMouseMove,
      },
      presets: {
        items: presetsHook.presets,
        save: presetsHook.savePreset,
        delete: presetsHook.deletePreset,
        duplicate: presetsHook.duplicatePreset,
        export: presetsHook.exportPresets,
        import: presetsHook.importPresets,
      },
      glow: glowHook,
      animation: animationHook,
      scene: sceneHook,
      modals: modalsHook,
    }),
    [
      superellipseHook,
      layerHook,
      canvasHook,
      presetsHook,
      glowHook,
      animationHook,
      sceneHook,
      modalsHook,
    ]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
