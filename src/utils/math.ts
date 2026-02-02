/**
 * Generates a superellipse path with per-corner exponents
 */
export function getPerCornerSuperellipsePath(
  width: number,
  height: number,
  corners: { tl: number; tr: number; br: number; bl: number }
): string {
  const w = width / 2;
  const h = height / 2;
  const segments = 100;

  // Generate path for each corner quadrant
  const generateQuadrant = (
    startAngle: number,
    endAngle: number,
    exponent: number,
    offsetX: number,
    offsetY: number
  ): string => {
    const points: string[] = [];
    const angleStep = (endAngle - startAngle) / segments;

    for (let i = 0; i <= segments; i++) {
      const angle = startAngle + i * angleStep;
      const cosT = Math.cos(angle);
      const sinT = Math.sin(angle);
      
      const x = Math.sign(cosT) * Math.pow(Math.abs(cosT), 2 / exponent) * w + offsetX;
      const y = Math.sign(sinT) * Math.pow(Math.abs(sinT), 2 / exponent) * h + offsetY;
      
      points.push(`${i === 0 ? 'L' : ''} ${x.toFixed(2)},${y.toFixed(2)}`);
    }
    
    return points.join(' ');
  };

  const centerX = width / 2;
  const centerY = height / 2;

  // Start from top-right, going clockwise
  let path = 'M ';
  
  // Top-right corner (0 to π/2)
  path += generateQuadrant(0, Math.PI / 2, corners.tr, centerX, centerY);
  
  // Top-left corner (π/2 to π)
  path += ' ' + generateQuadrant(Math.PI / 2, Math.PI, corners.tl, centerX, centerY);
  
  // Bottom-left corner (π to 3π/2)
  path += ' ' + generateQuadrant(Math.PI, (3 * Math.PI) / 2, corners.bl, centerX, centerY);
  
  // Bottom-right corner (3π/2 to 2π)
  path += ' ' + generateQuadrant((3 * Math.PI) / 2, 2 * Math.PI, corners.br, centerX, centerY);
  
  path += ' Z';

  return path;
}

/**
 * Simplified superellipse path with uniform exponent
 */
export function getSuperellipsePath(
  width: number,
  height: number,
  exponent: number
): string {
  return getPerCornerSuperellipsePath(width, height, {
    tl: exponent,
    tr: exponent,
    br: exponent,
    bl: exponent,
  });
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}
