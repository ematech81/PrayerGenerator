import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Platform,
  ActionSheetIOS,
  Alert,
  StyleSheet,
} from "react-native";
// import { Audio } from "expo-audio";
import { Audio } from "expo-av";
import YoutubePlayer from "react-native-youtube-iframe";
import { MaterialIcons } from "@expo/vector-icons";
import { convertToMp3 } from "../utils/mp3Converter";
import { BibleContext } from "../contex/BibleContext";

const mp3Cache = new Map();

export default function SongItem({ video, songsList = [] }) {
  const videoId = video.id.videoId;
  const { title, channelTitle, thumbnails } = video.snippet;

  const {
    currentVideoId,
    setCurrentVideoId,
    isPlaying,
    setIsPlaying,
    audioObjRef,
    addToPlaylist,
    setCurrentSongMeta,
    setDuration,
    queueIndex,
    setQueueIndex,
    playQueue,
    setPlayQueue,
    setPosition,
  } = useContext(BibleContext);

  const [loading, setLoading] = useState(false);

  const isThisRow = currentVideoId === videoId;
  const isThisPlaying = isThisRow && isPlaying;

  /* PLAY / PAUSE handler                                      */
  const onPlayPausePress = useCallback(async () => {
    // 🔹 If this row is already playing → pause
    if (isThisPlaying) {
      try {
        await audioObjRef.current.pauseAsync();
        setIsPlaying(false);
      } catch (_) {}
      return;
    }

    // 🔹 If this row is paused but currentVideoId === this → resume
    if (isThisRow && !isPlaying) {
      try {
        await audioObjRef.current.playAsync();
        setIsPlaying(true);
      } catch (err) {
        console.error("Resume error:", err.message);
      }
      return;
    }
    playTrack(video);
  }, [
    isThisPlaying,
    isThisRow,
    isPlaying,
    videoId,
    audioObjRef,
    setCurrentVideoId,
    setIsPlaying,
  ]);

  /* ⋮ three‑dot menu                                          */
  const showMenu = () => {
    const onAddToPlaylist = () => {
      if (addToPlaylist) addToPlaylist(video); // expose via context/hook
      else Alert.alert("Playlist", "Added to your playlist!");
    };

    const onOpenYouTube = () => {
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      Linking.openURL(url);
    };

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Add to Playlist", "Play in YouTube"],
          destructiveButtonIndex: -1,
          cancelButtonIndex: 0,
          userInterfaceStyle: "#ff008c",
        },
        (buttonIndex) => {
          if (buttonIndex === 1) onAddToPlaylist();
          if (buttonIndex === 2) onOpenYouTube();
        }
      );
    } else {
      Alert.alert("Options", "", [
        { text: "Add to Playlist", onPress: onAddToPlaylist },
        { text: "Play in YouTube", onPress: onOpenYouTube },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const playNext = async () => {
    const { playQueue, queueIndex } = BibleContext; // grab from context
    if (queueIndex == null) return;
    const next = playQueue[queueIndex + 1];
    if (next) {
      /* Recursively trigger a play by simulating a press */
      onPlayPausePress(next); // or refactor play logic into a context fn
    } else {
      setIsPlaying(false);
    }
  };

  const playTrack = async (videoObj) => {
    try {
      setLoading(true);

      /* 1. Prepare MP3 URL */
      const vId = videoObj.id.videoId;
      const mp3Url =
        mp3Cache.get(vId) ||
        (await convertToMp3(vId).then((url) => {
          mp3Cache.set(vId, url);
          return url;
        }));

      /* 2. Stop previous sound */
      if (audioObjRef.current) {
        try {
          await audioObjRef.current.stopAsync();
          await audioObjRef.current.unloadAsync();
        } catch (_) {}
      }

      /* 3. Create & play */
      const { sound, status } = await Audio.Sound.createAsync(
        { uri: mp3Url },
        { shouldPlay: true }
      );
      audioObjRef.current = sound;

      /* 4. Update global + queue */
      setPlayQueue(songsList);
      setQueueIndex(songsList.findIndex((v) => v.id.videoId === vId));
      setCurrentVideoId(vId);
      setCurrentSongMeta(videoObj);
      setDuration(status.durationMillis);
      setPosition(0);
      setIsPlaying(true);

      /* 5. Progress + auto‑next */
      sound.setOnPlaybackStatusUpdate((st) => {
        if (!st.isLoaded) return;
        setPosition(st.positionMillis);
        setDuration(st.durationMillis);
        if (st.didJustFinish) {
          const idx = songsList.findIndex((x) => x.id.videoId === vId);
          const next = songsList[idx + 1];
          next ? playTrack(next) : setIsPlaying(false);
        }
      });
    } catch (err) {
      console.error("Play error:", err.message);
      Alert.alert("Playback Error", "Sorry, that track can't be played.");
    } finally {
      setLoading(false);
    }
  };

  /* RENDER    */
  return (
    <View
      style={[
        styles.row,
        isThisRow && styles.rowActive, // highlight!
      ]}
    >
      {/* Colored strip indicator (can switch to bg tint) */}
      {isThisRow && <View style={styles.leftStrip} />}

      {/* thumbnail */}
      <Image
        source={{ uri: thumbnails.medium.url }}
        style={styles.thumb}
        resizeMode="cover"
      />

      {/* info */}
      <TouchableOpacity style={styles.info} onPress={onPlayPausePress}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.channel}>{channelTitle}</Text>
      </TouchableOpacity>

      {/* play/pause OR loading */}
      <TouchableOpacity style={styles.iconContainer} onPress={onPlayPausePress}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.icon}>{isThisPlaying ? "❚❚" : "▶︎"}</Text>
        )}
      </TouchableOpacity>

      {/* three‑dot menu */}
      <TouchableOpacity onPress={showMenu} style={styles.menuBtn}>
        <Text style={styles.menuIcon}>⋮</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  songContainer: {
    marginBottom: 4,
    //     backgroundColor: "#2f0f36",
    backgroundColor: "#3d1248",
    borderRadius: 10,
    paddingHorizontal: 8,

    //     elevation: 2,
  },
  songHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 10,
  },
  songInfo: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    fontSize: 12,
    color: "#ccc",
  },
  channel: {
    color: "#666",
    fontSize: 12,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  controlButton: {
    padding: 8,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  activeControlButton: {
    backgroundColor: "#6200ee",
  },
  controlText: {
    color: "#333",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    // backgroundColor: "#fff",
  },
  thumb: { width: 64, height: 64, borderRadius: 4 },
  info: { flex: 1, marginHorizontal: 10 },
  channel: { fontSize: 12, color: "#666", marginTop: 2 },
  iconContainer: { width: 34, alignItems: "center" },
  icon: { fontSize: 18, color: "#ff008c" },
  menuIcon: { fontSize: 26, color: "#999" },
  menuBtn: {
    marginLeft: 10,
    // backgroundColor: "blue",
    width: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  rowActive: {
    backgroundColor: "#3d1248",
    // backgroundColor: "#f0f7ff",
  },
  leftStrip: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#2c79ff",
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
});
