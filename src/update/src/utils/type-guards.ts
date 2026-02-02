/**
 * Type guard utilities for runtime type checking
 * 
 * These functions validate that runtime values conform to the expected types.
 * Useful for validating data from localStorage, imports, and API responses.
 */

import {
  Layer,
  LayerType,
  BlendMode,
  SuperellipseState,
  GradientStop,
  GlowLayer,
  Transform,
  AnchorPoint,
  Preset,
} from '@/types/layers';
import { isValidHexColor } from './validation';

/**
 * Type guard: Check if value is a valid LayerType
 */
function isValidLayerType(value: any): value is LayerType {
  return ['shape', 'image', 'text', 'group'].includes(value);
}

/**
 * Type guard: Check if value is a valid BlendMode
 */
function isValidBlendMode(value: any): value is BlendMode {
  const validModes = [
    'normal',
    'multiply',
    'screen',
    'overlay',
    'darken',
    'lighten',
    'color-dodge',
    'color-burn',
    'hard-light',
    'soft-light',
    'difference',
    'exclusion',
    'hue',
    'saturation',
    'color',
    'luminosity',
  ];
  return validModes.includes(value);
}

/**
 * Type guard: Check if value is a valid AnchorPoint
 */
function isValidAnchorPoint(value: any): value is AnchorPoint {
  const validPoints = [
    'top-left',
    'top-center',
    'top-right',
    'center-left',
    'center',
    'center-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ];
  return validPoints.includes(value);
}

/**
 * Type guard: Check if value is a valid Transform object
 */
export function isValidTransform(value: any): value is Transform {
  if (!value || typeof value !== 'object') return false;

  return (
    typeof value.x === 'number' &&
    typeof value.y === 'number' &&
    typeof value.rotation === 'number' &&
    typeof value.scaleX === 'number' &&
    typeof value.scaleY === 'number' &&
    isValidAnchorPoint(value.anchor)
  );
}

/**
 * Type guard: Check if value is a valid GradientStop
 */
export function isValidGradientStop(value: any): value is GradientStop {
  if (!value || typeof value !== 'object') return false;

  return (
    typeof value.id === 'string' &&
    isValidHexColor(value.color) &&
    typeof value.position === 'number' &&
    value.position >= 0 &&
    value.position <= 100
  );
}

/**
 * Type guard: Check if value is a valid GlowLayer
 */
export function isValidGlowLayer(value: any): value is GlowLayer {
  if (!value || typeof value !== 'object') return false;

  return (
    typeof value.id === 'string' &&
    typeof value.blur === 'number' &&
    value.blur >= 0 &&
    typeof value.opacity === 'number' &&
    value.opacity >= 0 &&
    value.opacity <= 100 &&
    typeof value.enabled === 'boolean'
  );
}

/**
 * Type guard: Check if value is a valid SuperellipseState
 */
export function isValidSuperellipseState(value: any): value is SuperellipseState {
  if (!value || typeof value !== 'object') return false;

  // Check basic numeric properties
  if (
    typeof value.width !== 'number' ||
    typeof value.height !== 'number' ||
    typeof value.exponent !== 'number' ||
    typeof value.blur !== 'number' ||
    typeof value.backdropBlur !== 'number' ||
    typeof value.strokeWidth !== 'number' ||
    typeof value.noiseOpacity !== 'number' ||
    typeof value.glowIntensity !== 'number' ||
    typeof value.gradientAngle !== 'number'
  ) {
    return false;
  }

  // Check boolean properties
  if (
    typeof value.useIndividualCorners !== 'boolean' ||
    typeof value.lockAspectRatio !== 'boolean' ||
    typeof value.glowEnabled !== 'boolean'
  ) {
    return false;
  }

  // Check fill type
  const validFillTypes = ['solid', 'linear', 'radial', 'conic'];
  if (!validFillTypes.includes(value.fillType)) return false;

  // Check color properties
  if (
    !isValidHexColor(value.solidColor) ||
    !isValidHexColor(value.glowColor) ||
    !isValidHexColor(value.strokeColor) ||
    !isValidHexColor(value.backgroundColor)
  ) {
    return false;
  }

  // Check corner exponents object
  if (
    !value.cornerExponents ||
    typeof value.cornerExponents.topLeft !== 'number' ||
    typeof value.cornerExponents.topRight !== 'number' ||
    typeof value.cornerExponents.bottomRight !== 'number' ||
    typeof value.cornerExponents.bottomLeft !== 'number'
  ) {
    return false;
  }

  // Check gradient stops array
  if (!Array.isArray(value.gradientStops)) return false;
  if (!value.gradientStops.every(isValidGradientStop)) return false;

  // Check glow layers array
  if (!Array.isArray(value.glowLayers)) return false;
  if (!value.glowLayers.every(isValidGlowLayer)) return false;

  return true;
}

/**
 * Type guard: Check if value is a valid Layer
 */
export function isValidLayer(value: any): value is Layer {
  if (!value || typeof value !== 'object') return false;

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    isValidLayerType(value.type) &&
    typeof value.visible === 'boolean' &&
    typeof value.locked === 'boolean' &&
    typeof value.solo === 'boolean' &&
    typeof value.opacity === 'number' &&
    value.opacity >= 0 &&
    value.opacity <= 100 &&
    isValidBlendMode(value.blendMode) &&
    isValidTransform(value.transform) &&
    Array.isArray(value.effects) &&
    (typeof value.parentId === 'string' || value.parentId === null) &&
    typeof value.zIndex === 'number' &&
    (!value.content || isValidLayerContent(value.content))
  );
}

