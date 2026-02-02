/**
 * Global Constants for Superellipse Generator
 * 
 * Centralized configuration for all magic numbers, default values, and constraints
 * throughout the application.
 */

// ============================================================================
// Canvas Navigation Constants
// ============================================================================

export const ZOOM = {
  STEP: 25,
  MIN: 25,
  MAX: 400,
  DEFAULT: 100,
} as const;

// ============================================================================
// Shape Constraints
// ============================================================================

export const SHAPE_BOUNDS = {
  WIDTH: { MIN: 50, MAX: 800, DEFAULT: 200 },
  HEIGHT: { MIN: 50, MAX: 800, DEFAULT: 200 },
  EXPONENT: { MIN: 0.5, MAX: 10, DEFAULT: 4, STEP: 0.1 },
} as const;

// ============================================================================
// Animation Timers (in milliseconds)
// ============================================================================

export const ANIMATION_TIMERS = {
  GLOW_DISABLE: 950,    // Time to disable glow before color change animation
  GLOW_ENABLE: 90,      // Time to re-enable glow after color change
} as const;

// ============================================================================
// Glow Effect Defaults
// ============================================================================

export const GLOW_DEFAULTS = {
  ENABLED: true,
  MASK_SIZE: 0.3,
  SCALE: 0.9,
  INTENSITY: 100,
  COLOR: '#667eea',
  POSITION_X: -590,
  POSITION_Y: -1070,
} as const;

// ============================================================================
// Noise Effect Defaults
// ============================================================================

export const NOISE_DEFAULTS = {
  ENABLED: true,
  INTENSITY: 0.35,
  OPACITY: 0,
} as const;

// ============================================================================
// Scene Settings Defaults
// ============================================================================

export const SCENE_DEFAULTS = {
  GLOBAL_SCALE: 1,
  GRADIENT_MASK_INTENSITY: 0.7,
  SCENE_NOISE_OVERLAY: true,
} as const;

// ============================================================================
// Animation Defaults
// ============================================================================

export const ANIMATION_DEFAULTS = {
  ENABLED: false,
  TYPE: 'pulse' as const,
  SPEED: 1,
} as const;

// ============================================================================
// Color Defaults
// ============================================================================

export const COLOR_DEFAULTS = {
  SOLID: '#667eea',
  GLOW: '#667eea',
  STROKE: '#000000',
  BACKGROUND: '#1a1a1a',
  GRADIENT_START: '#667eea',
  GRADIENT_END: '#764ba2',
} as const;

// ============================================================================
// Gradient Defaults
// ============================================================================

export const GRADIENT_DEFAULTS = {
  TYPE: 'linear' as const,
  ANGLE: 135,
  POSITION_MIN: 0,
  POSITION_MAX: 100,
  STOPS: [
    { id: '1', color: '#667eea', position: 0 },
    { id: '2', color: '#764ba2', position: 100 },
  ] as const,
} as const;

// ============================================================================
// Effect Constraints
// ============================================================================

export const EFFECT_CONSTRAINTS = {
  BLUR: { MIN: 0, MAX: 100, DEFAULT: 0 },
  BACKDROP_BLUR: { MIN: 0, MAX: 100, DEFAULT: 0 },
  STROKE_WIDTH: { MIN: 0, MAX: 50, DEFAULT: 0 },
  OPACITY: { MIN: 0, MAX: 100, DEFAULT: 100 },
  GLOW_INTENSITY: { MIN: 0, MAX: 200, DEFAULT: 100 },
  NOISE_OPACITY: { MIN: 0, MAX: 100, DEFAULT: 0 },
} as const;

// ============================================================================
// Glow Layer Defaults
// ============================================================================

export const GLOW_LAYERS = [
  { id: '1', blur: 8, opacity: 80, enabled: true },
  { id: '2', blur: 24, opacity: 60, enabled: true },
  { id: '3', blur: 48, opacity: 40, enabled: true },
  { id: '4', blur: 96, opacity: 20, enabled: true },
] as const;

// ============================================================================
// History Management
// ============================================================================

export const HISTORY = {
  MAX_ENTRIES: 50,
} as const;

// ============================================================================
// File Import Constraints
// ============================================================================

export const FILE_CONSTRAINTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['application/json'],
  ALLOWED_EXTENSIONS: ['.json'],
} as const;

// ============================================================================
// Color Space Ranges
// ============================================================================

export const COLOR_SPACE = {
  HSL: {
    HUE: { MIN: 0, MAX: 360 },
    SATURATION: { MIN: 0, MAX: 100 },
    LIGHTNESS: { MIN: 0, MAX: 100 },
  },
  RGB: {
    MIN: 0,
    MAX: 255,
  },
} as const;

// ============================================================================
// Default Superellipse State
// ============================================================================

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
} as const;

// ============================================================================
// Math/Geometry Constants
// ============================================================================

export const GEOMETRY = {
  SUPERELLIPSE_SEGMENTS_PER_QUADRANT: 100,
  PATH_PRECISION: 2, // decimal places for SVG path coordinates
} as const;
