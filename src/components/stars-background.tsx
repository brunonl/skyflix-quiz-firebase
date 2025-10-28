"use client";

import React, { useState, useEffect, useMemo } from 'react';

const StarsBackground = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 150 }).map(() => ({
      top: `${Math.random() * 100}vh`,
      left: `${Math.random() * 100}vw`,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 5 + 3,
    }));
  }, []);

  // Return null on the server to avoid hydration mismatch
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div className="relative w-full h-full">
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
            animationDuration: `${star.duration}s`,
            position: 'absolute', // Change from fixed to absolute
          }}
        />
      ))}
    </div>
  );
};

export default StarsBackground;
