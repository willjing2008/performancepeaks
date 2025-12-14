export type ShotType = 
  | 'smash' 
  | 'clear' 
  | 'drop' 
  | 'drive' 
  | 'net' 
  | 'lift' 
  | 'serve'
  | 'block'
  | 'push';

export type ShotOutcome = 'winner' | 'error' | 'continue' | 'forced_error';

export interface Player {
  id: string;
  name: string;
  position: { x: number; y: number };
  color: string;
}

export interface Shot {
  id: string;
  timestamp: number;
  player: string;
  type: ShotType;
  outcome?: ShotOutcome;
  position?: { x: number; y: number };
  targetPosition?: { x: number; y: number };
  speed?: number;
  description?: string;
}

export interface Rally {
  id: string;
  number: number;
  startTime: number;
  endTime: number;
  shots: Shot[];
  winner: string;
  points: { player1: number; player2: number };
}

export interface PlayerStats {
  name: string;
  totalShots: number;
  shotDistribution: Record<ShotType, number>;
  winners: number;
  errors: number;
  forcedErrors: number;
  avgShotSpeed?: number;
  courtCoverage?: number;
  dominantSide?: 'forehand' | 'backhand';
}

export interface MatchAnalysis {
  id: string;
  videoUrl?: string;
  title: string;
  date: string;
  players: {
    player1: PlayerStats;
    player2: PlayerStats;
  };
  rallies: Rally[];
  keyMoments: KeyMoment[];
  summary: string;
  tacticalInsights: string[];
  score: {
    player1: number;
    player2: number;
    sets?: { player1: number; player2: number }[];
  };
  duration: number;
}

export interface KeyMoment {
  id: string;
  timestamp: number;
  type: 'winner' | 'rally' | 'momentum_shift' | 'crucial_point';
  description: string;
  player: string;
  importance: 'high' | 'medium' | 'low';
}

export interface FrameAnalysis {
  timestamp: number;
  players: {
    player1: { x: number; y: number; pose?: string };
    player2: { x: number; y: number; pose?: string };
  };
  shuttlecock?: { x: number; y: number };
  currentShot?: Shot;
}

export interface AnalysisState {
  status: 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';
  progress: number;
  currentStep: string;
  error?: string;
}
