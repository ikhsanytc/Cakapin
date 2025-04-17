import * as QueryParams from "expo-auth-session/build/QueryParams";
import { supabase } from "./supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;
  if (!access_token) return;
  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  await AsyncStorage.setItem("supabaseSession", JSON.stringify(data.session));
  if (error) throw new Error(error.message);
  return data.session;
};

export default createSessionFromUrl;
