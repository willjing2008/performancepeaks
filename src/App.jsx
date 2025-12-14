import React, { useState } from 'react'
import VideoUpload from './components/VideoUpload'
import AnalysisResults from './components/AnalysisResults'
import MatchBreakdown from './components/MatchBreakdown'
import './App.css'

function App() {
  const [analysisData, setAnalysisData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalysisComplete = (data) => {
    setAnalysisData(data)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏸 Badminton AI Analysis</h1>
        <p>Zero-Shot AI Analysis of Badminton Matches</p>
      </header>
      
      <main className="app-main">
        <VideoUpload 
          onAnalysisComplete={handleAnalysisComplete}
          loading={loading}
          setLoading={setLoading}
        />
        
        {analysisData && (
          <>
            <AnalysisResults data={analysisData} />
            <MatchBreakdown data={analysisData} />
          </>
        )}
      </main>
    </div>
  )
}

export default App
