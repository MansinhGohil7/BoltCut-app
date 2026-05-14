import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const ProcessingModal = ({ isProcessing, progress }) => {
  return (
    <AnimatePresence>
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-label="Video processing in progress"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-panel p-10 rounded-3xl flex flex-col items-center justify-center max-w-sm w-full relative overflow-hidden"
          >
            {/* Glowing background effect */}
            <div className="absolute inset-0 bg-accent/10 animate-pulse" />
            
            {/* Abstract data flows / progress circles */}
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
              <motion.svg className="w-full h-full absolute" viewBox="0 0 100 100" initial={{ rotate: -90 }}>
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-zinc-800"
                  strokeWidth="4"
                  fill="none"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="stroke-accent"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: 283, strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * progress) }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </motion.svg>
              
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border-t-2 border-r-2 border-purple-500/50"
              />
              
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-6 rounded-full border-b-2 border-l-2 border-blue-500/50"
              />
              
              <div className="absolute text-xl font-bold text-white">
                {Math.round(progress * 100)}%
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-2 relative z-10">
              Extracting Clip
            </h3>
            <p className="text-zinc-400 text-sm text-center relative z-10 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing entirely in browser...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
