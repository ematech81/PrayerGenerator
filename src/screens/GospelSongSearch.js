import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from "react-native";

import { fetchDefaultSongs, searchSongs } from "../utils/apiService";
import { BibleContext } from "../contex/BibleContext";
import PlayerOptionsCard from "../videoComponent/PlayerOptionCard";
import SongItem from "../videoComponent/SongItem";
import AudioPlayerModal from "../videoComponent/AudioPlayerModal";
import MiniPlayer from "../videoComponent/MiniPlayer";

// 🧠 Fetch hook for songs (default + search)
function useSongs(query) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let canceled = false;
    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const data =
          query.trim() === ""
            ? await fetchDefaultSongs()
            : await searchSongs(query);
        if (!canceled) setSongs(data);
      } catch (err) {
        if (!canceled) setError(err.message || "Error loading songs");
      } finally {
        if (!canceled) setLoading(false);
      }
    }, 500); // debounce

    return () => {
      canceled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return { songs, loading, error, refetch: () => setLoading(true) };
}

//  Main Song Screen
const SongScreen = () => {
  const [activeTab, setActiveTab] = useState("songs");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const {
    currentVideoId,
    isPlaying,
    playlist = [],
    favorites = [],
  } = useContext(BibleContext);

  const { songs, loading, error, refetch } = useSongs(searchQuery);

  const filteredSongs = useMemo(() => {
    if (activeTab === "playlist") {
      return songs.filter((song) => playlist.includes(song.id.videoId));
    }
    if (activeTab === "favorites") {
      return songs.filter((song) => favorites.includes(song.id.videoId));
    }
    return songs;
  }, [songs, activeTab, playlist, favorites]);

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={refetch}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading && songs.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ff008c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#081329" barStyle="light-content" />

      {/* Search Bar */}
      <TextInput
        placeholder="Search gospel songs..."
        placeholderTextColor="#ccc"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />

      {/* Tabs */}
      <View style={styles.tabBar}>
        {["songs", "playlist", "favorites"].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text style={activeTab === tab ? styles.activeTab : styles.tab}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Song List */}
      <FlatList
        data={filteredSongs}
        keyExtractor={(item) => item.id.videoId}
        extraData={[currentVideoId, isPlaying, activeTab]}
        renderItem={({ item }) => (
          <SongItem video={item} songsList={filteredSongs} />
        )}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.fallBack}>No songs found</Text>
          </View>
        }
      />

      {/* Player Options + Modals */}
      <PlayerOptionsCard />

      {/* Mini‑player bar */}
      <MiniPlayer onOpenModal={() => setModalVisible(true)} />

      {/* Audio modal */}
      <AudioPlayerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        metaList={songs} // pass full list so modal can find metadata quickly
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#081329",
    // backgroundColor: "#1e2572",
  },
  searchBar: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 30,
    marginBottom: 10,
    color: "#fff",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  tab: {
    padding: 10,
    color: "#666",
  },
  activeTab: {
    padding: 10,
    color: "#fff",
    // color: "#6200ee",
    fontWeight: "bold",
    fontSize: 18,
    borderBottomWidth: 2,
    borderBottomColor: "#ff008c",
    // borderBottomColor: "#6200ee",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#081329",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  retryText: {
    color: "#6200ee",
  },
  fallBack: {
    color: "#fff",
  },
});

export default SongScreen;
