import { useState, useMemo } from 'react';
import { SuperellipseState, GradientStop, GlowLayer } from '@/types/layers';
import { getPerCornerSuperellipsePath, getSuperellipsePath } from '@/utils/math';

const DEFAULT_STATE: SuperellipseState = {
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

export function useSuperellipse() {
  const [state, setState] = useState<SuperellipseState>(DEFAULT_STATE);

  const pathData = useMemo(() => {
    if (state.useIndividualCorners) {
      return getPerCornerSuperellipsePath(state.width, state.height, {
        tl: state.cornerExponents.topLeft,
        tr: state.cornerExponents.topRight,
        br: state.cornerExponents.bottomRight,
        bl: state.cornerExponents.bottomLeft,
      });
    } else {
      return getSuperellipsePath(state.width, state.height, state.exponent);
    }
  }, [
    state.width,
    state.height,
    state.exponent,
    state.useIndividualCorners,
    state.cornerExponents,
  ]);

  const updateState = (updates: Partial<SuperellipseState>) => {
    setState((prev) => {
      const newState = { ...prev, ...updates };
      
      // Handle aspect ratio locking
      if (newState.lockAspectRatio && updates.width && !updates.height) {
        const ratio = prev.height / prev.width;
        newState.height = newState.width * ratio;
      } else if (newState.lockAspectRatio && updates.height && !updates.width) {
        const ratio = prev.width / prev.height;
        newState.width = newState.height * ratio;
      }
      
      return newState;
    });
  };

  const updateGradientStop = (id: string, updates: Partial<GradientStop>) => {
    setState((prev) => ({
      ...prev,
      gradientStops: prev.gradientStops.map((stop) =>
        stop.id === id ? { ...stop, ...updates } : stop
      ),
    }));
  };

  const addGradientStop = (color: string, position: number) => {
    const newStop: GradientStop = {
      id: Date.now().toString(),
      color,
      position,
    };
    setState((prev) => ({
      ...prev,
      gradientStops: [...prev.gradientStops, newStop].sort(
        (a, b) => a.position - b.position
      ),
    }));
  };

  const removeGradientStop = (id: string) => {
    setState((prev) => ({
      ...prev,
      gradientStops: prev.gradientStops.filter((stop) => stop.id !== id),
    }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  const loadState = (newState: SuperellipseState) => {
    setState(newState);
  };

  const randomizeGlow = () => {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    setState((prev) => ({
      ...prev,
      glowColor: randomColor,
      glowIntensity: Math.random() * 100 + 50,
    }));
  };

  return {
    state,
    updateState,
    updateGradientStop,
    addGradientStop,
    removeGradientStop,
    resetState,
    loadState,
    randomizeGlow,
    pathData,
  };
}
