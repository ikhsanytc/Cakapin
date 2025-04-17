import React, { useEffect } from "react";
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/constants/Colors";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
} from "@react-navigation/native";
import merge from "deepmerge";
import { useTheme } from "@/hooks/useTheme";
import * as SystemUI from "expo-system-ui";
import { AuthProvider } from "@/providers/AuthProvider";
import { Slot, Stack, withLayoutContext } from "expo-router";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";

const customDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };
const customLightTheme = { ...MD3LightTheme, colors: Colors.light };

const { DarkTheme, LightTheme } = adaptNavigationTheme({
  reactNavigationDark: NavigationDarkTheme,
  reactNavigationLight: NavigationLightTheme,
});

const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);
const CombinedLightTheme = merge(LightTheme, customLightTheme);

export default function RootLayout() {
  const { colorScheme } = useTheme();
  const paperTheme =
    colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme;
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(paperTheme.colors.background);
  }, [paperTheme]);
  return (
    <AuthProvider>
      <PaperProvider theme={paperTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
        <StatusBar
          style={colorScheme === "dark" ? "light" : "dark"}
          translucent
        />
      </PaperProvider>
    </AuthProvider>
  );
}
