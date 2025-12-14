'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Rally, ShotType } from '@/types';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface ShotTimelineProps {
  rallies: Rally[];
  currentTime: number;
  duration: number;
  onSeek?: (time: number) => void;
}

const shotTypeColors: Record<ShotType, string> = {
  smash: '#ef4444',
  clear: '#3b82f6',
  drop: '#10b981',
  drive: '#f59e0b',
  net: '#8b5cf6',
  lift: '#ec4899',
  serve: '#06b6d4',
  block: '#6366f1',
  push: '#84cc16',
};

export default function ShotTimeline({ rallies, currentTime, duration, onSeek }: ShotTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 300 }); // 5 minutes visible
  const [selectedRally, setSelectedRally] = useState<Rally | null>(null);
  
  // Calculate all shots from rallies
  const allShots = rallies.flatMap(rally => rally.shots);
  
  // Get shots in visible range
  const visibleShots = allShots.filter(
    shot => shot.timestamp >= visibleRange.start && shot.timestamp <= visibleRange.end
  );
  
  // Navigate timeline
  const scrollTimeline = (direction: 'left' | 'right') => {
    const shift = 120; // 2 minutes
    if (direction === 'left') {
      setVisibleRange(prev => ({
        start: Math.max(0, prev.start - shift),
        end: Math.max(shift, prev.end - shift),
      }));
    } else {
      setVisibleRange(prev => ({
        start: Math.min(duration - shift, prev.start + shift),
        end: Math.min(duration, prev.end + shift),
      }));
    }
  };
  
  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get position on timeline
  const getPosition = (timestamp: number) => {
    const range = visibleRange.end - visibleRange.start;
    return ((timestamp - visibleRange.start) / range) * 100;
  };
  
  // Current rally
  const currentRally = rallies.find(
    rally => currentTime >= rally.startTime && currentTime <= rally.endTime
  );

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="text-emerald-500" size={20} />
          Shot Timeline
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/50">
            {formatTime(visibleRange.start)} - {formatTime(visibleRange.end)}
          </span>
          <button
            onClick={() => scrollTimeline('left')}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            disabled={visibleRange.start === 0}
          >
            <ChevronLeft size={20} className={visibleRange.start === 0 ? 'text-white/20' : 'text-white/60'} />
          </button>
          <button
            onClick={() => scrollTimeline('right')}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            disabled={visibleRange.end >= duration}
          >
            <ChevronRight size={20} className={visibleRange.end >= duration ? 'text-white/20' : 'text-white/60'} />
          </button>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(shotTypeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-white/60 capitalize">{type}</span>
          </div>
        ))}
      </div>
      
      {/* Timeline */}
      <div
        ref={containerRef}
        className="relative h-32 bg-[#0a0a0a] rounded-lg overflow-hidden"
      >
        {/* Time markers */}
        <div className="absolute top-0 left-0 right-0 h-6 flex items-end border-b border-[#2a2a2a]">
          {Array.from({ length: 6 }).map((_, i) => {
            const time = visibleRange.start + (i * (visibleRange.end - visibleRange.start)) / 5;
            return (
              <div
                key={i}
                className="absolute text-xs text-white/40"
                style={{ left: `${i * 20}%` }}
              >
                {formatTime(time)}
              </div>
            );
          })}
        </div>
        
        {/* Rally zones */}
        {rallies
          .filter(rally => rally.endTime >= visibleRange.start && rally.startTime <= visibleRange.end)
          .map((rally) => {
            const startPos = Math.max(0, getPosition(rally.startTime));
            const endPos = Math.min(100, getPosition(rally.endTime));
            const width = endPos - startPos;
            
            return (
              <div
                key={rally.id}
                className={`absolute top-8 h-16 rounded cursor-pointer transition-colors ${
                  currentRally?.id === rally.id
                    ? 'bg-emerald-500/20 border border-emerald-500/50'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
                style={{
                  left: `${startPos}%`,
                  width: `${Math.max(1, width)}%`,
                }}
                onClick={() => {
                  setSelectedRally(rally);
                  onSeek?.(rally.startTime);
                }}
              >
                <div className="absolute top-0 left-1 text-xs text-white/40">
                  R{rally.number}
                </div>
              </div>
            );
          })}
        
        {/* Shot markers */}
        {visibleShots.map((shot, index) => {
          const pos = getPosition(shot.timestamp);
          const isPlayer1 = shot.player === 'Lin Dan';
          
          return (
            <motion.div
              key={`${shot.id}-${index}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute cursor-pointer"
              style={{
                left: `${pos}%`,
                top: isPlayer1 ? '40%' : '60%',
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => onSeek?.(shot.timestamp)}
              title={`${shot.player}: ${shot.type}`}
            >
              <div
                className="w-2 h-2 rounded-full transition-transform hover:scale-150"
                style={{ backgroundColor: shotTypeColors[shot.type] }}
              />
            </motion.div>
          );
        })}
        
        {/* Current time indicator */}
        {currentTime >= visibleRange.start && currentTime <= visibleRange.end && (
          <motion.div
            className="absolute top-6 bottom-0 w-0.5 bg-emerald-500"
            style={{ left: `${getPosition(currentTime)}%` }}
            animate={{ left: `${getPosition(currentTime)}%` }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-emerald-500" />
          </motion.div>
        )}
        
        {/* Player labels */}
        <div className="absolute left-2 top-10 text-xs text-red-400/60">Player 1</div>
        <div className="absolute left-2 bottom-4 text-xs text-blue-400/60">Player 2</div>
      </div>
      
      {/* Selected rally info */}
      {selectedRally && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-[#0a0a0a] rounded-lg border border-[#2a2a2a]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Rally #{selectedRally.number}</span>
            <span className="text-sm text-white/50">
              {selectedRally.shots.length} shots • {formatTime(selectedRally.endTime - selectedRally.startTime)}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className={selectedRally.winner === 'Lin Dan' ? 'text-red-400' : 'text-blue-400'}>
              Won by {selectedRally.winner}
            </span>
            <span className="text-white/30">|</span>
            <span className="text-white/50">
              Score: {selectedRally.points.player1} - {selectedRally.points.player2}
            </span>
          </div>
          
          {/* Shot sequence */}
          <div className="mt-3 flex flex-wrap gap-1">
            {selectedRally.shots.slice(0, 20).map((shot, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-sm flex items-center justify-center text-xs"
                style={{ backgroundColor: shotTypeColors[shot.type] + '40' }}
                title={`${shot.player}: ${shot.type}`}
              >
                {shot.type[0].toUpperCase()}
              </div>
            ))}
            {selectedRally.shots.length > 20 && (
              <span className="text-xs text-white/40 ml-1">
                +{selectedRally.shots.length - 20} more
              </span>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
