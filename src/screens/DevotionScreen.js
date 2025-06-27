import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { MotiView } from "moti";
import CommentSection from "../component/ComentSection";
import { devotion } from "../constant/DummyDevtion";
import devotionImg from "../assets/devotionImg.jpg";
import { useNavigation } from "@react-navigation/native";

const DevotionScreen = () => {
  const { width } = Dimensions.get("window");
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Image */}
        <Image
          source={devotionImg}
          style={[styles.headerImage, { width: width }]}
          resizeMode="cover"
        />
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Go Back Home</Text>
          </TouchableOpacity>
        </>
        {/* Title */}
        <Text style={styles.title}>{devotion.title}</Text>
        <Text style={styles.date}>{devotion.date}</Text>

        {/* Introduction with animation */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 900 }}
          style={styles.section}
        >
          <Text style={styles.sectionIntro}>{devotion.introduction}</Text>
        </MotiView>

        {/* Key Verses */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Key Scriptures</Text>
          {devotion.keyVerses?.map((verse, index) => (
            <Text key={index} style={styles.keyVerse}>
              <Text style={{ fontStyle: "italic" }}>{verse.text}</Text>{" "}
              <Text style={styles.verseRef}>({verse.reference})</Text>
            </Text>
          ))}
        </View>

        {/* Devotion Sections */}
        {devotion.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionHeading}>{section.heading}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        {/* Reflection Questions */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Reflection Questions</Text>
          {devotion.reflectionQuestions.map((q, i) => (
            <Text key={i} style={styles.bulletPoint}>
              • {q}
            </Text>
          ))}
        </View>

        {/* Prayer */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Prayer</Text>
          <Text style={styles.prayer}>{devotion.prayer}</Text>
        </View>

        {/* comment section */}
        <CommentSection />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
    backgroundColor: "#ffffff",
  },
  headerImage: {
    height: 200,
    //     borderRadius: 16,
    marginBottom: 20,
    alignSelf: "center",
    marginTop: 10,
  },
  button: {
    alignSelf: "flex-end",
    marginBottom: 5,
    // backgroundColor: "#2563eb", // Blue color
  },
  buttonText: {
    // color: "#ffffff",
    fontSize: 11,
    // fontWeight: "600",
    textAlign: "center",
    fontStyle: "italic",
    textDecoration: "underline",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e", // Light gray border
  },
  sectionIntro: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
    fontStyle: "italic",
  },
  sectionContent: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 28,
  },
  bulletPoint: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 6,
  },
  prayer: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#1e293b",
    lineHeight: 24,
  },
  keyVerse: {
    fontSize: 16,
    color: "#b91c1c", // Deep warm red
    lineHeight: 24,
    marginBottom: 10,
    fontStyle: "italic",
    borderBottomColor: "#e5e7eb", // Light gray border
    borderBottomWidth: 1,
  },

  verseRef: {
    fontSize: 14,
    color: "#9b1c1c",
    fontStyle: "normal",
  },
});

export default DevotionScreen;
