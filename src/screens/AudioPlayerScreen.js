import React, {
  useEffect,
  useRef,
  useContext,
  useState,
  useCallback,
} from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import Slider from "@react-native-community/slider";
import { BibleContext } from "../contex/BibleContext";
import VideoPlayerModal from "../videoComponent/VideoPlayerModal";

const { width } = Dimensions.get("window");

const AudioPlayerScreen = () => {
  const {
    selectedVideo,
    currentVideoId,
    isPlaying,
    playerStatus,
    // togglePlayback,
    setShowVideoModal,
    playVideo,
    showVideoModal,
    setIsPlaying,
    setPlayerStatus,
  } = useContext(BibleContext);

  const playerRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlayerReady, setisPlayerReady] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Auto play on screen mount
  useEffect(() => {
    if (selectedVideo?.id?.videoId) {
      playVideo(selectedVideo.id.videoId); // sets isPlaying = true internally
    }
  }, [selectedVideo]);

  // Sync playback time
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && playerRef.current?.getCurrentTime) {
        playerRef.current
          .getCurrentTime()
          .then(setCurrentTime)
          .catch(() => {});
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // function to check and set duration
  useEffect(() => {
    const checkDuration = async () => {
      if (playerRef.current?.getDuration) {
        try {
          const dur = await playerRef.current.getDuration();
          if (!isNaN(dur) && dur > 0) {
            setDuration(dur);
          }
        } catch (err) {
          console.warn("Failed to get duration:", err);
        }
      }
    };

    checkDuration();
  }, [playerRef, currentVideoId]);

  if (!selectedVideo) {
    return (
      <View style={styles.centered}>
        <Text>No song selected.</Text>
      </View>
    );
  }

  useEffect(() => {
    console.log(playerRef.current); // Should log the player instance
  }, []);

  const onPlay = useCallback(() => {
    setIsPlaying(true);
    setPlayerStatus("playing");
  }, []);

  const onPause = useCallback(() => {
    setIsPlaying(false);
    setPlayerStatus("paused");
  }, []);

  // Toggle via direct player methods
  const togglePlayback = useCallback(() => {
    if (!isPlayerReady) return; // ⚠️ Wait for readiness

    if (isPlaying) {
      playerRef.current?.pause();
    } else {
      playerRef.current?.play();
    }
  }, [isPlaying, isPlayerReady]);

  // Modify your onChangeState to handle more cases
  const handleStateChange = useCallback((state) => {
    setIsPlaying(state === "playing");
  }, []);

  const thumbnail = selectedVideo.snippet?.thumbnails?.high?.url;
  const title = selectedVideo.snippet?.title;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Tabs */}
      <View style={styles.topTabs}>
        <TouchableOpacity style={styles.tabActive}>
          <Text style={styles.tabTextActive}>Now Playing</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabInactive}
          onPress={() => setShowVideoModal(true)}
        >
          <Text style={styles.tabTextInactive}>Watch Video</Text>
        </TouchableOpacity>
      </View>

      {/* Thumbnail */}
      <View style={styles.thumbnailWrapper}>
        {thumbnail ? (
          <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
        ) : (
          <Ionicons name="musical-notes" size={100} color="#ccc" />
        )}
      </View>

      {/* Title & Favorite */}
      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <TouchableOpacity>
          <MaterialIcons name="favorite-border" size={28} color="#6200ee" />
        </TouchableOpacity>
      </View>

      {/* Progress Slider */}
      <View style={styles.progressWrapper}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={currentTime}
          onSlidingComplete={(val) => {
            if (playerRef.current?.seekTo) {
              playerRef.current.seekTo(val, true);
              setCurrentTime(val);
            }
          }}
          minimumTrackTintColor="#6200ee"
          maximumTrackTintColor="#ccc"
        />
        <Text style={styles.timeText}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity>
          <MaterialIcons name="skip-previous" size={36} color="#6200ee" />
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePlayback}>
          <MaterialIcons
            name={isPlaying ? "pause-circle-filled" : "play-circle-filled"}
            size={64}
            color="#6200ee"
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name="skip-next" size={36} color="#6200ee" />
        </TouchableOpacity>
      </View>

      {/* Hidden YouTube Player (audio only) */}
      <YoutubePlayer
        ref={playerRef}
        height={200}
        play={isPlaying} // Still useful for initial state
        videoId={currentVideoId}
        onChangeState={handleStateChange}
        onReady={() => {
          console.log(
            "Player ref methods:",
            Object.keys(playerRef.current || {})
          ); // Debug
          playerRef.current
            ?.getDuration()
            .then(setDuration)
            .catch(console.error);

          if (isPlaying) {
            console.log("Attempting to play...");
            playerRef.current?.play?.(); // Optional chaining as fallback
          }
        }}
      />

      {/* <YoutubePlayer
        ref={playerRef}
        height={0}
        play={isPlaying}
        videoId={currentVideoId}
        onReady={() =>
          playerRef.current
            ?.getDuration()
            .then(setDuration)
            .catch(() => {})
        }
        onChangeState={(state) => {
          console.log("Player state:", state);

          if (state === "playing") {
            onPlay(); // Sync app state
          } else if (state === "paused" || state === "ended") {
            onPause(); // Sync app state
          }
        }}
      /> */}

      {/* Optional Video Modal */}
      {showVideoModal && <VideoPlayerModal />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 30 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  topTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  tabActive: { borderBottomWidth: 2, borderColor: "#6200ee", paddingBottom: 5 },
  tabTextActive: { color: "#6200ee", fontWeight: "bold" },
  tabInactive: { paddingBottom: 5 },
  tabTextInactive: { color: "#666" },
  thumbnailWrapper: { alignItems: "center", marginTop: 20 },
  thumbnail: { width: width * 0.8, height: width * 0.5, borderRadius: 10 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "bold", flex: 1, marginRight: 10 },
  progressWrapper: { paddingHorizontal: 20, marginTop: 20 },
  slider: { width: "100%", height: 40 },
  timeText: { textAlign: "center", color: "#666" },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 30,
  },
});

