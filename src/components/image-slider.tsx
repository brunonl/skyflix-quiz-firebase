import Image from "next/image";
import React, { useRef, useState, TouchEvent } from "react";

interface ImageSliderProps {
  images: string[];
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (position: number) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(position - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragMove = (position: number) => {
    if (!isDragging || !sliderRef.current) return;
    const x = position - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  // Mouse Events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.pageX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragMove(e.pageX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    handleDragEnd();
  };

  // Touch Events
  const handleTouchStart = (e: TouchEvent) => {
    handleDragStart(e.touches[0].pageX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    handleDragMove(e.touches[0].pageX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  return (
    <div className="w-full relative overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div 
        ref={sliderRef}
        className="w-full overflow-x-hidden cursor-grab touch-pan-x"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onTouchStart={(e) => handleTouchStart(e as unknown as TouchEvent)}
        onTouchMove={(e) => handleTouchMove(e as unknown as TouchEvent)}
        onTouchEnd={handleTouchEnd}
      >
        <div className="slider-track flex gap-4">
          {[...images, ...images, ...images].map((src, i) => (
            <div key={i} className="w-[180px] h-[300px] flex-shrink-0">
              <Image 
                src={src} 
                alt={`Capa de conteúdo ${i+1}`} 
                width={180} 
                height={300} 
                className="w-full h-full object-cover pointer-events-none rounded-none" 
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .slider-track {
          animation: slide 60s linear infinite;
        }
        
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${images.length * (180 + 16)}px);
          }
        }

        .slider-container .slider-track {
          animation-play-state: running !important;
        }
      `}</style>
    </div>
  );
};
