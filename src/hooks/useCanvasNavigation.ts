import { useState, useRef, useCallback, useEffect } from 'react';
import { ZOOM, PAN } from '@/constants';

/**
 * Canvas Navigation Hook
 * Handles zoom, pan, and canvas interaction
 */
export function useCanvasNavigation() {
  const [zoom, setZoom] = useState<number>(ZOOM.DEFAULT);
  const [panX, setPanX] = useState<number>(PAN.DEFAULT_X);
  const [panY, setPanY] = useState<number>(PAN.DEFAULT_Y);
  const [isPanning, setIsPanning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  
  // Track if component is mounted for cleanup
  const isMountedRef = useRef(true);

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + ZOOM.STEP, ZOOM.MAX));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - ZOOM.STEP, ZOOM.MIN));
  }, []);

  const resetView = useCallback(() => {
    setZoom(ZOOM.DEFAULT);
    setPanX(PAN.DEFAULT_X);
    setPanY(PAN.DEFAULT_Y);
  }, []);

  const zoomTo100 = useCallback(() => {
    setZoom(ZOOM.DEFAULT);
  }, []);

  // Handle mouse wheel zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -ZOOM.STEP : ZOOM.STEP;
        setZoom((prev) => Math.max(ZOOM.MIN, Math.min(ZOOM.MAX, prev + delta)));
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []); // Empty deps - ref doesn't change

  // Handle space + drag for panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't activate pan if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.code === 'Space' && !isPanning) {
        e.preventDefault();
        setIsPanning(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPanning]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      // Store the initial mouse position AND the initial pan values
      panStartRef.current = { 
        x: e.clientX, 
        y: e.clientY,
        panX: panX,
        panY: panY
      };
    }
  }, [isPanning, panX, panY]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning && e.buttons === 1) {
      // Calculate delta from start position
      const deltaX = e.clientX - panStartRef.current.x;
      const deltaY = e.clientY - panStartRef.current.y;
      
      // Apply delta to initial pan values (fixes jerky panning)
      setPanX(panStartRef.current.panX + deltaX);
      setPanY(panStartRef.current.panY + deltaY);
    }
  }, [isPanning]);

  return {
    zoom,
    panX,
    panY,
    isPanning,
    containerRef,
    zoomIn,
    zoomOut,
    resetView,
    zoomTo100,
    handleMouseDown,
    handleMouseMove,
  };
}
