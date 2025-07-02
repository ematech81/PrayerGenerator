import React, { useEffect, useRef, useContext, useState } from "react";
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
    togglePlayback,
    playVideo,
    showVideoModal,
    setShowVideoModal,
    setIsPlaying,
  } = useContext(BibleContext);

  const playerRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Autoplay on screen load
  useEffect(() => {
    if (selectedVideo?.id?.videoId) {
      playVideo(selectedVideo.id.videoId);
    }
  }, [selectedVideo]);

  // Track progress
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

  if (!selectedVideo) {
    return (
      <View style={styles.centered}>
        <Text>No song selected.</Text>
      </View>
    );
  }

  const thumbnail = selectedVideo.snippet?.thumbnails?.high?.url;
  const title = selectedVideo.snippet?.title;

  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    const rem = Math.floor(sec % 60);
    return `${min}:${rem < 10 ? "0" : ""}${rem}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Tabs */}
      <View style={styles.topTabs}>
        <TouchableOpacity style={styles.tabActive}>
          <Text style={styles.tabTextActive}>Now Playing</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabInactive}
          onPress={() => {
            setShowVideoModal(true);
            // setIsPlaying(false);
          }}
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

      {/* Title + Favorite */}
      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <TouchableOpacity>
          <MaterialIcons name="favorite-border" size={28} color="#6200ee" />
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View style={styles.progressWrapper}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={currentTime}
          onSlidingComplete={(val) => {
            playerRef.current?.seekTo(val);
            setCurrentTime(val);
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
        <TouchableOpacity
          onPress={() => {
            togglePlayback(); // Just toggle state
          }}
        >
          <MaterialIcons
            name={isPlaying ? "pause-circle-filled" : "play-circle-filled"}
            size={64}
            color="#6200ee"
          />
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={() => {
            if (playerRef.current) {
              if (isPlaying) {
                playerRef.current.pauseVideo();
                togglePlayback(false); // Explicit pause
              } else {
                playerRef.current.playVideo();
                togglePlayback(true); // Explicit play
              }
            }
          }}
        >
          <MaterialIcons
            name={isPlaying ? "pause-circle-filled" : "play-circle-filled"}
            size={64}
            color="#6200ee"
          />
        </TouchableOpacity> */}

        {/* <TouchableOpacity>
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
        </TouchableOpacity> */}
      </View>

      {/* Hidden YouTube Player */}
      <YoutubePlayer
        key={`${currentVideoId}-${isPlaying}`} // Force update
        ref={playerRef}
        height={200}
        play={isPlaying}
        videoId={currentVideoId}
        onReady={() =>
          playerRef.current
            ?.getDuration()
            .then(setDuration)
            .catch(() => {})
        }
        onChangeState={(state) => {
          if (state === "ended") togglePlayback(false);
        }}
      />

      {/* <YoutubePlayer
        ref={playerRef}
        // height={Dimensions.get("window").width * 1}
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
          if (state === "ended") togglePlayback(false);
        }}
      /> */}
      <>{showVideoModal && <VideoPlayerModal />}</>
    </ScrollView>
  );
};

export default AudioPlayerScreen;

const styles = StyleSheet.create({
  container: {
    padding: 5,
    backgroundColor: "#fff",
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topTabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 50,
  },
  tabActive: {
    flex: 1,
    marginRight: 5,
    padding: 10,
    backgroundColor: "#6200ee",
    borderRadius: 10,
  },
  tabInactive: {
    flex: 1,
    marginLeft: 5,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  tabTextActive: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  tabTextInactive: {
    color: "#6200ee",
    textAlign: "center",
    fontWeight: "bold",
  },
  thumbnailWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  thumbnail: {
    width: width * 0.8,
    height: width * 0.45,
    borderRadius: 10,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    marginRight: 10,
  },
  progressWrapper: {
    marginBottom: 10,
  },
  slider: {
    width: "100%",
  },
  timeText: {
    textAlign: "center",
    color: "#555",
    marginTop: 4,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 20,
  },
});

// import React, { useEffect, useRef, useState, useContext } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   ScrollView,
// } from "react-native";
// import YoutubePlayer from "react-native-youtube-iframe";
// import Slider from "@react-native-community/slider";
// import { MaterialIcons, Ionicons } from "@expo/vector-icons";
// import { BibleContext } from "../contex/BibleContext";
// import VideoPlayerModal from "../videoComponent/VideoPlayerModal";

// const { width } = Dimensions.get("window");

// const AudioPlayerScreen = ({ route, navigation }) => {
//   const {
//     currentVideoId,
//     isPlaying,
//     setIsPlaying,
//     playVideo,
//     playerStatus,
//     togglePlayback,
//     showVideoModal,
//     setShowVideoModal,
//     selectedVideo,
//   } = useContext(BibleContext);

//   const [duration, setDuration] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);
//   const playerRef = useRef(null);

//   const video = selectedVideo; // we assume you set this when navigating

//   // Auto play video on screen load
//   useEffect(() => {
//     if (video?.id?.videoId) {
//       playVideo(video.id.videoId);
//     }
//   }, [video]);

//   // Track progress every second
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (isPlaying && playerRef.current?.getCurrentTime) {
//         playerRef.current.getCurrentTime().then(setCurrentTime);
//       }
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [isPlaying]);

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   if (!video) {
//     return (
//       <View style={styles.centered}>
//         <Text>Loading song...</Text>
//       </View>
//     );
//   }

//   const thumbnail = video.snippet?.thumbnails?.high?.url;

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* Top Tabs */}
//       <View style={styles.topTabs}>
//         <TouchableOpacity style={styles.tabActive}>
//           <Text style={styles.tabTextActive}>Now Playing</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.tabInactive}
//           onPress={() => setShowVideoModal(true)}
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
//           {video.snippet.title}
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
//           onSlidingComplete={(value) => {
//             playerRef.current?.seekTo(value);
//             setCurrentTime(value);
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
//         <TouchableOpacity>
//           <MaterialIcons name="skip-previous" size={36} color="#6200ee" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => togglePlayback()}>
//           <MaterialIcons
//             name={isPlaying ? "pause-circle-filled" : "play-circle-filled"}
//             size={64}
//             color="#6200ee"
//           />
//         </TouchableOpacity>
//         <TouchableOpacity>
//           <MaterialIcons name="skip-next" size={36} color="#6200ee" />
//         </TouchableOpacity>
//       </View>

//       {/* Hidden YouTube player */}
//       <YoutubePlayer
//         ref={playerRef}
//         height={0}
//         play={isPlaying}
//         videoId={video.id.videoId}
//         onChangeState={(state) => {
//           if (state === "ended") {
//             setIsPlaying(false);
//           }
//         }}
//         onReady={() => {
//           playerRef.current?.getDuration().then(setDuration);
//         }}
//       />

//       {/* Video Modal */}
//       <VideoPlayerModal />
//     </ScrollView>
//   );
// };

// export default AudioPlayerScreen;

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     paddingBottom: 40,
//     backgroundColor: "#fff",
//   },
//   topTabs: {
//     flexDirection: "row",
//     marginBottom: 20,
//     justifyContent: "space-between",
//   },
//   tabActive: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: "#6200ee",
//     borderRadius: 10,
//     marginRight: 5,
//   },
//   tabInactive: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: "#eee",
//     borderRadius: 10,
//     marginLeft: 5,
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
//   centered: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });
