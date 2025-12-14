'use client';

import { motion } from 'framer-motion';
import { Lightbulb, ChevronRight, Brain } from 'lucide-react';

interface TacticalInsightsProps {
  insights: string[];
  summary: string;
  isLoading?: boolean;
}

export default function TacticalInsights({ insights, summary, isLoading }: TacticalInsightsProps) {
  if (isLoading) {
    return (
      <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-[#2a2a2a] rounded w-48" />
          <div className="h-24 bg-[#2a2a2a] rounded" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 bg-[#2a2a2a] rounded w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Match Summary */}
      <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Brain className="text-purple-400" size={20} />
          AI Match Summary
        </h3>
        
        <p className="text-white/80 leading-relaxed text-sm">
          {summary}
        </p>
      </div>
      
      {/* Tactical Insights */}
      <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="text-yellow-400" size={20} />
          Tactical Insights
          <span className="text-white/40 text-sm font-normal ml-auto">
            {insights.length} insights
          </span>
        </h3>
        
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-[#0a0a0a] hover:bg-[#111] transition-colors group"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400/10 flex items-center justify-center text-yellow-400 text-xs font-medium">
                {index + 1}
              </div>
              <p className="text-sm text-white/80 leading-relaxed flex-1">
                {insight}
              </p>
              <ChevronRight
                size={16}
                className="text-white/20 group-hover:text-yellow-400 transition-colors flex-shrink-0 mt-0.5"
              />
            </motion.div>
          ))}
        </div>
        
        {insights.length === 0 && (
          <div className="text-center py-8 text-white/40">
            <Lightbulb className="mx-auto mb-2 opacity-50" size={32} />
            <p>No tactical insights available yet</p>
            <p className="text-sm mt-1">Upload a video to generate analysis</p>
          </div>
        )}
      </div>
    </div>
  );
}
