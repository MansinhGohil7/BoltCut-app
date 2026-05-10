import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw } from 'lucide-react';

export const ResultView = ({ resultUrl, onReset }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [resultUrl]);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `extracted_clip_${new Date().getTime()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-4xl mx-auto space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white tracking-tight">Clip Extracted Successfully!</h2>
        <p className="text-zinc-400">Your video maintains its original quality.</p>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden p-2">
        <video
          ref={videoRef}
          controls
          className="w-full h-auto max-h-[60vh] object-contain bg-black rounded-xl"
          src={resultUrl}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handleDownload}
          className="w-full sm:w-auto min-h-[56px] px-8 py-4 bg-accent hover:bg-pink-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] flex items-center justify-center gap-2 group"
        >
          <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          <span>Download Video</span>
        </button>

        <button
          onClick={onReset}
          className="w-full sm:w-auto min-h-[56px] px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl transition-all duration-300 border border-zinc-700 hover:border-zinc-500 flex items-center justify-center gap-2 group"
        >
          <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          <span>Extract Another</span>
        </button>
      </div>
    </motion.div>
  );
};
