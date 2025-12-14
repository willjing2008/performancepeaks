# Badminton AI Analysis

Zero-Shot AI Analysis of Badminton Matches - A web application for analyzing badminton match videos using AI.

## Features

- 🎥 Video upload and analysis
- 🤖 AI-powered match analysis
- 📊 Real-time statistics and visualizations
- 🏸 Player performance breakdown
- 📈 Score progression tracking
- 🎯 Shot type analysis

## Tech Stack

### Frontend
- React 18
- Vite
- Recharts for data visualization
- Axios for API calls

### Backend
- Flask (Python)
- OpenCV for video processing
- NumPy for data processing

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the backend server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

1. Start both the backend and frontend servers
2. Open your browser and navigate to `http://localhost:3000`
3. Upload a badminton match video or provide a video URL
4. Click "Analyze Match" to start the analysis
5. View the results including:
   - Player statistics
   - Shot type comparisons
   - Score progression
   - Detailed rally breakdown

## Project Structure

```
.
├── backend/
│   ├── app.py              # Flask backend server
│   └── requirements.txt    # Python dependencies
├── src/
│   ├── components/
│   │   ├── VideoUpload.jsx      # Video upload component
│   │   ├── AnalysisResults.jsx  # Results visualization
│   │   └── MatchBreakdown.jsx   # Rally breakdown
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── package.json            # Node.js dependencies
├── vite.config.js          # Vite configuration
└── README.md              # This file
```

## Notes

This is a demonstration application. For production use, you would integrate:
- Real computer vision models for player and shuttlecock detection
- Advanced AI models for shot classification
- Video processing pipelines for real-time analysis
- Database storage for analysis history
- User authentication and session management

## License

MIT
