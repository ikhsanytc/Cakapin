import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Appbar, Divider, List, useTheme } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";

export default function Profile() {
  const { profile } = useAuth();
  const { colors } = useTheme();
  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: colors.background,
        }}
      >
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Profile" />
      </Appbar.Header>
      <Divider />
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
      >
        <Image
          source={{
            uri: profile?.avatar_url,
          }}
          style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            alignSelf: "center",
            marginTop: 15,
          }}
        />
        <List.Item title=""></List.Item>
      </ScrollView>
    </>
  );
}
