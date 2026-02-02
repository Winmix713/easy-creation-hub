/**
 * Convert HEX to OKLCH
 * Note: This is a simplified conversion. For production, use a proper color library.
 */
export function hexToOKLCH(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Simplified OKLCH approximation
  // In production, use a proper color conversion library
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const c = Math.sqrt((r - l) ** 2 + (g - l) ** 2 + (b - l) ** 2);
  const h = Math.atan2(b - l, r - l) * (180 / Math.PI);
  
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(2)} ${h.toFixed(0)})`;
}

/**
 * Generate gradient CSS
 */
export function generateGradientCSS(
  type: 'linear' | 'radial' | 'conic',
  stops: { color: string; position: number }[],
  angle: number = 135
): string {
  const stopsString = stops
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(', ');

  switch (type) {
    case 'linear':
      return `linear-gradient(${angle}deg, ${stopsString})`;
    case 'radial':
      return `radial-gradient(circle, ${stopsString})`;
    case 'conic':
      return `conic-gradient(from ${angle}deg, ${stopsString})`;
  }
}

/**
 * Predefined color palettes
 */
export const COLOR_PALETTES = {
  sunset: ['#FF6B6B', '#FFA07A', '#FFD700'],
  ocean: ['#006994', '#0099CC', '#66CCCC'],
  forest: ['#2D5016', '#3D7317', '#6AA121'],
  purple: ['#667eea', '#764ba2', '#9D50BB'],
  neon: ['#00F5FF', '#FF10F0', '#FFE400'],
};

/**
 * Generate random color
 */
export function randomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}
