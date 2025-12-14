'use client';

import { motion } from 'framer-motion';
import { AnalysisState } from '@/types';
import { Loader2, CheckCircle2, XCircle, Upload, Brain, BarChart3 } from 'lucide-react';

interface AnalysisProgressProps {
  state: AnalysisState;
}

const steps = [
  { id: 'upload', label: 'Upload Video', icon: Upload },
  { id: 'analyze', label: 'AI Analysis', icon: Brain },
  { id: 'complete', label: 'Generate Report', icon: BarChart3 },
];

export default function AnalysisProgress({ state }: AnalysisProgressProps) {
  const getCurrentStepIndex = () => {
    switch (state.status) {
      case 'uploading':
        return 0;
      case 'analyzing':
        return 1;
      case 'complete':
        return 3;
      default:
        return -1;
    }
  };

  const currentIndex = getCurrentStepIndex();

  if (state.status === 'idle') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <div className="bg-[#1a1a1a] rounded-2xl p-8 max-w-md w-full mx-4 border border-[#2a2a2a]">
        {state.status === 'error' ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <XCircle className="text-red-500" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analysis Failed</h3>
            <p className="text-white/60 text-sm">{state.error || 'An error occurred during analysis'}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : state.status === 'complete' ? (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="text-emerald-500" size={32} />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">Analysis Complete!</h3>
            <p className="text-white/60 text-sm">Your match analysis is ready to view</p>
          </div>
        ) : (
          <>
            {/* Progress steps */}
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentIndex;
                const isComplete = index < currentIndex;

                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isComplete
                            ? 'bg-emerald-500'
                            : isActive
                            ? 'bg-emerald-500/20 border-2 border-emerald-500'
                            : 'bg-[#2a2a2a]'
                        }`}
                      >
                        {isComplete ? (
                          <CheckCircle2 size={20} className="text-white" />
                        ) : isActive ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <Loader2 size={20} className="text-emerald-500" />
                          </motion.div>
                        ) : (
                          <Icon size={20} className="text-white/40" />
                        )}
                      </div>
                      <span
                        className={`text-xs mt-2 ${
                          isActive ? 'text-emerald-400' : isComplete ? 'text-white/80' : 'text-white/40'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-16 h-0.5 mx-2 ${
                          isComplete ? 'bg-emerald-500' : 'bg-[#2a2a2a]'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Current step info */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">{state.currentStep}</h3>
              
              {/* Progress bar */}
              <div className="h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${state.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-white/40 text-sm mt-2">{state.progress}% complete</p>
            </div>

            {/* Animated dots */}
            <div className="flex justify-center gap-1 mt-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-emerald-500"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
