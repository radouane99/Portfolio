import React, { useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Interactive card with mouse-tracking radial spotlight glow + subtle 3D perspective tilt
 */
export default function SpotlightCard({
  children,
  className = '',
  tilt = true,
  maxTilt = 4,
  spotlightColorDark = 'rgba(139, 92, 246, 0.18)',
  spotlightColorLight = 'rgba(139, 92, 246, 0.10)',
  ...rest
}) {
  const { isDarkMode: dark } = useTheme();
  const cardRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPos({ x, y });

    if (tilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;
      setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`);
    }
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    if (tilt) {
      setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)');
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: opacity
          ? 'transform 0.12s ease-out, border-color 0.3s ease, box-shadow 0.3s ease'
          : 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.3s ease, box-shadow 0.3s ease',
        willChange: 'transform',
      }}
      className={`relative overflow-hidden ${className}`}
      {...rest}
    >
      {/* Dynamic Mouse Spotlight Overlay */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, ${
            dark ? spotlightColorDark : spotlightColorLight
          }, transparent 70%)`,
        }}
      />
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
}
