// GospelSongSearchScreen.js
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Dimensions,
} from "react-native";
// import { WebView } from "react-native-webview";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const { height } = Dimensions.get("window");
const Tab = createMaterialTopTabNavigator();
const YOUTUBE_API_KEY = "AIzaSyAbN4WRfOcz4TvTDq2AXvyTa2YDdnIsX2U";

const SongPlayerModal = ({ visible, onClose, videoId, title }) => {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Text style={styles.modalTitle}>{title}</Text>
        <webview
          style={{ flex: 1 }}
          javaScriptEnabled
          source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
        />
        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionText}>➕ Add to Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionText}>📁 Add to Playlist</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.closeModal} onPress={onClose}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const SongsTab = () => {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  const searchSongs = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${query}+gospel&type=video&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      setSongs(data.items);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
    setLoading(false);
  };

  const openModal = (song) => {
    setSelectedSong(song);
    setModalVisible(true);
  };

  const renderItem = ({ item }) => {
    const videoId = item.id.videoId;
    const { title, thumbnails, channelTitle } = item.snippet;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => openModal({ videoId, title })}
      >
        <Image
          source={{ uri: thumbnails.medium.url }}
          style={styles.thumbnail}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.channel}>{channelTitle}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search gospel song..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={searchSongs}
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" />
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id.videoId}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}

      {selectedSong && (
        <SongPlayerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          videoId={selectedSong.videoId}
          title={selectedSong.title}
        />
      )}
    </View>
  );
};

const PlaylistTab = () => (
  <View style={styles.tabPlaceholder}>
    <Text>All your playlist will appear here.</Text>
  </View>
);

const RecentlyPlayedTab = () => (
  <View style={styles.tabPlaceholder}>
    <Text>Recently played songs will appear here.</Text>
  </View>
);
const FavoritesTab = () => (
  <View style={styles.tabPlaceholder}>
    <Text>Favorite songs will appear here.</Text>
  </View>
);

const GospelSongSearchScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Songs" component={SongsTab} />
      <Tab.Screen name="Playlist" component={PlaylistTab} />
      <Tab.Screen name="Recent" component={RecentlyPlayedTab} />
      <Tab.Screen name="Favorites" component={FavoritesTab} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#1e2572" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  list: { paddingBottom: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
  },
  thumbnail: { width: 100, height: 60, borderRadius: 6, marginRight: 10 },
  title: { fontSize: 14, fontWeight: "bold" },
  channel: { fontSize: 12, color: "#666" },
  modalTitle: { fontSize: 18, fontWeight: "bold", margin: 16 },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#f0f0f0",
  },
  actionBtn: {
    padding: 10,
    backgroundColor: "#4A90E2",
    borderRadius: 8,
  },
  actionText: { color: "#fff", fontWeight: "bold" },
  closeModal: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#eee",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  tabPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    // marginTop: 100,
  },
});

export default GospelSongSearchScreen;
