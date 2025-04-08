import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, ToastAndroid } from "react-native";

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_PROJECT_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
export async function getProfileUser() {
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

export async function getProfileUserById(id: string) {
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

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
