import React, { useContext } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { BibleContext } from "../contex/BibleContext";

const MiniPlayer = ({ onOpenModal }) => {
  const {
    currentVideoId,
    isPlaying,
    setIsPlaying,
    audioObjRef,
    favourites,
    currentSongMeta: songMeta,
  } = useContext(BibleContext);

  if (!currentVideoId) return null; // nothing playing

  const onPlayPause = async () => {
    if (!audioObjRef.current) return;
    try {
      if (isPlaying) {
        await audioObjRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await audioObjRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch {}
  };

  // fetch title/thumbnail from somewhere: easiest is a map
  //   const songMeta = favourites.find((x) => x.id?.videoId === currentVideoId);

  return (
    <TouchableOpacity style={styles.container} onPress={onOpenModal}>
      <Image
        source={{ uri: songMeta?.snippet?.thumbnails?.default?.url }}
        style={styles.thumb}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {songMeta?.snippet?.title || "Playing..."}
        </Text>
      </View>
      <TouchableOpacity onPress={onPlayPause} style={styles.playBtn}>
        <Text style={styles.playIcon}>{isPlaying ? "❚❚" : "▶︎"}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default MiniPlayer;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",

    backgroundColor: "#9c4c55",
    width: "100%",
    borderRadius: 25,
    marginHorizontal: "auto",
    marginBottom: 50,
  },
  thumb: { width: 40, height: 40, borderRadius: 25, overflow: "hidden" },
  info: { flex: 1, marginLeft: 10 },
  title: { fontSize: 14, fontWeight: "600" },
  playBtn: { paddingHorizontal: 8 },
  playIcon: { fontSize: 18, color: "#081329" },
});
