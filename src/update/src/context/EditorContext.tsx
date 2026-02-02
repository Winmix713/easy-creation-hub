import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import {
  GLOW_DEFAULTS,
  NOISE_DEFAULTS,
  SCENE_DEFAULTS,
  ANIMATION_DEFAULTS,
} from '@/constants/index';

/**
 * Editor state encompasses all UI-level settings that are not directly
 * part of the layer/superellipse state but affect the editing experience
 */
interface EditorState {
  // Glow Editor State
  glowEnabled: boolean;
  maskSize: number;
  glowScale: number;
  positionX: number;
  positionY: number;

  // Noise Settings
  noiseEnabled: boolean;
  noiseIntensity: number;

  // Animation State
  animationEnabled: boolean;
  animationType: 'pulse' | 'rotate' | 'wave';
  animationSpeed: number;

  // Scene Settings
  globalScale: number;
  gradientMaskIntensity: number;
  sceneNoiseOverlay: boolean;

  // Modal States
  isExportModalOpen: boolean;
  isShortcutsModalOpen: boolean;
}

/**
 * Editor state setters - Separated interface for easier type management
 */
interface EditorActions {
  // Glow settings
  setGlowEnabled: (enabled: boolean) => void;
  setMaskSize: (size: number) => void;
  setGlowScale: (scale: number) => void;
  setPositionX: (x: number) => void;
  setPositionY: (y: number) => void;

  // Noise settings
  setNoiseEnabled: (enabled: boolean) => void;
  setNoiseIntensity: (intensity: number) => void;

  // Animation settings
  setAnimationEnabled: (enabled: boolean) => void;
  setAnimationType: (type: 'pulse' | 'rotate' | 'wave') => void;
  setAnimationSpeed: (speed: number) => void;

  // Scene settings
  setGlobalScale: (scale: number) => void;
  setGradientMaskIntensity: (intensity: number) => void;
  setSceneNoiseOverlay: (enabled: boolean) => void;

  // Modal controls
  setIsExportModalOpen: (open: boolean) => void;
  setIsShortcutsModalOpen: (open: boolean) => void;

  // Bulk actions
  resetGlowEditor: () => void;
  resetEditorState: () => void;
}

type EditorContextType = EditorState & EditorActions;

const EditorContext = createContext<EditorContextType | undefined>(undefined);

/**
 * EditorProvider - Wraps the application to provide centralized editor state
 * 
 * Eliminates prop drilling by making glow, noise, animation, and scene settings
 * available throughout the component tree via useEditor hook
 */
