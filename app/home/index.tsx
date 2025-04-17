import { FlatList, View } from "react-native";
import React, { useEffect } from "react";
import {
  Appbar,
  useTheme,
  Text,
  List,
  Avatar,
  Divider,
} from "react-native-paper";
import MenuComponent from "@/components/Home/menu";
import { useAuth } from "@/providers/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";

const contacts = [
  {
    id: "1",
    name: "John Doe",
    lastMessage: "Hey, how are you?",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Jane Smith",
    lastMessage: "Let's meet tomorrow.",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    name: "Alex Brown",
    lastMessage: "Good morning!",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    lastMessage: "Got your message.",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
];

export default function Home() {
  const { colors } = useTheme();
  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: colors.background,
        }}
      >
        <Appbar.Content
          title="Cakapin"
          titleStyle={{
            fontWeight: "bold",
            fontSize: 28,
          }}
        />
        <MenuComponent />
      </Appbar.Header>
      <Divider />
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
      >
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              description={item.lastMessage}
              left={() => (
                <Avatar.Image
                  style={{
                    marginLeft: 20,
                  }}
                  size={50}
                  source={{ uri: item.avatar }}
                />
              )}
              onPress={() => router.push("/message")}
            />
          )}
        />
      </View>
    </>
  );
}
