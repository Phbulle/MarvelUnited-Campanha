import React, { useRef, useState, type MouseEvent as ReactMouseEvent, useEffect } from 'react';
import type { MapMarker, ToolType } from '../types';
import { Check, X } from 'lucide-react';

interface MapViewerProps {
  markers: MapMarker[];
  tool: ToolType;
  onAddMarker: (x: number, y: number) => void;
  onRemoveMarker: (id: string) => void;
}

export const MapViewer: React.FC<MapViewerProps> = ({ markers, tool, onAddMarker, onRemoveMarker }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5); // Initial zoom out to see more map
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSensitivity = 0.001;
      const delta = -e.deltaY * zoomSensitivity;
      let newScale = scale * Math.exp(delta);
      
      if (newScale < 0.05) newScale = 0.05;
      if (newScale > 5) newScale = 5;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const xs = (mouseX - position.x) / scale;
      const ys = (mouseY - position.y) / scale;

      setScale(newScale);
      setPosition({
        x: mouseX - xs * newScale,
        y: mouseY - ys * newScale,
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [scale, position]);

  const handleMouseDown = (e: ReactMouseEvent) => {
    if (tool === 'pan' || e.button === 1 || e.button === 2) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleClick = (e: ReactMouseEvent) => {
    // If we just finished dragging, don't place a marker
    if (tool === 'pan') return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Calculate map coordinates relative to image scale
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Convert to unscaled coordinates (percentage or absolute pixels of the image)
    // To make it resolution independent, we store the unscaled coordinates
    const unscaledX = (mouseX - position.x) / scale;
    const unscaledY = (mouseY - position.y) / scale;
    
    onAddMarker(unscaledX, unscaledY);
  };

  return (
    <div 
      className="map-container"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      onContextMenu={(e) => e.preventDefault()}
      style={{ cursor: tool === 'pan' ? (isDragging ? 'grabbing' : 'grab') : 'crosshair' }}
    >
      <div 
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          position: 'absolute',
        }}
      >
        <img 
          src="/map.png" 
          alt="Marvel United Campaign Map" 
          className="map-image"
          draggable="false"
        />
        
        {markers.map((marker) => (
          <div
            key={marker.id}
            className={`marker ${marker.type}`}
            style={{
              left: marker.x,
              top: marker.y,
              // scale down the marker inversely to zoom, so it stays a consistent size?
              // Actually keeping it fixed size in the scaled container means it grows/shrinks with zoom
              // which is usually desired for maps so they stick exactly to the region.
              // We'll divide size by scale if we wanted fixed screen size.
              transform: `translate(-50%, -50%) scale(${1 / scale})`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Deseja realmente remover este marcador?')) {
                onRemoveMarker(marker.id);
              }
            }}
          >
            {marker.type === 'unlocked' ? <Check size={24} /> : <X size={24} />}
          </div>
        ))}
      </div>
    </div>
  );
};
