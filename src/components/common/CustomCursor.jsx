import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorState, setCursorState] = useState({
    isHovered: false,
    label: '',
    variant: 'default'
  });
  const [ripples, setRipples] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true);
      return;
    }

    const onMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target;
      const clickable = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor]');
      
      if (clickable) {
        const cursorAttr = clickable.getAttribute('data-cursor');
        setCursorState({
          isHovered: true,
          label: cursorAttr || '',
          variant: cursorAttr ? 'labeled' : 'pointer'
        });
      } else {
        setCursorState({
          isHovered: false,
          label: '',
          variant: 'default'
        });
      }
    };

    const onMouseDown = (e) => {
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples((prev) => [...prev.slice(-3), newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (isTouch || !isVisible) return null;

  return (
    <div className="custom-cursor-container fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Click Ripples */}
      {ripples.map((r) => (
        <motion.div
          key={r.id}
          initial={{ scale: 0.2, opacity: 0.8 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="fixed w-8 h-8 rounded-full border border-ariso-500 bg-ariso-400/10 pointer-events-none"
          style={{ left: r.x - 16, top: r.y - 16 }}
        />
      ))}

      {/* Central Precision Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-ariso-600 pointer-events-none"
        animate={{
          x: mousePosition.x - 5,
          y: mousePosition.y - 5,
          opacity: cursorState.isHovered ? 0 : 1,
          scale: cursorState.isHovered ? 0.4 : 1,
        }}
        transition={{ type: 'spring', damping: 35, stiffness: 600, mass: 0.08 }}
      />

      {/* Outer Follower Ring with Dynamic Inertia & Badge Morph */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none flex items-center justify-center font-bold tracking-wider text-white select-none"
        animate={{
          x: cursorState.variant === 'labeled' ? mousePosition.x - 38 : mousePosition.x - (cursorState.isHovered ? 26 : 18),
          y: cursorState.variant === 'labeled' ? mousePosition.y - 38 : mousePosition.y - (cursorState.isHovered ? 26 : 18),
          width: cursorState.variant === 'labeled' ? 76 : (cursorState.isHovered ? 52 : 36),
          height: cursorState.variant === 'labeled' ? 76 : (cursorState.isHovered ? 52 : 36),
          backgroundColor: cursorState.variant === 'labeled' 
            ? 'rgba(0, 110, 199, 0.95)' 
            : cursorState.isHovered 
            ? 'rgba(0, 110, 199, 0.14)' 
            : 'rgba(0, 110, 199, 0.03)',
          borderColor: cursorState.variant === 'labeled' 
            ? 'rgba(255, 255, 255, 0.9)' 
            : cursorState.isHovered 
            ? 'rgba(0, 110, 199, 0.7)' 
            : 'rgba(0, 110, 199, 0.35)',
          borderWidth: cursorState.variant === 'labeled' ? '1.5px' : '1.5px',
          boxShadow: cursorState.variant === 'labeled' ? '0 10px 25px -5px rgba(0, 110, 199, 0.4)' : 'none',
        }}
        transition={{ type: 'spring', damping: 26, stiffness: 350, mass: 0.18 }}
      >
        <AnimatePresence>
          {cursorState.label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="text-[10px] uppercase font-bold tracking-widest text-center px-1 leading-tight"
            >
              {cursorState.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
