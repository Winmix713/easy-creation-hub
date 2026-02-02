/**
 * Color Conversion Utilities
 * HSL-based color conversions (more reliable than OKLCH approximations)
 */

import { isValidHexColor, safeParseNumber } from './validation';

/**
 * Convert HEX to HSL color space
 * @param hex - Hex color string (with or without #)
 * @returns HSL object with h (0-360), s (0-1), l (0-1)
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  // Validate and normalize hex
  let cleanHex = hex.replace('#', '');
  
  // Expand shorthand (e.g., "F00" -> "FF0000")
  if (cleanHex.length === 3) {
    cleanHex = cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2];
  }
  
  // Parse RGB values
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  
  // Handle NaN from invalid hex
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return { h: 0, s: 0, l: 0.5 };
  }
  
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
    s: Math.round(s * 100) / 100, 
    l: Math.round(l * 100) / 100 
  };
}

/**
 * Convert HSL to HEX color
 * @param h - Hue (0-360)
 * @param s - Saturation (0-1)
 * @param l - Lightness (0-1)
 * @returns Hex color string with #
 */
export function hslToHex(h: number, s: number, l: number): string {
  // Validate inputs
  h = safeParseNumber(h, 0) % 360;
  s = Math.max(0, Math.min(1, safeParseNumber(s, 0)));
  l = Math.max(0, Math.min(1, safeParseNumber(l, 0.5)));
  
  const hueToRgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  
  let r: number, g: number, b: number;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h / 360 + 1 / 3);
    g = hueToRgb(p, q, h / 360);
    b = hueToRgb(p, q, h / 360 - 1 / 3);
  }
  
  const toHex = (x: number): string => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

/**
 * Parse HSL string to components
 * @param color - HSL string like "hsl(180, 50%, 50%)" or hex color
 * @returns HSL object
 */
export function parseHSL(color: string): { h: number; s: number; l: number } | null {
  if (!color || typeof color !== 'string') return null;
  
  // Try HSL format
  const hslMatch = color.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/i);
  if (hslMatch) {
    return {
      h: safeParseNumber(hslMatch[1], 0),
      s: safeParseNumber(hslMatch[2], 50) / 100,
      l: safeParseNumber(hslMatch[3], 50) / 100,
    };
  }
  
  // Try hex format
  if (color.startsWith('#')) {
    return hexToHsl(color);
  }
  
  return null;
}

/**
 * Generate a random hex color
 * @returns Random hex color string with #
 */
export function randomHexColor(): string {
  const randomValue = Math.floor(Math.random() * 16777215);
  return '#' + randomValue.toString(16).padStart(6, '0');
}

/**
 * Lighten or darken a hex color
 * @param hex - Original hex color
 * @param amount - Amount to lighten (positive) or darken (negative), -1 to 1
 * @returns Adjusted hex color
 */
export function adjustBrightness(hex: string, amount: number): string {
  const hsl = hexToHsl(hex);
  const newL = Math.max(0, Math.min(1, hsl.l + amount));
  return hslToHex(hsl.h, hsl.s, newL);
}

/**
 * Get contrasting text color (black or white) for a background
 * @param backgroundColor - Hex color of background
 * @returns '#000000' or '#ffffff'
 */
export function getContrastColor(backgroundColor: string): string {
  const hsl = hexToHsl(backgroundColor);
  return hsl.l > 0.5 ? '#000000' : '#ffffff';
}

// ============ LEGACY OKLCH FUNCTIONS (Kept for backward compatibility) ============

/**
 * @deprecated Use hexToHsl instead for accurate color conversions
 * Convert HEX to OKLCH color space (simplified approximation)
 */
export function hexToOklch(hex: string): { l: number; c: number; h: number } {
  const hsl = hexToHsl(hex);
  // Map HSL to approximate OKLCH values
  return { 
    l: hsl.l, 
    c: hsl.s * 0.4, // Approximate chroma from saturation
    h: hsl.h 
  };
}

/**
 * @deprecated Use hslToHex instead for accurate color conversions
 * Convert OKLCH to HEX color (simplified)
 */
export function oklchToHex(l: number, c: number, h: number): string {
  // Map OKLCH back to HSL approximately
  const s = Math.min(1, c / 0.4);
  return hslToHex(h, s, l);
}

/**
 * @deprecated Use parseHSL instead
 * Parse OKLCH string to components
 */
export function parseOKLCH(color: string): { l: number; c: number; h: number } {
  const match = color.match(/oklch\((\d+\.?\d*)%?\s+([\d.]+)\s+([\d.]+)\)/);
  if (match) {
    const l = safeParseNumber(match[1], 70) / 100;
    const c = safeParseNumber(match[2], 0.15);
    const h = safeParseNumber(match[3], 0);
    return { l, c, h };
  }
  
  // Try hex
  if (color.startsWith('#')) {
    return hexToOklch(color);
  }
  
  return { l: 0.7, c: 0.15, h: 0 };
}
