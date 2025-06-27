import React, { createContext, useState } from "react";
import axios from "axios";

export const BibleContext = createContext();

export const BibleProvider = ({ children }) => {
  // Existing Bible state (keep your current state here)
  const [bibleData, setBibleData] = useState(null);
  const [currentBook, setCurrentBook] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);

  // Player state
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [playerStatus, setPlayerStatus] = useState("idle"); // 'idle', 'loading', 'playing', 'paused'

  // Player controls
  const playVideo = (videoId) => {
    setCurrentVideoId(videoId);
    setIsPlaying(true);
    setPlayerStatus("playing");
  };

  const togglePlayback = (value) => {
    if (value !== undefined) {
      setIsPlaying(value);
      setPlayerStatus(value ? "playing" : "paused");
    } else {
      setIsPlaying((prev) => !prev);
      setPlayerStatus((prev) => (prev === "playing" ? "paused" : "playing"));
    }
  };

  const toggleAudioMode = (value) => {
    if (value !== undefined) {
      setIsAudioMode(value);
    } else {
      setIsAudioMode((prev) => !prev);
    }
  };

  // Your existing Bible functions (keep these)
  const fetchBibleData = async () => {
    // Your existing implementation
  };

  return (
    <BibleContext.Provider
      value={{
        // Player-related values and functions
        currentVideoId,
        isPlaying,
        isAudioMode,
        playerStatus,
        playVideo,
        togglePlayback,
        toggleAudioMode,
      }}
    >
      {children}
    </BibleContext.Provider>
  );
};