export function EditorProvider({ children }: { children: ReactNode }) {
  // Glow Editor State
  const [glowEnabled, setGlowEnabled] = useState(GLOW_DEFAULTS.ENABLED);
  const [maskSize, setMaskSize] = useState(GLOW_DEFAULTS.MASK_SIZE);
  const [glowScale, setGlowScale] = useState(GLOW_DEFAULTS.SCALE);
  const [positionX, setPositionX] = useState(GLOW_DEFAULTS.POSITION_X);
  const [positionY, setPositionY] = useState(GLOW_DEFAULTS.POSITION_Y);

  // Noise Settings
  const [noiseEnabled, setNoiseEnabled] = useState(NOISE_DEFAULTS.ENABLED);
  const [noiseIntensity, setNoiseIntensity] = useState(NOISE_DEFAULTS.INTENSITY);

  // Animation State
  const [animationEnabled, setAnimationEnabled] = useState(ANIMATION_DEFAULTS.ENABLED);
  const [animationType, setAnimationType] = useState<'pulse' | 'rotate' | 'wave'>(
    ANIMATION_DEFAULTS.TYPE
  );
  const [animationSpeed, setAnimationSpeed] = useState(ANIMATION_DEFAULTS.SPEED);

  // Scene Settings
  const [globalScale, setGlobalScale] = useState(SCENE_DEFAULTS.GLOBAL_SCALE);
  const [gradientMaskIntensity, setGradientMaskIntensity] = useState(
    SCENE_DEFAULTS.GRADIENT_MASK_INTENSITY
  );
  const [sceneNoiseOverlay, setSceneNoiseOverlay] = useState(SCENE_DEFAULTS.SCENE_NOISE_OVERLAY);

  // Modal States
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  /**
   * Reset glow editor to default state
   */
  const resetGlowEditor = useCallback(() => {
    setGlowEnabled(GLOW_DEFAULTS.ENABLED);
    setMaskSize(GLOW_DEFAULTS.MASK_SIZE);
    setGlowScale(GLOW_DEFAULTS.SCALE);
    setPositionX(GLOW_DEFAULTS.POSITION_X);
    setPositionY(GLOW_DEFAULTS.POSITION_Y);
  }, []);

  /**
   * Reset all editor state to defaults
   */
  const resetEditorState = useCallback(() => {
    resetGlowEditor();
    setNoiseEnabled(NOISE_DEFAULTS.ENABLED);
    setNoiseIntensity(NOISE_DEFAULTS.INTENSITY);
    setAnimationEnabled(ANIMATION_DEFAULTS.ENABLED);
    setAnimationType(ANIMATION_DEFAULTS.TYPE);
    setAnimationSpeed(ANIMATION_DEFAULTS.SPEED);
    setGlobalScale(SCENE_DEFAULTS.GLOBAL_SCALE);
    setGradientMaskIntensity(SCENE_DEFAULTS.GRADIENT_MASK_INTENSITY);
    setSceneNoiseOverlay(SCENE_DEFAULTS.SCENE_NOISE_OVERLAY);
  }, [resetGlowEditor]);

  const value: EditorContextType = {
    // State
    glowEnabled,
    maskSize,
    glowScale,
    positionX,
    positionY,
    noiseEnabled,
    noiseIntensity,
    animationEnabled,
    animationType,
    animationSpeed,
    globalScale,
    gradientMaskIntensity,
    sceneNoiseOverlay,
    isExportModalOpen,
    isShortcutsModalOpen,

    // Actions
    setGlowEnabled,
    setMaskSize,
    setGlowScale,
    setPositionX,
    setPositionY,
    setNoiseEnabled,
    setNoiseIntensity,
    setAnimationEnabled,
    setAnimationType,
    setAnimationSpeed,
    setGlobalScale,
    setGradientMaskIntensity,
    setSceneNoiseOverlay,
    setIsExportModalOpen,
    setIsShortcutsModalOpen,
    resetGlowEditor,
    resetEditorState,
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

/**
 * Hook to access editor state and actions
 * 
 * Usage:
 * ```tsx
 * const { glowEnabled, setGlowEnabled } = useEditor();
 * ```
 */
export function useEditor(): EditorContextType {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}

/**
 * Hook to access only glow editor state and actions
 * 
 * Usage:
 * ```tsx
 * const { glowEnabled, maskSize, setMaskSize } = useGlowEditor();
 * ```
 */
export function useGlowEditor() {
  const {
    glowEnabled,
    maskSize,
    glowScale,
    positionX,
    positionY,
    setGlowEnabled,
    setMaskSize,
    setGlowScale,
    setPositionX,
    setPositionY,
    resetGlowEditor,
  } = useEditor();

  return {
    glowEnabled,
    maskSize,
    glowScale,
    positionX,
    positionY,
    setGlowEnabled,
    setMaskSize,
    setGlowScale,
    setPositionX,
    setPositionY,
    resetGlowEditor,
  };
}

/**
 * Hook to access noise settings
 */
export function useNoiseSettings() {
  const { noiseEnabled, noiseIntensity, setNoiseEnabled, setNoiseIntensity } = useEditor();

  return {
    noiseEnabled,
    noiseIntensity,
    setNoiseEnabled,
    setNoiseIntensity,
  };
}

/**
 * Hook to access animation settings
 */
export function useAnimationSettings() {
  const {
    animationEnabled,
    animationType,
    animationSpeed,
    setAnimationEnabled,
    setAnimationType,
    setAnimationSpeed,
  } = useEditor();

  return {
    animationEnabled,
    animationType,
    animationSpeed,
    setAnimationEnabled,
    setAnimationType,
    setAnimationSpeed,
  };
}

/**
 * Hook to access scene settings
 */
export function useSceneSettings() {
  const {
    globalScale,
    gradientMaskIntensity,
    sceneNoiseOverlay,
    setGlobalScale,
    setGradientMaskIntensity,
    setSceneNoiseOverlay,
  } = useEditor();

  return {
    globalScale,
    gradientMaskIntensity,
    sceneNoiseOverlay,
    setGlobalScale,
    setGradientMaskIntensity,
    setSceneNoiseOverlay,
  };
}

/**
 * Hook to access modal states
 */
export function useModals() {
  const {
    isExportModalOpen,
    isShortcutsModalOpen,
    setIsExportModalOpen,
    setIsShortcutsModalOpen,
  } = useEditor();

  return {
    isExportModalOpen,
    isShortcutsModalOpen,
    setIsExportModalOpen,
    setIsShortcutsModalOpen,
  };
}
