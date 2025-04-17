import {
  ActivityIndicator,
  Image,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Button,
  HelperText,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { getProfileUserById, supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Network from "expo-network";

const scheme = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi!")
    .email("Format email tidak valid!"),
  password: z.string().min(8, "Password minimal 8 karakter!"),
});

export default function Login() {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isNetwork, setIsNetwork] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<z.infer<typeof scheme>>({
    resolver: zodResolver(scheme),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof scheme>> = async ({
    email,
    password,
  }) => {
    setIsLoading(true);
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
      await AsyncStorage.setItem(
        "supabaseSession",
        JSON.stringify(data.session)
      );
      const profile = await getProfileUserById(data.session.user.id);
      await AsyncStorage.setItem("supabaseProfile", JSON.stringify(profile));
      ToastAndroid.show("Selamat datang kembali!", ToastAndroid.SHORT);
      setIsLoading(false);
      router.replace("/home");
    } catch (e: any) {
      setIsLoading(false);
      if (e.message) {
        if (e.message === "Invalid login credentials") {
          setError("email", {
            message: "Email atau password salah!",
          });
          setError("password", {
            message: "Email atau password salah!",
          });
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
    (async () => {
      const network = await Network.getNetworkStateAsync();
      if (network.isConnected) {
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
          <View
            style={{
              alignSelf: "stretch",
            }}
          >
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <>
                  <TextInput
                    mode="outlined"
                    label="Email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    ref={ref}
                    error={!!errors.email}
                    autoCapitalize="none"
                    keyboardType="email-address"
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
              render={({ field: { onBlur, onChange, value, ref } }) => (
                <>
                  <TextInput
                    mode="outlined"
                    label="Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    ref={ref}
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
            loading={isLoading}
            disabled={isLoading}
            style={{
              width: "100%",
            }}
            onPress={handleSubmit(onSubmit)}
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
