# Court Vision Lab 🏸

**Zero-Shot AI Analysis of Badminton Matches**

A modern web application that provides AI-powered analysis of badminton match videos, featuring player tracking, shot detection, tactical insights, and comprehensive statistics.

![Court Vision Lab](https://img.shields.io/badge/AI-Powered-emerald) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## Features

- 🎥 **Video Upload & Playback** - Upload badminton match videos and watch with custom player controls
- 🏃 **Player Tracking** - Real-time visualization of player positions on the court
- 🎯 **Shot Detection** - AI identifies and classifies shot types (smash, clear, drop, drive, net, lift, serve)
- 📊 **Comprehensive Statistics** - Detailed stats including shot distribution, winners, errors, and more
- ⭐ **Key Moments** - Automatic detection of important match moments (winners, long rallies, momentum shifts)
- 📈 **Shot Timeline** - Visual timeline showing all shots throughout the match
- 💡 **Tactical Insights** - AI-generated tactical analysis and match summary
- 🏆 **Score Tracking** - Live scoreboard with set-by-set breakdown

## Demo

The application includes a built-in demo featuring analysis of the iconic **Lin Dan vs Lee Chong Wei** Rio Olympics 2016 Semi-final match.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **AI**: OpenAI GPT-4 Vision API
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (for AI analysis features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/courtvisionlab/courtvision.git
cd courtvision
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── analyze/      # AI analysis API routes
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page component
├── components/
│   ├── VideoPlayer.tsx       # Video player with overlay
│   ├── StatsPanel.tsx        # Player statistics panel
│   ├── KeyMoments.tsx        # Key moments display
│   ├── ShotTimeline.tsx      # Shot timeline visualization
│   ├── CourtVisualization.tsx # Court view with player positions
│   ├── TacticalInsights.tsx  # AI tactical insights
│   ├── AnalysisProgress.tsx  # Analysis progress indicator
│   └── ScoreBoard.tsx        # Match scoreboard
├── lib/
│   └── mockData.ts       # Demo data for Lin Dan vs Lee Chong Wei
└── types/
    └── index.ts          # TypeScript type definitions
```

## Usage

### Upload a Video

1. Click the upload area or drag and drop a video file
2. Supported formats: MP4, WebM, MOV
3. Wait for the AI to analyze the video
4. Explore the generated analysis

### Using the Demo

1. Click "Load Demo" to see a pre-analyzed match
2. Navigate between tabs: Overview, Statistics, Timeline, Insights
3. Click on key moments to jump to that point in the video
4. Explore shot distribution and player statistics

## API Routes

### POST `/api/analyze`

Analyze video frames or generate match analysis.

**Actions:**
- `analyzeFrame` - Analyze a single video frame
- `generateAnalysis` - Generate full match analysis

**Example:**
```typescript
const response = await fetch('/api/analyze', {
  method: 'POST',
  body: JSON.stringify({
    action: 'generateAnalysis',
    data: {
      description: 'Olympic badminton match',
      player1: 'Lin Dan',
      player2: 'Lee Chong Wei'
    }
  })
});
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Inspired by professional badminton analysis systems
- Demo data based on the legendary Lin Dan vs Lee Chong Wei rivalry
- Built with ❤️ for the badminton community

---

**Court Vision Lab** - Bringing AI-powered insights to badminton analysis
