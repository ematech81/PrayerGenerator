import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { devotion } from "../constant/DummyDevtion";
import bibleReading from "../assets/bibleReading.png";
import { getTodayDayIndex } from "../utils/dateHelper";
import { dailyDevotionDatabase } from "../Database/dailyDevotionDatabase"; // Uncomment if using local data
import { fetchEnglishBooks } from "../utils/apiService";
import { getFormattedToday } from "../utils/TodayDate";
// import { formatStyledText } from "./DevotionScreen";

// 👇 Helper to format **bold** text
const formatStyledText = (text) => {
  const elements = [];

  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;

  const matches = text.matchAll(regex);

  for (const match of matches) {
    const matchText = match[0];
    const index = match.index;

    // Push text before the match
    if (index > lastIndex) {
      elements.push(text.substring(lastIndex, index));
    }

    // Style match
    if (matchText.startsWith("**")) {
      elements.push(
        <Text key={index} style={{ fontWeight: "bold" }}>
          {matchText.slice(2, -2)}
        </Text>
      );
    } else if (matchText.startsWith("*")) {
      elements.push(
        <Text key={index} style={{ fontStyle: "italic" }}>
          {matchText.slice(1, -1)}
        </Text>
      );
    }

    lastIndex = index + matchText.length;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements;
};

const DailyReadingScreen = () => {
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");

  const todayIndex = getTodayDayIndex();
  // const todayIndex = 1;
  const todayDevotion = dailyDevotionDatabase.find((d) => d.day === todayIndex);
  console.log("TodayIndex:", todayIndex);
  console.log(
    "Available days:",
    dailyDevotionDatabase.map((d) => d.day)
  );

  const handleReadingTap = async (bookName, chapter, verse = 1) => {
    try {
      const allBooks = await fetchEnglishBooks();

      const selectedBook = allBooks.find(
        (b) => b.name.toLowerCase() === bookName.toLowerCase()
      );

      if (!selectedBook) {
        console.warn(`Book not found: ${bookName}`);
        return;
      }

      navigation.navigate("VerseScreen", {
        selectedBook,
        selectedChapter: chapter,
        selectedVerse: verse,
        fromDailyReading: true, // 👈 Add this flag
      });
    } catch (err) {
      console.error("Error fetching book for daily reading:", err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Image */}
      <Image
        source={bibleReading}
        resizeMode="cover"
        style={[styles.headerImage, { width: width }]}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonTextBack}>Go Back Home</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Daily Bible Reading</Text>
      <Text style={styles.date}>Today, {getFormattedToday()}</Text>

      {/* Subheading */}
      <Text style={styles.subheading}>Spend time in God’s Word today</Text>

      {/* Reading List */}
      <View style={styles.readingContainer}>
        <Text style={styles.readingHeader}>📖 Today's Reading:</Text>

        {todayDevotion ? (
          todayDevotion.readings.map((reading, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                handleReadingTap(
                  reading.book,
                  reading.chapter,
                  reading.startVerse
                )
              }
            >
              <Text style={styles.readingItem}>
                {reading.book} {reading.chapter}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.fallbackText}>
            Today's devotion is not available yet. Please check back later.
          </Text>
        )}
      </View>

      {/* Devotion Button */}

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() =>
          navigation.navigate("DevotionScreen", { day: todayIndex })
        }
      >
        <ImageBackground
          source={require("../assets/preImgDevotion.png")}
          style={styles.image}
          imageStyle={{ borderRadius: 12 }}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <Text style={styles.ButtonText}>Check Today’s Devotion</Text>
            <Text style={styles.title}>{todayDevotion?.title}</Text>

            <View style={{ padding: 10 }}>
              <Text style={styles.sectionIntro}>
                {formatStyledText(
                  todayDevotion?.introduction.slice(0, 100) + "..."
                )}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
    backgroundColor: "#9f9171ff",
    alignItems: "center",
  },
  headerImage: {
    height: 200,
    marginBottom: 20,
  },

  date: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 12,
    alignSelf: "flex-start",
    fontWeight: "bold",
  },
  subheading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  readingContainer: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    width: "100%",
  },
  readingHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
    // color: "#111827",
    marginBottom: 8,
    marginBottom: 12,
  },
  readingItem: {
    fontSize: 20,
    color: "#374151",
    marginBottom: 4,
    lineHeight: 24,
    fontWeight: "500",
  },
  button: {
    // backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  ButtonText: {
    color: "#FFCCCC",
    fontSize: 12,
    fontWeight: "bold",

    paddingBottom: 4,

    marginTop: 10,
  },
  buttonTextBack: {
    color: "#333",
    fontSize: 11,
    // fontWeight: "600",
    textAlign: "center",
    fontStyle: "italic",
    textDecoration: "underline",
  },
  buttonContainer: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 20,
  },
  image: {
    flex: 1,
    justifyContent: "flex-start",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 16,
    flex: 1,
    minHeight: 250,
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 6,
    fontStyle: "italic",
  },
  buttonText: {
    fontSize: 14,
    color: "#eee",
  },
  fallbackText: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 12,
  },
  sectionIntro: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#fff",
    lineHeight: 22,
    fontWeight: "bold",
  },
});

export default DailyReadingScreen;
