'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shot, ShotType } from '@/types';
import { generateFrameData } from '@/lib/mockData';

interface CourtVisualizationProps {
  currentTime: number;
  currentShot?: Shot;
  player1Name: string;
  player2Name: string;
  heatmapData?: { x: number; y: number; intensity: number }[];
  showHeatmap?: boolean;
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

export default function CourtVisualization({
  currentTime,
  currentShot,
  player1Name,
  player2Name,
  heatmapData = [],
  showHeatmap = false,
}: CourtVisualizationProps) {
  // Memoize frame data calculation
  const frameData = useMemo(() => generateFrameData(currentTime), [currentTime]);

  // Memoize shot trajectory calculation
  const shotTrail = useMemo(() => {
    if (currentShot?.position && currentShot?.targetPosition) {
      const trail: { x: number; y: number }[] = [];
      const steps = 10;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        trail.push({
          x: currentShot.position.x + (currentShot.targetPosition.x - currentShot.position.x) * t,
          y: currentShot.position.y + (currentShot.targetPosition.y - currentShot.position.y) * t,
        });
      }
      return trail;
    }
    return [];
  }, [currentShot]);

  if (!frameData) return null;

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Court View</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-white/60">{player1Name}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-white/60">{player2Name}</span>
          </div>
        </div>
      </div>

      {/* Court SVG */}
      <div className="relative aspect-[2/1] bg-[#0d4f1c] rounded-lg overflow-hidden">
        <svg
          viewBox="0 0 200 100"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Court background */}
          <rect x="0" y="0" width="200" height="100" fill="#0d4f1c" />
          
          {/* Court lines */}
          <g stroke="#fff" strokeWidth="0.5" fill="none">
            {/* Outer boundary */}
            <rect x="10" y="5" width="180" height="90" />
            
            {/* Doubles sidelines (inner) */}
            <line x1="20" y1="5" x2="20" y2="95" strokeDasharray="2,2" opacity="0.3" />
            <line x1="180" y1="5" x2="180" y2="95" strokeDasharray="2,2" opacity="0.3" />
            
            {/* Center line */}
            <line x1="100" y1="5" x2="100" y2="95" />
            
            {/* Service lines */}
            <line x1="10" y1="25" x2="100" y2="25" />
            <line x1="100" y1="25" x2="190" y2="25" />
            <line x1="10" y1="75" x2="100" y2="75" />
            <line x1="100" y1="75" x2="190" y2="75" />
            
            {/* Short service lines */}
            <line x1="10" y1="35" x2="190" y2="35" strokeDasharray="2,2" opacity="0.5" />
            <line x1="10" y1="65" x2="190" y2="65" strokeDasharray="2,2" opacity="0.5" />
            
            {/* Center service line */}
            <line x1="55" y1="25" x2="55" y2="75" />
            <line x1="145" y1="25" x2="145" y2="75" />
          </g>
          
          {/* Net */}
          <line
            x1="100"
            y1="5"
            x2="100"
            y2="95"
            stroke="#fff"
            strokeWidth="2"
            opacity="0.8"
          />
          <rect x="98" y="2" width="4" height="3" fill="#8B4513" />
          <rect x="98" y="95" width="4" height="3" fill="#8B4513" />
          
          {/* Heatmap overlay */}
          {showHeatmap && heatmapData.map((point, i) => (
            <circle
              key={i}
              cx={point.x * 2}
              cy={point.y}
              r={5}
              fill={`rgba(239, 68, 68, ${point.intensity * 0.5})`}
            />
          ))}
          
          {/* Shot trajectory */}
          {currentShot && shotTrail.length > 0 && (
            <g>
              <motion.path
                d={`M ${shotTrail.map((p) => `${p.x * 2} ${p.y}`).join(' L ')}`}
                stroke={shotTypeColors[currentShot.type]}
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
              {/* Shot target marker */}
              {currentShot.targetPosition && (
                <circle
                  cx={currentShot.targetPosition.x * 2}
                  cy={currentShot.targetPosition.y}
                  r="3"
                  fill={shotTypeColors[currentShot.type]}
                  opacity="0.8"
                />
              )}
            </g>
          )}
          
          {/* Player 1 */}
          <motion.g
            animate={{
              x: frameData.players.player1.x * 2 - 50,
              y: frameData.players.player1.y - 50,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <circle cx="50" cy="50" r="6" fill="#ef4444" stroke="#fff" strokeWidth="1.5" />
            <text
              x="50"
              y="53"
              textAnchor="middle"
              fontSize="6"
              fill="#fff"
              fontWeight="bold"
            >
              1
            </text>
          </motion.g>
          
          {/* Player 2 */}
          <motion.g
            animate={{
              x: frameData.players.player2.x * 2 - 150,
              y: frameData.players.player2.y - 50,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <circle cx="150" cy="50" r="6" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
            <text
              x="150"
              y="53"
              textAnchor="middle"
              fontSize="6"
              fill="#fff"
              fontWeight="bold"
            >
              2
            </text>
          </motion.g>
          
          {/* Shuttlecock */}
          {frameData.shuttlecock && (
            <motion.g
              animate={{
                x: frameData.shuttlecock.x * 2 - 100,
                y: frameData.shuttlecock.y - 50,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <circle cx="100" cy="50" r="2.5" fill="#facc15" />
              <circle
                cx="100"
                cy="50"
                r="4"
                fill="none"
                stroke="#facc15"
                strokeWidth="0.5"
                opacity="0.5"
              />
            </motion.g>
          )}
        </svg>
        
        {/* Current shot indicator */}
        {currentShot && (
          <div className="absolute bottom-2 left-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: shotTypeColors[currentShot.type] + '40', color: shotTypeColors[currentShot.type] }}
          >
            {currentShot.type.charAt(0).toUpperCase() + currentShot.type.slice(1)}
            {currentShot.speed && ` • ${currentShot.speed} km/h`}
          </div>
        )}
      </div>
      
      {/* Shot info */}
      {currentShot && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-[#0a0a0a] rounded-lg"
        >
          <div className="flex items-center justify-between text-sm">
            <span className={currentShot.player === player1Name ? 'text-red-400' : 'text-blue-400'}>
              {currentShot.player}
            </span>
            <span className="text-white/50">{currentShot.description || `${currentShot.type} shot`}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
