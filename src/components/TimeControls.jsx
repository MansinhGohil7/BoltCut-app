import React from 'react';
import { motion } from 'framer-motion';
import { Scissors } from 'lucide-react';

export const TimeControls = ({ startTime, setStartTime, endTime, setEndTime, onExtract, disabled }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 rounded-2xl w-full"
    >
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1 w-full space-y-2">
          <label className="text-sm font-medium text-zinc-400 block ml-1">Start Time (HH:MM:SS)</label>
          <input
            type="text"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            placeholder="00:00:00"
            className="w-full bg-zinc-900/80 border border-zinc-700/50 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all font-mono"
            disabled={disabled}
          />
        </div>
        
        <div className="flex-1 w-full space-y-2">
          <label className="text-sm font-medium text-zinc-400 block ml-1">End Time (HH:MM:SS)</label>
          <input
            type="text"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            placeholder="00:00:10"
            className="w-full bg-zinc-900/80 border border-zinc-700/50 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all font-mono"
            disabled={disabled}
          />
        </div>

        <div className="w-full md:w-auto pt-7">
          <button
            onClick={onExtract}
            disabled={disabled}
            className="w-full md:w-auto min-h-[56px] px-8 py-4 bg-accent hover:bg-pink-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            <Scissors className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span>Extract Clip</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
