import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import './AnalysisResults.css'

function AnalysisResults({ data }) {
  const { players, statistics, timeline } = data

  const playerStats = [
    {
      name: players?.player1 || 'Player 1',
      points: statistics?.player1_points || 0,
      smashes: statistics?.player1_smashes || 0,
      drops: statistics?.player1_drops || 0,
      clears: statistics?.player1_clears || 0,
      serves: statistics?.player1_serves || 0,
    },
    {
      name: players?.player2 || 'Player 2',
      points: statistics?.player2_points || 0,
      smashes: statistics?.player2_smashes || 0,
      drops: statistics?.player2_drops || 0,
      clears: statistics?.player2_clears || 0,
      serves: statistics?.player2_serves || 0,
    },
  ]

  const shotComparison = [
    { shot: 'Smashes', player1: playerStats[0].smashes, player2: playerStats[1].smashes },
    { shot: 'Drops', player1: playerStats[0].drops, player2: playerStats[1].drops },
    { shot: 'Clears', player1: playerStats[0].clears, player2: playerStats[1].clears },
    { shot: 'Serves', player1: playerStats[0].serves, player2: playerStats[1].serves },
  ]

  return (
    <div className="analysis-results">
      <h2>Match Analysis Results</h2>
      
      <div className="results-grid">
        <div className="result-card">
          <h3>Player Statistics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={playerStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="points" fill="#8884d8" name="Points" />
              <Bar dataKey="smashes" fill="#82ca9d" name="Smashes" />
              <Bar dataKey="drops" fill="#ffc658" name="Drops" />
              <Bar dataKey="clears" fill="#ff7300" name="Clears" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="result-card">
          <h3>Shot Type Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={shotComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="shot" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="player1" fill="#8884d8" name={playerStats[0].name} />
              <Bar dataKey="player2" fill="#82ca9d" name={playerStats[1].name} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="result-card">
          <h3>Score Progression</h3>
          {timeline && timeline.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="player1_score" stroke="#8884d8" name={playerStats[0].name} />
                <Line type="monotone" dataKey="player2_score" stroke="#82ca9d" name={playerStats[1].name} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">Score timeline data not available</p>
          )}
        </div>

        <div className="result-card summary">
          <h3>Match Summary</h3>
          <div className="summary-content">
            <div className="summary-item">
              <span className="label">Winner:</span>
              <span className="value">{data.winner || 'Analysis pending'}</span>
            </div>
            <div className="summary-item">
              <span className="label">Final Score:</span>
              <span className="value">
                {statistics?.player1_points || 0} - {statistics?.player2_points || 0}
              </span>
            </div>
            <div className="summary-item">
              <span className="label">Total Rallies:</span>
              <span className="value">{statistics?.total_rallies || 0}</span>
            </div>
            <div className="summary-item">
              <span className="label">Match Duration:</span>
              <span className="value">{data.duration || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisResults
