import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  isValidHexColor,
  normalizeHexColor,
  validateNumber,
} from './validation';

/**
 * Convert HEX to HSL color space
 *
 * Uses the standard HSL color space instead of OKLCH for better compatibility
 * and more intuitive color manipulation.
 *
 * @param hex - Hex color string (e.g., '#667eea' or '667eea')
 * @returns Object with h (0-360), s (0-100), l (0-100)
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  if (!isValidHexColor(hex)) {
    return null;
  }

  const normalized = normalizeHexColor(hex);
  if (!normalized) return null;

  // Parse RGB values
  const r = parseInt(normalized.substring(1, 3), 16);
  const g = parseInt(normalized.substring(3, 5), 16);
  const b = parseInt(normalized.substring(5, 7), 16);

  return rgbToHsl(r, g, b);
}

/**
 * Convert HSL to HEX color
 *
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns Hex color string with proper validation
 */
export function hslToHex(h: number, s: number, l: number): string {
  // Validate inputs
  h = validateNumber(h, 0, 360);
  s = validateNumber(s, 0, 100);
  l = validateNumber(l, 0, 100);

  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

/**
 * Parse HSL color string to components
 *
 * Supports formats like:
 * - hsl(120, 100%, 50%)
 * - hsl(120 100% 50%)
 * - Hex colors (converts to HSL)
 *
 * @param color - Color string in HSL or hex format
 * @returns Object with h, s, l values or null if invalid
 */
export function parseHSL(color: string): { h: number; s: number; l: number } | null {
  // Try HSL function format
  const hslMatch = color.match(
    /hsl\(\s*(\d+\.?\d*)\s*[,\s]\s*(\d+\.?\d*)%?\s*[,\s]\s*(\d+\.?\d*)%?\s*\)/
  );
  if (hslMatch) {
    return {
      h: validateNumber(parseFloat(hslMatch[1]), 0, 360),
      s: validateNumber(parseFloat(hslMatch[2]), 0, 100),
      l: validateNumber(parseFloat(hslMatch[3]), 0, 100),
    };
  }

  // Try hex format
  if (color.startsWith('#') || /^[0-9a-f]{6}$/i.test(color)) {
    return hexToHsl(color);
  }

  return null;
}

/**
 * Generates HSL color string for CSS
 *
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns HSL CSS string like "hsl(120, 100%, 50%)"
 */
export function generateHslString(h: number, s: number, l: number): string {
  h = validateNumber(h, COLOR_SPACE.HSL.HUE.MIN, COLOR_SPACE.HSL.HUE.MAX);
  s = validateNumber(s, COLOR_SPACE.HSL.SATURATION.MIN, COLOR_SPACE.HSL.SATURATION.MAX);
  l = validateNumber(l, COLOR_SPACE.HSL.LIGHTNESS.MIN, COLOR_SPACE.HSL.LIGHTNESS.MAX);

  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

/**
 * Adjust the lightness of a hex color
 *
 * @param hex - Hex color string
 * @param lightnessAdjustment - Amount to adjust lightness (-100 to 100)
 * @returns Adjusted hex color or original if invalid
 *
 * @example
 * adjustLightness('#667eea', 20) // Returns lighter version
 * adjustLightness('#667eea', -20) // Returns darker version
 */
export function adjustLightness(hex: string, lightnessAdjustment: number): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;

  const newLightness = validateNumber(hsl.l + lightnessAdjustment, 0, 100);
  return hslToHex(hsl.h, hsl.s, newLightness);
}

/**
 * Adjust the saturation of a hex color
 *
 * @param hex - Hex color string
 * @param saturationAdjustment - Amount to adjust saturation (-100 to 100)
 * @returns Adjusted hex color or original if invalid
 */
export function adjustSaturation(hex: string, saturationAdjustment: number): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;

  const newSaturation = validateNumber(hsl.s + saturationAdjustment, 0, 100);
  return hslToHex(hsl.h, newSaturation, hsl.l);
}

/**
 * Adjust the hue of a hex color
 *
 * @param hex - Hex color string
 * @param hueAdjustment - Amount to adjust hue in degrees (-360 to 360)
 * @returns Adjusted hex color or original if invalid
 */
export function adjustHue(hex: string, hueAdjustment: number): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;

  const newHue = (hsl.h + hueAdjustment) % 360;
  return hslToHex(newHue < 0 ? newHue + 360 : newHue, hsl.s, hsl.l);
}

/**
 * Validate a color string and return normalized hex or null
 *
 * @param color - Color string in any format
 * @returns Normalized hex color or null if invalid
 */
export function validateColor(color: string): string | null {
  if (typeof color !== 'string') return null;

  // Try hex format
  if (isValidHexColor(color)) {
    return normalizeHexColor(color);
  }

  // Try HSL format - convert to hex
  const hsl = parseHSL(color);
  if (hsl) {
    return hslToHex(hsl.h, hsl.s, hsl.l);
  }

  return null;
}

/**
 * Get complementary color (180° rotation on color wheel)
 *
 * @param hex - Hex color string
 * @returns Complementary hex color or original if invalid
 */
export function getComplementaryColor(hex: string): string {
  return adjustHue(hex, 180);
}

/**
 * Get triadic colors (120° apart on color wheel)
 *
 * @param hex - Hex color string
 * @returns Array of three triadic colors or [hex] if invalid
 */
export function getTriadicColors(hex: string): string[] {
  return [hex, adjustHue(hex, 120), adjustHue(hex, 240)];
}

/**
 * Get analogous colors (30° apart on color wheel)
 *
 * @param hex - Hex color string
 * @returns Array of three analogous colors or [hex] if invalid
 */
export function getAnalogousColors(hex: string): string[] {
  return [adjustHue(hex, -30), hex, adjustHue(hex, 30)];
}
