/**
 * Validation utilities for input sanitization and constraints
 * 
 * Provides functions to validate and constrain numeric inputs, color values,
 * and other data types to ensure application-wide data consistency.
 */

import {
  SHAPE_BOUNDS,
  EFFECT_CONSTRAINTS,
  GRADIENT_DEFAULTS,
  COLOR_SPACE,
} from '@/constants/index';

/**
 * Validates and clamps a number to a specified range
 * 
 * @param value - The number to validate
 * @param min - Minimum allowed value (inclusive)
 * @param max - Maximum allowed value (inclusive)
 * @returns The validated number, clamped to [min, max]
 * 
 * @example
 * validateNumber(150, 50, 800) // Returns 150
 * validateNumber(1000, 50, 800) // Returns 800 (clamped)
 * validateNumber(-10, 50, 800) // Returns 50 (clamped)
 */
export function validateNumber(value: number, min: number, max: number): number {
  if (isNaN(value)) {
    return min;
  }
  return Math.max(min, Math.min(max, value));
}

/**
 * Validates width input
 * 
 * @param value - Width value to validate
 * @returns Validated width within bounds
 */
export function validateWidth(value: number): number {
  return validateNumber(value, SHAPE_BOUNDS.WIDTH.MIN, SHAPE_BOUNDS.WIDTH.MAX);
}

/**
 * Validates height input
 * 
 * @param value - Height value to validate
 * @returns Validated height within bounds
 */
export function validateHeight(value: number): number {
  return validateNumber(value, SHAPE_BOUNDS.HEIGHT.MIN, SHAPE_BOUNDS.HEIGHT.MAX);
}

/**
 * Validates corner exponent (curvature) input
 * 
 * @param value - Exponent value to validate
 * @returns Validated exponent within bounds
 */
export function validateExponent(value: number): number {
  return validateNumber(value, SHAPE_BOUNDS.EXPONENT.MIN, SHAPE_BOUNDS.EXPONENT.MAX);
}

/**
 * Validates blur effect value
 * 
 * @param value - Blur value to validate
 * @returns Validated blur within bounds
 */
export function validateBlur(value: number): number {
  return validateNumber(value, EFFECT_CONSTRAINTS.BLUR.MIN, EFFECT_CONSTRAINTS.BLUR.MAX);
}

/**
 * Validates backdrop blur value
 * 
 * @param value - Backdrop blur value to validate
 * @returns Validated backdrop blur within bounds
 */
export function validateBackdropBlur(value: number): number {
  return validateNumber(
    value,
    EFFECT_CONSTRAINTS.BACKDROP_BLUR.MIN,
    EFFECT_CONSTRAINTS.BACKDROP_BLUR.MAX
  );
}

/**
 * Validates stroke width value
 * 
 * @param value - Stroke width value to validate
 * @returns Validated stroke width within bounds
 */
export function validateStrokeWidth(value: number): number {
  return validateNumber(
    value,
    EFFECT_CONSTRAINTS.STROKE_WIDTH.MIN,
    EFFECT_CONSTRAINTS.STROKE_WIDTH.MAX
  );
}

/**
 * Validates opacity value (0-100 range)
 * 
 * @param value - Opacity value to validate
 * @returns Validated opacity within bounds
 */
export function validateOpacity(value: number): number {
  return validateNumber(value, EFFECT_CONSTRAINTS.OPACITY.MIN, EFFECT_CONSTRAINTS.OPACITY.MAX);
}

/**
 * Validates glow intensity value
 * 
 * @param value - Glow intensity to validate
 * @returns Validated glow intensity within bounds
 */
export function validateGlowIntensity(value: number): number {
  return validateNumber(
    value,
    EFFECT_CONSTRAINTS.GLOW_INTENSITY.MIN,
    EFFECT_CONSTRAINTS.GLOW_INTENSITY.MAX
  );
}

/**
 * Validates gradient stop position (0-100 range)
 * 
 * @param value - Position value to validate
 * @returns Validated position within bounds
 */
export function validateGradientPosition(value: number): number {
  return validateNumber(
    value,
    GRADIENT_DEFAULTS.POSITION_MIN,
    GRADIENT_DEFAULTS.POSITION_MAX
  );
}

/**
 * Validates HSL hue component
 * 
 * @param value - Hue value to validate (0-360)
 * @returns Validated hue
 */
