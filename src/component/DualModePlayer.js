import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import Slider from "@react-native-community/slider";
import { MaterialIcons } from "@expo/vector-icons";

const DualModePlayer = ({ videoId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [volume, setVolume] = useState(0.5); // 0 to 1
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef(null);

  // Update progress every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        playerRef.current?.getCurrentTime().then((time) => {
          setCurrentTime(time);
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Handle background audio
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "background") {
        setIsAudioMode(true);
      }
    };
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      {/* YouTube Player (Hidden in Audio Mode) */}
      <YoutubePlayer
        ref={playerRef}
        height={isAudioMode ? 0 : 220}
        play={isPlaying}
        volume={volume * 100} // 0-100 scale
        videoId={videoId}
        audioOnly={isAudioMode}
        onChangeState={(event) => {
          if (event === "ended") setIsPlaying(false);
        }}
        onReady={() => {
          playerRef.current?.getDuration().then((dur) => setDuration(dur));
        }}
      />

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={currentTime}
          onSlidingComplete={(value) => {
            playerRef.current?.seekTo(value);
            setCurrentTime(value);
          }}
          minimumTrackTintColor="#6200ee"
          maximumTrackTintColor="#ccc"
        />
      </View>

      {/* Control Buttons */}
      <View style={styles.controlRow}>
        <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)}>
          <MaterialIcons
            name={isPlaying ? "pause" : "play-arrow"}
            size={32}
            color="#6200ee"
          />
        </TouchableOpacity>

        <View style={styles.volumeContainer}>
          <MaterialIcons name="volume-down" size={24} color="#6200ee" />
          <Slider
            style={styles.volumeSlider}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            onValueChange={setVolume}
            minimumTrackTintColor="#6200ee"
            maximumTrackTintColor="#ccc"
          />
          <MaterialIcons name="volume-up" size={24} color="#6200ee" />
        </View>
      </View>

      {/* Audio/Video Toggle */}
      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[styles.modeButton, !isAudioMode && styles.activeMode]}
          onPress={() => setIsAudioMode(false)}
        >
          <Text style={styles.modeText}>Video</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, isAudioMode && styles.activeMode]}
          onPress={() => setIsAudioMode(true)}
        >
          <Text style={styles.modeText}>Audio Only</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Helper: Format seconds to MM:SS
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  progressContainer: {
    marginVertical: 10,
  },
  timeText: {
    textAlign: "center",
    color: "#666",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  controlRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  volumeContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "60%",
  },
  volumeSlider: {
    flex: 1,
    marginHorizontal: 5,
  },
  modeToggle: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  modeButton: {
    padding: 8,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
  },
  activeMode: {
    backgroundColor: "#6200ee",
  },
  modeText: {
    color: "#333",
  },
  activeModeText: {
    color: "white",
  },
});

export default DualModePlayer;
