import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoUploader } from './components/VideoUploader';
import { VideoPlayer } from './components/VideoPlayer';
import { TimeControls } from './components/TimeControls';
import { ProcessingModal } from './components/ProcessingModal';
import { ResultView } from './components/ResultView';
import { loadFFmpeg, trimVideo } from './utils/ffmpeg';
import { Scissors, Download } from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState('');
  const [ffmpegInstance, setFfmpegInstance] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIosPrompt, setIsIosPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detect iOS and standalone
    const isIos = /ipad|iphone|ipod/.test(window.navigator.userAgent.toLowerCase());
    const isInStandaloneMode = ('standalone' in window.navigator) && window.navigator.standalone;

    if (isIos && !isInStandaloneMode) {
      setIsIosPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  useEffect(() => {
    // Preload ffmpeg on mount
    loadFFmpeg().then(ffmpeg => {
      setFfmpegInstance(ffmpeg);
    }).catch(err => {
      console.error("Failed to load FFmpeg:", err);
      setError("Failed to load video processing engine. Please try refreshing.");
    });
  }, []);

  const handleUpload = (uploadedFile) => {
    setFile(uploadedFile);
    setVideoUrl(URL.createObjectURL(uploadedFile));
    setResultUrl(null);
    setError('');
    // Default values
    setStartTime('00:00:00');
    setEndTime('00:00:10');
  };

  const handleReset = () => {
    setFile(null);
    setVideoUrl(null);
    setResultUrl(null);
    setStartTime('');
    setEndTime('');
    setProgress(0);
    setError('');
  };

  const parseTime = (timeStr) => {
    // Parses HH:MM:SS or MM:SS into seconds
    const parts = timeStr.split(':').map(Number);
    if (parts.some(isNaN)) return null;

    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return parts[0] || null;
  };

  const handleExtract = async () => {
    if (!ffmpegInstance) {
      setError("Processing engine not ready yet.");
      return;
    }

    const startSeconds = parseTime(startTime);
    const endSeconds = parseTime(endTime);

    if (startSeconds === null || endSeconds === null || startSeconds >= endSeconds) {
      setError("Invalid timestamps. Ensure start time is before end time and format is valid (e.g., 00:01:30).");
      // Clear error after 5s
      setTimeout(() => setError(''), 5000);
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError('');

    try {
      const url = await trimVideo(ffmpegInstance, file, startTime, endTime, (p) => {
        setProgress(p);
      });
      setResultUrl(url);
    } catch (err) {
      console.error(err);
      setError("An error occurred while processing the video.");
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white relative overflow-x-hidden">
      {/* Background ambient light */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-600/10 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10 max-w-5xl">
        <header className="mb-12 text-center flex flex-col items-center relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-2">VIDEO UTILITY</div>
            <h1 className="text-6xl font-extrabold text-white tracking-tighter mb-4">
              BOLT CUT
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-medium text-zinc-400 max-w-sm mx-auto mb-10 uppercase tracking-wide"
          >
            BROWSER-BASED CLIPPING. ORIGINAL QUALITY. NO SERVERS.
          </motion.p>

          <AnimatePresence>
            {(deferredPrompt || isIosPrompt) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={deferredPrompt ? handleInstallClick : () => alert('To install, tap the Share icon at the bottom of Safari and select "Add to Home Screen".')}
                className="absolute top-0 right-0 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-bold uppercase tracking-wider text-white rounded-full transition-colors flex items-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4 text-accent" />
                {deferredPrompt ? 'Download App' : 'Add to Home Screen'}
              </motion.button>
            )}
          </AnimatePresence>
        </header>

        {/* Error Toast */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="fixed top-6 left-1/2 z-50 px-6 py-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-full shadow-lg backdrop-blur-md"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <main className="space-y-8">
          {!videoUrl && !resultUrl && (
            <VideoUploader onUpload={handleUpload} />
          )}

          {videoUrl && !resultUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center px-2">
                <h2 className="text-xl font-semibold">Preview & Trim</h2>
                <button
                  onClick={handleReset}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Change Video
                </button>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <VideoPlayer videoUrl={videoUrl} />
                <TimeControls
                  startTime={startTime}
                  setStartTime={setStartTime}
                  endTime={endTime}
                  setEndTime={setEndTime}
                  onExtract={handleExtract}
                  disabled={isProcessing}
                />
              </div>
            </motion.div>
          )}

          {resultUrl && (
            <ResultView resultUrl={resultUrl} onReset={handleReset} />
          )}
        </main>
      </div>

      <ProcessingModal isProcessing={isProcessing} progress={progress} />
    </div>
  );
}

export default App;
