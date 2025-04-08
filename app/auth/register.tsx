import {
  Image,
  ScrollView,
  TextInput as TextInputType,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import {
  Button,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function Register() {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const emailRef = useRef<TextInputType>(null);
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
          <TextInput
            mode="outlined"
            value={username}
            onChangeText={setUsername}
            label="Nama"
            returnKeyType="next"
            style={{
              alignSelf: "stretch",
              marginBottom: 5,
            }}
            onSubmitEditing={() => emailRef.current?.focus()}
            submitBehavior="submit"
          />
          <TextInput
            mode="outlined"
            ref={emailRef}
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
            style={{
              width: "100%",
            }}
            onPress={() => {}}
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
