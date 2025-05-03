'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export default function ZoomableImage({ src, alt, width, height }: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0, showLens: false });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPosition({
      x: x - 80, // Half of lens width
      y: y - 80, // Half of lens height
      showLens: true
    });
  };

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setPosition(prev => ({ ...prev, showLens: true }))}
      onMouseLeave={() => setPosition(prev => ({ ...prev, showLens: false }))}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-contain max-h-[600px] transition-transform duration-300 group-hover:scale-150"
        style={{
          transformOrigin: position.showLens 
            ? `${((position.x + 80) / (containerRef.current?.offsetWidth || 1)) * 100}% ${((position.y + 80) / (containerRef.current?.offsetHeight || 1)) * 100}%`
            : 'center'
        }}
      />
      {position.showLens && (
        <div 
          className="absolute w-40 h-40 bg-white bg-opacity-30 border-2 border-white pointer-events-none rounded-lg z-10"
          style={{
            left: `${Math.max(0, Math.min(position.x, (containerRef.current?.offsetWidth || 0) - 160))}px`,
            top: `${Math.max(0, Math.min(position.y, (containerRef.current?.offsetHeight || 0) - 160))}px`
          }}
        />
      )}
    </div>
  );
}