import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { getUser } from "@/lib/supabase";
import { ActivityIndicator, ToastAndroid } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";

SplashScreen.preventAutoHideAsync();
export default function index() {
  const { colors } = useTheme();
  useEffect(() => {
    (async () => {
      try {
        const user = await getUser();
        if (user) {
          router.replace("/home");
        } else {
          router.replace("/auth");
        }
      } catch (e) {
        console.error(e);
        ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
      } finally {
        await SplashScreen.hideAsync();
      }
    })();
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size={100} color={colors.primary} />
    </SafeAreaView>
  );
}