/**
 * Type guard: Check if value is valid layer content
 */
function isValidLayerContent(value: any): boolean {
  if (!value || typeof value !== 'object') return false;

  // If superellipseState exists, validate it
  if (value.superellipseState && !isValidSuperellipseState(value.superellipseState)) {
    return false;
  }

  // Image URL should be string if present
  if (value.imageUrl && typeof value.imageUrl !== 'string') return false;

  // Text should be string if present
  if (value.text && typeof value.text !== 'string') return false;

  return true;
}

/**
 * Type guard: Check if value is a valid Preset
 */
export function isValidPreset(value: any): value is Preset {
  if (!value || typeof value !== 'object') return false;

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.createdAt === 'string' &&
    isValidSuperellipseState(value.state) &&
    (!value.thumbnail || typeof value.thumbnail === 'string')
  );
}

/**
 * Type guard: Check if value is an array of Presets
 */
export function isValidPresetArray(value: any): value is Preset[] {
  return Array.isArray(value) && value.every(isValidPreset);
}

/**
 * Type guard: Check if value is an array of Layers
 */
export function isValidLayerArray(value: any): value is Layer[] {
  return Array.isArray(value) && value.every(isValidLayer);
}

/**
 * Validates and sanitizes a SuperellipseState object
 * Replaces invalid values with defaults
 * 
 * @param state - State object to validate
 * @param defaults - Default state to use for invalid properties
 * @returns Validated state object
 */
export function sanitizeSuperellipseState(
  state: any,
  defaults: SuperellipseState
): SuperellipseState {
  if (!isValidSuperellipseState(state)) {
    return defaults;
  }
  return state;
}

/**
 * Validates and sanitizes a Layer object
 * 
 * @param layer - Layer object to validate
 * @returns Valid layer or null if invalid
 */
export function sanitizeLayer(layer: any): Layer | null {
  if (!isValidLayer(layer)) {
    return null;
  }
  return layer;
}

/**
 * Deep clones and validates a SuperellipseState
 * Ensures all properties are present and valid
 * 
 * @param state - State to clone and validate
 * @returns Cloned and validated state
 */
export function cloneAndValidateSuperellipseState(
  state: SuperellipseState
): SuperellipseState {
  return {
    width: typeof state.width === 'number' ? state.width : 200,
    height: typeof state.height === 'number' ? state.height : 200,
    exponent: typeof state.exponent === 'number' ? state.exponent : 4,
    cornerExponents: {
      topLeft: typeof state.cornerExponents?.topLeft === 'number' ? state.cornerExponents.topLeft : 4,
      topRight: typeof state.cornerExponents?.topRight === 'number' ? state.cornerExponents.topRight : 4,
      bottomRight: typeof state.cornerExponents?.bottomRight === 'number' ? state.cornerExponents.bottomRight : 4,
      bottomLeft: typeof state.cornerExponents?.bottomLeft === 'number' ? state.cornerExponents.bottomLeft : 4,
    },
    useIndividualCorners: state.useIndividualCorners === true,
    lockAspectRatio: state.lockAspectRatio === true,
    fillType: ['solid', 'linear', 'radial', 'conic'].includes(state.fillType as any) ? state.fillType : 'linear',
    solidColor: isValidHexColor(state.solidColor as any) ? state.solidColor : '#667eea',
    gradientStops: Array.isArray(state.gradientStops)
      ? state.gradientStops.filter(isValidGradientStop)
      : [
          { id: '1', color: '#667eea', position: 0 },
          { id: '2', color: '#764ba2', position: 100 },
        ],
    gradientAngle: typeof state.gradientAngle === 'number' ? state.gradientAngle : 135,
    glowEnabled: state.glowEnabled === true,
    glowIntensity: typeof state.glowIntensity === 'number' ? state.glowIntensity : 100,
    glowColor: isValidHexColor(state.glowColor as any) ? state.glowColor : '#667eea',
    glowLayers: Array.isArray(state.glowLayers)
      ? state.glowLayers.filter(isValidGlowLayer)
      : [
          { id: '1', blur: 8, opacity: 80, enabled: true },
          { id: '2', blur: 24, opacity: 60, enabled: true },
          { id: '3', blur: 48, opacity: 40, enabled: true },
          { id: '4', blur: 96, opacity: 20, enabled: true },
        ],
    blur: typeof state.blur === 'number' ? state.blur : 0,
    backdropBlur: typeof state.backdropBlur === 'number' ? state.backdropBlur : 0,
    strokeWidth: typeof state.strokeWidth === 'number' ? state.strokeWidth : 0,
    strokeColor: isValidHexColor(state.strokeColor as any) ? state.strokeColor : '#000000',
    noiseOpacity: typeof state.noiseOpacity === 'number' ? state.noiseOpacity : 0,
    backgroundColor: isValidHexColor(state.backgroundColor as any) ? state.backgroundColor : '#1a1a1a',
  };
}
