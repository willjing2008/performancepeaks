'use client';

import { motion } from 'framer-motion';
import { Trophy, Clock } from 'lucide-react';

interface ScoreBoardProps {
  player1Name: string;
  player2Name: string;
  score: {
    player1: number;
    player2: number;
    sets?: { player1: number; player2: number }[];
  };
  duration: number;
  isLive?: boolean;
}

export default function ScoreBoard({
  player1Name,
  player2Name,
  score,
  duration,
  isLive = false,
}: ScoreBoardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const winner = score.player1 > score.player2 ? 'player1' : score.player2 > score.player1 ? 'player2' : null;
  const setsWon = score.sets?.reduce(
    (acc, set) => ({
      player1: acc.player1 + (set.player1 > set.player2 ? 1 : 0),
      player2: acc.player2 + (set.player2 > set.player1 ? 1 : 0),
    }),
    { player1: 0, player2: 0 }
  );

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-xl border border-[#2a2a2a] overflow-hidden">
      {/* Header */}
      <div className="bg-[#0a0a0a] px-6 py-3 flex items-center justify-between border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-400" size={18} />
          <span className="text-sm font-medium text-white/80">Match Score</span>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/20 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-red-400 font-medium">LIVE</span>
            </span>
          )}
          <span className="flex items-center gap-1 text-white/50 text-sm">
            <Clock size={14} />
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* Score display */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Player 1 */}
          <div className={`text-center ${winner === 'player1' ? 'opacity-100' : winner ? 'opacity-60' : ''}`}>
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-2">
              <span className="text-red-400 font-bold text-lg">
                {player1Name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h4 className="font-semibold text-red-400 truncate">{player1Name}</h4>
            {winner === 'player1' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center gap-1 mt-1"
              >
                <Trophy size={12} className="text-yellow-400" />
                <span className="text-xs text-yellow-400">Winner</span>
              </motion.div>
            )}
          </div>

          {/* Score */}
          <div className="text-center">
            {score.sets && score.sets.length > 0 ? (
              <div className="space-y-2">
                {/* Sets score */}
                <div className="flex items-center justify-center gap-3">
                  <span className="text-4xl font-bold text-red-400">{setsWon?.player1 || 0}</span>
                  <span className="text-2xl text-white/30">-</span>
                  <span className="text-4xl font-bold text-blue-400">{setsWon?.player2 || 0}</span>
                </div>
                <span className="text-xs text-white/40">Sets</span>
                
                {/* Individual set scores */}
                <div className="flex justify-center gap-2 mt-3">
                  {score.sets.map((set, index) => (
                    <div
                      key={index}
                      className="px-2 py-1 bg-[#0a0a0a] rounded text-xs"
                    >
                      <span className={set.player1 > set.player2 ? 'text-red-400' : 'text-white/50'}>
                        {set.player1}
                      </span>
                      <span className="text-white/30 mx-1">-</span>
                      <span className={set.player2 > set.player1 ? 'text-blue-400' : 'text-white/50'}>
                        {set.player2}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl font-bold text-red-400">{score.player1}</span>
                <span className="text-2xl text-white/30">-</span>
                <span className="text-4xl font-bold text-blue-400">{score.player2}</span>
              </div>
            )}
          </div>

          {/* Player 2 */}
          <div className={`text-center ${winner === 'player2' ? 'opacity-100' : winner ? 'opacity-60' : ''}`}>
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-400 font-bold text-lg">
                {player2Name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h4 className="font-semibold text-blue-400 truncate">{player2Name}</h4>
            {winner === 'player2' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center gap-1 mt-1"
              >
                <Trophy size={12} className="text-yellow-400" />
                <span className="text-xs text-yellow-400">Winner</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
