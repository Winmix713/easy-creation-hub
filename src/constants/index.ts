/**
 * Application Constants
 * Centralized configuration values for the Superellipse Generator
 */

// ============ ZOOM & CANVAS ============
export const ZOOM = {
  STEP: 25,
  MIN: 25,
  MAX: 400,
  DEFAULT: 100,
} as const;

export const PAN = {
  DEFAULT_X: 0,
  DEFAULT_Y: 0,
} as const;

// ============ SHAPE BOUNDS ============
export const SHAPE_BOUNDS = {
  WIDTH: { MIN: 50, MAX: 800 },
  HEIGHT: { MIN: 50, MAX: 800 },
  EXPONENT: { MIN: 0.5, MAX: 10, STEP: 0.1 },
} as const;

// ============ ANIMATION TIMERS ============
export const ANIMATION_TIMERS = {
  GLOW_TRANSITION: 950,
  ENABLE_DELAY: 90,
  DEBOUNCE: 150,
} as const;

// ============ HISTORY ============
export const HISTORY = {
  MAX_ENTRIES: 50,
} as const;

// ============ COLOR DEFAULTS ============
export const COLOR_DEFAULTS = {
  SOLID: '#667eea',
  GLOW: '#667eea',
  STROKE: '#000000',
  BACKGROUND_DARK: '#1a1a1a',
  BACKGROUND_LIGHT: '#ffffff',
} as const;

// ============ GRADIENT ============
export const GRADIENT = {
  ANGLE: { MIN: 0, MAX: 360 },
  POSITION: { MIN: 0, MAX: 100 },
  MIN_STOPS: 2,
} as const;

// ============ EFFECTS ============
export const EFFECTS = {
  BLUR: { MIN: 0, MAX: 50 },
  BACKDROP_BLUR: { MIN: 0, MAX: 30 },
  NOISE_OPACITY: { MIN: 0, MAX: 50 },
  STROKE_WIDTH: { MIN: 0, MAX: 20 },
  GLOW_INTENSITY: { MIN: 0, MAX: 200 },
} as const;

// ============ GLOW LAYERS ============
export const GLOW_LAYER_DEFAULTS = [
  { id: '1', blur: 8, opacity: 80, enabled: true },
  { id: '2', blur: 24, opacity: 60, enabled: true },
  { id: '3', blur: 48, opacity: 40, enabled: true },
  { id: '4', blur: 96, opacity: 20, enabled: true },
] as const;

// ============ LAYER ============
export const LAYER = {
  OPACITY: { MIN: 0, MAX: 100, DEFAULT: 100 },
  SCALE: { MIN: 10, MAX: 200, DEFAULT: 100 },
  ROTATION: { MIN: 0, MAX: 360, DEFAULT: 0 },
} as const;

// ============ SVG PATH GENERATION ============
export const PATH = {
  SEGMENTS_PER_QUADRANT: 100,
  PRECISION: 2,
} as const;

// ============ FILE IMPORT ============
export const FILE_IMPORT = {
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  ALLOWED_EXTENSIONS: ['.json'],
} as const;

// ============ DEFAULT SUPERELLIPSE STATE ============
// Note: Not using `as const` to allow mutable arrays
export const DEFAULT_SUPERELLIPSE_STATE = {
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
  fillType: 'linear' as 'solid' | 'linear' | 'radial' | 'conic',
  solidColor: COLOR_DEFAULTS.SOLID,
  gradientStops: [
    { id: '1', color: '#667eea', position: 0 },
    { id: '2', color: '#764ba2', position: 100 },
  ],
  gradientAngle: 135,
  glowEnabled: true,
  glowIntensity: 100,
  glowColor: COLOR_DEFAULTS.GLOW,
  glowLayers: [
    { id: '1', blur: 8, opacity: 80, enabled: true },
    { id: '2', blur: 24, opacity: 60, enabled: true },
    { id: '3', blur: 48, opacity: 40, enabled: true },
    { id: '4', blur: 96, opacity: 20, enabled: true },
  ],
  blur: 0,
  backdropBlur: 0,
  strokeWidth: 0,
  strokeColor: COLOR_DEFAULTS.STROKE,
  noiseOpacity: 0,
  backgroundColor: COLOR_DEFAULTS.BACKGROUND_DARK,
};
