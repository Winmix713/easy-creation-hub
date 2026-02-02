import { useState, useCallback } from 'react';

/**
 * Hook for managing glow editor state
 */
export const useGlowEditor = (updateState: (updates: any) => void) => {
  const [enabled, setEnabled] = useState(true);
  const [maskSize, setMaskSize] = useState(0.3);
  const [scale, setScale] = useState(0.9);
  const [positionX, setPositionX] = useState(-590);
  const [positionY, setPositionY] = useState(-1070);
  const [noiseEnabled, setNoiseEnabled] = useState(true);
  const [noiseIntensity, setNoiseIntensity] = useState(0.35);

  const randomizeColor = useCallback(() => {
    setEnabled(false);
    setTimeout(() => {
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      updateState({ solidColor: randomColor });
      setTimeout(() => {
        setEnabled(true);
      }, 90);
    }, 950);
  }, [updateState]);

  return {
    enabled,
    maskSize,
    scale,
    positionX,
    positionY,
    noiseEnabled,
    noiseIntensity,
    setEnabled,
    setMaskSize,
    setScale,
    setPositionX,
    setPositionY,
    setNoiseEnabled,
    setNoiseIntensity,
    randomizeColor,
  };
};
