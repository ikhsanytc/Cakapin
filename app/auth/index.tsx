import { Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { useTheme, Text, Button } from "react-native-paper";
import { router } from "expo-router";

export default function Auth() {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 25,
      }}
    >
      <Image
        source={require("@/assets/images/icon.png")}
        style={{
          width: 150,
          height: 150,
          borderRadius: 100,
          marginBottom: 20,
        }}
      />
      <Text
        style={{
          fontSize: 40,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Cakapin
      </Text>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "medium",
          marginBottom: 20,
        }}
      >
        Mulai cakapin, akhiri kesepian!
      </Text>
      <Button
        mode="contained"
        style={{
          width: "100%",
        }}
        onPress={() => router.push("/auth/login")}
      >
        Masuk
      </Button>
      <Button
        mode="outlined"
        style={{
          width: "100%",
          marginTop: 10,
        }}
        onPress={() => router.push("/auth/register")}
      >
        Daftar
      </Button>
    </SafeAreaView>
  );
}
