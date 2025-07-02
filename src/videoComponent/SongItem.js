import React, { useState, useContext } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { MaterialIcons } from "@expo/vector-icons";
import { BibleContext } from "../contex/BibleContext";
import { useNavigation } from "@react-navigation/native";

const SongItem = ({ video }) => {
  const { currentVideoId, setSelectedVideo, isPlaying } =
    useContext(BibleContext);

  const navigation = useNavigation();
  // const isCurrentSong = currentVideoId === video.id.videoId;

  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedVideo(video); // update context
        navigation.navigate("AudioPlayerScreen"); // make sure the route is defined
      }}
      style={styles.songContainer}
    >
      <View style={styles.songHeader}>
        <Image
          source={{ uri: video.snippet.thumbnails.default.url }}
          style={styles.thumbnail}
        />
        <View style={styles.songInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {video.snippet.title}
          </Text>
          <Text style={styles.channel}>{video.snippet.channelTitle}</Text>
        </View>

        <MaterialIcons
          name="play-arrow"
          size={24}
          color="#ff008c"
          //     color="#6200ee"
        />
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
});

export default SongItem;
