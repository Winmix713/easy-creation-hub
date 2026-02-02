import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layer } from '@/types/layers';
import { getPerCornerSuperellipsePath, getSuperellipsePath } from '@/utils/math';

interface LayerRendererProps {
  layer: Layer;
  isSelected?: boolean;
  onTransformUpdate?: (layerId: string, transform: Partial<Layer['transform']>) => void;
}

export function LayerRenderer({ layer, isSelected = false, onTransformUpdate }: LayerRendererProps) {
  // Skip if layer is not visible
  if (!layer.visible || layer.type !== 'shape' || !layer.content?.superellipseState) {
    return null;
  }

  const state = layer.content.superellipseState;

  // Calculate superellipse path
  const pathData = useMemo(() => {
    if (state.useIndividualCorners) {
      return getPerCornerSuperellipsePath(state.width, state.height, {
        tl: state.cornerExponents.topLeft,
        tr: state.cornerExponents.topRight,
        br: state.cornerExponents.bottomRight,
        bl: state.cornerExponents.bottomLeft,
      });
    } else {
      return getSuperellipsePath(state.width, state.height, state.exponent);
    }
  }, [
    state.width,
    state.height,
    state.exponent,
    state.useIndividualCorners,
    state.cornerExponents,
  ]);

  // Generate fill style
  const fillStyle = useMemo(() => {
    if (state.fillType === 'solid') {
      return state.solidColor;
    } else if (state.fillType === 'linear') {
      const stops = state.gradientStops
        .map((stop) => `${stop.color} ${stop.position}%`)
        .join(', ');
      return `linear-gradient(${state.gradientAngle}deg, ${stops})`;
    } else if (state.fillType === 'radial') {
      const stops = state.gradientStops
        .map((stop) => `${stop.color} ${stop.position}%`)
        .join(', ');
      return `radial-gradient(circle, ${stops})`;
    } else if (state.fillType === 'conic') {
      const stops = state.gradientStops
        .map((stop) => `${stop.color} ${stop.position}%`)
        .join(', ');
      return `conic-gradient(from ${state.gradientAngle}deg, ${stops})`;
    }
    return state.solidColor;
  }, [state.fillType, state.solidColor, state.gradientStops, state.gradientAngle]);

  // Calculate transform
  const transform = useMemo(() => {
    const { x, y, rotation, scaleX, scaleY } = layer.transform;
    return `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scaleX / 100}, ${scaleY / 100})`;
  }, [layer.transform]);

  return (
    <motion.div
      className="absolute"
      style={{
        mixBlendMode: layer.blendMode,
        opacity: layer.opacity / 100,
        transform,
        zIndex: layer.zIndex,
        pointerEvents: layer.locked ? 'none' : 'auto',
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: layer.opacity / 100, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Glow layers */}
      {state.glowEnabled && state.glowLayers.map((glow, index) => (
        glow.enabled && (
          <svg
            key={glow.id}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: state.width + glow.blur * 2,
              height: state.height + glow.blur * 2,
              filter: `blur(${glow.blur}px)`,
              opacity: glow.opacity / 100,
              zIndex: -index - 1,
            }}
            viewBox={`0 0 ${state.width} ${state.height}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={pathData}
              fill={state.glowColor}
            />
          </svg>
        )
      ))}

      {/* Main shape */}
      <svg
        className="relative"
        style={{
          width: state.width,
          height: state.height,
          filter: state.blur > 0 ? `blur(${state.blur}px)` : undefined,
        }}
        viewBox={`0 0 ${state.width} ${state.height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {state.fillType !== 'solid' && (
            <>
              {state.fillType === 'linear' && (
                <linearGradient
                  id={`gradient-${layer.id}`}
                  gradientTransform={`rotate(${state.gradientAngle})`}
                >
                  {state.gradientStops.map((stop) => (
                    <stop
                      key={stop.id}
                      offset={`${stop.position}%`}
                      stopColor={stop.color}
                    />
                  ))}
                </linearGradient>
              )}
              {state.fillType === 'radial' && (
                <radialGradient id={`gradient-${layer.id}`}>
                  {state.gradientStops.map((stop) => (
                    <stop
                      key={stop.id}
                      offset={`${stop.position}%`}
                      stopColor={stop.color}
                    />
                  ))}
                </radialGradient>
              )}
            </>
          )}
        </defs>

        <path
          d={pathData}
          fill={state.fillType === 'solid' ? state.solidColor : `url(#gradient-${layer.id})`}
          stroke={state.strokeWidth > 0 ? state.strokeColor : 'none'}
          strokeWidth={state.strokeWidth}
        />
      </svg>

      {/* Selection indicator */}
      {isSelected && (
        <div
          className="absolute inset-0 border-2 border-blue-500 rounded pointer-events-none"
          style={{
            width: state.width,
            height: state.height,
          }}
        />
      )}

      {/* Noise overlay */}
      {state.noiseOpacity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            width: state.width,
            height: state.height,
            opacity: state.noiseOpacity / 100,
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' /></filter><rect width='100%' height='100%' filter='url(%23n)' /></svg>")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </motion.div>
  );
}