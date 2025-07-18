import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBible } from "../contex/BibleContext";

const palette = [
  { backgroundColor: "#b3e5fc" },
  { backgroundColor: "#c8e6c9" },
  { backgroundColor: "#fff9c4" },
  { backgroundColor: "#ffe0b2" },
];

const PrayerPoint = () => {
  const navigation = useNavigation();
  const { getDailyTopics } = useBible();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    setTopics(getDailyTopics());
  }, [getDailyTopics]);

  const openPrayerScreen = (id, name) => {
    navigation.navigate("Prayer", { topicId: id, topicName: name });
  };

  return (
    <View style={styles.prayerContainer}>
      {/* heading */}
      <View style={styles.containerWrapper}>
        <View style={styles.prayerPointContainer}>
          <View style={styles.bullet} />
          <Text style={styles.prayerPointHeading}>Prayer Point</Text>
        </View>

        <Pressable onPress={() => navigation.navigate("PrayerGenerator")}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>

      <Text style={styles.textInstruction}>
        Select any topic to generate Prayer Points
      </Text>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.row}>
          {topics.map((t, i) => (
            <Pressable
              key={t._id}
              onPress={() => openPrayerScreen(t._id, t.topic)}
            >
              <View style={[styles.box, palette[i % palette.length]]}>
                <Text style={styles.text}>{t.topic}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  prayerContainer: { marginBottom: 24, padding: 16 },
  containerWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prayerPointContainer: { flexDirection: "row", alignItems: "center" },
  bullet: {
    width: 10,
    height: 10,
    backgroundColor: "#3edc65",
    borderRadius: 100,
    marginRight: 6,
  },
  prayerPointHeading: { fontSize: 18, fontWeight: "700", color: "#fff" },
  seeAll: { color: "#ccc", fontSize: 14, paddingRight: 10 },
  textInstruction: { marginVertical: 8, color: "#fff" },
  scrollContainer: { paddingVertical: 4 },
  row: { flexDirection: "row", gap: 8 },
  box: {
    Width: "45%",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
    minHeight: 150,
    flexDirection: "row",
  },
  text: { fontSize: 14, fontWeight: "600" },
});

export default PrayerPoint;
