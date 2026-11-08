import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export const FluidCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for fluid trailing effect
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on desktop devices with fine pointer (no touch screens)
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const moveHandler = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Detect if hovering over clickable element
      const target = e.target as HTMLElement;
      const isClickable = Boolean(
        target.closest('button, a, input, select, textarea, [role="button"]')
      );
      setIsPointer(isClickable);
    };

    const leaveHandler = () => setIsVisible(false);
    const enterHandler = () => setIsVisible(true);

    window.addEventListener('mousemove', moveHandler, { passive: true });
    document.addEventListener('mouseleave', leaveHandler);
    document.addEventListener('mouseenter', enterHandler);

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseleave', leaveHandler);
      document.removeEventListener('mouseenter', enterHandler);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Trailing fluid halo */}
      <motion.div
        className="fixed top-0 left-0 rounded-full bg-blue-500/15 dark:bg-blue-400/20 blur-[2px]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width: isPointer ? 44 : 28,
          height: isPointer ? 44 : 28,
          transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
      {/* Crisp central dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full bg-blue-600 dark:bg-blue-400"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          width: isPointer ? 8 : 5,
          height: isPointer ? 8 : 5,
          transition: 'width 0.15s ease, height 0.15s ease',
        }}
      />
    </div>
  );
};
