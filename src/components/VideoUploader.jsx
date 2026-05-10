import React, { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

export const VideoUploader = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        onUpload(file);
      } else {
        alert('Please upload a valid video file.');
      }
      e.dataTransfer.clearData();
    }
  }, [onUpload]);

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        onUpload(file);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mt-6"
    >
      <div
        className={`glass-panel p-12 rounded-3xl text-center cursor-pointer transition-all duration-300 relative overflow-hidden group ${
          isDragging ? 'border-accent shadow-[0_0_30px_rgba(236,72,153,0.3)]' : 'border-zinc-800 hover:border-zinc-600'
        }`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <input
          type="file"
          accept="video/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        <motion.div
          animate={isDragging ? { scale: 1.1, y: -10 } : { scale: 1, y: 0 }}
          className="flex flex-col items-center justify-center space-y-6 pointer-events-none"
        >
          <div className="p-5 bg-zinc-900 rounded-full shadow-lg relative">
            <div className={`absolute inset-0 rounded-full transition-all duration-500 ${isDragging ? 'bg-accent/20 blur-xl' : 'bg-transparent'}`} />
            <UploadCloud className={`w-10 h-10 transition-colors duration-300 ${isDragging ? 'text-accent' : 'text-zinc-400 group-hover:text-zinc-200'}`} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">
              {isDragging ? 'Drop video here' : 'Upload your video'}
            </h3>
            <p className="text-sm text-zinc-400">
              Drag and drop, or click to browse
            </p>
          </div>
          
          <div className="px-4 py-2 bg-zinc-800/50 rounded-full border border-zinc-700/50">
            <span className="text-xs text-zinc-300 font-medium">MP4, MOV, WEBM</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
