import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";

const DailyBibleReading = () => {
  const Navigation = useNavigation();

  return (
    <>
      <TouchableOpacity
        onPress={() => Navigation.navigate("DailyReadingScreen")}
      >
        <View style={styles.bibleReadingContainer}>
          <View style={styles.readingHeading}>
            {/* <View> */}
            <View
              style={{
                width: 10,
                height: 10,
                backgroundColor: "#3edc65",
                borderRadius: 2,
                marginRight: 6,
                borderRadius: 100,
              }}
            ></View>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: "##14314f",
                marginBottom: 6,
              }}
            >
              Daily Reading
            </Text>

            {/* </View> */}
          </View>
          <View style={styles.scriptreContainer}>
            <View style={styles.cont}>
              <View style={styles.roundView}></View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text
                  style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}
                >
                  Dialy Scripture
                </Text>
                <Text style={{ color: "#fff", fontSize: 13 }}>Psalm 23:1</Text>
              </View>
            </View>
            {/* read all */}
            <View style={styles.readAllContainer}>
              <Text style={{ color: "#fff", fontSize: 14, paddingRight: 10 }}>
                Read all
              </Text>
              <AntDesign name="right" size={20} color="white" strokeWidth="2" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default DailyBibleReading;

const styles = StyleSheet.create({
  bibleReadingContainer: {
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
    height: 150,
    // backgroundColor: "#fff",
    // elevation: 1,
  },
  cont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    // backgroundColor: "#ccc",
    flex: 1,
  },
  readingHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    // backgroundColor: "#ccc",
  },
  scriptreContainer: {
    width: "100%",
    height: 100,
    backgroundColor: "#10181a",
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 6,
    // paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  roundView: {
    width: 40,
    height: 40,
    backgroundColor: "#3edc65",
    borderRadius: 25,
    //   alignSelf: 'center',
    //   marginTop: 20,
  },
  readAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    alignSelf: "flex-end",
    marginTop: 4,
  },
});
