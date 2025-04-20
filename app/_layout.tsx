import React, { createContext, useContext, useEffect } from "react";
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
import { Theme, useTheme } from "@/hooks/useTheme";
import * as SystemUI from "expo-system-ui";
import { AuthProvider } from "@/providers/AuthProvider";
import { Slot, Stack, withLayoutContext } from "expo-router";

const customDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };
const customLightTheme = { ...MD3LightTheme, colors: Colors.light };

const { DarkTheme, LightTheme } = adaptNavigationTheme({
  reactNavigationDark: NavigationDarkTheme,
  reactNavigationLight: NavigationLightTheme,
});

const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);
const CombinedLightTheme = merge(LightTheme, customLightTheme);

type ThemeContextType = {
  colorScheme: Theme | "";
  toggleTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  colorScheme: "",
  toggleTheme: (theme: Theme) => {},
});

export function useColorSchemeContext() {
  return useContext(ThemeContext);
}

export default function RootLayout() {
  const { colorScheme, toggleTheme } = useTheme();
  const paperTheme =
    colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme;
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(paperTheme.colors.background);
  }, [paperTheme]);
  return (
    <AuthProvider>
      <PaperProvider theme={paperTheme}>
        <ThemeContext.Provider
          value={{ colorScheme: colorScheme as Theme, toggleTheme }}
        >
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
          <StatusBar
            style={colorScheme === "dark" ? "light" : "dark"}
            translucent
          />
        </ThemeContext.Provider>
      </PaperProvider>
    </AuthProvider>
  );
}
