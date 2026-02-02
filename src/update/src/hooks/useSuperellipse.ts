import { useState, useMemo } from 'react';
import { SuperellipseState, GradientStop, GlowLayer } from '@/types/layers';
import { getPerCornerSuperellipsePath, getSuperellipsePath } from '@/utils/math';
import { DEFAULT_SUPERELLIPSE_STATE } from '@/constants/index';

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
