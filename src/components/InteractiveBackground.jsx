import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Interactive ambient mouse-following spotlight + lightweight floating constellation particles
 */
export default function InteractiveBackground() {
  const { isDarkMode: dark } = useTheme();
  const spotlightRef = useRef(null);
  const canvasRef = useRef(null);

  // Mouse spotlight follower
  useEffect(() => {
    const el = spotlightRef.current;
    if (!el) return;

    let rafId = null;
    const handleMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        el.style.background = dark
          ? `radial-gradient(650px circle at ${e.clientX}px ${e.clientY}px, rgba(139, 92, 246, 0.11), rgba(236, 72, 153, 0.04) 40%, transparent 80%)`
          : `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(139, 92, 246, 0.08), rgba(236, 72, 153, 0.03) 40%, transparent 80%)`;
      });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [dark]);

  // Subtle floating particles canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(Math.floor(window.innerWidth / 38), 36);
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dark
          ? `rgba(167, 139, 250, ${p.alpha})`
          : `rgba(139, 92, 246, ${p.alpha * 0.6})`;
        ctx.fill();

        // Connect nearby particles with subtle lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / 130) * (dark ? 0.08 : 0.05);
            ctx.strokeStyle = `rgba(139, 92, 246, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [dark]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{ opacity: 0.85 }}
      />
      <div
        ref={spotlightRef}
        className="fixed inset-0 pointer-events-none z-[2] transition-opacity duration-300"
      />
    </>
  );
}
