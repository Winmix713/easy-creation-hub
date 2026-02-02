import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { Layer } from '@/types/layers';
import { getPerCornerSuperellipsePath, getSuperellipsePath } from '@/utils/math';

interface LayerRendererProps {
  layer: Layer;
  isSelected?: boolean;
  onTransformUpdate?: (layerId: string, transform: Partial<Layer['transform']>) => void;
}

/**
 * LayerRenderer Component
 * Renders a single layer with all its effects (glow, blur, noise)
 * Memoized for performance optimization
 */
export const LayerRenderer = memo(function LayerRenderer({ 
  layer, 
  isSelected = false, 
  onTransformUpdate 
}: LayerRendererProps) {
  const state = layer.content?.superellipseState;

  // All hooks must be called before any conditional returns
  const pathData = useMemo(() => {
    if (!state) return '';
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
  }, [state]);

  const transformStyle = useMemo(() => {
    const { x, y, rotation, scaleX, scaleY } = layer.transform;
    return `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scaleX / 100}, ${scaleY / 100})`;
  }, [layer.transform]);

  const noiseSvg = useMemo(() => 
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' /></filter><rect width='100%' height='100%' filter='url(%23n)' /></svg>",
    []
  );

  // Now we can have conditional returns after all hooks
  if (!layer.visible || layer.type !== 'shape' || !state) {
    return null;
  }

  return (
    <motion.div
      className="absolute"
      style={{
        mixBlendMode: layer.blendMode,
        opacity: layer.opacity / 100,
        transform: transformStyle,
        zIndex: layer.zIndex,
        pointerEvents: layer.locked ? 'none' : 'auto',
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: layer.opacity / 100, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
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
            backgroundImage: `url("${noiseSvg}")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better memoization
  return (
    prevProps.layer.id === nextProps.layer.id &&
    prevProps.layer.visible === nextProps.layer.visible &&
    prevProps.layer.opacity === nextProps.layer.opacity &&
    prevProps.layer.zIndex === nextProps.layer.zIndex &&
    prevProps.isSelected === nextProps.isSelected &&
    JSON.stringify(prevProps.layer.transform) === JSON.stringify(nextProps.layer.transform) &&
    JSON.stringify(prevProps.layer.content) === JSON.stringify(nextProps.layer.content)
  );
});
