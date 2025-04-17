import { router } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  List,
  Avatar,
  Text,
  Appbar,
  useTheme,
  IconButton,
  Divider,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

// Dummy data untuk percakapan
const messages = [
  {
    id: "1",
    sender: "John Doe",
    content: "Hey, how are you?",
    timestamp: "10:00 AM",
  },
  {
    id: "2",
    sender: "You",
    content: "I'm good, thanks!",
    timestamp: "10:01 AM",
  },
  {
    id: "3",
    sender: "John Doe",
    content: "Let's catch up soon!",
    timestamp: "10:02 AM",
  },
];

const ChatScreen = () => {
  const [message, setMessage] = useState("");
  const [messagesList, setMessagesList] = useState(messages); // Pesan yang sudah ada
  const flatListRef = useRef<FlatList>(null);
  const { colors } = useTheme();

  // Fungsi untuk mengirim pesan
  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: (messagesList.length + 1).toString(),
        sender: "You",
        content: message,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessagesList([...messagesList, newMessage]);
      setMessage("");
      setTimeout(() => {
        // Scroll otomatis ke pesan terakhir
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  useEffect(() => {
    // Scroll otomatis ke pesan terakhir saat pertama kali membuka halaman
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messagesList]);

  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: colors.background,
        }}
      >
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Siapa kek" />
      </Appbar.Header>
      <Divider />
      <View style={styles.container}>
        {/* Daftar pesan */}
        <FlatList
          ref={flatListRef}
          style={{
            padding: 5,
          }}
          data={messagesList}
          renderItem={({ item }) => (
            <View
              style={
                item.sender === "You"
                  ? styles.sentMessage
                  : styles.receivedMessage
              }
            >
              <Text>{item.content}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
          // Membalik urutan daftar pesan, agar pesan baru muncul di bawah
        />

        {/* Input dan tombol kirim */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message"
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <IconButton
              icon="send"
              style={{
                alignSelf: "flex-end",
              }}
              onPress={sendMessage}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#d1ffd1",
    padding: 10,
    margin: 5,
    borderRadius: 10,
    maxWidth: "70%",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f1f1",
    padding: 10,
    margin: 5,
    borderRadius: 10,
    maxWidth: "70%",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    maxHeight: 150,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
});

export default ChatScreen;
