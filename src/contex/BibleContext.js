import React, { createContext, useState } from "react";
import axios from "axios";

export const BibleContext = createContext();

export const BibleProvider = ({ children }) => {
  // Player state
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [playerStatus, setPlayerStatus] = useState("idle"); // 'idle',
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showPlayerOptions, setShowPlayerOptions] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // fuction to select video to play
  const selectVideo = (video) => {
    setSelectedVideo(video);
  };

  // Player controls
  const playVideo = (videoId) => {
    setCurrentVideoId(videoId);
    setIsPlaying(true);
    setPlayerStatus("playing");
  };

  // const togglePlayback = (value) => {
  //   if (value !== undefined) {
  //     setIsPlaying(value);
  //     setPlayerStatus(value ? "playing" : "paused");
  //   } else {
  //     setIsPlaying((prev) => !prev);
  //     setPlayerStatus((prev) => (prev === "playing" ? "paused" : "playing"));
  //   }
  // };

  const toggleAudioMode = (value) => {
    if (value !== undefined) {
      setIsAudioMode(value);
    } else {
      setIsAudioMode((prev) => !prev);
    }
  };

  const playAsAudio = () => {
    setIsAudioMode(true);
    setShowAudioModal(true);
    setPlayerStatus("playing");
    setIsPlaying(true);
    setShowPlayerOptions(false);
  };

  const playAsVideo = () => {
    setIsAudioMode(false);
    setShowVideoModal(true);
    setPlayerStatus("playing");
    setIsPlaying(true);
    setShowPlayerOptions(false);
  };

  const closeAudioModal = () => {
    setShowAudioModal(false);
    setIsPlaying(false);
    setPlayerStatus("paused");
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setIsPlaying(false);
    setPlayerStatus("paused");
  };

  // Your existing Bible functions (keep these)
  const fetchBibleData = async () => {
    // Your existing implementation
  };

  return (
    <BibleContext.Provider
      value={{
        // Player-related values and functions
        selectedVideo,
        setSelectedVideo,
        showPlayerOptions,
        selectVideo,
        currentVideoId,
        isPlaying,
        isAudioMode,
        playerStatus,
        playVideo,
        // togglePlayback,
        toggleAudioMode,
        showAudioModal,
        setShowVideoModal,
        showVideoModal,
        playAsAudio,
        playAsVideo,
        closeAudioModal,
        closeVideoModal,
      }}
    >
      {children}
    </BibleContext.Provider>
  );
};
