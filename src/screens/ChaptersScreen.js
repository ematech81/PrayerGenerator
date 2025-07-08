import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { fetchChapter, fetchChaptersForBook } from "../utils/apiService";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation, useRoute } from "@react-navigation/native";

const ChaptersScreen = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  const {
    selectedBook,
    selectedLanguage = "en", // default to English
    chapters: initialChapters = [],
  } = route.params || {};

  useEffect(() => {
    setChapters(initialChapters);
  }, []);

  const handleChapterPress = async (chapter) => {
    try {
      setLoading(true);

      const response = await fetchChapter(
        chapter.bookId,
        chapter.chapterId,
        selectedLanguage
      );

      let versesArray = response?.verses?.[0] || [];
      if (!Array.isArray(versesArray)) versesArray = [];

      const formattedVerses = versesArray.map((verse, index) => ({
        id: verse?.id ?? `${chapter.bookId}-${chapter.chapterId}-${index + 1}`,
        verseId: verse?.verseId ?? index + 1,
        text: verse?.verse ?? verse?.text ?? `Verse ${index + 1}`,
      }));

      navigation.navigate("VerseScreen", {
        selectedBook,
        selectedChapter: chapter.chapterId,
        verses: formattedVerses,
      });
    } catch (err) {
      console.error("❌ Verse loading failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderChapterItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chapterItem}
      onPress={() => handleChapterPress(item)}
    >
      <Text style={styles.chapterText}>{item.chapterId}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.chaptersContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.chapterHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>

        <View style={{ flexDirection: "column", flex: 1 }}>
          <Text style={styles.bookTitle}>{selectedBook?.name || "Book"}</Text>
        </View>
      </View>

      <View style={{ padding: 8, marginTop: 8 }}>
        <Text style={styles.chapterTitle}>Select Chapter</Text>
      </View>

      <FlatList
        data={chapters}
        renderItem={renderChapterItem}
        keyExtractor={(item) => `${item.bookId}-${item.chapterId}`}
        numColumns={5}
        contentContainerStyle={styles.chaptersGrid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chaptersContainer: {
    flex: 1,
    // backgroundColor: "#4263eb",
    backgroundColor: "#f8f9fa",
    marginTop: 26,
    paddingBottom: 50,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chapterHeader: {
    padding: 8,
    // backgroundColor: "#000",
    backgroundColor: "#4263eb",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    // height: 60,
  },
  backButton: {
    padding: 10,
    // backgroundColor: "green",
  },
  backButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    fontStyle: "underline",
  },
  chapterTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#444",
    marginLeft: 40,
  },
  bookTitle: {
    fontSize: 20,
    color: "#fff",
    // textAlign: "center",
    marginLeft: 40,
  },
  chaptersGrid: {
    padding: 16,
  },
  chapterItem: {
    width: (Dimensions.get("window").width - 72) / 5,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    margin: 4,
  },
  chapterText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4263eb",
  },
});
export default ChaptersScreen;
