import React, { useContext } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { BibleContext } from "../contex/BibleContext";

const AudioPlayerModal = () => {
  const {
    selectedVideo,
    showAudioModal,
    closeAudioModal,
    isPlaying,
    togglePlayback,
  } = useContext(BibleContext);

  if (!selectedVideo) return null;

  return (
    <Modal visible={showAudioModal} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{selectedVideo.snippet.title}</Text>

          <YoutubePlayer
            height={0}
            play={isPlaying}
            videoId={selectedVideo.id.videoId}
            onChangeState={(event) => {
              if (event === "ended") togglePlayback(false);
            }}
          />

          <View style={styles.controls}>
            <TouchableOpacity onPress={togglePlayback}>
              <Text style={styles.controlText}>
                {isPlaying ? "⏸ Pause" : "▶️ Play"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeAudioModal}>
              <Text style={styles.closeText}>✖ Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AudioPlayerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20,
  },
  controlText: {
    fontSize: 16,
    color: "#6200ee",
  },
  closeText: {
    fontSize: 16,
    color: "red",
  },
});
