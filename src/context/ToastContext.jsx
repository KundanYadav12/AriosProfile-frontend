import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    info: (msg, dur) => addToast(msg, 'info', dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-xl border backdrop-blur-md ${
                t.type === 'success'
                  ? 'bg-white/95 border-emerald-200 text-emerald-900'
                  : t.type === 'error'
                  ? 'bg-white/95 border-rose-200 text-rose-900'
                  : 'bg-white/95 border-ariso-200 text-ariso-950'
              }`}
            >
              <div className="flex items-center gap-3">
                {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
                {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
                {t.type === 'info' && <Info className="w-5 h-5 text-ariso-600 flex-shrink-0" />}
                <p className="text-sm font-medium leading-snug">{t.message}</p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="ml-3 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
