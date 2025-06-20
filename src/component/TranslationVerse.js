import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Picker,
} from "react-native";
import {
  fetchAllTranslations,
  fetchVersesForTranslation,
} from "../utils/apiService";

const TranslationVerse = ({ bookId, chapterId, verseId = null }) => {
  // State management
  const [translations, setTranslations] = useState([]);
  const [currentTranslation, setCurrentTranslation] = useState(null);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState({
    translations: false,
    verses: false,
  });
  const [error, setError] = useState(null);

  // Fetch all available translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setLoading((prev) => ({ ...prev, translations: true }));
        setError(null);

        const data = await fetchAllTranslations();

        if (!Array.isArray(data)) {
          throw new Error("Invalid translations data format");
        }

        setTranslations(data);

        // Set first translation as default if none selected
        if (data.length > 0 && !currentTranslation) {
          setCurrentTranslation(data[0]);
        }
      } catch (err) {
        console.error("Translation load error:", err);
        setError("Failed to load translations");
        // Fallback to default translations
        setTranslations([
          { id: 1, abbreviation: "KJV", version: "King James Version" },
          { id: 2, abbreviation: "ASV", version: "American Standard Version" },
        ]);
      } finally {
        setLoading((prev) => ({ ...prev, translations: false }));
      }
    };

    loadTranslations();
  }, []);

  // Fetch verses when translation, book, or chapter changes
  useEffect(() => {
    const abortController = new AbortController();

    const loadVerses = async () => {
      if (!currentTranslation?.abbreviation || !bookId || !chapterId) return;

      try {
        setLoading((prev) => ({ ...prev, verses: true }));
        setError(null);
        setVerses([]); // Clear previous verses

        const versesData = await fetchVersesForTranslation(
          currentTranslation.abbreviation,
          bookId,
          chapterId,
          verseId,
          { signal: abortController.signal }
        );

        setVerses(versesData);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Verse load error:", err);
          setError(`Failed to load ${currentTranslation.version} verses`);
          setVerses([]);
        }
      } finally {
        setLoading((prev) => ({ ...prev, verses: false }));
      }
    };

    loadVerses();

    return () => abortController.abort();
  }, [currentTranslation, bookId, chapterId, verseId]);

  // Handle translation selection change
  const handleTranslationChange = (value) => {
    const selected = translations.find((t) => t.abbreviation === value);
    if (selected) setCurrentTranslation(selected);
  };

  // Render loading state
  if (loading.translations) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading translations...</Text>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Translation Selector */}
      <View style={styles.pickerContainer}>
        <Text>Select Translation:</Text>
        <Picker
          selectedValue={currentTranslation?.abbreviation || ""}
          onValueChange={handleTranslationChange}
          style={styles.picker}
          enabled={!loading.verses}
        >
          {translations.map((translation) => (
            <Picker.Item
              key={translation.id}
              label={`${translation.version} (${translation.abbreviation})`}
              value={translation.abbreviation}
            />
          ))}
        </Picker>
      </View>

      {/* Verses Display */}
      <View style={styles.versesContainer}>
        {loading.verses ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" />
            <Text>Loading verses...</Text>
          </View>
        ) : verses.length === 0 ? (
          <Text style={styles.noVersesText}>No verses found</Text>
        ) : (
          verses.map((verse) => (
            <View
              key={`${verse.id}-${verse.verseId}`}
              style={styles.verseContainer}
            >
              <Text style={styles.verseNumber}>{verse.verseId}.</Text>
              <Text style={styles.verseText}>{verse.text}</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  versesContainer: {
    flex: 1,
  },
  verseContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  verseNumber: {
    fontWeight: "bold",
    marginRight: 8,
  },
  verseText: {
    flex: 1,
    flexWrap: "wrap",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  noVersesText: {
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default TranslationVerse;
