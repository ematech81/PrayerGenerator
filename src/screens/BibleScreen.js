import React, { useState, useEffect, useRef, useReducer } from "react";
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
} from "react-native";
import { loadBibleData } from "../BibleStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";
import AiIcon from "../assets/AiIcon.jpg";

import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LANGUAGES } from "../constant/BibleTranslations";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import TranslationVerse from "../component/TranslationVerse";
import {
  fetchAllTranslations,
  fetchBibleBooks,
  fetchChapter,
  fetchVersesForTranslation,
  apiBible,
  fetchChaptersForBook,
} from "../utils/apiService";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import VerseMenu from "../component/verseMenu";
import TranslationSelector from "../component/TranslationSelector";

const BibleScreen = () => {
  // State management
  const [books, setBooks] = useState([]);
  const [oldTestamentBooks, setOldTestamentBooks] = useState([]);
  const [newTestamentBooks, setNewTestamentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("old");
  const [selectedLanguage, setselectedLanguage] = useState("en"); // Default to English
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [translations, setTranslations] = useState([]);
  const [currentTranslation, setCurrentTranslation] = useState(null);
  const [translationVerses, setTranslationVerses] = useState([]);
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);
  const [selectedVerseItem, setSelectedVerseItem] = useState(null);
  const [showActionBox, setShowActionBox] = useState(false);
  const [activeVerseId, setActiveVerseId] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [currentReadingVerseId, setCurrentReadingVerseId] = useState(null);

  // Navigation state
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [verses, setVerses] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [currentView, setCurrentView] = useState("books");
  const [showVerseSelector, setShowVerseSelector] = useState(true);
  const [selectedVerseId, setSelectedVerseId] = useState(null);

  const versesListRef = useRef(null);

  const navigation = useNavigation();

  // Add this useEffect to load translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const data = await fetchAllTranslations();
        setTranslations(data);

        // Set default to KJV if available
        const asv = data.find((t) => t.abbreviation.toUpperCase() === "ASV");
        setCurrentTranslation(asv || data[0]);
      } catch (error) {
        // Fallback to KJV and ASV
        setTranslations([
          { id: 2, abbreviation: "ASV", version: "American Standard Version" },
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

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load books based on current language
        let booksData;
        if (selectedLanguage === "en") {
          // Use existing English API with local caching
          const cachedData = await loadBibleData();
          booksData = Array.isArray(cachedData?.books) ? cachedData.books : [];
        } else {
          // Use API.Bible for other languages
          const apiBooks = await fetchBibleBooks(selectedLanguage);
          booksData = Array.isArray(apiBooks) ? apiBooks : [];
        }

        // Ensure we always have an array
        if (!Array.isArray(booksData)) {
          throw new Error("Invalid books data format");
        }

        // Process books data
        setBooks(booksData);

        // Filter OT/NT books with proper fallbacks

        const otBooks = booksData.filter((book) => {
          const testament = book.testament?.toUpperCase();
          const bookId = String(book.id); // Convert to string to handle both number and string IDs

          return (
            testament === "OT" ||
            testament === "OLD TESTAMENT" ||
            (bookId && (bookId.includes("GEN") || parseInt(bookId) <= 39))
          );
        });

        const ntBooks = booksData.filter((book) => {
          const testament = book.testament?.toUpperCase();
          const bookId = String(book.id); // Convert to string to handle both number and string IDs

          return (
            testament === "NT" ||
            testament === "NEW TESTAMENT" ||
            (bookId && (bookId.includes("MAT") || parseInt(bookId) > 39))
          );
        });

        setOldTestamentBooks(otBooks);
        setNewTestamentBooks(ntBooks);
      } catch (err) {
        console.error("Failed to load books:", err);
        setError(
          `Failed to load ${LANGUAGES[selectedLanguage]?.name || "Bible"}`
        );

        // Fallback to English if other language fails
        if (selectedLanguage !== "en") {
          setselectedLanguage("en");
        }
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [selectedLanguage]);

  const navigateTo = (view) => {
    setCurrentView(view);
  };

  // FUNCTION TO FETCH CHAPTERS
  const handleBookPress = async (book) => {
    if (!book || !book.id) {
      console.error("Invalid book data:", book);
      return;
    }

    try {
      let chaptersData;

      if (selectedLanguage !== "en") {
        // ✅ Use API.Bible dynamic chapter fetch
        chaptersData = await fetchChaptersForBook(selectedLanguage, book.id);
      } else {
        // ✅ Fallback for English using hardcoded count
        chaptersData = Array.from(
          { length: book.chapterCount || 1 },
          (_, i) => ({
            chapterId: i + 1,
            bookId: book.id,
          })
        );
      }

      setSelectedBook(book);
      setChapters(chaptersData);
      setVerses([]);
      setError(null);
      navigateTo("chapters");
    } catch (error) {
      setError("Unable to load chapters. Please try again.");
    }
  };

  // // function to load verses whenever chapter is selected

  const handleChapterPress = async (chapter) => {
    try {
      setLoading(true);
      setSelectedChapter(chapter.chapterId);

      const response = await fetchChapter(
        chapter.bookId,
        chapter.chapterId,
        selectedLanguage // ✅ Pass the selected language here
      );

      console.log("📦 Chapter raw response:", response);

      let versesArray = response.verses?.[0] || [];
      if (!Array.isArray(versesArray)) versesArray = [];

      const formattedVerses = versesArray.map((verse, index) => {
        const verseId = verse?.verseId ?? index + 1;
        return {
          id: verse?.id ?? `${chapter.bookId}-${chapter.chapterId}-${verseId}`,
          verseId: verseId,
          text: verse?.verse ?? verse?.text ?? `Verse ${verseId}`, // ✅ fallback for local language
        };
      });

      console.log(
        "✅ Formatted verses from handleChapterPress:",
        formattedVerses
      );

      setVerses(formattedVerses);
      navigateTo("verses");
    } catch (err) {
      console.error("❌ Verse loading failed:", err);
      setVerses([]);
      setError("Couldn't load verses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to format book name (first 3 letters, except for numbered books)
  const formatBookName = (name) => {
    if (selectedLanguage !== "en") {
      return name; // Full book name for local languages
    }

    // Keep abbreviating for English
    if (/^\d/.test(name)) {
      return name.substring(0, 5).toUpperCase();
    }
    return name.substring(0, 3).toUpperCase();
  };

  const renderBookItem = ({ item }) => {
    const columnCount = selectedLanguage === "en" ? 5 : 3;
    const itemWidth = (Dimensions.get("window").width - 40) / columnCount;

    // Check if the selected language is a local one
    const isLocalLanguage = ["yo", "ig", "hau"].includes(selectedLanguage);

    const displayName = isLocalLanguage
      ? item.name.toUpperCase()
      : formatBookName(item.name);

    return (
      <TouchableOpacity
        style={[styles.bookItem, { width: itemWidth }]}
        onPress={() => handleBookPress(item)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.bookText,
            isLocalLanguage && { fontSize: 11 }, // 👈 Adjust this size as you like
          ]}
        >
          {displayName}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderChapterItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chapterItem}
      onPress={() => handleChapterPress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.chapterText}>{item.chapterId}</Text>
    </TouchableOpacity>
  );

  const renderVerseItem = ({ item }) => {
    const verseNumber = item.verseId || item.id || "?";
    const verseText = item.verse || item.text || "Verse not available";
    const isSelected = selectedVerseItem?.verseId === verseNumber;
    const isActive = currentReadingVerseId === item.verseId;

    return (
      <View
        style={[
          styles.verseContainer,
          isSelected && styles.selectedVerse,
          isActive && { backgroundColor: "#DFF8E8" },
        ]}
        key={`verse-${item.id || verseNumber}`}
      >
        <TouchableOpacity
          onPress={() => {
            if (isSelected) {
              setSelectedVerseItem(null);
              setShowActionBox(false);
            } else {
              setSelectedVerseItem(item);
              setShowActionBox(true);
            }
          }}
          style={{ paddingBottom: 10 }}
        >
          <View style={styles.verseChapterWrapper}>
            <Text style={styles.verseNumber}>
              {selectedBook?.name} {selectedChapter}:{verseNumber}.
            </Text>
            <TouchableOpacity onPress={() => setActiveVerseId(item.verseId)}>
              <Entypo
                name={
                  activeVerseId === item.verseId
                    ? "cross"
                    : "dots-three-horizontal"
                }
                size={20}
                color="#777"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.verseText}>{verseText}</Text>

          {isLoadingTranslation && verseNumber === 1 && (
            <ActivityIndicator size="small" style={styles.loadingIndicator} />
          )}
        </TouchableOpacity>

        {isSelected && showActionBox && (
          <View style={styles.actionBox}>
            <Text style={styles.actionText}>Explain with Bible Teacher?</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.yesButton}
                onPress={() => {
                  setShowActionBox(false);
                  navigation.navigate("AIScreen", {
                    verse: item,
                    reference: `${selectedBook?.name} ${selectedChapter}:${verseNumber}`,
                  });
                }}
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
        {activeVerseId === item.verseId && (
          <VerseMenu
            verse={{
              verseId: item.verseId,
              verseText: item.text,
              selectedBook: selectedBook,
              selectedChapter: selectedChapter,
            }}
            onClose={() => setActiveVerseId(null)}
            onCopy={() => {
              // Optional callback if you want to track copied verses
            }}
            onHighlight={(color) => {
              // Optional: store highlighted verses here
            }}
            onFavorite={() => {
              // Optional: store favorites here
            }}
          />
        )}
      </View>
    );
  };

  // Displays the grid for selecting a verse
  const VerseSelector = ({ verses, onSelectVerse, onClose }) => (
    <View style={styles.verseSelectorContainer}>
      <View style={styles.verseSelectorHeader}>
        <Text style={styles.verseSelectorTitle}>Select Verse</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={verses}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.verseSelectorOption}
            onPress={() => onSelectVerse(item.verseId || item.id)}
            // onSelectVerse={handleVerseSelect}
          >
            <Text style={styles.verseSelectorText}>
              {item.verseId || item.id}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => `verse-option-${item.verseId || item.id}`}
        numColumns={5}
        contentContainerStyle={[
          styles.verseOptionsGrid,
          {
            opacity: showVerseSelector ? 1 : 0,
            transform: [
              {
                translateY: showVerseSelector ? 0 : 20,
              },
            ],
            transition: "opacity 300ms, transform 300ms",
          },
        ]}
      />
    </View>
  );

  // Displays the full list of verses (either translated or default)
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

  const renderLanguageSelector = () => (
    <View style={styles.languageSelector}>
      <TouchableOpacity
        onPress={() => setShowLanguageSelector(true)}
        style={styles.languageButton}
      >
        <Text style={styles.selectedLanguage}>
          {LANGUAGES[selectedLanguage].name}
        </Text>
        <Icon name="chevron-down" size={24} color="#fff" stokeWidth="10" />
      </TouchableOpacity>

      <Modal visible={showLanguageSelector} transparent animationType="fade">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Language</Text>

          {/* English option */}
          <TouchableOpacity
            style={styles.languageOption}
            onPress={() => {
              setselectedLanguage("en");
              setShowLanguageSelector(false);
            }}
          >
            <Text>English</Text>
            {selectedLanguage === "en" && (
              <Icon name="check" size={20} color="green" />
            )}
          </TouchableOpacity>

          {/* Other languages */}
          {Object.entries(LANGUAGES).map(
            ([code, lang]) =>
              code !== "en" && (
                <TouchableOpacity
                  key={code}
                  style={styles.languageOption}
                  onPress={() => {
                    setselectedLanguage(code);
                    setShowLanguageSelector(false);
                  }}
                >
                  <Text>{lang.name}</Text>
                  {selectedLanguage === code && (
                    <Icon
                      name="check"
                      size={24}
                      color="green"
                      stokeWidth="10"
                    />
                  )}
                </TouchableOpacity>
              )
          )}

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowLanguageSelector(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );

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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Books View */}
      {currentView === "books" && (
        <>
          <View style={styles.tabContainer}>
            {selectedLanguage === "en" ? (
              // ✅ OT/NT toggle section
              <View style={styles.toggleTabs}>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === "old" && styles.activeTab,
                  ]}
                  onPress={() => setActiveTab("old")}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "old" && styles.activeTabText,
                    ]}
                  >
                    OT
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    activeTab === "new" && styles.activeTab,
                  ]}
                  onPress={() => setActiveTab("new")}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "new" && styles.activeTabText,
                    ]}
                  >
                    NT
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              // ✅ Language header for local languages
              <View style={styles.languageHeader}>
                <Text style={styles.languageHeaderText}>
                  Bible in{" "}
                  {LANGUAGES[selectedLanguage]?.name || "Selected Language"}
                </Text>
              </View>
            )}

            {/* ✅ Always show language selector */}
            {renderLanguageSelector()}
          </View>

          {/* ✅ FlatList comes below */}
          <FlatList
            data={
              selectedLanguage === "en"
                ? activeTab === "old"
                  ? oldTestamentBooks
                  : newTestamentBooks
                : books
            }
            renderItem={renderBookItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={selectedLanguage === "en" ? 5 : 3}
            key={`book-list-${selectedLanguage}-${
              selectedLanguage === "en" ? activeTab : "all"
            }`}
            contentContainerStyle={styles.booksGrid}
          />
        </>
      )}

      {/* Chapters View */}
      {currentView === "chapters" && (
        <View style={styles.chaptersContainer}>
          <View style={styles.chapterHeader}>
            {/* back to books button */}
            <TouchableOpacity
              onPress={() => navigateTo("books")}
              style={styles.backButton}
            >
              <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "column",
                alignItems: "flexstart",
                // justifyContent: "center",
                flex: 1,
                // paddingLeft: 50,
              }}
            >
              {/* select chapter */}
              <Text style={styles.chapterTitle}>Select Chapter</Text>
              <Text style={styles.bookTitle}>{selectedBook?.name}</Text>
            </View>
          </View>

          <FlatList
            data={chapters}
            renderItem={renderChapterItem}
            keyExtractor={(item) => `${item.bookId}-${item.chapterId}`}
            numColumns={5}
            contentContainerStyle={styles.chaptersGrid}
          />
        </View>
      )}

      {/* Verses View */}
      {currentView === "verses" && (
        <View style={styles.versesContainer}>
          {/* Horizontal Scrollable Header */}
          <View style={{ marginTop: 30 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalHeader}
            >
              {/* Chapter Selector */}
              <TouchableOpacity
                onPress={() => navigateTo("chapters")}
                style={styles.headerButton}
              >
                <Text style={styles.headerButtonText}>
                  Ch. {selectedChapter}
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

              <TranslationSelector
                translations={translations}
                currentTranslation={currentTranslation}
                onSelectTranslation={(selected) => {
                  setCurrentTranslation(selected);
                }}
              />

              {/* Placeholder for Audio Bible */}
              <TouchableOpacity style={styles.headerButton}>
                onPress={toggleSpeech}
                <Ionicons name="volume-medium" size={20} color="white" />
              </TouchableOpacity>

              {/* Placeholder for AI Assistance */}
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
                {/* <MaterialIcons name="live-help" size={20} color="white" /> */}
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* book name component */}
          <View style={styles.bookChapterTitle}>
            <AntDesign name="arrowleft" size={18} color="blue" />
            <TouchableOpacity
              onPress={() => navigateTo("books")}
              style={styles.headerButton}
            >
              <Text style={styles.verseHeaderTitle}>
                {selectedBook?.name} {selectedChapter}
              </Text>
            </TouchableOpacity>
            {/* <AntDesign name="arrowright" size={18} color="blue" /> */}
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
              `verse-${currentTranslation.abbreviation}-${item.id}`
            }
            getItemLayout={(data, index) => ({
              length: 190,
              offset: 190 * index,
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
                <ActivityIndicator
                  size="small"
                  style={styles.loadingIndicator}
                />
              ) : null
            }
          />

          <View
            style={{
              position: "absolute",
              bottom: 60,
              right: 18,
              flexDirection: "column",
              // backgroundColor: "red",
              padding: 4,
            }}
          >
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
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: "row",
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#4263eb",
    elevation: 2,
    marginTop: 40,
    alignItems: "center",
    justifyContent: "space-around",
    width: "96%",
    marginHorizontal: "auto",
  },
  tabButton: {
    padding: 10,
    alignItems: "center",
    width: "100px",
    // backgroundColor: "#ccc",
  },
  activeTab: {
    backgroundColor: "#495057",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  activeTabText: {
    color: "#B3E5FC",
  },
  booksGrid: {
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  bookItem: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 2,
    elevation: 1,
    aspectRatio: 1,
    padding: 3,
  },
  bookText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4263eb",
    // color: "#343a40",
  },
  chaptersContainer: {
    flex: 1,
    // backgroundColor: "#4263eb",
    backgroundColor: "#f8f9fa",
    marginTop: 26,
    paddingBottom: 50,
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
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 40,
  },
  bookTitle: {
    fontSize: 17,
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
  versesContainer: {
    flex: 1,
    // backgroundColor: "red",
    backgroundColor: "#fff",
    marginTop: 26,
    position: "relative",
    paddingBottom: 100,
  },
  verseHeader: {
    padding: 10,
    backgroundColor: "#4263eb",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: "#000",
  },
  verseHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    fontStyle: "underline",
  },
  versesList: {
    padding: 16,
  },
  verseContainer: {
    marginBottom: 10,
    marginTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingHorizontal: 10,
    minHeight: 100,
    flexWrap: "wrap",
    overflow: "hidden",
  },
  verseNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4263eb",
    marginRight: 8,
    lineHeight: 22,
  },
  verseText: {
    fontSize: 16,
    lineHeight: 25,
    flex: 1,
    color: "#333",
    textAlign: "justify",
    fontWeight: "400",
    fontStyle: "italic",
  },
  verseChapterWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 3,
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
    backgroundColor: "#eee",
    // backgroundColor: "#f0f4ff",
    borderLeftWidth: 3,
    borderLeftColor: "#4263eb",
  },

  languageSelector: {
    alignItems: "center",
    alignSelf: "flex-end",
  },
  selectedLanguage: {
    marginRight: 10,
    fontWeight: "bold",
    fontSize: 17,
    color: "#B3E5FC",
    // color: "#495057",
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    // backgroundColor: "#4263eb",
    borderRadius: 5,
  },
  modalContent: {
    // flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFDEE9",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
  versesContainer: {
    flex: 1,
    backgroundColor: "#fff",
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
  headerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  translationContainer: {
    // height: 50,
    width: 100,
    marginRight: 10,
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    // backgroundColor: "#4263eb",
    borderRadius: 5,
  },
  translationPicker: {
    color: "#fff",
    // height: 40,
    // width: 80,
    fontSize: 20,
    // backgroundColor: "#4263eb",
    borderRadius: 5,
    fontWeight: "bold",
  },
  bookChapterTitle: {
    // padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    flexDirection: "row",
    gap: 20,
  },
  verseHeaderTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
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
  languageHeader: {
    alignItems: "center",
    // marginBottom: 10,
    // marginTop: 40,
  },
  languageHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#B3E5FC",
  },
  toggleTabs: {
    flexDirection: "row",
    padding: 1,
    gap: 10,
    // backgroundColor: "#495057",
    width: 100,
  },
});

export default BibleScreen;
