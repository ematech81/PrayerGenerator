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

const DailyReadingScreen = () => {
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");

  const dailyReading = {
    date: "June 23, 2025",
    image: require("../assets/prayer-hand.jpg"),
    readings: [
      { book: "John", chapter: 15 },
      { book: "Proverbs", chapter: 3 },
      { book: "Isaiah", chapter: 40 },
    ],
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
      <Text style={styles.date}>{dailyReading.date}</Text>

      {/* Subheading */}
      <Text style={styles.subheading}>Spend time in God’s Word today</Text>

      {/* Reading List */}
      <View style={styles.readingContainer}>
        <Text style={styles.readingHeader}>📖 Today's Reading:</Text>
        {dailyReading.readings.map((reading, index) => (
          <Text key={index} style={styles.readingItem}>
            • {reading.book} {reading.chapter}
          </Text>
        ))}
      </View>

      {/* Devotion Button */}

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => navigation.navigate("DevotionScreen")}
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
});

export default DailyReadingScreen;
