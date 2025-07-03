// components/VideoPlayerModal.js
import { useContext, useState } from "react";
import {
  Button,
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { BibleContext } from "../contex/BibleContext";
import { useNavigation } from "@react-navigation/native";
export default function VideoPlayerModal({ visible, video, onClose }) {
  const {
    selectedVideo,
    setShowVideoModal,
    isPlaying,
    togglePlayback,
    isAudioMode,
    currentVideoId,
    showVideoModal,
  } = useContext(BibleContext);

  if (!selectedVideo) return null;

  return (
    <Modal animationType="fade" visible={showVideoModal} transparent>
      <View style={styles.modalContainer}>
        {/* Enhanced Player */}
        <YoutubePlayer
          height={200}
          width={Dimensions.get("window").width}
          play={isPlaying}
          videoId={currentVideoId}
          audioOnly={isAudioMode}
          onChangeState={(event) => {
            if (event === "ended") togglePlayback(false);
          }}
          webViewProps={{
            allowsFullscreenVideo: true,
            allowsInlineMediaPlayback: true,
          }}
        />
        <TouchableOpacity
          onPress={() => setShowVideoModal(false)}
          style={styles.backButton}
        >
          <Text style={styles.closeText}>✖ Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#0e2432",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
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
  backButton: {
    marginTop: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#333",
  },
});
