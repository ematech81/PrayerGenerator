import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { use } from "react";
import { useNavigation } from "@react-navigation/native";

const PrayerPoint = () => {
  const Navigation = useNavigation();

  return (
    <View style={styles.prayerContainer}>
      <View style={styles.containerWrapper}>
        <View style={styles.prayerPointContainer}>
          {/* <View> */}
          <View
            style={{
              width: 8,
              height: 8,
              backgroundColor: "#3edc65",
              borderRadius: 2,
              marginRight: 6,
              borderRadius: 100,
            }}
          ></View>
          <Text style={styles.prayerPointHeading}>Prayer Point</Text>
        </View>

        <View style={{}}>
          <Pressable onPress={() => Navigation.navigate("PrayerPointScreen")}>
            <Text style={{ color: "#000", fontSize: 11, paddingRight: 10 }}>
              See all
            </Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.textInstruction}>
        Select any topic to generate prayer Points
      </Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.row}>
          <View style={[styles.box, styles.box1]}>
            <Text style={styles.text}>Healing</Text>
          </View>
          <View style={[styles.box, styles.box2]}>
            <Text style={styles.text}>Depression</Text>
          </View>
          <View style={[styles.box, styles.box3]}>
            <Text style={styles.text}>Fear</Text>
          </View>
          <View style={[styles.box, styles.box4]}>
            <Text style={styles.text}>Peace</Text>
          </View>
          {/* Add more boxes as needed */}
        </View>
      </ScrollView>
    </View>
  );
};

export default PrayerPoint;

const styles = StyleSheet.create({
  prayerContainer: {
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
    backgroundColor: "#dbea",
  },

  prayerPointHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 6,
  },
  scrollContainer: {
    padding: 10,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  box: {
    width: "48%",
    //     backgroundColor: "#14314f",
    marginBottom: 10,
    padding: 16,
    borderRadius: 8,
  },
  textInstruction: {
    //     color: "#fff",
    fontSize: 14,
    //     fontWeight: "bold",
    marginLeft: 10,
    lineHeight: 22,
  },

  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  box1: {
    backgroundColor: "#992c55",
  },
  box2: {
    backgroundColor: "#45374e",
  },
  box3: {
    backgroundColor: "#f19727",
  },
  box4: {
    backgroundColor: "#3d79c2",
  },
  containerWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  prayerPointContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
