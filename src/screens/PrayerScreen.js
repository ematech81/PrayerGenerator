import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  useColorScheme,
  SafeAreaView,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import DummyPrayer from "../constant/DummyPrayer";

const PrayerScreen = () => {
  const categories = [...new Set(DummyPrayer.map((item) => item.category))];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const isDark = useColorScheme() === "dark";

  const topics = DummyPrayer.filter(
    (item) =>
      item.category === selectedCategory &&
      item.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Load favorites from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem("favorites").then((data) => {
      if (data) setFavorites(JSON.parse(data));
    });
  }, []);

  const handleFavorite = async (topicId) => {
    const updated = favorites.includes(topicId)
      ? favorites.filter((id) => id !== topicId)
      : [...favorites, topicId];
    setFavorites(updated);
    await AsyncStorage.setItem("favorites", JSON.stringify(updated));
  };

  const renderCategoryItem = (category) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryItem,
        selectedCategory === category && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === category && styles.selectedCategoryText,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  const renderTopicItem = ({ item }) => (
    <View style={[styles.topicItem, isDark && { backgroundColor: "#333" }]}>
      <Text style={[styles.topicText, isDark && { color: "#fff" }]}>
        {item.topic}
      </Text>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={styles.goButton}
          onPress={() =>
            navigation.navigate("GeneratedScreen", { topic: item })
          }
        >
          <Text style={styles.goButtonText}>Go</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={() => handleFavorite(item._id)}
        >
          {/* <Text
            style={{ color: favorites.includes(item._id) ? "red" : "gray" }}
          >
            ♥
          </Text> */}
        </TouchableOpacity>
      </View>
    </View>
  );

  const navigation = useNavigation();

  return (
    <View style={[styles.container, isDark && { backgroundColor: "#000" }]}>
      <StatusBar barStyle="light-content" backgroundColor="#071738" />
      <TouchableOpacity
        style={styles.arrowBack}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="arrowleft" size={30} color="#ff008c" />
      </TouchableOpacity>
      <Text style={[styles.title, isDark && { color: "#fff" }]}>
        Prayer Point Generator
      </Text>

      <TextInput
        placeholder="Search topic..."
        placeholderTextColor={isDark ? "#888" : "#666"}
        style={[
          styles.searchBar,
          isDark && { backgroundColor: "#222", color: "#fff" },
        ]}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.categSubHeading}>
        <Text style={styles.categSubHeadingText}>Select Category</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryList}
      >
        {categories.map(renderCategoryItem)}
      </ScrollView>

      <FlatList
        data={topics}
        keyExtractor={(item) => item._id}
        renderItem={renderTopicItem}
        contentContainerStyle={styles.topicList}
      />

      {/* MODAL for Selected Prayer */}
      <Modal visible={!!selectedTopic} animationType="slide" transparent>
        <View
          style={[
            styles.modalOverlay,
            isDark && { backgroundColor: "#000000cc" },
          ]}
        >
          <View
            style={[styles.modalContent, isDark && { backgroundColor: "#222" }]}
          >
            <Text style={[styles.modalTitle, isDark && { color: "#fff" }]}>
              Selected Prayer
            </Text>
            <Text style={[styles.modalTopic, isDark && { color: "#ccc" }]}>
              {selectedTopic?.topic}
            </Text>
            <Text style={[styles.modalText, isDark && { color: "#ddd" }]}>
              Lord, I bring this topic before You. I ask for wisdom, grace, and
              power to walk in this area. Guide me and help me in all things
              concerning "{selectedTopic?.topic}". Amen.
            </Text>
            <TouchableOpacity
              style={[
                styles.closeButton,
                isDark && { backgroundColor: "#555" },
              ]}
              onPress={() => setSelectedTopic(null)}
            >
              <Text style={styles.goButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 50,
    backgroundColor: "#071738",
    paddingBottom: 50,
  },
  arrowBack: {
    padding: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#ffffff",
    fontWeight: "bold",
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "#6f7688",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: "#f1f1f1",
    elevation: 3,
  },

  categoryList: {
    marginBottom: 24,
    paddingVertical: 6, // Add padding for better spacing
    // backgroundColor: "",
    height: 100, // Increased height for better visibility
  },
  categSubHeading: {
    marginVertical: 10,
    padding: 10,
    justifyContent: "flex-start",
    width: "100%",
    // backgroundColor: "red",
  },
  categSubHeadingText: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "500",
    color: "#fff",
  },
  categoryItem: {
    paddingVertical: 10, // Increased for touch-friendly size
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#2e2e2e",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCategory: {
    backgroundColor: "#1e2572",
  },
  categoryText: {
    fontSize: 15,
    color: "#ccc",
    fontWeight: "bold",
  },
  selectedCategoryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  topicList: {
    paddingBottom: 16,
  },
  topicItem: {
    padding: 12,
    backgroundColor: "#321033",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topicText: {
    fontSize: 16,
    flex: 1,
    color: "#ccc",
    fontWeight: "bold",
  },
  goButton: {
    backgroundColor: "#ff008c",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 10,
    width: 80,
    alignItems: "center",
  },
  goButtonText: {
    color: "#ccc",
    fontWeight: "bold",
  },
  favoriteBtn: {
    marginLeft: 8,
    padding: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#ffffffcc",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    height: "auto",
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  modalTopic: {
    fontSize: 16,
    marginBottom: 12,
  },
  modalText: {
    fontSize: 15,
    marginBottom: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    backgroundColor: "#4A90E2",
    padding: 10,
    borderRadius: 8,
  },
});

export default PrayerScreen;
