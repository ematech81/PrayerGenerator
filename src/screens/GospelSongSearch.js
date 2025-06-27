import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { fetchDefaultSongs, searchSongs } from "../utils/apiService";
import { BibleContext } from "../contex/BibleContext";
import SongItem from "../component/SongItem";

const SongScreen = () => {
  const [activeTab, setActiveTab] = useState("songs");
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentVideoId, isPlaying } = useContext(BibleContext);

  // Fetch songs with error handling
  const fetchSongs = async (fetchFunction) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFunction();
      setSongs(data);
    } catch (err) {
      setError("Failed to load songs. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch default songs on load
  useEffect(() => {
    fetchSongs(fetchDefaultSongs);
  }, []);

  // Search songs (debounced)
  useEffect(() => {
    if (searchQuery.trim() === "") {
      fetchSongs(fetchDefaultSongs);
      return;
    }

    const timer = setTimeout(() => {
      fetchSongs(() => searchSongs(searchQuery));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter songs based on tab
  const getFilteredSongs = () => {
    if (activeTab === "playlist") {
      return songs.filter((song) => playlist.includes(song.id.videoId));
    }
    if (activeTab === "favorites") {
      return songs.filter((song) => favorites.includes(song.id.videoId));
    }
    return songs;
  };

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => fetchSongs(fetchDefaultSongs)}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading && songs.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        placeholder="Search gospel songs..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => setActiveTab("songs")}>
          <Text style={activeTab === "songs" ? styles.activeTab : styles.tab}>
            Songs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("playlist")}>
          <Text
            style={activeTab === "playlist" ? styles.activeTab : styles.tab}
          >
            Playlist
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("favorites")}>
          <Text
            style={activeTab === "favorites" ? styles.activeTab : styles.tab}
          >
            Favorites
          </Text>
        </TouchableOpacity>
      </View>

      {/* Song List */}
      <FlatList
        data={getFilteredSongs()}
        keyExtractor={(item) => item.id.videoId}
        extraData={[currentVideoId, isPlaying, activeTab]}
        renderItem={({ item }) => <SongItem video={item} />}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text>No songs found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  tab: {
    padding: 10,
    color: "#666",
  },
  activeTab: {
    padding: 10,
    color: "#6200ee",
    fontWeight: "bold",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  retryText: {
    color: "#6200ee",
  },
});

export default SongScreen;
