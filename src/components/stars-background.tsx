"use client";

import React, { useState, useEffect } from 'react';

const StarsBackground = () => {
  const [stars, setStars] = useState<{ top: string; left: string; size: number; delay: number; }[]>([]);

  useEffect(() => {
    // This check is to prevent window not defined error during server-side rendering
    if (typeof window !== 'undefined') {
      const generateStars = () => {
        const newStars = Array.from({ length: 100 }).map(() => ({
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          size: Math.random() * 2 + 1,
          delay: Math.random() * 5,
        }));
        setStars(newStars);
      };

      generateStars();
    }
  }, []);

  return (
    <>
      {stars.map((star, i) => (
        <div
          key={i}
          className="star"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.delay + 3}s`,
          }}
        />
      ))}
    </>
  );
};

export default StarsBackground;
