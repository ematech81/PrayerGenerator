import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  useColorScheme,
  Dimensions,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const stories = [
  {
    id: "noah",
    title: "Noah’s Ark",
    // image: require("../assets/stories/noah.png"),
    shortDescription:
      "God tells Noah to build an ark and save animals from the flood.",
  },
  {
    id: "david",
    title: "David & Goliath",
    // image: require("../assets/stories/david.png"),
    shortDescription: "Young David defeats a giant with God’s help.",
  },
  {
    id: "moses",
    title: "Parting the Red Sea",
    // image: require("../assets/stories/moses.png"),
    shortDescription: "Moses leads the Israelites out of Egypt by God’s power.",
  },
];

export default function KidBibleStoriesScreen() {
  const navigation = useNavigation();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const styles = getStyles(isDarkMode);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Bible Stories</Text>

      {stories.map((story) => (
        <TouchableOpacity
          key={story.id}
          style={styles.card}
          // onPress={() =>
          //   navigation.navigate("StoryDetailScreen", { storyId: story.id })
          // }
        >
          {/* <Image source={story.image} style={styles.image} /> */}
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{story.title}</Text>
            <Text style={styles.cardDescription}>{story.shortDescription}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const getStyles = (isDarkMode) => {
  const backgroundColor = isDarkMode ? "#121212" : "#FFF8F0";
  const textColor = isDarkMode ? "#ffffff" : "#333333";
  const cardBg = isDarkMode ? "#1E1E1E" : "#FFF";
  const baseFontSize = Platform.OS === "ios" ? 16 : 15;
  const cardWidth = SCREEN_WIDTH - 32;

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 16,
      color: textColor,
    },
    card: {
      backgroundColor: cardBg,
      borderRadius: 16,
      marginBottom: 16,
      overflow: "hidden",
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 6,
      width: cardWidth,
      alignSelf: "center",
    },
    image: {
      width: "100%",
      height: SCREEN_WIDTH * 0.5,
    },
    cardContent: {
      padding: 12,
    },
    cardTitle: {
      fontSize: baseFontSize + 2,
      fontWeight: "600",
      marginBottom: 4,
      color: textColor,
    },
    cardDescription: {
      fontSize: baseFontSize,
      color: textColor,
    },
  });
};
