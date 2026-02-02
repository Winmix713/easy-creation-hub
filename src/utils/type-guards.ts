/**
 * Type Guards
 * Runtime type validation for data structures
 */

import { Layer, SuperellipseState, GradientStop, GlowLayer, Preset } from '@/types/layers';
import { isValidObject, isNonEmptyArray, isValidHexColor } from './validation';

/**
 * Check if value is a valid GradientStop
 */
export function isValidGradientStop(obj: unknown): obj is GradientStop {
  if (!isValidObject(obj)) return false;
  
  return (
    typeof obj.id === 'string' &&
    typeof obj.color === 'string' &&
    typeof obj.position === 'number' &&
    obj.position >= 0 &&
    obj.position <= 100
  );
}

/**
 * Check if value is a valid GlowLayer
 */
export function isValidGlowLayer(obj: unknown): obj is GlowLayer {
  if (!isValidObject(obj)) return false;
  
  return (
    typeof obj.id === 'string' &&
    typeof obj.blur === 'number' &&
    typeof obj.opacity === 'number' &&
    typeof obj.enabled === 'boolean'
  );
}

/**
 * Check if value is a valid SuperellipseState
 */
export function isValidSuperellipseState(obj: unknown): obj is SuperellipseState {
  if (!isValidObject(obj)) return false;
  
  const state = obj as Record<string, unknown>;
  
  // Check required numeric fields
  const numericFields = ['width', 'height', 'exponent', 'gradientAngle', 'glowIntensity', 'blur', 'backdropBlur', 'strokeWidth', 'noiseOpacity'];
  for (const field of numericFields) {
    if (typeof state[field] !== 'number') return false;
  }
  
  // Check required string fields
  const stringFields = ['solidColor', 'glowColor', 'strokeColor', 'backgroundColor'];
  for (const field of stringFields) {
    if (typeof state[field] !== 'string') return false;
  }
  
  // Check boolean fields
  const booleanFields = ['useIndividualCorners', 'lockAspectRatio', 'glowEnabled'];
  for (const field of booleanFields) {
    if (typeof state[field] !== 'boolean') return false;
  }
  
  // Check fillType
  if (!['solid', 'linear', 'radial', 'conic'].includes(state.fillType as string)) return false;
  
  // Check gradient stops
  if (!isNonEmptyArray<GradientStop>(state.gradientStops)) return false;
  if (!state.gradientStops.every(isValidGradientStop)) return false;
  
  // Check glow layers
  if (!Array.isArray(state.glowLayers)) return false;
  if (!state.glowLayers.every(isValidGlowLayer)) return false;
  
  // Check corner exponents
  if (!isValidObject(state.cornerExponents)) return false;
  const corners = state.cornerExponents as Record<string, unknown>;
  const cornerFields = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'];
  for (const field of cornerFields) {
    if (typeof corners[field] !== 'number') return false;
  }
  
  return true;
}

/**
 * Check if value is a valid Layer
 */
export function isValidLayer(obj: unknown): obj is Layer {
  if (!isValidObject(obj)) return false;
  
  const layer = obj as Record<string, unknown>;
  
  // Check required fields
  if (typeof layer.id !== 'string') return false;
  if (typeof layer.name !== 'string') return false;
  if (!['shape', 'image', 'text', 'group'].includes(layer.type as string)) return false;
  if (typeof layer.visible !== 'boolean') return false;
  if (typeof layer.locked !== 'boolean') return false;
  if (typeof layer.opacity !== 'number') return false;
  if (typeof layer.zIndex !== 'number') return false;
  
  return true;
}

/**
 * Check if value is a valid Preset
 */
export function isValidPreset(obj: unknown): obj is Preset {
  if (!isValidObject(obj)) return false;
  
  const preset = obj as Record<string, unknown>;
  
  if (typeof preset.id !== 'string') return false;
  if (typeof preset.name !== 'string') return false;
  if (typeof preset.createdAt !== 'string') return false;
  if (!isValidSuperellipseState(preset.state)) return false;
  
  return true;
}

/**
 * Validate an array of presets for import
 */
export function validatePresetImport(data: unknown): { valid: boolean; presets: Preset[]; errors: string[] } {
  const errors: string[] = [];
  const validPresets: Preset[] = [];
  
  if (!Array.isArray(data)) {
    return { valid: false, presets: [], errors: ['Import data must be an array'] };
  }
  
  data.forEach((item, index) => {
    if (isValidPreset(item)) {
      validPresets.push(item);
    } else {
      errors.push(`Invalid preset at index ${index}`);
    }
  });
  
  return {
    valid: validPresets.length > 0,
    presets: validPresets,
    errors,
  };
}
