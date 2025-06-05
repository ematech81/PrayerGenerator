import { ScrollView, StyleSheet, Text, View, SafeAreaView } from "react-native";
import React from "react";
import SearchInput from "../constant/SearchInput";

const PrayerPointScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Prayer Point Generator</Text>
        </View>
        <SearchInput />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrayerPointScreen;

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 20,
    marginTop: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
});
