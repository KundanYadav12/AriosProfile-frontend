import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function VideoModal({ isOpen, onClose, videoUrl, title }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 z-10 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/90">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-ariso-500 animate-pulse" />
              <h3 className="font-semibold text-white text-base sm:text-lg tracking-tight">
                {title ? `${title} — Product Demo` : 'Product Demo'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Player Frame */}
          <div className="relative aspect-video bg-black flex items-center justify-center">
            {videoUrl ? (
              <video
                src={videoUrl.startsWith('http') || videoUrl.startsWith('/uploads') ? videoUrl : videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-ariso-900/50 border border-ariso-700/50 text-ariso-400 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-white mb-1">Demo Video Coming Soon</h4>
                <p className="text-slate-400 text-sm max-w-sm">
                  The interactive walkthrough video for this product will be available shortly or can be uploaded directly via Superadmin.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
