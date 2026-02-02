import { useState } from 'react';

/**
 * Hook for managing scene settings
 */
export const useSceneSettings = () => {
  const [globalScale, setGlobalScale] = useState(1);
  const [gradientMaskIntensity, setGradientMaskIntensity] = useState(0.7);
  const [noiseOverlay, setNoiseOverlay] = useState(true);

  return {
    globalScale,
    gradientMaskIntensity,
    noiseOverlay,
    setGlobalScale,
    setGradientMaskIntensity,
    setNoiseOverlay,
  };
};
