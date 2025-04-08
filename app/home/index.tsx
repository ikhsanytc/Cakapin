import { View } from "react-native";
import React from "react";
import { Appbar, useTheme, Text } from "react-native-paper";

export default function Home() {
  const { colors } = useTheme();
  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: colors.elevation.level4,
        }}
      >
        <Appbar.Content title="Cakapin" />
      </Appbar.Header>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 40,
            fontWeight: "bold",
          }}
        >
          Welcome Home
        </Text>
      </View>
    </>
  );
}