export function validateHue(value: number): number {
  return validateNumber(value, COLOR_SPACE.HSL.HUE.MIN, COLOR_SPACE.HSL.HUE.MAX);
}

/**
 * Validates HSL saturation component
 * 
 * @param value - Saturation value to validate (0-100)
 * @returns Validated saturation
 */
export function validateSaturation(value: number): number {
  return validateNumber(value, COLOR_SPACE.HSL.SATURATION.MIN, COLOR_SPACE.HSL.SATURATION.MAX);
}

/**
 * Validates HSL lightness component
 * 
 * @param value - Lightness value to validate (0-100)
 * @returns Validated lightness
 */
export function validateLightness(value: number): number {
  return validateNumber(value, COLOR_SPACE.HSL.LIGHTNESS.MIN, COLOR_SPACE.HSL.LIGHTNESS.MAX);
}

/**
 * Validates if a string is a valid hex color
 * 
 * @param hex - Hex color string to validate
 * @returns True if valid hex color, false otherwise
 * 
 * @example
 * isValidHexColor('#667eea') // Returns true
 * isValidHexColor('667eea') // Returns true
 * isValidHexColor('#gg7eea') // Returns false
 */
export function isValidHexColor(hex: string): boolean {
  const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(hex);
}

/**
 * Normalizes a hex color string to #RRGGBB format
 * 
 * @param hex - Hex color string
 * @returns Normalized hex string, or null if invalid
 * 
 * @example
 * normalizeHexColor('#667eea') // Returns '#667eea'
 * normalizeHexColor('667eea') // Returns '#667eea'
 * normalizeHexColor('#6e7') // Returns '#66ee77'
 */
export function normalizeHexColor(hex: string): string | null {
  if (!isValidHexColor(hex)) {
    return null;
  }

  hex = hex.replace('#', '');

  // Expand shorthand format (#abc -> #aabbcc)
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  return '#' + hex.toUpperCase();
}

/**
 * Validates a hex color and returns normalized form or default
 * 
 * @param hex - Hex color string to validate
 * @param fallback - Default color to return if validation fails
 * @returns Normalized hex color or fallback
 */
export function validateHexColor(hex: string, fallback: string = '#667eea'): string {
  const normalized = normalizeHexColor(hex);
  return normalized || fallback;
}

/**
 * Converts hex color to RGB object
 * 
 * @param hex - Hex color string
 * @returns Object with r, g, b properties (0-255) or null if invalid
 * 
 * @example
 * hexToRgb('#667eea') // Returns { r: 102, g: 126, b: 234 }
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = normalizeHexColor(hex);
  if (!normalized) return null;

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Converts RGB values to hex color
 * 
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns Hex color string
 * 
 * @example
 * rgbToHex(102, 126, 234) // Returns '#667eea'
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(validateNumber(n, 0, 255)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return '#' + toHex(r) + toHex(g) + toHex(b);
}

/**
 * Converts RGB to HSL color space
 * 
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns Object with h (0-360), s (0-100), l (0-100)
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  // Normalize to 0-1 range
  r = validateNumber(r, 0, 255) / 255;
  g = validateNumber(g, 0, 255) / 255;
  b = validateNumber(b, 0, 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Converts HSL to RGB color space
 * 
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns Object with r, g, b (0-255)
 */
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  // Validate and normalize inputs
  h = validateHue(h) / 360;
  s = validateSaturation(s) / 100;
  l = validateLightness(l) / 100;

  let r = 0;
  let g = 0;
  let b = 0;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * Converts hex color to HSL color space
 * 
 * @param hex - Hex color string
 * @returns Object with h (0-360), s (0-100), l (0-100), or null if invalid
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
}

/**
 * Converts HSL to hex color
 * 
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns Hex color string
 */
export function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

/**
 * Creates a safe validation wrapper for input handlers
 * 
 * Usage:
 * ```tsx
 * <input
 *   onChange={(e) => {
 *     const validated = createValidator(Number(e.target.value), 0, 100);
 *     setState(validated);
 *   }}
 * />
 * ```
 */
export function createValidator(value: any, validator: (v: number) => number): number {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 0 : validator(num);
}

/**
 * Safe JSON parse with fallback
 * 
 * @param json - JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed object or fallback value
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
