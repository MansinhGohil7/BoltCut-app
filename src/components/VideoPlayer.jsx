import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export const VideoPlayer = ({ videoUrl }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoUrl]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full rounded-2xl overflow-hidden glass-panel"
    >
      <video
        ref={videoRef}
        controls
        aria-label="Source video preview for trimming"
        className="w-full h-auto max-h-[60vh] object-contain bg-black"
        src={videoUrl}
      >
        Your browser does not support the video tag.
      </video>
    </motion.div>
  );
};
