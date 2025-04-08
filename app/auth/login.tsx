import {
  Image,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import * as Linking from "expo-linking";
import createSessionFromUrl from "@/lib/createSessionFromUrl";

const isDev = __DEV__;
const emailRedirectTo = isDev
  ? "exp://192.168.1.48:8081/--/auth/login"
  : "cakapin://auth/login";

export default function Login() {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const url = Linking.useURL();
  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo,
        },
      });
      if (error) throw new Error(error.message);
      ToastAndroid.show("Link telah di kirim", ToastAndroid.SHORT);
      setEmail("");
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      if (e.message) {
        if (e.message === "Signups not allowed for otp") {
          ToastAndroid.show("Akun tidak ditemukan", ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(e.message, ToastAndroid.SHORT);
        }
        return;
      }
      console.error(e);
      ToastAndroid.show("Terjadi kesalahan", ToastAndroid.SHORT);
    }
  };
  useEffect(() => {
    if (url) {
      createSessionFromUrl(url);
      router.replace("/home");
    }
  }, [url]);
  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.background,
        flex: 1,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <IconButton icon="arrow-left" onPress={() => router.back()} />
        <Image
          source={require("@/assets/images/icon.png")}
          style={{
            width: 150,
            height: 150,
            borderRadius: 100,
            marginBottom: 60,
            alignSelf: "center",
            marginTop: 50,
          }}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: colors.elevation.level3,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            alignItems: "center",
            paddingHorizontal: 25,
            paddingVertical: 25,
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              marginBottom: 2,
            }}
          >
            Masuk
          </Text>
          <View
            style={{
              width: 150,
              height: 5,
              borderRadius: 100,
              backgroundColor: colors.primary,
              marginBottom: 50,
            }}
          ></View>
          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={{
              alignSelf: "stretch",
              marginBottom: 20,
            }}
          />
          <Button
            mode="contained"
            loading={isLoading}
            disabled={isLoading}
            style={{
              width: "100%",
            }}
            onPress={onSubmit}
          >
            Masuk
          </Button>
          <TouchableOpacity
            onPress={() => router.replace("/auth/register")}
            style={{
              alignSelf: "baseline",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                marginTop: 5,
              }}
            >
              Tidak punya akun? Daftar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
