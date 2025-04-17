import { createClient, Session } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, ToastAndroid } from "react-native";
import * as Network from "expo-network";
import { ProfilesDB } from "@/types/profiles";
import { router } from "expo-router";

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_PROJECT_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);
export async function getUser() {
  const networkState = await Network.getNetworkStateAsync();
  if (networkState.isConnected) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  }
  const session = await AsyncStorage.getItem("supabaseSession");
  if (!session) {
    return null;
  }
  const sessionJson = JSON.parse(session ?? "") as Session;
  return sessionJson.user;
}
export async function getProfileUser(): Promise<ProfilesDB | null> {
  const networkState = await Network.getNetworkStateAsync();
  if (networkState.isConnected) {
    const user = await getUser();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .maybeSingle();

    if (error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
      return null;
    }
    return data;
  }
  const profile = await AsyncStorage.getItem("supabaseProfile");
  if (!profile) {
    return null;
  }
  const profileJson = JSON.parse(profile ?? "") as ProfilesDB;
  return profileJson;
}

export async function getProfileUserById(
  id: string
): Promise<ProfilesDB | null> {
  const networkState = await Network.getNetworkStateAsync();
  if (networkState.isConnected) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
      return null;
    }
    return data;
  }
  const user = await getUser();
  if (user && user.id === id) {
    const profile = await getProfileUser();
    return profile;
  }
  return null;
}
export async function logout() {
  await supabase.auth.signOut();
  await AsyncStorage.removeItem("supabaseSession");
  await AsyncStorage.removeItem("supabaseProfile");
  router.replace("/auth");
}

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
