import {
  Image,
  ImageSourcePropType,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  HelperText,
  Icon,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/providers/AuthProvider";
import { getProfileUser, supabase } from "@/lib/supabase";
import * as FileSystem from "expo-file-system";
import uuid from "react-native-uuid";
import { base64ToUint8Array } from "@/lib/utils";
import { router } from "expo-router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";

const scheme = z.object({
  username: z
    .string()
    .min(1, "Nama tidak boleh kosong!")
    .min(3, "Nama minimal 3 karakter"),
  status: z.string().min(1, "Status tidak boleh kosong!"),
});

export default function Wizard() {
  const [profileImg, setProfileImg] = useState(
    "https://nwuwkyrhxdxeelkrtaap.supabase.co/storage/v1/object/public/avatars//nophoto.jpeg"
  );
  const { user, profile } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof scheme>>({
    resolver: zodResolver(scheme),
    defaultValues: {
      status: "Hey there! I'm using Cakapin",
      username: "",
    },
  });
  const { colors } = useTheme();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      if (profile?.avatar_url && profile.avatar_url !== profileImg) {
        setProfileImg(profile.avatar_url);
      }
    })();
  }, [profile, user]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // crop langsung saat pilih
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];

      // Optional: Crop/resize lagi jika perlu
      const cropped = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 512, height: 512 } }], // resize square
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );
      console.log(cropped.uri);
      await uploadToSupabase(cropped.uri);
    }
  };

  const uploadToSupabase = async (uri: string) => {
    try {
      setUploading(true);
      const fileInfo = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const blob = base64ToUint8Array(fileInfo);
      const fileName = `${uuid.v4()}.${uri.split(".").pop()}`;
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(fileName, blob!, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (error) throw new Error(error.message);

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      setProfileImg(publicUrl);
    } catch (err: any) {
      console.error(err);
      if (err.message) {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
        return;
      }
      ToastAndroid.show("Kesalahan terjadi", ToastAndroid.SHORT);
    } finally {
      setUploading(false);
    }
  };
  const updateProfileUser: SubmitHandler<z.infer<typeof scheme>> = async ({
    status,
    username,
  }) => {
    try {
      if (!user) return;
      setUploading(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          status,
          username,
          avatar_url: profileImg,
        })
        .eq("id", user?.id);
      if (error) throw new Error(error.message);
      ToastAndroid.show("Sukses", ToastAndroid.SHORT);
      const profile = await getProfileUser();
      await AsyncStorage.setItem("supabaseProfile", JSON.stringify(profile));
      router.replace("/home");
    } catch (err: any) {
      if (err.message) {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
        return;
      }
      ToastAndroid.show("Kesalahan terjadi!", ToastAndroid.SHORT);
    } finally {
      setUploading(false);
    }
  };

  if (!profile && !user) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
      }}
    >
      <TouchableOpacity
        style={{ position: "relative" }}
        onPress={handlePickImage}
        disabled={uploading}
      >
        <View style={{ position: "absolute", bottom: 0, right: 0 }}>
          <Icon source="circle-edit-outline" size={32} />
        </View>
        <Image
          source={{ uri: profileImg }}
          style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            opacity: uploading ? 0.5 : 1,
          }}
        />
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        Selamat datang di wizard!
      </Text>
      <View
        style={{
          alignSelf: "stretch",
          marginBottom: 10,
        }}
      >
        <Controller
          control={control}
          name="username"
          render={({ field: { onBlur, onChange, ref, value } }) => (
            <>
              <TextInput
                mode="outlined"
                label="Nama"
                placeholder="example123"
                ref={ref}
                onBlur={onBlur}
                value={value}
                onChangeText={onChange}
                placeholderTextColor="grey"
                error={!!errors.username}
              />
              <HelperText type="error" visible={!!errors.username}>
                {errors.username?.message}
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
          name="status"
          render={({ field: { onBlur, onChange, ref, value } }) => (
            <>
              <TextInput
                mode="outlined"
                label="Status"
                value={value}
                placeholder="Sibuk gua."
                onChangeText={onChange}
                onBlur={onBlur}
                ref={ref}
                placeholderTextColor="grey"
                error={!!errors.status}
              />
              <HelperText type="error" visible={!!errors.status}>
                {errors.status?.message}
              </HelperText>
            </>
          )}
        />
      </View>

      <Button
        mode="contained"
        style={{ marginTop: 30 }}
        onPress={handleSubmit(updateProfileUser)}
        loading={uploading}
        disabled={uploading}
      >
        Lanjutkan
      </Button>
    </SafeAreaView>
  );
}
