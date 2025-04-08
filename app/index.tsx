import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { getUser } from "@/lib/supabase";
import { ToastAndroid } from "react-native";
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();
export default function index() {
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
  return <></>;
}
