import {
  Image,
  ScrollView,
  TextInput as TextInputType,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  HelperText,
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
import { useAuth } from "@/providers/AuthProvider";
import z from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import uuid from "react-native-uuid";
import * as Network from "expo-network";

const isDev = __DEV__;
const emailRedirectTo = isDev
  ? "exp://192.168.1.48:8081/--/auth/register"
  : "cakapin://auth/register";

const scheme = z.object({
  email: z.string().min(1, "Email wajib diisi!").email("Email tidak valid!"),
  password: z.string().min(8, "Password minimal 8 karakter!"),
});

export default function Register() {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isNetwork, setIsNetwork] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    resetField,
  } = useForm<z.infer<typeof scheme>>({
    resolver: zodResolver(scheme),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const url = Linking.useURL();
  const { user } = useAuth();
  const onSubmit: SubmitHandler<z.infer<typeof scheme>> = async ({
    email,
    password,
  }) => {
    const username = uuid.v4();
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .maybeSingle();
      if (data) throw new Error("Akun sudah ada");
      const { error: ErrorSignIn } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            email,
            status: "Hey there! I'm using cakapin!",
            avatar_url:
              "https://nwuwkyrhxdxeelkrtaap.supabase.co/storage/v1/object/public/avatars//nophoto.jpeg",
          },
          emailRedirectTo,
        },
      });
      if (ErrorSignIn) throw new Error(ErrorSignIn.message);
      ToastAndroid.show("Cek email mu sekarang!", ToastAndroid.SHORT);
      resetField("email");
      resetField("password");
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      if (e.message) {
        if (e.message === "Akun sudah ada") {
          setError("email", {
            message: e.message,
          });
          resetField("password");
          return;
        }
        ToastAndroid.show(e.message, ToastAndroid.SHORT);
        return;
      }
      console.error(e);
      ToastAndroid.show("Kesalahan terjadi", ToastAndroid.SHORT);
    }
  };
  useEffect(() => {
    if (url) {
      createSessionFromUrl(url);
    }
    if (user) {
      router.replace("/auth/wizard");
    }
  }, [url, user]);
  useEffect(() => {
    (async () => {
      const network = await Network.getNetworkStateAsync();
      if (network) {
        setIsNetwork(true);
        return;
      }
      ToastAndroid.show(
        "Kamu tidak memiliki akses ke internet!",
        ToastAndroid.SHORT
      );
      setIsNetwork(false);
      router.back();
    })();
  }, []);
  if (!isNetwork) {
    return (
      <SafeAreaView
        style={{
          backgroundColor: colors.background,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color={colors.primary} size={100} />
      </SafeAreaView>
    );
  }
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
            Daftar
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
          <View
            style={{
              alignSelf: "stretch",
            }}
          >
            <Controller
              control={control}
              name="email"
              render={({ field: { onBlur, onChange, ref, value } }) => (
                <>
                  <TextInput
                    mode="outlined"
                    label="Email"
                    placeholder="example123@placeholder.com"
                    placeholderTextColor="grey"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    ref={ref}
                    value={value}
                    error={!!errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <HelperText type="error" visible={!!errors.email}>
                    {errors.email?.message}
                  </HelperText>
                </>
              )}
            />
          </View>
          <View
            style={{
              alignSelf: "stretch",
            }}
          >
            <Controller
              control={control}
              name="password"
              render={({ field: { onBlur, onChange, ref, value } }) => (
                <>
                  <TextInput
                    mode="outlined"
                    label="Password"
                    placeholder="example123@@@%$#^#"
                    placeholderTextColor="grey"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    ref={ref}
                    value={value}
                    error={!!errors.password}
                    secureTextEntry
                  />
                  <HelperText type="error" visible={!!errors.password}>
                    {errors.password?.message}
                  </HelperText>
                </>
              )}
            />
          </View>

          <Button
            mode="contained"
            disabled={isLoading}
            loading={isLoading}
            style={{
              width: "100%",
            }}
            onPress={handleSubmit(onSubmit)}
          >
            Daftar
          </Button>
          <TouchableOpacity
            onPress={() => router.replace("/auth/login")}
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
              Punya akun? Masuk
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
