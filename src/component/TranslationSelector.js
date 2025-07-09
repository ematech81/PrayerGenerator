import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const TranslationSelector = ({
  translations,
  currentTranslation,
  onSelectTranslation,
}) => {
  const [showList, setShowList] = useState(false);

  const handleSelect = (translation) => {
    onSelectTranslation(translation);
    setShowList(false);
  };

  return (
    <View style={styles.container}>
      {/* Current translation shown as button */}
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setShowList(true)}
      >
        <Text style={styles.selectorText}>
          {currentTranslation?.abbreviation?.toUpperCase() || "ASV"}
        </Text>
        <AntDesign name="down" size={14} color="#ccc" />
      </TouchableOpacity>

      {/* Modal for selecting translation */}
      <Modal
        visible={showList}
        transparent
        animationType="slide"
        onRequestClose={() => setShowList(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => setShowList(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Translation</Text>
            <FlatList
              data={translations}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.translationItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.translationText}>
                    {item.name} ({item.abbreviation})
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default TranslationSelector;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    // backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    borderRadius: 15,
    marginRight: 10,
  },
  selector: {
    padding: 8,
    borderRadius: 15,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    height: 40,
    flexDirection: "row",
    gap: 4,
  },
  selectorText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  modalBackdrop: {
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    Height: 200,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  translationItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  translationText: {
    fontSize: 16,
  },
});
