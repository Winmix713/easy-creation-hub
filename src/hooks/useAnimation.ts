import { useState } from 'react';
import { AnimationType } from '@/types';

/**
 * Hook for managing animation state
 */
export const useAnimation = () => {
  const [enabled, setEnabled] = useState(false);
  const [type, setType] = useState<AnimationType>('pulse');
  const [speed, setSpeed] = useState(1);

  return {
    enabled,
    type,
    speed,
    setEnabled,
    setType,
    setSpeed,
  };
};
