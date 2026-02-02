import { useState, useCallback, useMemo } from 'react';
import { SuperellipseState, GradientStop } from '@/types';

const DEFAULT_STATE: SuperellipseState = {
  width: 200,
  height: 200,
  n: 4,
  solidColor: '#3b82f6',
  useGradient: true,
  gradientStops: [
    { id: '1', color: '#3b82f6', position: 0 },
    { id: '2', color: '#8b5cf6', position: 1 },
  ],
  gradientAngle: 135,
  strokeWidth: 0,
  strokeColor: '#ffffff',
  hasStroke: false,
};

/**
 * Generate superellipse path data
 */
const generateSuperellipsePath = (
  width: number,
  height: number,
  n: number
): string => {
  const a = width / 2;
  const b = height / 2;
  const points: string[] = [];
  const steps = 100;

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * 2 * Math.PI;
    const cosT = Math.cos(t);
    const sinT = Math.sin(t);
    
    const x = a * Math.sign(cosT) * Math.pow(Math.abs(cosT), 2 / n) + a;
    const y = b * Math.sign(sinT) * Math.pow(Math.abs(sinT), 2 / n) + b;
    
    if (i === 0) {
      points.push(`M ${x} ${y}`);
    } else {
      points.push(`L ${x} ${y}`);
    }
  }
  
  points.push('Z');
  return points.join(' ');
};

/**
 * Hook for managing superellipse state
 */
export const useSuperellipse = () => {
  const [state, setState] = useState<SuperellipseState>(DEFAULT_STATE);

  const pathData = useMemo(
    () => generateSuperellipsePath(state.width, state.height, state.n),
    [state.width, state.height, state.n]
  );

  const updateState = useCallback((updates: Partial<SuperellipseState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const updateGradientStop = useCallback(
    (id: string, updates: Partial<GradientStop>) => {
      setState(prev => ({
        ...prev,
        gradientStops: prev.gradientStops.map(stop =>
          stop.id === id ? { ...stop, ...updates } : stop
        ),
      }));
    },
    []
  );

  const addGradientStop = useCallback((color: string, position: number) => {
    const newStop: GradientStop = {
      id: Date.now().toString(),
      color,
      position,
    };
    setState(prev => ({
      ...prev,
      gradientStops: [...prev.gradientStops, newStop].sort(
        (a, b) => a.position - b.position
      ),
    }));
  }, []);

  const removeGradientStop = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      gradientStops: prev.gradientStops.filter(stop => stop.id !== id),
    }));
  }, []);

  const resetState = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  const loadState = useCallback((newState: SuperellipseState) => {
    setState(newState);
  }, []);

  const randomizeGlow = useCallback(() => {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setState(prev => ({ ...prev, solidColor: randomColor }));
  }, []);

  return {
    state,
    pathData,
    updateState,
    updateGradientStop,
    addGradientStop,
    removeGradientStop,
    resetState,
    loadState,
    randomizeGlow,
  };
};
