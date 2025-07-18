// AI Assistant Screen UI in React Native (JavaScript)
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const AIAssistanceScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Replace with your actual key — move to env file later
  const OPENAI_API_KEY = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

  const sendToOpenAI = async (message) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful Christian Bible assistant that answers questions based on the Bible only.",
            },
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const aiReply = response.data.choices[0].message.content.trim();
      return aiReply;
    } catch (error) {
      console.error("OpenAI Error:", error?.response?.data || error.message);
      return "Sorry, I could not fetch a response. Please try again.";
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };
    setMessages([...messages, newMessage]);
    setInput("");

    // Simulate AI reply (will be replaced with real API later)
    setTimeout(() => {
      const aiReply = {
        id: Date.now().toString() + "_ai",
        text: `"${newMessage.text}" is a great question! Here is what the Bible says:
Jesus is the Son of God, the Savior of the world. He came in love, lived without sin, died for our sins, and rose again to give us eternal life. Through Him, we know God and receive grace, truth, and hope that never fails.`,
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1200);
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === "user" ? styles.userBubble : styles.aiBubble,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Ionicons name="chatbubbles-outline" size={24} color="white" />
        <Text style={styles.headerText}>Ask Bible Assistant</Text>
      </View>

      <Text style={styles.subHeader}>
        Get answers, insights & help from Scripture
      </Text>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask me Bible Questions..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={22} color="white" />
        </TouchableOpacity>
      </View>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfdfd",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4b0082",
    paddingVertical: 14,
    paddingHorizontal: 18,
    height: 150,
    marginTop: Platform.OS === "android" ? 0 : 44,
  },
  headerText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "bold",
  },
  subHeader: {
    textAlign: "center",
    paddingVertical: 10,
    color: "#555",
    fontWeight: "bold",
    fontStyle: "italic",
  },
  chatContainer: {
    padding: 14,
    flexGrow: 1,
    width: "90%",
  },
  messageBubble: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: "#dcf8c6",
    alignSelf: "flex-end",
  },
  aiBubble: {
    backgroundColor: "#f0f0f0",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 25,
    textAlign: "justify",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    // backgroundColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 14,
    fontSize: 15,
    paddingVertical: 10,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  sendButton: {
    backgroundColor: "#4b0082",
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AIAssistanceScreen;
