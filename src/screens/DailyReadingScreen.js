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

      {/* Title */}
      <Text style={styles.title}>Daily Bible Reading</Text>
      <Text style={styles.date}>04-06-2025</Text>

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
        onPress={
          (() => navigation.navigate("DevotionScreen"), { day: todayIndex })
        }
      >
        <ImageBackground
          source={require("../assets/preImgDevotion.png")}
          style={styles.image}
          imageStyle={{ borderRadius: 12 }}
        >
          <View style={styles.overlay}>
            <Text style={styles.title}>{devotion.title}</Text>

            <Text style={styles.buttonText}>Check Today’s Devotion</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Go Back Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  headerImage: {
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
    // alignSelf: "center",
    padding: 16,
    textAlign: "center",
  },
  date: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
    alignSelf: "flex-start",
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
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonContainer: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 20,
  },
  image: {
    flex: 1,
    justifyContent: "flex-start",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.1)",
    padding: 16,
  },
  title: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 6,
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
});

export default DailyReadingScreen;
