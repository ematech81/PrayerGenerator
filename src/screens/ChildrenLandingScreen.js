import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Platform,
  Dimensions,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

const { width: SCREEN_WIDTH, height: sreenHeight } = Dimensions.get("window");
// const { height } = Dimensions.get("window");

const palette = [
  { backgroundColor: "#1e2572" },
  { backgroundColor: "#004d40" },
  { backgroundColor: "#321033" },
  { backgroundColor: "#1565c0" },
  { backgroundColor: "#4527a0" },
  { backgroundColor: "#03c988" },
  { backgroundColor: "#3e2723" },
  { backgroundColor: "#ee6a3d" },
];

const topics = [
  { id: "stories", title: "Bible Stories" },
  { id: "quiz", title: "Bible Quiz" },
  { id: "facts", title: "Bible Facts" },
  { id: "names_of_god", title: "Names of God" },
  { id: "apostles", title: "12 Apostles" },
  { id: "angels", title: "Angels" },
  { id: "audio_bible", title: "Audio Bible" },
  { id: "memory_verse", title: "Memory Verse" },
];

export default function ChildrenLandingScreen({ index }) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const styles = getStyles(isDarkMode);

  const onItemPress = (id) => {
    switch (id) {
      case "stories":
        navigation.navigate("KidBibleStoriesScreen");
        break;
      case "prayer":
        navigation.navigate("PrayerScreen");
        break;
      case "ai":
        navigation.navigate("AIAssistanceScreen");
        break;
      case "sermon":
        navigation.navigate("Sermon");
        break;
      case "affirmation":
        navigation.navigate("Affirmation");
        break;
      case "community":
        navigation.navigate("Community");
        break;
      case "scripture":
        navigation.navigate("DailyReadingScreen");
        break;
      case "quiz":
        navigation.navigate("Quiz");
        break;
      default:
        console.warn("Unknown ID:", id);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with image */}

      <ImageBackground
        source={require("../assets/childrenHeaderImage.png")}
        style={styles.headerImage}
        // imageStyle={{
        //   borderBottomLeftRadius: 20,
        //   borderBottomRightRadius: 20,
        // }}
        resizeMode="cover"
      >
        {/* <View style={styles.overlay}>
          <Text style={styles.headerTitle}>CHILDREN BIBLE</Text>
          <Text style={styles.quote}>
            "Train up a child in the way he should go, and when he is old, he
            will not depart from it."
          </Text>
        </View> */}
      </ImageBackground>

      <View style={styles.quoteContainer}>
        <Text style={styles.introText}>
          Select a topic to explore Bible stories, quizzes, facts, and more for
          children.
        </Text>
      </View>

      {/* Grid of buttons */}
      <View style={styles.grid}>
        {topics.map((item, i) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, palette[i % palette.length]]}
            onPress={() => navigation.navigate(item.id)}
          >
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const getStyles = (isDarkMode) => {
  const backgroundColor = isDarkMode ? "#121212" : "#e9e4e7ff";
  // const cardBackground = isDarkMode ? "#333333" : "#FFD966";
  const textColor = isDarkMode ? "#ffffff" : "#fff";

  const baseFont = Platform.OS === "ios" ? 16 : 15;
  const cardSize = SCREEN_WIDTH / 2 - 18;
  const cardHeight = sreenHeight * 0.15;

  return StyleSheet.create({
    container: {
      backgroundColor: backgroundColor,
    },
    headerImage: {
      height: SCREEN_WIDTH * 0.7,
      justifyContent: "center",
      marginHorizontal: 3,
    },
    overlay: {
      // backgroundColor: "rgba(0,0,0,0.3)",
      padding: 16,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },

    quoteContainer: {
      width: "100%",
      padding: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      color: "#081",
      fontSize: 18,
      fontStyle: "italic",
      textAlign: "center",
    },
    quote: {
      color: "#ffffff",
      fontSize: 18,
      fontStyle: "italic",
      textAlign: "center",
    },
    introText: {
      color: "#ff008c",
      fontSize: 20,
      fontStyle: "italic",
      textAlign: "center",
      fontWeight: "bold",
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      padding: 16,
    },
    card: {
      // backgroundColor: cardBackground,
      width: cardSize,
      height: cardHeight,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    cardText: {
      textAlign: "center",
      fontWeight: "bold",
      color: textColor,
      fontSize: baseFont,
    },
  });
};
