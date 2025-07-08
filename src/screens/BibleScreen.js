import React, {
  useState,
  useEffect,
  useRef,
  useReducer,
  useCallback,
} from "react";
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

import AntDesign from "@expo/vector-icons/AntDesign";
import { LANGUAGES } from "../constant/BibleTranslations";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  fetchBibleBooks,
  fetchChapterCount,
  fetchChaptersForBook,
} from "../utils/apiService";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";

const BibleScreen = () => {
  // State management
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chapters, setChapters] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("old");
  const [selectedLanguage, setselectedLanguage] = useState("en"); // Defaultish
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [oldTestamentBooks, setOldTestamentBooks] = useState([]);
  const [newTestamentBooks, setNewTestamentBooks] = useState([]);

  // Navigation state
  const [selectedBook, setSelectedBook] = useState(null);
  const navigation = useNavigation();

  // const route = useRoute();

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

  const handleBookPress = async (book) => {
    if (!book?.id) {
      console.error("Invalid book selected");
      return;
    }

    try {
      let chaptersData;

      if (selectedLanguage === "en") {
        // Fetch chapter count (safe fallback)
        const count = await fetchChapterCount(book.id);
        chaptersData = Array.from({ length: count }, (_, i) => ({
          chapterId: i + 1,
          bookId: book.id,
        }));
      } else {
        // Fetch from API.Bible
        chaptersData = await fetchChaptersForBook(selectedLanguage, book.id);
      }

      setSelectedBook(book);
      setChapters(chaptersData);
      // setVerses([]);
      setError(null);

      navigation.navigate("ChaptersScreen", {
        selectedBook: book,
        chapters: chaptersData,
        selectedLanguage,
      });
    } catch (error) {
      console.error("Unable to load chapters:", error);
      setError("Unable to load chapters. Please try again.");
    }
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
      <View style={{ width: "100%" }}>
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
      </View>
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
    marginBottom: 16,
    // borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#4263eb",
    elevation: 2,
    marginTop: 40,
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    // marginHorizontal: "auto",
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
