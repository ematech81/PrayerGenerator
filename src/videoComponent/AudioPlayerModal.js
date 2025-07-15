// components/AudioPlayerModal.js
import React, { useContext, useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { BibleContext } from "../contex/BibleContext";
import Slider from "@react-native-community/slider";

const AudioPlayerModal = ({ visible, onClose, metaList }) => {
  const {
    currentVideoId,
    isPlaying,
    setIsPlaying,
    audioObjRef,
    position,
    setPosition,
    duration,
    favourites,
    toggleFavourite,
  } = useContext(BibleContext);

  const [localMeta, setLocalMeta] = useState(null);

  const { width } = Dimensions.get("window");

  /* -- find current song metadata from the list passed by SongScreen -- */
  useEffect(() => {
    const meta = metaList.find((x) => x.id.videoId === currentVideoId);
    setLocalMeta(meta);
  }, [currentVideoId, metaList]);

  /* -- update slider position -- */
  useEffect(() => {
    if (!audioObjRef.current) return;
    const subscription = audioObjRef.current.setOnPlaybackStatusUpdate(
      (s) => s.isLoaded && setPosition(s.positionMillis)
    );
    return () => {
      /* unsub not strictly needed in expo-av, but keep clean */
      audioObjRef.current.setOnPlaybackStatusUpdate(null);
    };
  }, [audioObjRef]);

  const onPlayPause = async () => {
    if (!audioObjRef.current) return;
    if (isPlaying) {
      await audioObjRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await audioObjRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const onSlidingComplete = async (value) => {
    try {
      if (audioObjRef.current) {
        await audioObjRef.current.setPositionAsync(value);
        setPosition(value);
      }
    } catch {}
  };

  if (!localMeta) return null;

  const { title, channelTitle, thumbnails } = localMeta.snippet;
  const fav = favourites.includes(currentVideoId);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* close */}
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        {/* artwork */}
        <Image
          source={{ uri: thumbnails.high.url }}
          style={styles.art}
          resizeMode="cover"
        />

        {/* title */}
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.channel}>{channelTitle}</Text>

        {/* progress */}
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={onSlidingComplete}
        />
        <View style={styles.timeRow}>
          <Text style={styles.time}>
            {Math.floor(position / 60000)}:
            {("0" + (Math.floor(position / 1000) % 60)).slice(-2)}
          </Text>
          <Text style={styles.time}>
            {Math.floor(duration / 60000)}:
            {("0" + (Math.floor(duration / 1000) % 60)).slice(-2)}
          </Text>
        </View>

        {/* controls */}
        <View style={styles.controlRow}>
          <TouchableOpacity disabled style={styles.controlBtn}>
            <Text style={styles.controlIcon}>⏮</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPlayPause} style={styles.controlBtn}>
            <Text style={styles.controlIcon}>{isPlaying ? "❚❚" : "▶︎"}</Text>
          </TouchableOpacity>
          <TouchableOpacity disabled style={styles.controlBtn}>
            <Text style={styles.controlIcon}>⏭</Text>
          </TouchableOpacity>
        </View>

        {/* favourite toggle */}
        <TouchableOpacity
          onPress={() => toggleFavourite(currentVideoId)}
          style={styles.favBtn}
        >
          <Text style={styles.favIcon}>{fav ? "♥" : "♡"}</Text>
          <Text style={styles.favText}>
            {fav ? "Added to Favourites" : "Add to Favourites"}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default AudioPlayerModal;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#081329",
    alignItems: "center",
  },
  closeBtn: { position: "absolute", top: 20, right: 20, zIndex: 10 },
  closeIcon: { fontSize: 26, color: "#fff" },
  art: { width: width - 40, height: width - 40, borderRadius: 10 },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    textAlign: "center",
  },
  channel: { color: "#ccc", fontSize: 14, marginTop: 6 },
  slider: { width: width - 40, marginTop: 30 },
  timeRow: {
    width: width - 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: { color: "#ff008c", fontSize: 12 },
  controlRow: { flexDirection: "row", marginTop: 30, alignItems: "center" },
  controlBtn: { paddingHorizontal: 20 },
  controlIcon: { color: "#fff", fontSize: 32 },
  favBtn: { flexDirection: "row", alignItems: "center", marginTop: 30 },
  favIcon: { color: "red", fontSize: 24 },
  favText: { color: "#fff", marginLeft: 8 },
});

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     justifyContent: "center",
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 20,
//     alignItems: "center",
//   },
//   title: {
//     fontWeight: "bold",
//     fontSize: 18,
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   controls: {
//     flexDirection: "row",
//     gap: 20,
//     marginTop: 20,
//   },
//   controlText: {
//     fontSize: 16,
//     color: "#6200ee",
//   },
//   closeText: {
//     fontSize: 16,
//     color: "red",
//   },
// });
