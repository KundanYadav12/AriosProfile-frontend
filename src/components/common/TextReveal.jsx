import React from 'react';
import { motion } from 'framer-motion';

export function TextReveal({ text, className = '', delay = 0, as: Component = 'h2' }) {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 18,
        stiffness: 120,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <Component className={`overflow-hidden flex flex-wrap ${className}`}>
      <motion.span
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="flex flex-wrap"
      >
        {words.map((word, index) => (
          <span key={index} className="inline-block whitespace-nowrap mr-[0.28em] overflow-hidden">
            <motion.span variants={child} className="inline-block">
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Component>
  );
}

export function FadeIn({ children, className = '', delay = 0, direction = 'up', distance = 25 }) {
  const directions = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  };

  const initial = { opacity: 0, ...directions[direction] };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
