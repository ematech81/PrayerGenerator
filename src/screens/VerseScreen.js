import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  ScrollView,
  Modal,
  Alert,
  Image,
  SafeAreaView,
  ImageBackground,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import TranslationVerse from "../component/TranslationVerse";
import AiIcon from "../assets/AiIcon.jpg";
import {
  fetchAllTranslations,
  fetchVersesForTranslation,
} from "../utils/apiService";
import VerseMenu from "../component/verseMenu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation, useRoute } from "@react-navigation/native";
import TranslationSelector from "../component/TranslationSelector";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";

const VerseScreen = () => {
  const [selectedVerseItem, setSelectedVerseItem] = useState(null);
  const [showActionBox, setShowActionBox] = useState(false);
  const [activeVerseId, setActiveVerseId] = useState(null);
  const [showVerseSelector, setShowVerseSelector] = useState(true);
  const [selectedVerseId, setSelectedVerseId] = useState(null);
  // const [verses, setVerses] = useState([]);
  const [currentReadingVerseId, setCurrentReadingVerseId] = useState(null);
  const [translations, setTranslations] = useState([]);
  const [currentTranslation, setCurrentTranslation] = useState({
    id: 2,
    abbreviation: "ASV",
    version: "American Standard Version",
  });
  const [translationVerses, setTranslationVerses] = useState([]);
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  const route = useRoute();
  const versesListRef = useRef(null);
  const {
    selectedBook,
    selectedChapter,
    verses = [],
    fromDailyReading,
  } = route.params || {};

  if (!currentTranslation || !selectedBook || !selectedChapter) return;

  //  useEffect to load translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const data = await fetchAllTranslations();
        setTranslations(data);

        // Set default to asv if available
        const asv = data.find((t) => t.abbreviation.toUpperCase() === "ASV");
        setCurrentTranslation(asv || data[0]);
      } catch (error) {
        // Fallback to KJV and ASV
        setTranslations([
          {
            id: 2,
            abbreviation: "ASV",
            version: "American Standard Version",
          },
        ]);
        setCurrentTranslation({
          id: 2,
          abbreviation: "ASV",
          version: "American Standard Version",
        });
      }
    };

    loadTranslations();
  }, []);

  // Add this useEffect to load verses when translation changes
  useEffect(() => {
    const loadTranslationVerses = async () => {
      if (!currentTranslation || !selectedBook || !selectedChapter) return;

      try {
        setIsLoadingTranslation(true);
        const verses = await fetchVersesForTranslation(
          currentTranslation.abbreviation,
          selectedBook.id,
          selectedChapter
        );
        setTranslationVerses(verses);
      } catch (error) {
        console.error("Failed to load translation verses:", error);
        setTranslationVerses([]);
      } finally {
        setIsLoadingTranslation(false);
      }
    };

    loadTranslationVerses();
  }, [currentTranslation, selectedBook, selectedChapter]);

  // Function to toggle speech reading of verses
  const toggleSpeech = () => {
    if (isReading) {
      Speech.stop();
      setIsReading(false);
      setCurrentReadingVerseId(null);
      return;
    }

    if (!translationVerses || translationVerses.length === 0) return;

    const startIndex = selectedVerseId
      ? translationVerses.findIndex((v) => v.verseId === selectedVerseId)
      : 0;

    if (startIndex === -1) return;

    const versesToRead = translationVerses.slice(startIndex);

    let i = 0;
    setIsReading(true);

    const readNext = () => {
      if (!isReading || i >= versesToRead.length) {
        setIsReading(false);
        setCurrentReadingVerseId(null);
        return;
      }

      const verse = versesToRead[i];
      setCurrentReadingVerseId(verse.verseId);

      Speech.speak(
        `${selectedBook?.name} ${selectedChapter}:${verse.verseId}. ${verse.text}`,
        {
          language: "en",
          rate: 0.95,
          pitch: 1,
          onDone: () => {
            i++;
            readNext();
          },
          onStopped: () => {
            setIsReading(false);
            setCurrentReadingVerseId(null);
          },
        }
      );
    };

    readNext();
  };

  const renderVerseItem = ({ item }) => {
    const verseNumber = item.verseId || item.id || "?";
    const verseText = item.verse || item.text || "Verse not available";

    const isSelected = selectedVerseItem?.verseId === verseNumber;
    const isActive = currentReadingVerseId === item.verseId;
    const isActionMenuOpen = activeVerseId === item.verseId;

    const handlePress = () => {
      if (isSelected) {
        setSelectedVerseItem(null);
        setShowActionBox(false);
      } else {
        setSelectedVerseItem(item);
        setShowActionBox(true);
      }
    };

    const handleExplain = () => {
      setShowActionBox(false);
      navigation.navigate("AIScreen", {
        verse: item,
        reference: `${selectedBook?.name} ${selectedChapter}:${verseNumber}`,
      });
    };

    return (
      <View
        key={`verse-${item.id || verseNumber}`}
        style={[
          styles.verseContainer,
          isSelected && styles.selectedVerse,
          // isActive && { backgroundColor: "#DFF8E8" },
        ]}
      >
        {/* Main verse display */}
        <TouchableOpacity onPress={handlePress} style={{ paddingBottom: 10 }}>
          <View style={styles.verseChapterWrapper}>
            <Text style={styles.verseNumber}>
              {selectedBook?.name} {selectedChapter}:{verseNumber}
            </Text>
            <TouchableOpacity onPress={() => setActiveVerseId(item.verseId)}>
              <Entypo
                name={
                  activeVerseId === item.verseId
                    ? "cross"
                    : "dots-three-horizontal"
                }
                size={20}
                color="#ccc"
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[styles.verseText, isSelected && styles.selectedVerseText]}
          >
            {verseText}
          </Text>

          {/* Show spinner while loading translation */}
          {/* {isLoadingTranslation && verseNumber === 1 && (
            <ActivityIndicator size="small" style={styles.loadingIndicator} />
          )} */}
        </TouchableOpacity>

        {/* Action box: Explain with Bible Teacher */}
        {isSelected && showActionBox && (
          <View style={styles.actionBox}>
            <Text style={styles.actionText}>Explain with Bible Teacher?</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.yesButton}
                onPress={handleExplain}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.noButton}
                onPress={() => setShowActionBox(false)}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Dot menu (copy, favorite, highlight) */}
        {isActionMenuOpen && (
          <VerseMenu
            verse={{
              verseId: item.verseId,
              verseText: item.text,
              selectedBook,
              selectedChapter,
            }}
            onClose={() => setActiveVerseId(null)}
            onCopy={() => {
              // Optional: add copy logic
            }}
            onHighlight={(color) => {
              // Optional: add highlight logic
            }}
            onFavorite={() => {
              // Optional: add favorite logic
            }}
          />
        )}
      </View>
    );
  };

  const VerseSelector = ({ verses, onSelectVerse, onClose }) => {
    return (
      <View style={styles.verseSelectorContainer}>
        {/* Header */}
        <View style={styles.verseSelectorHeader}>
          <Text style={styles.verseSelectorTitle}>Select Verse</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Verse Grid */}
        <FlatList
          data={verses}
          keyExtractor={(item) => `verse-option-${item.verseId || item.id}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.verseSelectorOption}
              onPress={() => onSelectVerse(item.verseId || item.id)}
            >
              <Text style={styles.verseSelectorText}>
                {item.verseId || item.id}
              </Text>
            </TouchableOpacity>
          )}
          numColumns={5}
          contentContainerStyle={[
            styles.verseOptionsGrid,
            showVerseSelector
              ? {
                  opacity: 1,
                  transform: [{ translateY: 0 }],
                }
              : {
                  opacity: 0,
                  transform: [{ translateY: 20 }],
                },
          ]}
        />
      </View>
    );
  };

  <FlatList
    ref={versesListRef}
    data={translationVerses.length > 0 ? translationVerses : verses}
    renderItem={renderVerseItem}
    keyExtractor={(item) => `verse-${item.id || item.verseId}`}
    getItemLayout={(data, index) => ({
      length: 50,
      offset: 50 * index,
      index,
    })}
    onScrollToIndexFailed={({ index, averageItemLength }) => {
      versesListRef.current?.scrollToOffset({
        offset: index * averageItemLength,
        animated: true,
      });
    }}
    contentContainerStyle={styles.versesList}
    ListHeaderComponent={
      isLoadingTranslation ? (
        <ActivityIndicator size="small" style={styles.loadingIndicator} />
      ) : null
    }
  />;

  // if (loading) {
  //   return (
  //     <View style={styles.centerContainer}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  // if (error) {
  //   return (
  //     <View style={styles.centerContainer}>
  //       <Text style={styles.errorText}>Error: {error}</Text>
  //     </View>
  //   );
  // }

  // main return component

  return (
    <ImageBackground
      source={require("../assets/verseHeader.jpg")}
      resizeMode="cover"
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.versesContainer}>
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalHeader}
            >
              {/* Chapter Selector */}
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.headerButton}
              >
                <Text style={styles.headerButtonText}>
                  {fromDailyReading ? "Back" : `Ch. ${selectedChapter}`}
                </Text>
              </TouchableOpacity>

              {/* Verse Selector */}
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setShowVerseSelector(!showVerseSelector)}
              >
                <Text style={styles.headerButtonText}>
                  {showVerseSelector ? "Hide Verses" : "Show Verses"}
                </Text>
              </TouchableOpacity>

              {/* Translation Dropdown Selector */}
              <TranslationSelector
                translations={translations}
                currentTranslation={currentTranslation}
                onSelectTranslation={(selected) => {
                  setCurrentTranslation(selected);
                }}
              />

              {/* Audio Bible Button */}
              <TouchableOpacity
                style={styles.headerButton}
                onPress={toggleSpeech} // ✅ Moved this out of text content
              >
                <Ionicons name="volume-medium" size={20} color="white" />
              </TouchableOpacity>

              {/* AI Teacher Assistant */}
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => console.log("AI Assistance")}
              >
                <Image
                  source={AiIcon}
                  resizeMode="cover"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 25,
                    borderWidth: 2,
                    borderColor: "#ccc",
                  }}
                />
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* book name component */}

          <View style={styles.bookChapterTitle}>
            {/* Previous Chapter */}
            <TouchableOpacity
              onPress={() => {
                if (selectedChapter > 1) {
                  navigation.replace("VerseScreen", {
                    selectedBook,
                    selectedChapter: selectedChapter - 1,
                  });
                }
              }}
              disabled={selectedChapter <= 1}
              style={{ padding: 4 }}
            >
              <AntDesign
                name="arrowleft"
                size={24}
                color={selectedChapter > 1 ? "#fff" : "gray"}
              />
            </TouchableOpacity>

            {/* Book Title - Back to Book List */}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("MainTabs", { screen: "Bible" })
              }
              style={styles.chapterNameCont}
            >
              <Text style={styles.verseHeaderTitle}>
                {selectedBook?.name} {selectedChapter}
              </Text>
            </TouchableOpacity>

            {/* Next Chapter */}
            <TouchableOpacity
              onPress={() => {
                const maxChapter = selectedBook?.chapterCount || 150; // Fallback if chapterCount is undefined
                if (selectedChapter < maxChapter) {
                  navigation.replace("VerseScreen", {
                    selectedBook,
                    selectedChapter: selectedChapter + 1,
                  });
                }
              }}
              disabled={selectedChapter >= selectedBook?.chapterCount}
              style={{ padding: 4 }}
            >
              <AntDesign
                name="arrowright"
                size={24}
                color={
                  selectedChapter < (selectedBook?.chapterCount || 150)
                    ? "#fff"
                    : "gray"
                }
              />
            </TouchableOpacity>
          </View>

          {/* Verse Selector Grid */}
          {showVerseSelector && (
            <VerseSelector
              verses={translationVerses.length > 0 ? translationVerses : verses}
              onSelectVerse={(verseId) => {
                const data =
                  translationVerses.length > 0 ? translationVerses : verses;

                const verseIndex = data.findIndex(
                  (v) => v.verseId === verseId || v.id === verseId
                );

                // Step 1: highlight selected verse
                setSelectedVerseId(verseId);

                // Step 2: close the selector
                setShowVerseSelector(false);

                // Step 3: scroll to selected verse AFTER closing UI
                setTimeout(() => {
                  if (versesListRef.current && verseIndex >= 0) {
                    versesListRef.current.scrollToIndex({
                      index: verseIndex,
                      animated: true,
                      viewPosition: 0, // 0 = top, 0.5 = center, 1 = bottom
                    });
                  }
                }, 500); // Delay helps layout stabilize
              }}
              onClose={() => setShowVerseSelector(false)}
            />
          )}

          {/* Verses List */}
          <FlatList
            ref={versesListRef}
            data={translationVerses.length > 0 ? translationVerses : verses}
            extraData={currentTranslation.abbreviation}
            renderItem={renderVerseItem}
            keyExtractor={(item) =>
              currentTranslation
                ? `verse-${currentTranslation.abbreviation}-${item.id}`
                : `verse-unknown-${item.id}`
            }
            getItemLayout={(data, index) => ({
              length: 190,
              offset: 190 * index,
              index,
            })}
            onScrollToIndexFailed={({ index, averageItemLength }) => {
              setTimeout(() => {
                versesListRef.current?.scrollToOffset(
                  {
                    offset: index * averageItemLength,
                    animated: true,
                  },
                  500
                );
              });
            }}
            contentContainerStyle={styles.versesList}
          />

          <View style={styles.aiAbsoluteContainer}>
            {/* AI BUTTON */}
            <TouchableOpacity
              style={styles.floatingAiButton}
              onPress={() => {
                if (!selectedVerseItem) {
                  Alert.alert("Bible Teacher", "Please select a verse first.");
                } else {
                  navigation.navigate("AIScreen", {
                    verse: selectedVerseItem,
                    reference: `${selectedBook?.name} ${selectedChapter}:${selectedVerseItem.verseId}`,
                  });
                }
              }}
            >
              <Image source={AiIcon} resizeMode="cover" style={styles.AiIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  versesContainer: {
    flex: 1,
    // backgroundColor: "red",
    // backgroundColor: "#fff",
    marginTop: 26,
    position: "relative",
  },
  verseHeader: {
    // padding: 10,
    backgroundColor: "#4263eb",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: "#000",
  },

  versesList: {
    padding: 16,
  },
  verseContainer: {
    marginBottom: 10,
    marginTop: 10,
    // paddingBottom: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: "#eee",
    paddingHorizontal: 2,
    minHeight: 100,
    flexWrap: "wrap",
    overflow: "hidden",
  },
  verseNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f3f307ff",
    // color: "#4263eb",
    marginRight: 8,
    lineHeight: 22,
  },
  verseText: {
    fontSize: 18,
    lineHeight: 25,
    flex: 1,
    color: "#fff",
    textAlign: "justify",
    fontWeight: "400",
    // fontStyle: "italic",
  },
  verseChapterWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 1,
    // backgroundColor: "#f8f",
  },

  verseSelectorContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    margin: 10,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 20,
    width: "94%",
    marginHorizontal: "auto",
  },

  verseSelectorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  verseSelectorTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4263eb",
  },
  closeButton: {
    fontSize: 18,
    color: "#888",
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#888",
  },
  verseSelectorOption: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    borderRadius: 20,
    margin: 5,
  },
  verseSelectorText: {
    color: "#4263eb",
    fontWeight: "bold",
  },
  verseSelectorGrid: {
    justifyContent: "center",
  },
  toggleSelectorButton: {
    padding: 10,
    // backgroundColor: "#ccc",
    // backgroundColor: "#4263eb",
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 10,
  },
  toggleSelectorText: {
    color: "white",
    fontWeight: "bold",
  },
  selectedVerse: {
    borderLeftWidth: 1,
    borderLeftColor: "#fff",
    // borderLeftColor: "#4263eb",
  },
  selectedVerseText: {
    backgroundColor: "#ffcccc",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#4263eb",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  horizontalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 15,
    backgroundColor: "#4263eb", // Or your preferred header color
    // marginTop: 50,
    height: 60,
  },
  headerButton: {
    paddingVertical: 0,
    paddingHorizontal: 16,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    justifyContent: "center",
  },
  chapterCount: {
    paddingVertical: 0,
    paddingHorizontal: 16,
    borderRadius: 15,
    // backgroundColor: "rgba(255,255,255,0.2)",
    // marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    justifyContent: "center",
  },
  headerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  bookChapterTitle: {
    // padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    flexDirection: "row",
    gap: 20,
    paddingBottom: 10,
  },
  verseHeaderTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    fontStyle: "italic",
    marginRight: 15,
  },
  loadingIndicator: {
    paddingVertical: 10,
  },
  actionBox: {
    backgroundColor: "#f0f",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  actionText: {
    fontSize: 15,
    marginBottom: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  yesButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
  },
  noButton: {
    backgroundColor: "#ccc",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  AiIcon: {
    width: 30,
    height: 30,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  aiAbsoluteContainer: {
    position: "absolute",
    bottom: 60,
    right: 18,
    flexDirection: "column",
    backgroundColor: "red",
    padding: 4,
    borderRadius: 50,
  },
});

export default VerseScreen;
