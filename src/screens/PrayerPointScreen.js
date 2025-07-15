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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";

// Dummy data with 4 categories and 5 topics each
const DummyPrayer = [
  {
    _id: "1",
    category: "Spiritual Growth & Faith",
    topic: "Growing in the Word",
  },
  {
    _id: "2",
    category: "Spiritual Growth & Faith",
    topic: "Deeper Prayer Life",
  },
  {
    _id: "3",
    category: "Spiritual Growth & Faith",
    topic: "Hearing God's Voice",
  },
  {
    _id: "4",
    category: "Spiritual Growth & Faith",
    topic: "Walking in the Spirit",
  },
  { _id: "5", category: "Spiritual Growth & Faith", topic: "Obedience to God" },
  { _id: "6", category: "Career & Finances", topic: "Financial Wisdom" },
  { _id: "7", category: "Career & Finances", topic: "Career Breakthrough" },
  { _id: "8", category: "Career & Finances", topic: "Business Expansion" },
  { _id: "9", category: "Career & Finances", topic: "Job Favor" },
  { _id: "10", category: "Career & Finances", topic: "Debt Freedom" },
  { _id: "11", category: "Protection & Warfare", topic: "Divine Protection" },
  {
    _id: "12",
    category: "Protection & Warfare",
    topic: "Breaking Strongholds",
  },
  { _id: "13", category: "Protection & Warfare", topic: "Victory in Battles" },
  { _id: "14", category: "Protection & Warfare", topic: "Spiritual Covering" },
  {
    _id: "15",
    category: "Protection & Warfare",
    topic: "Warfare Against Enemies",
  },
  { _id: "16", category: "Family & Relationships", topic: "Peace in Marriage" },
  { _id: "17", category: "Family & Relationships", topic: "Godly Parenting" },
  {
    _id: "18",
    category: "Family & Relationships",
    topic: "Restoration in Relationships",
  },
  {
    _id: "19",
    category: "Family & Relationships",
    topic: "Finding a Godly Spouse",
  },
  { _id: "20", category: "Family & Relationships", topic: "Unity in the Home" },
];

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
          onPress={() => setSelectedTopic(item)}
        >
          <Text style={styles.goButtonText}>Go</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={() => handleFavorite(item._id)}
        >
          <Text
            style={{ color: favorites.includes(item._id) ? "red" : "gray" }}
          >
            ♥
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const navigation = useNavigation();

  return (
    <View style={[styles.container, isDark && { backgroundColor: "#000" }]}>
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

      {/* <View></View> */}

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
    borderColor: "##6f7688",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#ccc",
  },
  categoryList: {
    marginBottom: 16,
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#9e4d54",
    marginRight: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  selectedCategory: {
    backgroundColor: "#1e2572",
  },
  categoryText: {
    fontSize: 14,
    color: "#ccc",
    fontWeight: "bold",
  },
  selectedCategoryText: {
    color: "#fff",
    fontWeight: "bold",
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
