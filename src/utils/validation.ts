/**
 * Validation Utilities
 * Input validation and sanitization functions
 */

import { SHAPE_BOUNDS, GRADIENT, EFFECTS, LAYER } from '@/constants';

/**
 * Clamp a number between min and max, handling NaN
 */
export function clampNumber(value: number, min: number, max: number): number {
  if (typeof value !== 'number' || isNaN(value)) {
    return min;
  }
  return Math.min(Math.max(value, min), max);
}

/**
 * Validate and clamp shape width
 */
export function validateWidth(value: number): number {
  return clampNumber(value, SHAPE_BOUNDS.WIDTH.MIN, SHAPE_BOUNDS.WIDTH.MAX);
}

/**
 * Validate and clamp shape height
 */
export function validateHeight(value: number): number {
  return clampNumber(value, SHAPE_BOUNDS.HEIGHT.MIN, SHAPE_BOUNDS.HEIGHT.MAX);
}

/**
 * Validate and clamp exponent
 */
export function validateExponent(value: number): number {
  return clampNumber(value, SHAPE_BOUNDS.EXPONENT.MIN, SHAPE_BOUNDS.EXPONENT.MAX);
}

/**
 * Validate and clamp gradient position (0-100)
 */
export function validateGradientPosition(value: number): number {
  return clampNumber(value, GRADIENT.POSITION.MIN, GRADIENT.POSITION.MAX);
}

/**
 * Validate and clamp gradient angle (0-360)
 */
export function validateGradientAngle(value: number): number {
  return clampNumber(value, GRADIENT.ANGLE.MIN, GRADIENT.ANGLE.MAX);
}

/**
 * Validate and clamp blur value
 */
export function validateBlur(value: number): number {
  return clampNumber(value, EFFECTS.BLUR.MIN, EFFECTS.BLUR.MAX);
}

/**
 * Validate and clamp opacity (0-100)
 */
export function validateOpacity(value: number): number {
  return clampNumber(value, LAYER.OPACITY.MIN, LAYER.OPACITY.MAX);
}

/**
 * Validate hex color format
 * Returns true if valid hex color, false otherwise
 */
export function isValidHexColor(color: string): boolean {
  if (typeof color !== 'string') return false;
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

/**
 * Validate and normalize hex color
 * Returns the color if valid, or a fallback color
 */
export function validateHexColor(color: string, fallback: string = '#000000'): string {
  if (isValidHexColor(color)) {
    // Normalize to 6 digits
    if (color.length === 4) {
      return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    return color.toLowerCase();
  }
  return fallback;
}

/**
 * Safe number parsing with fallback
 */
export function safeParseNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

/**
 * Validate array is not empty
 */
export function isNonEmptyArray<T>(arr: unknown): arr is T[] {
  return Array.isArray(arr) && arr.length > 0;
}

/**
 * Check if value is a valid object (not null, not array)
 */
export function isValidObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Validate file size and type for imports
 */
export function validateImportFile(file: File, maxSizeMB: number = 5): { valid: boolean; error?: string } {
  const maxBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxBytes) {
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
  }
  
  if (!file.name.endsWith('.json')) {
    return { valid: false, error: 'Only .json files are allowed' };
  }
  
  return { valid: true };
}
