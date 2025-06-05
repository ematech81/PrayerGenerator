import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";

const Navigation = () => {
  return (
    <View style={styles.navbar}>
      <AntDesign name="user" size={20} color="black" strokeWidth="10" />
      <View style={styles.menu}>
        <Ionicons
          name="notifications-circle"
          size={20}
          color="black"
          strokeWidth="10"
        />
        <Entypo name="menu" size={30} color="black" strokeWidth="10" />
      </View>
    </View>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: '#fff',
    height: 50,
    paddingTop: 4,
    width: "100%",
    marginTop: 30,
    paddingHorizontal: 10,
  },
  menu: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
});
