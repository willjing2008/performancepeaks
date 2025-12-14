from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import os
import json
from datetime import datetime
import random

app = Flask(__name__)
CORS(app)

# Store for analysis results
analysis_results = {}

def analyze_badminton_video(video_path=None, video_url=None):
    """
    Zero-shot AI analysis of badminton match video
    This is a simulated analysis - in production, you would use actual AI models
    """
    
    # Simulate video processing
    # In a real implementation, you would:
    # 1. Download/load the video
    # 2. Use computer vision models to detect players, shuttlecock, court
    # 3. Track player movements and shot types
    # 4. Analyze rallies and score progression
    
    # For demonstration, we'll generate realistic sample data
    player1_name = "Lin Dan"
    player2_name = "Lee Chong Wei"
    
    # Generate statistics
    player1_points = random.randint(15, 21)
    player2_points = random.randint(15, 21)
    
    # Ensure one player wins
    if player1_points == player2_points:
        player1_points += 1
    
    winner = player1_name if player1_points > player2_points else player2_name
    
    statistics = {
        "player1_points": player1_points,
        "player2_points": player2_points,
        "player1_smashes": random.randint(20, 40),
        "player2_smashes": random.randint(20, 40),
        "player1_drops": random.randint(15, 30),
        "player2_drops": random.randint(15, 30),
        "player1_clears": random.randint(25, 45),
        "player2_clears": random.randint(25, 45),
        "player1_serves": random.randint(30, 50),
        "player2_serves": random.randint(30, 50),
        "total_rallies": random.randint(50, 100)
    }
    
    # Generate timeline
    timeline = []
    p1_score = 0
    p2_score = 0
    
    for i in range(statistics["total_rallies"]):
        if p1_score >= player1_points and p2_score >= player2_points:
            break
        
        # Randomly award points
        if random.random() > 0.5 and p1_score < player1_points:
            p1_score += 1
        elif p2_score < player2_points:
            p2_score += 1
        
        timeline.append({
            "time": f"{i * 30}s",
            "player1_score": p1_score,
            "player2_score": p2_score
        })
    
    # Generate rallies breakdown
    rallies = []
    p1_rally_score = 0
    p2_rally_score = 0
    
    shot_types = ["Smash", "Drop", "Clear", "Net", "Lob", "Drive"]
    
    for i in range(min(statistics["total_rallies"], 20)):  # Show first 20 rallies
        rally_winner = player1_name if random.random() > 0.5 else player2_name
        if rally_winner == player1_name:
            p1_rally_score += 1
        else:
            p2_rally_score += 1
        
        num_shots = random.randint(3, 15)
        shots = []
        for j in range(num_shots):
            shots.append({
                "player": player1_name if j % 2 == 0 else player2_name,
                "type": random.choice(shot_types),
                "time": f"{j * 2}s"
            })
        
        rallies.append({
            "timestamp": f"{i * 30}s",
            "player1_score": p1_rally_score,
            "player2_score": p2_rally_score,
            "winner": rally_winner,
            "shot_type": random.choice(shot_types),
            "duration": f"{num_shots * 2}s",
            "shots": shots
        })
    
    result = {
        "players": {
            "player1": player1_name,
            "player2": player2_name
        },
        "statistics": statistics,
        "timeline": timeline,
        "rallies": rallies,
        "winner": winner,
        "duration": f"{len(timeline) * 30 // 60}m {len(timeline) * 30 % 60}s",
        "analysis_timestamp": datetime.now().isoformat()
    }
    
    return result

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        if 'video' in request.files:
            video_file = request.files['video']
            # Save video temporarily
            video_path = f"/tmp/{video_file.filename}"
            video_file.save(video_path)
            
            # Analyze video
            result = analyze_badminton_video(video_path=video_path)
            
            # Clean up
            if os.path.exists(video_path):
                os.remove(video_path)
            
            return jsonify(result)
        
        elif 'video_url' in request.form:
            video_url = request.form['video_url']
            
            # Analyze video from URL
            result = analyze_badminton_video(video_url=video_url)
            
            return jsonify(result)
        
        else:
            return jsonify({"error": "No video file or URL provided"}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
