import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const dummyComments = [
  {
    id: "1",
    username: "Mary Grace",
    text: "This devotion blessed me!",
    likes: 2,
    replies: [
      {
        id: "r1",
        username: "John O.",
        text: "Same here!",
      },
    ],
  },
  {
    id: "2",
    username: "Faith Okoro",
    text: "Powerful reminder from Isaiah 40 🙏",
    likes: 3,
    replies: [],
  },
];

const CommentSection = () => {
  const [comments, setComments] = useState(dummyComments);
  const [newComment, setNewComment] = useState("");

  const handlePost = () => {
    if (newComment.trim() === "") return;
    const comment = {
      id: Date.now().toString(),
      username: "You", // Replace with actual user if logged in
      text: newComment,
      likes: 0,
      replies: [],
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  const handleLike = (id) => {
    const updated = comments.map((c) =>
      c.id === id ? { ...c, likes: c.likes + 1 } : c
    );
    setComments(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💬 Comments</Text>

      {/* Add Comment */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Write a comment..."
          style={styles.input}
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      {/* Comment List */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentCard}>
            <View style={styles.commentUserWrapper}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="user" size={24} color="black" />
              </View>
              <Text style={styles.username}>{item.username}</Text>
            </View>
            <Text style={styles.commentText}>{item.text}</Text>

            <View style={styles.commentActions}>
              <TouchableOpacity onPress={() => handleLike(item.id)}>
                <Text style={styles.likeText}>❤️ {item.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.replyText}>Reply</Text>
              </TouchableOpacity>
            </View>

            {/* Replies */}
            {item.replies.map((reply) => (
              <View key={reply.id} style={styles.replyCard}>
                <View style={styles.commentUserWrapper}>
                  <View>
                    <FontAwesome5 name="user" size={24} color="black" />
                    <Text style={styles.username}>{reply.username}</Text>
                  </View>
                </View>
                <Text style={styles.commentText}>{reply.text}</Text>
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    height: 70,
  },
  postButton: {
    marginLeft: 8,
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  commentCard: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  username: {
    fontWeight: "600",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 15,
    color: "#374151",
  },
  commentActions: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "space-between",
    width: 100,
  },
  likeText: {
    color: "#ef4444",
  },
  replyText: {
    color: "#3b82f6",
  },
  replyCard: {
    marginTop: 10,
    marginLeft: 16,
    backgroundColor: "#eef2ff",
    padding: 8,
    borderRadius: 8,
  },
  commentUserWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 2,
  },
  iconContainer: {
    borderWidth: 2,
    padding: 2,
    backgroundColor: "#ccc",
  },
});

export default CommentSection;
