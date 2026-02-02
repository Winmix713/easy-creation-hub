import { useState, useRef, useCallback, useEffect } from 'react';

export function useCanvasNavigation() {
  const [zoom, setZoom] = useState(100);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panStartRef = useRef({ x: 0, y: 0 });

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 25, 400));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 25, 25));
  }, []);

  const resetView = useCallback(() => {
    setZoom(100);
    setPanX(0);
    setPanY(0);
  }, []);

  const zoomTo100 = useCallback(() => {
    setZoom(100);
  }, []);

  // Handle mouse wheel zoom
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -25 : 25;
        setZoom((prev) => Math.max(25, Math.min(400, prev + delta)));
      }
    };

    const container = containerRef.current;
    if (!container) {
      return; // Early exit if container not found
    }

    // Use passive: false to allow preventDefault
    container.addEventListener('wheel', handleWheel, { passive: false });

    // Ensure cleanup always happens
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Handle space + drag for panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      panStartRef.current = { x: e.clientX - panX, y: e.clientY - panY };
    }
  }, [isPanning, panX, panY]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning && e.buttons === 1) {
      setPanX(e.clientX - panStartRef.current.x);
      setPanY(e.clientY - panStartRef.current.y);
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
