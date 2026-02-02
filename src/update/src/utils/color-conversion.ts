/**
 * Convert HEX to OKLCH color space
 */
export function hexToOklch(hex: string): { l: number; c: number; h: number } {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Simplified OKLCH approximation
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const c = Math.sqrt((r - l) ** 2 + (g - l) ** 2 + (b - l) ** 2);
  const h = Math.atan2(b - l, r - l) * (180 / Math.PI);
  
  return { l, c, h: h < 0 ? h + 360 : h };
}

/**
 * Convert OKLCH to HEX color
 */
export function oklchToHex(l: number, c: number, h: number): string {
  // Simplified conversion - for production use a proper color library
  const hRad = (h * Math.PI) / 180;
  
  const r = Math.max(0, Math.min(1, l + c * Math.cos(hRad)));
  const g = Math.max(0, Math.min(1, l));
  const b = Math.max(0, Math.min(1, l + c * Math.sin(hRad)));
  
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

/**
 * Parse OKLCH string to components
 */
export function parseOKLCH(color: string): { l: number; c: number; h: number } {
  const match = color.match(/oklch\((\d+\.?\d*)%?\s+([\d.]+)\s+([\d.]+)\)/);
  if (match) {
    return {
      l: parseFloat(match[1]) / 100,
      c: parseFloat(match[2]),
      h: parseFloat(match[3]),
    };
  }
  // Try hex
  if (color.startsWith('#')) {
    return hexToOklch(color);
  }
  return { l: 0.7, c: 0.15, h: 0 };
}