export default AudioPlayerScreen;

// const { width } = Dimensions.get("window");

// const AudioPlayerScreen = () => {
//   const {
//     selectedVideo,
//     currentVideoId,
//     isPlaying,
//     playerStatus,
//     togglePlayback,
//     playVideo,
//     showVideoModal,
//     setShowVideoModal,
//     setIsPlaying,
//   } = useContext(BibleContext);

//   const playerRef = useRef(null);
//   const [duration, setDuration] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);

//   // Autoplay on screen load
//   useEffect(() => {
//     if (selectedVideo?.id?.videoId) {
//       playVideo(selectedVideo.id.videoId);
//     }
//   }, [selectedVideo]);

//   // Track progress
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (isPlaying && playerRef.current?.getCurrentTime) {
//         playerRef.current
//           .getCurrentTime()
//           .then(setCurrentTime)
//           .catch(() => {});
//       }
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [isPlaying]);

//   if (!selectedVideo) {
//     return (
//       <View style={styles.centered}>
//         <Text>No song selected.</Text>
//       </View>
//     );
//   }

//   const thumbnail = selectedVideo.snippet?.thumbnails?.high?.url;
//   const title = selectedVideo.snippet?.title;

//   const formatTime = (sec) => {
//     const min = Math.floor(sec / 60);
//     const rem = Math.floor(sec % 60);
//     return `${min}:${rem < 10 ? "0" : ""}${rem}`;
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* Top Tabs */}
//       <View style={styles.topTabs}>
//         <TouchableOpacity style={styles.tabActive}>
//           <Text style={styles.tabTextActive}>Now Playing</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.tabInactive}
//           onPress={() => {
//             setShowVideoModal(true);
//             // setIsPlaying(false);
//           }}
//         >
//           <Text style={styles.tabTextInactive}>Watch Video</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Thumbnail */}
//       <View style={styles.thumbnailWrapper}>
//         {thumbnail ? (
//           <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
//         ) : (
//           <Ionicons name="musical-notes" size={100} color="#ccc" />
//         )}
//       </View>

//       {/* Title + Favorite */}
//       <View style={styles.titleRow}>
//         <Text style={styles.title} numberOfLines={2}>
//           {title}
//         </Text>
//         <TouchableOpacity>
//           <MaterialIcons name="favorite-border" size={28} color="#6200ee" />
//         </TouchableOpacity>
//       </View>

//       {/* Progress */}
//       <View style={styles.progressWrapper}>
//         <Slider
//           style={styles.slider}
//           minimumValue={0}
//           maximumValue={duration}
//           value={currentTime}
//           onSlidingComplete={(val) => {
//             playerRef.current?.seekTo(val);
//             setCurrentTime(val);
//           }}
//           minimumTrackTintColor="#6200ee"
//           maximumTrackTintColor="#ccc"
//         />
//         <Text style={styles.timeText}>
//           {formatTime(currentTime)} / {formatTime(duration)}
//         </Text>
//       </View>

//       {/* Controls */}
//       <View style={styles.controls}>
//         <TouchableOpacity
//           onPress={() => {
//             togglePlayback(); // Just toggle state
//           }}
//         >
//           <MaterialIcons
//             name={isPlaying ? "pause-circle-filled" : "play-circle-filled"}
//             size={64}
//             color="#6200ee"
//           />
//         </TouchableOpacity>

//       </View>

//       {/* Hidden YouTube Player */}
//       <YoutubePlayer
//         key={`${currentVideoId}-${isPlaying}`} // Force update
//         ref={playerRef}
//         height={200}
//         play={isPlaying}
//         videoId={currentVideoId}
//         onReady={() =>
//           playerRef.current
//             ?.getDuration()
//             .then(setDuration)
//             .catch(() => {})
//         }
//         onChangeState={(state) => {
//           if (state === "ended") togglePlayback(false);
//         }}
//       />

//       <>{showVideoModal && <VideoPlayerModal />}</>
//     </ScrollView>
//   );
// };

// export default AudioPlayerScreen;

// const styles = StyleSheet.create({
//   container: {
//     padding: 5,
//     backgroundColor: "#fff",
//     paddingBottom: 40,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   topTabs: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     c
//   },
//   tabActive: {
//     flex: 1,
//     marginRight: 5,
//     padding: 10,
//     backgroundColor: "#6200ee",
//     borderRadius: 10,
//   },
//   tabInactive: {
//     flex: 1,
//     marginLeft: 5,
//     padding: 10,
//     backgroundColor: "#eee",
//     borderRadius: 10,
//   },
//   tabTextActive: {
//     color: "#fff",
//     textAlign: "center",
//     fontWeight: "bold",
//   },
//   tabTextInactive: {
//     color: "#6200ee",
//     textAlign: "center",
//     fontWeight: "bold",
//   },
//   thumbnailWrapper: {
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   thumbnail: {
//     width: width * 0.8,
//     height: width * 0.45,
//     borderRadius: 10,
//   },
//   titleRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   title: {
//     flex: 1,
//     fontSize: 18,
//     fontWeight: "600",
//     marginRight: 10,
//   },
//   progressWrapper: {
//     marginBottom: 10,
//   },
//   slider: {
//     width: "100%",
//   },
//   timeText: {
//     textAlign: "center",
//     color: "#555",
//     marginTop: 4,
//   },
//   controls: {
//     flexDirection: "row",
//     justifyContent: "space-evenly",
//     alignItems: "center",
//     marginTop: 20,
//   },
// });
