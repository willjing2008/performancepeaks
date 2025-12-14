'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipBack, 
  SkipForward,
  Upload,
  Video,
  Settings
} from 'lucide-react';
import { FrameAnalysis, KeyMoment } from '@/types';
import { generateFrameData } from '@/lib/mockData';

interface VideoPlayerProps {
  videoUrl?: string;
  onTimeUpdate?: (time: number) => void;
  onFrameCapture?: (frame: string) => void;
  keyMoments?: KeyMoment[];
  onVideoUpload?: (file: File) => void;
  showOverlay?: boolean;
}

export default function VideoPlayer({
  videoUrl,
  onTimeUpdate,
  onFrameCapture,
  keyMoments = [],
  onVideoUpload,
  showOverlay = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [frameData, setFrameData] = useState<FrameAnalysis | null>(null);

  // Handle time update
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
      
      // Generate frame data for overlay
      if (showOverlay) {
        setFrameData(generateFrameData(time));
      }
    }
  }, [onTimeUpdate, showOverlay]);

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * duration;
    }
  };

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        containerRef.current.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    }
  };

  // Handle video file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onVideoUpload?.(file);
    }
  };

  // Format time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Capture current frame
  const captureFrame = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onFrameCapture?.(dataUrl.split(',')[1]);
      }
    }
  }, [onFrameCapture]);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying && showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Calculate key moment positions on timeline
  const getKeyMomentPosition = (timestamp: number) => {
    if (duration === 0) return 0;
    return (timestamp / duration) * 100;
  };

  return (
    <div
      ref={containerRef}
      className="video-container relative w-full aspect-video bg-black rounded-xl overflow-hidden group"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {videoUrl ? (
        <>
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={togglePlay}
          />
          
          {/* Hidden canvas for frame capture */}
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Court overlay with player positions */}
          {showOverlay && frameData && (
            <div className="court-overlay">
              {/* Court lines */}
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Court boundaries */}
                <rect x="10" y="5" width="80" height="90" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                {/* Center line */}
                <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
                {/* Service lines */}
                <line x1="10" y1="25" x2="90" y2="25" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />
                <line x1="10" y1="75" x2="90" y2="75" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />
                {/* Net */}
                <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
              </svg>
              
              {/* Player 1 marker */}
              <motion.div
                className="absolute w-6 h-6 rounded-full bg-red-500/80 border-2 border-white flex items-center justify-center text-xs font-bold"
                style={{
                  left: `${frameData.players.player1.x}%`,
                  top: `${frameData.players.player1.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  left: `${frameData.players.player1.x}%`,
                  top: `${frameData.players.player1.y}%`,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                1
              </motion.div>
              
              {/* Player 2 marker */}
              <motion.div
                className="absolute w-6 h-6 rounded-full bg-blue-500/80 border-2 border-white flex items-center justify-center text-xs font-bold"
                style={{
                  left: `${frameData.players.player2.x}%`,
                  top: `${frameData.players.player2.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  left: `${frameData.players.player2.x}%`,
                  top: `${frameData.players.player2.y}%`,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                2
              </motion.div>
              
              {/* Shuttlecock */}
              {frameData.shuttlecock && (
                <motion.div
                  className="absolute w-3 h-3 rounded-full bg-yellow-400"
                  style={{
                    left: `${frameData.shuttlecock.x}%`,
                    top: `${frameData.shuttlecock.y}%`,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 10px rgba(250, 204, 21, 0.6)',
                  }}
                  animate={{
                    left: `${frameData.shuttlecock.x}%`,
                    top: `${frameData.shuttlecock.y}%`,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              )}
            </div>
          )}
          
          {/* Video controls */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4"
              >
                {/* Progress bar */}
                <div
                  className="relative h-1 bg-white/20 rounded-full mb-4 cursor-pointer group/progress"
                  onClick={handleSeek}
                >
                  {/* Key moments markers */}
                  {keyMoments.map((moment) => (
                    <div
                      key={moment.id}
                      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400 timeline-marker z-10"
                      style={{ left: `${getKeyMomentPosition(moment.timestamp)}%` }}
                      title={moment.description}
                    />
                  ))}
                  
                  {/* Progress fill */}
                  <div
                    className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                  
                  {/* Hover preview */}
                  <div
                    className="absolute top-0 left-0 h-full bg-white/30 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                
                {/* Control buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => skip(-10)}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <SkipBack size={20} />
                    </button>
                    
                    <button
                      onClick={togglePlay}
                      className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center transition-colors"
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                    </button>
                    
                    <button
                      onClick={() => skip(10)}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <SkipForward size={20} />
                    </button>
                    
                    <span className="text-sm text-white/80">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={captureFrame}
                      className="text-white/80 hover:text-white transition-colors"
                      title="Capture frame for analysis"
                    >
                      <Settings size={20} />
                    </button>
                    
                    <button
                      onClick={toggleMute}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    
                    <button
                      onClick={toggleFullscreen}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <Maximize size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Play button overlay when paused */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlay}
                className="w-20 h-20 rounded-full bg-emerald-500/90 hover:bg-emerald-400 flex items-center justify-center"
              >
                <Play size={40} className="ml-1" />
              </motion.button>
            </div>
          )}
        </>
      ) : (
        /* Upload area when no video */
        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="w-20 h-20 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-4">
            <Upload size={32} className="text-emerald-500" />
          </div>
          <p className="text-lg font-medium text-white/90">Upload a badminton match video</p>
          <p className="text-sm text-white/50 mt-2">or drop a file here</p>
          <div className="flex items-center gap-2 mt-4 text-emerald-500">
            <Video size={16} />
            <span className="text-sm">Supports MP4, WebM, MOV</span>
          </div>
        </label>
      )}
    </div>
  );
}
