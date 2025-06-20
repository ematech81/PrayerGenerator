import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";

const Affirmation = () => {
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
          <Text style={styles.prayerPointHeading}>Affirmations</Text>
        </View>

        <View style={{}}>
          <Text style={{ color: "#000", fontSize: 11, paddingRight: 10 }}>
            See all
          </Text>
        </View>
      </View>

      <Text style={styles.textInstruction}>
        Select any topic to generate prayer Points
      </Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.row}>
          <View style={[styles.box]}>
            <Text style={styles.text}>Business</Text>
          </View>
          <View style={[styles.box]}>
            <Text style={styles.text}>Faith</Text>
          </View>
          <View style={[styles.box]}>
            <Text style={styles.text}>Breakthrough</Text>
          </View>
          <View style={[styles.box]}>
            <Text style={styles.text}>Success</Text>
          </View>
          {/* Add more boxes as needed */}
        </View>
      </ScrollView>
    </View>
  );
};

export default Affirmation;

const styles = StyleSheet.create({
  prayerContainer: {
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ffffff",
    // backgroundColor: "#e4f5ed",
    elevation: 1,
    shadowColor: "#000",
    width: "96%",
    marginHorizontal: "auto",
    elevation: 3,
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
    backgroundColor: "#ccc",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  textInstruction: {
    //     color: "#",
    fontSize: 14,
    //     fontWeight: "bold",
    marginLeft: 10,
    lineHeight: 22,
  },

  text: {
    color: "#1e2572",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  containerWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    // backgroundColor: "#f8f8fa",
  },
  prayerPointContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
