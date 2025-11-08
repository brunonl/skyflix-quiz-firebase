import Image from "next/image";
import React, { useRef, useState } from "react";

interface ImageSliderProps {
  images: string[];
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="w-full relative overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div 
        ref={sliderRef}
        className="slider-container w-full overflow-hidden cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
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
