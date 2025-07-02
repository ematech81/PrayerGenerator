import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { BibleContext } from "../contex/BibleContext";

const PlayerOptionsCard = () => {
  const {
    selectedVideo,
    showPlayerOptions,
    closePlayerOptions,
    playAsAudio,
    playAsVideo,
  } = useContext(BibleContext);

  if (!selectedVideo) return null;

  return (
    <Modal visible={showPlayerOptions} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Image
            source={{ uri: selectedVideo.snippet.thumbnails.medium.url }}
            style={styles.thumbnail}
          />
          <Text style={styles.title} numberOfLines={2}>
            {selectedVideo.snippet.title}
          </Text>
          <Text style={styles.channel}>
            {selectedVideo.snippet.channelTitle}
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={playAsAudio}>
              <Text style={styles.buttonText}>🎧 Play as Audio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={playAsVideo}>
              <Text style={styles.buttonText}>🎬 Play as Video</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={closePlayerOptions}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PlayerOptionsCard;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  thumbnail: {
    width: 200,
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  channel: {
    color: "#888",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#6200ee",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
  },
  cancelText: {
    color: "#6200ee",
    marginTop: 10,
  },
});
