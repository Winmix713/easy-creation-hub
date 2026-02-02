/**
 * Type Definitions for Superellipse Generator
 * Ensures type safety across the application
 */

// Re-export all types from layers.ts as the canonical source
export * from './layers';

// ============================================================================
// Animation Types
// ============================================================================

export type AnimationType = 'pulse' | 'rotate' | 'wave';

export interface AnimationConfig {
  enabled: boolean;
  type: AnimationType;
  speed: number;
  duration?: number;
  easing?: string;
}

// ============================================================================
// Canvas Types
// ============================================================================

export interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
  isPanning: boolean;
}

export interface ViewportBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ============================================================================
// Glow Effect Types
// ============================================================================

export interface GlowConfig {
  enabled: boolean;
  maskSize: number;
  scale: number;
  positionX: number;
  positionY: number;
  noiseEnabled: boolean;
  noiseIntensity: number;
}

// ============================================================================
// Scene Types
// ============================================================================

export interface SceneConfig {
  globalScale: number;
  gradientMaskIntensity: number;
  noiseOverlay: boolean;
  backgroundColor?: string;
}

// ============================================================================
// History Types
// ============================================================================

export interface HistoryState<T = any> {
  past: T[];
  present: T;
  future: T[];
}

// ============================================================================
// Export Types
// ============================================================================

export type ExportFormat = 'svg' | 'react' | 'html' | 'css' | 'json';

export interface ExportOptions {
  format: ExportFormat;
  includeGlow?: boolean;
  includeAnimation?: boolean;
  minify?: boolean;
}

// ============================================================================
// Utility Types
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// ============================================================================
// Error Types
// ============================================================================

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class LayerNotFoundError extends AppError {
  constructor(layerId: string) {
    super(`Layer with id "${layerId}" not found`, 'LAYER_NOT_FOUND', { layerId });
    this.name = 'LayerNotFoundError';
  }
}

export class InvalidStateError extends AppError {
  constructor(message: string, state?: any) {
    super(message, 'INVALID_STATE', { state });
    this.name = 'InvalidStateError';
  }
}
