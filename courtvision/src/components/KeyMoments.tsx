'use client';

import { motion } from 'framer-motion';
import { KeyMoment } from '@/types';
import { 
  Star, 
  TrendingUp, 
  Award, 
  Target,
  Clock,
  ChevronRight
} from 'lucide-react';

interface KeyMomentsProps {
  moments: KeyMoment[];
  onMomentClick?: (timestamp: number) => void;
  currentTime?: number;
}

const momentIcons = {
  winner: Award,
  rally: TrendingUp,
  momentum_shift: Target,
  crucial_point: Star,
};

const momentColors = {
  winner: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  rally: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  momentum_shift: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  crucial_point: 'text-red-400 bg-red-400/10 border-red-400/30',
};

const momentLabels = {
  winner: 'Winner',
  rally: 'Epic Rally',
  momentum_shift: 'Momentum Shift',
  crucial_point: 'Crucial Point',
};

export default function KeyMoments({ moments, onMomentClick, currentTime = 0 }: KeyMomentsProps) {
  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sortedMoments = [...moments].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Star className="text-yellow-400" size={20} />
        Key Moments
        <span className="text-white/40 text-sm font-normal ml-auto">
          {moments.length} highlights
        </span>
      </h3>
      
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {sortedMoments.map((moment, index) => {
          const Icon = momentIcons[moment.type];
          const colorClass = momentColors[moment.type];
          const isActive = currentTime >= moment.timestamp && currentTime < moment.timestamp + 30;
          
          return (
            <motion.div
              key={moment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onMomentClick?.(moment.timestamp)}
              className={`
                group relative p-4 rounded-lg border cursor-pointer
                transition-all duration-300
                ${isActive 
                  ? 'bg-emerald-500/10 border-emerald-500/50' 
                  : 'bg-[#222] border-[#333] hover:border-[#444] hover:bg-[#252525]'
                }
              `}
            >
              {/* Importance indicator */}
              {moment.importance === 'high' && (
                <div className="absolute top-2 right-2">
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500" />
                  </span>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`p-2 rounded-lg border ${colorClass}`}>
                  <Icon size={18} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${colorClass}`}>
                      {momentLabels[moment.type]}
                    </span>
                    <span className="text-xs text-white/40 flex items-center gap-1">
                      <Clock size={12} />
                      {formatTimestamp(moment.timestamp)}
                    </span>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-white/80 leading-relaxed">
                    {moment.description}
                  </p>
                  
                  {/* Player */}
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-xs font-medium ${
                      moment.player === 'Lin Dan' ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {moment.player}
                    </span>
                    
                    <span className="text-xs text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Watch
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {moments.length === 0 && (
        <div className="text-center py-8 text-white/40">
          <Star className="mx-auto mb-2 opacity-50" size={32} />
          <p>No key moments detected yet</p>
          <p className="text-sm mt-1">Upload a video to analyze</p>
        </div>
      )}
    </div>
  );
}
