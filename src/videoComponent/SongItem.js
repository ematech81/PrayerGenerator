import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { MaterialIcons } from "@expo/vector-icons";
import { BibleContext } from "../contex/BibleContext";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import { convertToMp3 } from "../utils/mp3Converter";
// ← your StyleSheet

// Simple session cache:  videoId → mp3Url
const mp3Cache = new Map();

/**
 * One row in the gospel‑song list.
 * Props: { video }  ← the YouTube search item from api/youtube.js
 */
const SongItem = ({ video }) => {
  const videoId = video.id.videoId;
  const snippet = video.snippet;

  // Global playback state stored in BibleContext
  const {
    currentVideoId,
    isPlaying,
    setCurrentVideoId,
    setIsPlaying,
    audioObjRef, // mutable ref that holds the currently‑playing Sound
  } = useContext(BibleContext);

  const [loading, setLoading] = useState(false);

  // Is *this* row currently playing?
  const isThisPlaying = isPlaying && currentVideoId === videoId;

  const onPlayPausePress = useCallback(async () => {
    // ----------------------------------------------------------
    // 1. If this row is already playing → pause it
    // ----------------------------------------------------------
    if (isThisPlaying) {
      try {
        if (audioObjRef.current) await audioObjRef.current.pauseAsync();
        setIsPlaying(false);
      } catch (e) {
        /* ignore */
      }
      return;
    }

    // ----------------------------------------------------------
    // 2. Otherwise: convert, cache and play
    // ----------------------------------------------------------
    try {
      setLoading(true);

      // a) get / fetch mp3 URL
      let mp3Url = mp3Cache.get(videoId);
      if (!mp3Url) {
        mp3Url = await convertToMp3(videoId); // 🏃‍♂️ network + conversion
        mp3Cache.set(videoId, mp3Url);
        console.log(mp3Url);
      }

      // b) stop & unload previous track (if any)
      if (audioObjRef.current) {
        try {
          await audioObjRef.current.stopAsync();
          await audioObjRef.current.unloadAsync();
        } catch (e) {
          /* ignore */
        }
      }

      // c) create & play new sound
      const { sound } = await Audio.Sound.createAsync({ uri: mp3Url });
      audioObjRef.current = sound; // keep global ref
      await sound.playAsync();

      // d) update global state
      setCurrentVideoId(videoId);
      setIsPlaying(true);

      // e) auto‑reset when the song ends
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          setCurrentVideoId(null);
        }
      });
    } catch (err) {
      console.error("Play error:", err);
      alert("Sorry, that track can’t be played right now.");
    } finally {
      setLoading(false);
    }
  }, [videoId, isThisPlaying, audioObjRef, setCurrentVideoId, setIsPlaying]);

  /* ---------------------------------------------------------- */
  /*   Render                                                   */
  /* ---------------------------------------------------------- */
  return (
    <TouchableOpacity style={styles.row} onPress={onPlayPausePress}>
      {/* Thumbnail */}
      <Image
        source={{ uri: snippet.thumbnails.medium.url }}
        style={styles.thumb}
      />

      {/* Title & channel */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {snippet.title}
        </Text>
        <Text style={styles.channel}>{snippet.channelTitle}</Text>
      </View>

      {/* Play / Pause / Loading indicator */}
      <View style={styles.iconContainer}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.icon}>{isThisPlaying ? "❚❚" : "▶︎"}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  songContainer: {
    marginBottom: 4,
    //     backgroundColor: "#2f0f36",
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
    fontWeight: "bold",
    fontSize: 14,
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
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  thumb: { width: 64, height: 64, borderRadius: 4 },
  info: { flex: 1, marginLeft: 10 },
  // title: { color: "#ccc", fontSize: 14, fontWeight: "600" },
  // channel: { color: "#666", fontSize: 12, marginTop: 2 },
  iconContainer: { width: 40, alignItems: "center" },
  icon: { fontSize: 22, color: "#ff008c" },
});

export default SongItem;
