import { MatchAnalysis, Rally, Shot, KeyMoment, ShotType } from '@/types';

// Lin Dan vs Lee Chong Wei - Rio Olympics 2016 Semi-final Mock Data
export const mockMatchAnalysis: MatchAnalysis = {
  id: 'rio-2016-semifinal',
  title: 'Lin Dan vs Lee Chong Wei - Rio Olympics 2016 Semi-final',
  date: '2016-08-19',
  videoUrl: '/sample-match.mp4',
  players: {
    player1: {
      name: 'Lin Dan',
      totalShots: 287,
      shotDistribution: {
        smash: 42,
        clear: 68,
        drop: 55,
        drive: 38,
        net: 45,
        lift: 28,
        serve: 11,
        block: 0,
        push: 0,
      },
      winners: 38,
      errors: 22,
      forcedErrors: 15,
      avgShotSpeed: 285,
      courtCoverage: 87,
      dominantSide: 'forehand',
    },
    player2: {
      name: 'Lee Chong Wei',
      totalShots: 291,
      shotDistribution: {
        smash: 48,
        clear: 62,
        drop: 52,
        drive: 45,
        net: 42,
        lift: 31,
        serve: 11,
        block: 0,
        push: 0,
      },
      winners: 41,
      errors: 19,
      forcedErrors: 18,
      avgShotSpeed: 298,
      courtCoverage: 89,
      dominantSide: 'forehand',
    },
  },
  rallies: generateMockRallies(),
  keyMoments: generateKeyMoments(),
  summary: `An epic semi-final encounter between two of badminton's greatest legends. Lee Chong Wei showcased superior attack power with devastating smashes reaching up to 350 km/h, while Lin Dan demonstrated his tactical mastery and defensive resilience. The match featured 23 rallies exceeding 15 shots, highlighting the incredible fitness and mental fortitude of both players. Lee Chong Wei ultimately prevailed with his aggressive baseline play and precise net control.`,
  tacticalInsights: [
    "Lee Chong Wei's aggressive smash strategy forced Lin Dan into defensive positions, resulting in 18 forced errors",
    "Lin Dan countered with excellent cross-court drops, winning 12 points from this shot selection",
    "The Malaysian player dominated the front court with 67% net shot success rate",
    "Lin Dan's deceptive clears created multiple scoring opportunities in the second game",
    "Both players showed exceptional footwork, covering an average of 2.3km during the match",
    "Lee Chong Wei's serve variations kept Lin Dan guessing throughout the match",
  ],
  score: {
    player1: 19,
    player2: 21,
    sets: [
      { player1: 21, player2: 15 },
      { player1: 11, player2: 21 },
      { player1: 19, player2: 21 },
    ],
  },
  duration: 79, // minutes
};

function generateMockRallies(): Rally[] {
  const rallies: Rally[] = [];
  const shotTypes: ShotType[] = ['smash', 'clear', 'drop', 'drive', 'net', 'lift'];
  
  for (let i = 0; i < 40; i++) {
    const shotCount = Math.floor(Math.random() * 20) + 3;
    const shots: Shot[] = [];
    let currentTime = i * 45 + Math.random() * 10;
    
    for (let j = 0; j < shotCount; j++) {
      const isPlayer1 = j % 2 === 0;
      shots.push({
        id: `shot-${i}-${j}`,
        timestamp: currentTime + j * 1.5,
        player: isPlayer1 ? 'Lin Dan' : 'Lee Chong Wei',
        type: shotTypes[Math.floor(Math.random() * shotTypes.length)],
        position: {
          x: Math.random() * 100,
          y: Math.random() * 100,
        },
        targetPosition: {
          x: Math.random() * 100,
          y: Math.random() * 100,
        },
        speed: Math.floor(Math.random() * 150) + 150,
      });
      currentTime += 1.5;
    }
    
    rallies.push({
      id: `rally-${i}`,
      number: i + 1,
      startTime: i * 45,
      endTime: i * 45 + shotCount * 1.5,
      shots,
      winner: Math.random() > 0.48 ? 'Lee Chong Wei' : 'Lin Dan',
      points: {
        player1: Math.min(21, Math.floor(i * 0.5)),
        player2: Math.min(21, Math.floor(i * 0.52)),
      },
    });
  }
  
  return rallies;
}

function generateKeyMoments(): KeyMoment[] {
  return [
    {
      id: 'km-1',
      timestamp: 125,
      type: 'winner',
      description: 'Lin Dan executes a perfect cross-court smash from deep in the court, catching Lee Chong Wei off balance',
      player: 'Lin Dan',
      importance: 'high',
    },
    {
      id: 'km-2',
      timestamp: 312,
      type: 'rally',
      description: '28-shot rally showcases both players\' incredible defensive skills and court coverage',
      player: 'Lee Chong Wei',
      importance: 'high',
    },
    {
      id: 'km-3',
      timestamp: 487,
      type: 'momentum_shift',
      description: 'Lee Chong Wei breaks Lin Dan\'s serve with three consecutive smash winners',
      player: 'Lee Chong Wei',
      importance: 'high',
    },
    {
      id: 'km-4',
      timestamp: 892,
      type: 'crucial_point',
      description: 'Game point save by Lin Dan with an incredible diving net shot',
      player: 'Lin Dan',
      importance: 'high',
    },
    {
      id: 'km-5',
      timestamp: 1156,
      type: 'winner',
      description: 'Lee Chong Wei\'s signature jump smash clocked at 350 km/h - the fastest shot of the match',
      player: 'Lee Chong Wei',
      importance: 'high',
    },
    {
      id: 'km-6',
      timestamp: 1423,
      type: 'momentum_shift',
      description: 'Lin Dan starts the second game with 5 consecutive points through deceptive drops',
      player: 'Lin Dan',
      importance: 'medium',
    },
    {
      id: 'km-7',
      timestamp: 1789,
      type: 'rally',
      description: '35-shot rally - the longest of the match, won by Lee Chong Wei with a net kill',
      player: 'Lee Chong Wei',
      importance: 'high',
    },
    {
      id: 'km-8',
      timestamp: 2234,
      type: 'crucial_point',
      description: 'Match point: Lee Chong Wei\'s forehand smash seals the victory in the deciding game',
      player: 'Lee Chong Wei',
      importance: 'high',
    },
  ];
}

// Generate frame-by-frame position data for visualization
export function generateFrameData(timestamp: number) {
  const basePlayer1 = {
    x: 30 + Math.sin(timestamp * 0.5) * 20,
    y: 50 + Math.cos(timestamp * 0.3) * 30,
  };
  
  const basePlayer2 = {
    x: 70 + Math.sin(timestamp * 0.4 + 1) * 20,
    y: 50 + Math.cos(timestamp * 0.35 + 1) * 30,
  };
  
  const shuttlecock = {
    x: 50 + Math.sin(timestamp * 2) * 40,
    y: 50 + Math.cos(timestamp * 2) * 40,
  };
  
  return {
    timestamp,
    players: {
      player1: { ...basePlayer1, pose: 'ready' },
      player2: { ...basePlayer2, pose: 'ready' },
    },
    shuttlecock,
  };
}

// Sample video URL (using a placeholder)
export const sampleVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
