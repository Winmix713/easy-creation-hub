export type LayerType = 'shape' | 'image' | 'text' | 'group';

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity';

export type AnchorPoint =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface Transform {
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  anchor: AnchorPoint;
}

export interface LayerEffect {
  id: string;
  type: 'blur' | 'glow' | 'shadow' | 'stroke';
  enabled: boolean;
  params: Record<string, any>;
}

export interface LayerContent {
  superellipseState?: SuperellipseState;
  imageUrl?: string;
  text?: string;
}

export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
  solo: boolean;
  opacity: number;
  blendMode: BlendMode;
  transform: Transform;
  effects: LayerEffect[];
  parentId: string | null;
  zIndex: number;
  content?: LayerContent;
}

export interface GradientStop {
  id: string;
  color: string;
  position: number;
}

export interface GlowLayer {
  id: string;
  blur: number;
  opacity: number;
  enabled: boolean;
}

export interface SuperellipseState {
  // Shape
  width: number;
  height: number;
  exponent: number;
  cornerExponents: {
    topLeft: number;
    topRight: number;
    bottomRight: number;
    bottomLeft: number;
  };
  useIndividualCorners: boolean;
  lockAspectRatio: boolean;

  // Fill
  fillType: 'solid' | 'linear' | 'radial' | 'conic';
  solidColor: string;
  gradientStops: GradientStop[];
  gradientAngle: number;

  // Glow
  glowEnabled: boolean;
  glowIntensity: number;
  glowColor: string;
  glowLayers: GlowLayer[];

  // Effects
  blur: number;
  backdropBlur: number;
  strokeWidth: number;
  strokeColor: string;
  noiseOpacity: number;

  // Background
  backgroundColor: string;
}

export interface Preset {
  id: string;
  name: string;
  createdAt: string;
  state: SuperellipseState;
  thumbnail?: string;
}
