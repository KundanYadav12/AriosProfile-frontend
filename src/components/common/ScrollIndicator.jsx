import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollIndicator({ target = '#about' }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    const el = document.querySelector(target);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2.5 cursor-pointer group select-none"
          onClick={handleClick}
        >
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 group-hover:text-ariso-600 transition-colors">
            SCROLL TO EXPLORE
          </span>
          <div className="w-[1.5px] h-9 bg-slate-200 overflow-hidden relative rounded-full">
            <motion.div
              animate={{ y: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-full h-1/2 bg-ariso-600"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
