import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import React from "react";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const ChildrenBibleAndAearch = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Bible card 60 % */}
      <TouchableOpacity
        style={[styles.cardBase, styles.bibleCard]}
        onPress={() => navigation.navigate("ChildrenLandingScreen")}
      >
        <ImageBackground
          source={require("../assets/childrenImgButton.png")}
          style={styles.cardImg}
        >
          <View style={styles.textContainer}>
            <Text style={styles.childrenText}>Children</Text>
            <Text style={styles.childrenText}>Bible</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      {/* Search card 30 % */}
      <TouchableOpacity
        style={[styles.songCard]}
        onPress={() => console.log("Song pressed")}
      >
        <View style={styles.centeredContent}>
          <Ionicons name="search" size={24} color="#fff" strokeWidth="10" />
          <Text
            style={{
              marginTop: 8,
              fontWeight: "bold",
              color: "#ccc",
              textAlign: "center",
            }}
          >
            Search Bible
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ChildrenBibleAndAearch;

const styles = StyleSheet.create({
  /* row container */
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    //     backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 2,
  },
  centeredContent: {
    justifyContent: "center",
    alignItems: "center",
    //     backgroundColor: "red",
  },

  /* individual sizes */
  bibleCard: { width: "60%" },

  songCard: {
    width: 100,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 2,
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
  },
  //
  cardImg: {
    width: 200,
    height: 100,
    justifyContent: "flex-end", // Push content to bottom
    alignItems: "flex-start", // Align text to the left
    padding: 10, // Add spacing inside the image
    borderRadius: 12,
    overflow: "hidden",
  },
  textContainer: {
    flexDirection: "column",
  },
  childrenText: {
    color: "#FF5722",
    fontSize: 20,
    fontWeight: "bold",
  },
});
