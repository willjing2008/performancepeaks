import React, { useState } from 'react'
import axios from 'axios'
import './VideoUpload.css'

function VideoUpload({ onAnalysisComplete, loading, setLoading }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setVideoUrl(url)
    }
  }

  const handleUrlChange = (e) => {
    setVideoUrl(e.target.value)
    setSelectedFile(null)
  }

  const handleAnalyze = async () => {
    if (!selectedFile && !videoUrl) {
      alert('Please select a video file or enter a video URL')
      return
    }

    setLoading(true)
    const formData = new FormData()
    
    if (selectedFile) {
      formData.append('video', selectedFile)
    } else {
      formData.append('video_url', videoUrl)
    }

    try {
      const response = await axios.post('/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      onAnalysisComplete(response.data)
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Error analyzing video. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="video-upload">
      <div className="upload-container">
        <h2>Upload Badminton Match Video</h2>
        
        <div className="upload-options">
          <div className="file-upload">
            <label htmlFor="file-input" className="upload-label">
              Choose Video File
            </label>
            <input
              id="file-input"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="file-input"
            />
            {selectedFile && (
              <p className="file-name">{selectedFile.name}</p>
            )}
          </div>

          <div className="divider">OR</div>

          <div className="url-input">
            <input
              type="text"
              placeholder="Enter video URL (YouTube, etc.)"
              value={videoUrl}
              onChange={handleUrlChange}
              className="url-input-field"
            />
          </div>
        </div>

        {videoUrl && !selectedFile && (
          <div className="video-preview">
            <video src={videoUrl} controls className="preview-video" />
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading || (!selectedFile && !videoUrl)}
          className="analyze-button"
        >
          {loading ? 'Analyzing...' : 'Analyze Match'}
        </button>
      </div>
    </div>
  )
}

export default VideoUpload
