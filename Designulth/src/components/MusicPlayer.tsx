import React, { useState } from 'react';
import { Music, Play, Pause } from 'lucide-react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="music-player">
      <div className="music-icon-wrapper">
        <Music size={20} className="music-icon" />
      </div>
      <div className="music-info">
        <p className="song-title">A Thousand Years</p>
        <p className="song-artist">Christina Perri</p>
      </div>
      <button className="play-button" onClick={togglePlay}>
        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
      </button>
    </div>
  );
};

export default MusicPlayer;
