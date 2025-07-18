import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import DummyPrayer from "../constant/DummyPrayer";

export const BibleContext = createContext();

export const useBible = () => {
  const ctx = useContext(BibleContext);
  if (!ctx) {
    throw new Error("useBible must be used within BibleProvider");
  }
  return ctx;
};

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
  const [position, setPosition] = useState(0); // ms
  const [duration, setDuration] = useState(1); // ms (avoid div/0)
  const [playlist, setPlaylist] = useState([]); // store videoIds
  const [favourites, setFavourites] = useState([]);
  const [currentSongMeta, setCurrentSongMeta] = useState(null);
  const [playQueue, setPlayQueue] = useState([]); // array of video objects
  const [queueIndex, setQueueIndex] = useState(0);

  /* -- restore favourites on launch -- */
  useEffect(() => {
    (async () => {
      const saved = await SecureStore.getItemAsync("favourites");
      if (saved) setFavourites(JSON.parse(saved));
    })();
  }, []);

  /* -- persist favourites -- */
  const toggleFavourite = (videoId) => {
    setFavourites((prev) => {
      const next = prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId];
      SecureStore.setItemAsync("favourites", JSON.stringify(next));
      return next;
    });
  };

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

  const audioObjRef = useRef(null);

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

  const addToPlaylist = (video) => {
    setPlaylist((prev) => [...prev, video.id.videoId]);
  };

  // Your existing Bible functions (keep these)
  const fetchBibleData = async () => {
    // Your existing implementation
  };

  // prayer point logic
  /* 1. full topic list straight from the JSON */
  const topics = useMemo(() => DummyPrayer, []);

  /* 2. deterministic “daily four” */
  const getDailyTopics = useCallback(
    (count = 4) => {
      const today = new Date().toISOString().slice(0, 10); // e.g. "2025-07-16"

      // hash today’s date into a number
      let hash = 0;
      for (let i = 0; i < today.length; i++) {
        hash = today.charCodeAt(i) + ((hash << 5) - hash);
      }

      // tiny PRNG (mulberry32)
      const rand = (seed) => {
        return () => {
          seed |= 0;
          seed = (seed + 0x6d2b79f5) | 0;
          let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
          t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
      };
      const random = rand(hash);

      // shuffle copy of the list
      const shuffled = [...topics];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, count);
    },
    [topics]
  );

  /* 3. helpers */
  const getTopicById = useCallback(
    (id) => topics.find((t) => t._id === id),
    [topics]
  );

  const getPrayersByTopicId = useCallback(
    (id) => (getTopicById(id) || {}).prayers || [],
    [getTopicById]
  );

  return (
    <BibleContext.Provider
      value={{
        // Player-related values and functions
        selectedVideo,
        setSelectedVideo,
        showPlayerOptions,
        selectVideo,
        isPlaying,
        setIsPlaying,
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
        audioObjRef,
        currentVideoId,
        setCurrentVideoId,
        addToPlaylist,
        position,
        setPosition,
        duration,
        setDuration,
        playlist,
        setPlaylist,
        favourites,
        toggleFavourite,
        currentSongMeta,
        setCurrentSongMeta,
        queueIndex,
        setQueueIndex,
        playQueue,
        setPlayQueue,
        topics,
        getDailyTopics,
        getTopicById,
        getPrayersByTopicId,
      }}
    >
      {children}
    </BibleContext.Provider>
  );
};
