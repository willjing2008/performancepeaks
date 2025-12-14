import React, { useState } from 'react'
import './MatchBreakdown.css'

function MatchBreakdown({ data }) {
  const [selectedRally, setSelectedRally] = useState(null)
  const rallies = data.rallies || []

  return (
    <div className="match-breakdown">
      <h2>Match Breakdown</h2>
      
      {rallies.length > 0 ? (
        <div className="rallies-container">
          {rallies.map((rally, index) => (
            <div
              key={index}
              className={`rally-card ${selectedRally === index ? 'selected' : ''}`}
              onClick={() => setSelectedRally(selectedRally === index ? null : index)}
            >
              <div className="rally-header">
                <span className="rally-number">Rally {index + 1}</span>
                <span className="rally-time">{rally.timestamp || `${index * 30}s`}</span>
              </div>
              <div className="rally-content">
                <div className="rally-score">
                  <span className="score">{rally.player1_score || 0}</span>
                  <span className="separator">-</span>
                  <span className="score">{rally.player2_score || 0}</span>
                </div>
                <div className="rally-details">
                  <div className="detail-item">
                    <span className="detail-label">Winner:</span>
                    <span className="detail-value">{rally.winner || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Shot Type:</span>
                    <span className="detail-value">{rally.shot_type || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Rally Duration:</span>
                    <span className="detail-value">{rally.duration || 'N/A'}</span>
                  </div>
                </div>
                {selectedRally === index && rally.shots && (
                  <div className="rally-shots">
                    <h4>Shots in Rally:</h4>
                    <ul>
                      {rally.shots.map((shot, shotIndex) => (
                        <li key={shotIndex}>
                          {shot.player}: {shot.type} at {shot.time}s
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-rallies">
          <p>Rally breakdown data will appear here after analysis</p>
        </div>
      )}
    </div>
  )
}

export default MatchBreakdown
