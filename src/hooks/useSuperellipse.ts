import { useState, useMemo, useCallback } from 'react';
import { SuperellipseState, GradientStop, GlowLayer } from '@/types/layers';
import { getPerCornerSuperellipsePath, getSuperellipsePath } from '@/utils/math';
import { DEFAULT_SUPERELLIPSE_STATE, GRADIENT } from '@/constants';
import { validateWidth, validateHeight, validateExponent, validateGradientPosition } from '@/utils/validation';

/**
 * Sort gradient stops by position
 */
const sortGradientStops = (stops: GradientStop[]): GradientStop[] => {
  return [...stops].sort((a, b) => a.position - b.position);
};

/**
 * Superellipse State Management Hook
 * Handles shape state, gradient operations, and path generation
 */
export function useSuperellipse() {
  const [state, setState] = useState<SuperellipseState>({ ...DEFAULT_SUPERELLIPSE_STATE });

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

  const updateState = useCallback((updates: Partial<SuperellipseState>) => {
    setState((prev) => {
      const newState = { ...prev };
      
      // Validate and apply updates
      if (updates.width !== undefined) {
        newState.width = validateWidth(updates.width);
      }
      if (updates.height !== undefined) {
        newState.height = validateHeight(updates.height);
      }
      if (updates.exponent !== undefined) {
        newState.exponent = validateExponent(updates.exponent);
      }
      
      // Apply other updates directly
      Object.keys(updates).forEach((key) => {
        if (!['width', 'height', 'exponent'].includes(key)) {
          (newState as any)[key] = (updates as any)[key];
        }
      });
      
      // Handle aspect ratio locking
      if (newState.lockAspectRatio) {
        if (updates.width !== undefined && updates.height === undefined) {
          const ratio = prev.height / prev.width;
          newState.height = validateHeight(newState.width * ratio);
        } else if (updates.height !== undefined && updates.width === undefined) {
          const ratio = prev.width / prev.height;
          newState.width = validateWidth(newState.height * ratio);
        }
      }
      
      return newState;
    });
  }, []);

  const updateGradientStop = useCallback((id: string, updates: Partial<GradientStop>) => {
    setState((prev) => {
      const updatedStops = prev.gradientStops.map((stop) => {
        if (stop.id !== id) return stop;
        
        const updatedStop = { ...stop, ...updates };
        
        // Validate position if updated
        if (updates.position !== undefined) {
          updatedStop.position = validateGradientPosition(updates.position);
        }
        
        return updatedStop;
      });
      
      // Always sort after updating (fixes gradient position bug)
      return {
        ...prev,
        gradientStops: sortGradientStops(updatedStops),
      };
    });
  }, []);

  const addGradientStop = useCallback((color: string, position: number) => {
    const newStop: GradientStop = {
      id: Date.now().toString(),
      color,
      position: validateGradientPosition(position),
    };
    
    setState((prev) => ({
      ...prev,
      gradientStops: sortGradientStops([...prev.gradientStops, newStop]),
    }));
  }, []);

  const removeGradientStop = useCallback((id: string) => {
    setState((prev) => {
      // Prevent removing if only 2 stops remain
      if (prev.gradientStops.length <= GRADIENT.MIN_STOPS) {
        console.warn('Cannot remove gradient stop: minimum of 2 stops required');
        return prev;
      }
      
      return {
        ...prev,
        gradientStops: prev.gradientStops.filter((stop) => stop.id !== id),
      };
    });
  }, []);

  const resetState = useCallback(() => {
    setState({ ...DEFAULT_SUPERELLIPSE_STATE });
  }, []);

  const loadState = useCallback((newState: SuperellipseState) => {
    // Validate the loaded state has required fields
    if (!newState || typeof newState !== 'object') {
      console.error('Invalid state provided to loadState');
      return;
    }
    
    // Merge with defaults to ensure all fields exist
    setState({
      ...DEFAULT_SUPERELLIPSE_STATE,
      ...newState,
    } as SuperellipseState);
  }, []);

  const randomizeGlow = useCallback(() => {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setState((prev) => ({
      ...prev,
      glowColor: randomColor,
      glowIntensity: Math.floor(Math.random() * 100) + 50,
    }));
  }, []);

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
