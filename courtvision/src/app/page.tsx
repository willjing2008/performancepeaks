'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Play, 
  BarChart3, 
  Zap,
  RefreshCw,
  Github,
  ExternalLink
} from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';
import StatsPanel from '@/components/StatsPanel';
import KeyMoments from '@/components/KeyMoments';
import ShotTimeline from '@/components/ShotTimeline';
import CourtVisualization from '@/components/CourtVisualization';
import TacticalInsights from '@/components/TacticalInsights';
import AnalysisProgress from '@/components/AnalysisProgress';
import ScoreBoard from '@/components/ScoreBoard';
import { mockMatchAnalysis, sampleVideoUrl } from '@/lib/mockData';
import { MatchAnalysis, AnalysisState, Shot } from '@/types';

export default function Home() {
  const [analysis, setAnalysis] = useState<MatchAnalysis | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'timeline' | 'insights'>('overview');
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    status: 'idle',
    progress: 0,
    currentStep: '',
  });
  const [currentShot, setCurrentShot] = useState<Shot | undefined>();

  // Handle video upload
  const handleVideoUpload = useCallback(async (file: File) => {
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    
    // Start mock analysis
    setAnalysisState({
      status: 'uploading',
      progress: 0,
      currentStep: 'Uploading video...',
    });

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 100));
      setAnalysisState((prev) => ({ ...prev, progress: i }));
    }

    // Start analysis
    setAnalysisState({
      status: 'analyzing',
      progress: 0,
      currentStep: 'Analyzing video with AI...',
    });

    // Simulate analysis progress
    const analysisSteps = [
      'Detecting court boundaries...',
      'Tracking player movements...',
      'Identifying shot types...',
      'Analyzing rally patterns...',
      'Calculating statistics...',
      'Generating insights...',
    ];

    for (let i = 0; i < analysisSteps.length; i++) {
      await new Promise((r) => setTimeout(r, 800));
      setAnalysisState({
        status: 'analyzing',
        progress: Math.round(((i + 1) / analysisSteps.length) * 100),
        currentStep: analysisSteps[i],
      });
    }

    // Complete analysis
    setAnalysisState({
      status: 'complete',
      progress: 100,
      currentStep: 'Analysis complete!',
    });

    // Set mock analysis data
    setTimeout(() => {
      setAnalysis(mockMatchAnalysis);
      setAnalysisState({ status: 'idle', progress: 0, currentStep: '' });
    }, 1500);
  }, []);

  // Load demo data
  const loadDemo = useCallback(() => {
    setVideoUrl(sampleVideoUrl);
    setAnalysis(mockMatchAnalysis);
  }, []);

  // Handle time update from video player
  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
    
    // Find current shot based on time
    if (analysis) {
      const allShots = analysis.rallies.flatMap((r) => r.shots);
      const shot = allShots.find(
        (s) => time >= s.timestamp && time < s.timestamp + 2
      );
      setCurrentShot(shot);
    }
  }, [analysis]);

  // Seek video to specific moment
  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time);
    // The video player would handle the actual seeking
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Analysis progress overlay */}
      <AnimatePresence>
        {analysisState.status !== 'idle' && (
          <AnalysisProgress state={analysisState} />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Court Vision Lab</h1>
              <p className="text-xs text-white/40">Zero-Shot AI Badminton Analysis</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {!analysis && (
              <button
                onClick={loadDemo}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Play size={16} />
                Load Demo
              </button>
            )}
            {analysis && (
              <button
                onClick={() => {
                  setAnalysis(null);
                  setVideoUrl(null);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <RefreshCw size={16} />
                New Analysis
              </button>
            )}
            <a
              href="https://github.com/courtvisionlab"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Github size={20} className="text-white/60" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {!analysis ? (
          /* Landing / Upload State */
          <div className="min-h-[80vh] flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl"
            >
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center mx-auto mb-8 pulse-animation">
                <Activity className="text-emerald-500" size={48} />
              </div>
              
              <h2 className="text-4xl font-bold mb-4">
                <span className="gradient-text">AI-Powered</span> Badminton Analysis
              </h2>
              
              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                Upload any badminton match video and get instant AI analysis including
                player tracking, shot detection, tactical insights, and comprehensive statistics.
              </p>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                {[
                  { icon: Activity, label: 'Player Tracking', desc: 'Real-time position analysis' },
                  { icon: Zap, label: 'Shot Detection', desc: 'Identify every shot type' },
                  { icon: BarChart3, label: 'Deep Statistics', desc: 'Comprehensive match data' },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="p-4 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]"
                  >
                    <feature.icon className="text-emerald-500 mx-auto mb-2" size={24} />
                    <h3 className="font-medium text-sm">{feature.label}</h3>
                    <p className="text-xs text-white/40 mt-1">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Upload Area */}
              <div className="w-full max-w-xl mx-auto">
                <VideoPlayer onVideoUpload={handleVideoUpload} />
              </div>

              <div className="flex items-center justify-center gap-4 mt-6">
                <span className="text-white/30 text-sm">or</span>
                <button
                  onClick={loadDemo}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-lg font-medium transition-colors"
                >
                  <Play size={18} />
                  Try Demo: Lin Dan vs Lee Chong Wei
                  <ExternalLink size={14} className="opacity-60" />
                </button>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Analysis View */
          <div className="space-y-6">
            {/* Match Info Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold mb-2">{analysis.title}</h2>
              <p className="text-white/50">{analysis.date} • Rio Olympics 2016 Semi-final</p>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-[#2a2a2a] pb-2">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'stats', label: 'Statistics', icon: BarChart3 },
                { id: 'timeline', label: 'Timeline', icon: Play },
                { id: 'insights', label: 'Insights', icon: Zap },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'hover:bg-white/5 text-white/60'
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Video Player */}
              <div className="lg:col-span-2 space-y-6">
                <VideoPlayer
                  videoUrl={videoUrl || sampleVideoUrl}
                  onTimeUpdate={handleTimeUpdate}
                  keyMoments={analysis.keyMoments}
                  showOverlay={true}
                />

                {/* Score Board */}
                <ScoreBoard
                  player1Name={analysis.players.player1.name}
                  player2Name={analysis.players.player2.name}
                  score={analysis.score}
                  duration={analysis.duration}
                />

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-2 gap-6"
                    >
                      <CourtVisualization
                        currentTime={currentTime}
                        currentShot={currentShot}
                        player1Name={analysis.players.player1.name}
                        player2Name={analysis.players.player2.name}
                      />
                      <KeyMoments
                        moments={analysis.keyMoments}
                        onMomentClick={handleSeek}
                        currentTime={currentTime}
                      />
                    </motion.div>
                  )}

                  {activeTab === 'stats' && (
                    <motion.div
                      key="stats"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <StatsPanel
                        player1={analysis.players.player1}
                        player2={analysis.players.player2}
                      />
                    </motion.div>
                  )}

                  {activeTab === 'timeline' && (
                    <motion.div
                      key="timeline"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ShotTimeline
                        rallies={analysis.rallies}
                        currentTime={currentTime}
                        duration={analysis.duration * 60}
                        onSeek={handleSeek}
                      />
                    </motion.div>
                  )}

                  {activeTab === 'insights' && (
                    <motion.div
                      key="insights"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <TacticalInsights
                        insights={analysis.tacticalInsights}
                        summary={analysis.summary}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="text-emerald-500" size={20} />
                    Quick Stats
                  </h3>
                  
                  <div className="space-y-4">
                    <QuickStat
                      label="Total Rallies"
                      value={analysis.rallies.length.toString()}
                    />
                    <QuickStat
                      label="Avg Rally Length"
                      value={`${Math.round(
                        analysis.rallies.reduce((sum, r) => sum + r.shots.length, 0) /
                          analysis.rallies.length
                      )} shots`}
                    />
                    <QuickStat
                      label="Longest Rally"
                      value={`${Math.max(...analysis.rallies.map((r) => r.shots.length))} shots`}
                    />
                    <QuickStat
                      label="Match Duration"
                      value={`${analysis.duration} min`}
                    />
                  </div>
                </div>

                {/* Key Moments Preview */}
                <KeyMoments
                  moments={analysis.keyMoments.slice(0, 4)}
                  onMomentClick={handleSeek}
                  currentTime={currentTime}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm text-white/40">
          <div className="flex items-center gap-2">
            <Activity className="text-emerald-500" size={16} />
            <span>Court Vision Lab</span>
          </div>
          <p>Zero-Shot AI Analysis powered by GPT-4 Vision</p>
        </div>
      </footer>
    </div>
  );
}

// Quick stat component
function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/50 text-sm">{label}</span>
      <span className="font-medium text-emerald-400">{value}</span>
    </div>
  );
}
