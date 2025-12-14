'use client';

import { motion } from 'framer-motion';
import { PlayerStats, ShotType } from '@/types';
import { 
  Target, 
  Zap, 
  XCircle, 
  Activity,
  TrendingUp,
  Award
} from 'lucide-react';

interface StatsPanelProps {
  player1: PlayerStats;
  player2: PlayerStats;
  isLoading?: boolean;
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

const shotTypeLabels: Record<ShotType, string> = {
  smash: 'Smash',
  clear: 'Clear',
  drop: 'Drop',
  drive: 'Drive',
  net: 'Net',
  lift: 'Lift',
  serve: 'Serve',
  block: 'Block',
  push: 'Push',
};

export default function StatsPanel({ player1, player2, isLoading }: StatsPanelProps) {
  if (isLoading) {
    return (
      <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#2a2a2a] rounded w-48" />
          <div className="h-32 bg-[#2a2a2a] rounded" />
          <div className="h-32 bg-[#2a2a2a] rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Player Comparison Header */}
      <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="text-emerald-500" size={20} />
          Player Comparison
        </h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-left">
            <span className="text-red-400 font-semibold">{player1.name}</span>
          </div>
          <div className="text-center text-white/50 text-sm">VS</div>
          <div className="text-right">
            <span className="text-blue-400 font-semibold">{player2.name}</span>
          </div>
        </div>
        
        {/* Total Shots */}
        <StatComparison
          label="Total Shots"
          value1={player1.totalShots}
          value2={player2.totalShots}
          icon={<Target size={16} />}
        />
        
        {/* Winners */}
        <StatComparison
          label="Winners"
          value1={player1.winners}
          value2={player2.winners}
          icon={<Award size={16} />}
        />
        
        {/* Errors */}
        <StatComparison
          label="Unforced Errors"
          value1={player1.errors}
          value2={player2.errors}
          icon={<XCircle size={16} />}
          inverted
        />
        
        {/* Forced Errors */}
        <StatComparison
          label="Forced Errors"
          value1={player1.forcedErrors}
          value2={player2.forcedErrors}
          icon={<Zap size={16} />}
        />
      </div>
      
      {/* Shot Distribution */}
      <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="text-emerald-500" size={20} />
          Shot Distribution
        </h3>
        
        <div className="grid grid-cols-2 gap-8">
          {/* Player 1 Distribution */}
          <div>
            <h4 className="text-red-400 font-medium mb-3">{player1.name}</h4>
            <div className="space-y-2">
              {(Object.keys(player1.shotDistribution) as ShotType[])
                .filter(type => player1.shotDistribution[type] > 0)
                .sort((a, b) => player1.shotDistribution[b] - player1.shotDistribution[a])
                .map((type) => (
                  <ShotBar
                    key={type}
                    type={type}
                    count={player1.shotDistribution[type]}
                    total={player1.totalShots}
                  />
                ))}
            </div>
          </div>
          
          {/* Player 2 Distribution */}
          <div>
            <h4 className="text-blue-400 font-medium mb-3">{player2.name}</h4>
            <div className="space-y-2">
              {(Object.keys(player2.shotDistribution) as ShotType[])
                .filter(type => player2.shotDistribution[type] > 0)
                .sort((a, b) => player2.shotDistribution[b] - player2.shotDistribution[a])
                .map((type) => (
                  <ShotBar
                    key={type}
                    type={type}
                    count={player2.shotDistribution[type]}
                    total={player2.totalShots}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="stats-card bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]"
        >
          <div className="text-white/50 text-sm mb-1">Avg Shot Speed</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-red-400">{player1.avgShotSpeed || 285}</span>
            <span className="text-white/50 text-sm">km/h</span>
          </div>
          <div className="text-xs text-white/40 mt-1">{player1.name}</div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="stats-card bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]"
        >
          <div className="text-white/50 text-sm mb-1">Avg Shot Speed</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-400">{player2.avgShotSpeed || 298}</span>
            <span className="text-white/50 text-sm">km/h</span>
          </div>
          <div className="text-xs text-white/40 mt-1">{player2.name}</div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="stats-card bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]"
        >
          <div className="text-white/50 text-sm mb-1">Court Coverage</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-red-400">{player1.courtCoverage || 87}%</span>
          </div>
          <div className="text-xs text-white/40 mt-1">{player1.name}</div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="stats-card bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]"
        >
          <div className="text-white/50 text-sm mb-1">Court Coverage</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-400">{player2.courtCoverage || 89}%</span>
          </div>
          <div className="text-xs text-white/40 mt-1">{player2.name}</div>
        </motion.div>
      </div>
    </div>
  );
}

// Comparison bar component
function StatComparison({ 
  label, 
  value1, 
  value2, 
  icon,
  inverted = false 
}: { 
  label: string; 
  value1: number; 
  value2: number; 
  icon: React.ReactNode;
  inverted?: boolean;
}) {
  const total = value1 + value2;
  const p1 = total > 0 ? (value1 / total) * 100 : 50;
  const p2 = total > 0 ? (value2 / total) * 100 : 50;
  
  const winner1 = inverted ? value1 < value2 : value1 > value2;
  const winner2 = inverted ? value2 < value1 : value2 > value1;
  
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between text-sm mb-1">
        <span className={`font-medium ${winner1 ? 'text-red-400' : 'text-white/70'}`}>{value1}</span>
        <span className="flex items-center gap-1.5 text-white/50">
          {icon}
          {label}
        </span>
        <span className={`font-medium ${winner2 ? 'text-blue-400' : 'text-white/70'}`}>{value2}</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-[#2a2a2a]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${p1}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="bg-red-500/80"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${p2}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="bg-blue-500/80"
        />
      </div>
    </div>
  );
}

// Shot distribution bar component
function ShotBar({ type, count, total }: { type: ShotType; count: number; total: number }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white/60 w-12">{shotTypeLabels[type]}</span>
      <div className="flex-1 h-3 bg-[#2a2a2a] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: shotTypeColors[type] }}
        />
      </div>
      <span className="text-xs text-white/60 w-8">{count}</span>
    </div>
  );
}
