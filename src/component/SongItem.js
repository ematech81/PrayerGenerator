import React, { useState, useContext } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { MaterialIcons } from "@expo/vector-icons";
import { BibleContext } from "../contex/BibleContext";

const SongItem = ({ video }) => {
  const {
    currentVideoId,
    isPlaying,
    isAudioMode,
    playVideo,
    togglePlayback,
    toggleAudioMode,
  } = useContext(BibleContext);

  const isCurrentSong = currentVideoId === video.id.videoId;

  return (
    <View style={styles.songContainer}>
      {/* Song Thumbnail & Info */}
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
        <TouchableOpacity
          onPress={() => {
            if (isCurrentSong) {
              togglePlayback();
            } else {
              playVideo(video.id.videoId);
            }
          }}
        >
          <MaterialIcons
            name={isCurrentSong && isPlaying ? "pause" : "play-arrow"}
            size={30}
            color="#6200ee"
          />
        </TouchableOpacity>
      </View>

      {/* YouTube Player (Only for current song) */}
      {isCurrentSong && (
        <>
          <YoutubePlayer
            height={isAudioMode ? 0 : 200}
            play={isPlaying}
            videoId={video.id.videoId}
            audioOnly={isAudioMode}
            onChangeState={(event) => {
              if (event === "ended") togglePlayback(false);
            }}
          />

          {/* Audio/Video Toggle */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={[
                styles.controlButton,
                isAudioMode && styles.activeControlButton,
              ]}
              onPress={() => toggleAudioMode(true)}
            >
              <Text style={styles.controlText}>Audio</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.controlButton,
                !isAudioMode && styles.activeControlButton,
              ]}
              onPress={() => toggleAudioMode(false)}
            >
              <Text style={styles.controlText}>Video</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  songContainer: {
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  songHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  songInfo: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  channel: {
    color: "#666",
    fontSize: 14,
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
