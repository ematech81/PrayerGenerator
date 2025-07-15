import React, { use, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { MotiView } from "moti";
import { useNavigation } from "@react-navigation/native";
import bibleReading from "../assets/bibleReading.png";

const { width } = Dimensions.get("window");

const prayerImage = require("../assets/prayer-hand.jpg");

const steps = [
  {
    title: "Step 1: Be Still & Focus",
    description:
      "Find a quiet place. Sit or stand comfortably. Take a few deep breaths. Let go of distractions and be present in the moment.",
  },
  {
    title: "Step 2: Invite God's Presence",
    description:
      "Whisper a simple prayer: 'Holy Spirit, please come and fill this space.' God hears and honors your invitation.",
  },
  {
    title: "Step 3: Thank God for Today",
    description:
      "Start with gratitude. Say 'Thank You' for life, health, peace, or anything else. Gratitude opens your heart.",
  },
  {
    title: "Step 4: Speak from Your Heart",
    description:
      "Talk to God like a close friend. Share your thoughts, emotions, and needs. Just be real and honest.",
  },
  {
    title: "Step 5: Pray the Prayer Points",
    description:
      "Use the prayer points provided. Say them aloud or silently. Reflect on each one. Add your own words too.",
  },
  {
    title: "Step 6: Listen in Silence",
    description:
      "After praying, stay quiet for a moment. Let God speak to your heart. Feel the peace, clarity, or comfort.",
  },
  {
    title: "Step 7: Close with Faith",
    description:
      "End by saying something like, 'Thank You, Lord. I believe You’ve heard me. Amen.' Trust God is working.",
  },
];

const HowToPrayScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  const { width } = Dimensions.get("window");

  const navigation = useNavigation();

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // const Image = require("../assets/prayer-hand.jpg");

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: "#ff008c", fontSize: 16 }}>Close</Text>
      </TouchableOpacity>
      <Image
        source={prayerImage}
        resizeMode="cover"
        style={[styles.headerImage, { width: width }]}
      />

      <Text style={styles.guidedPrayer}>Guided Prayer</Text>
      <MotiView
        key={currentStep}
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 400 }}
        style={styles.card}
      >
        <Text style={styles.title}>{steps[currentStep].title}</Text>
        <Text style={styles.description}>{steps[currentStep].description}</Text>
      </MotiView>

      <View style={styles.navButtons}>
        <TouchableOpacity onPress={goBack} disabled={currentStep === 0}>
          <ArrowLeft size={28} color={currentStep === 0 ? "#ccc" : "#ff008c"} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goNext}
          disabled={currentStep === steps.length - 1}
        >
          <ArrowRight
            size={28}
            color={currentStep === steps.length - 1 ? "#ccc" : "#ff008c"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.indicatorWrapper}>
        {steps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicatorDot,
              currentStep === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default HowToPrayScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#071738",
    // paddingHorizontal: 16,
    justifyContent: "center",
    paddingBottom: 70,
  },
  headerImage: {
    height: 200,
    // borderRadius: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 20,
    width: 80,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
  },
  card: {
    // backgroundColor: "#f9f9f9",
    padding: 16,
    width: "96%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ccc",
    textAlign: "center",
    fontStyle: "underline",
  },
  guidedPrayer: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#3dc1ee",
    textAlign: "center",
    fontStyle: "underline",
  },
  description: {
    fontSize: 18,
    color: "#eee",
    textAlign: "center",
    lineHeight: 24,
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    paddingHorizontal: 40,
  },
  indicatorWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  indicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: "#ccc",
  },
  activeDot: {
    backgroundColor: "#ff008c",
  },
});
