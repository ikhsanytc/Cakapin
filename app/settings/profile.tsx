import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { FC } from "react";
import { useAuth } from "@/providers/AuthProvider";
import {
  Appbar,
  Divider,
  IconButton,
  List,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";

export default function Profile() {
  const { profile } = useAuth();
  const { colors } = useTheme();
  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: colors.background,
        }}
      >
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Profile" />
      </Appbar.Header>
      <Divider />
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
      >
        <TouchableOpacity onPress={() => {}}>
          <View
            style={{
              position: "relative",
            }}
          >
            <View
              style={{
                position: "absolute",
                bottom: 10,
                right: 120,
                zIndex: 9999,
                backgroundColor: colors.elevation.level4,
                borderRadius: 100,
              }}
            >
              <IconButton
                icon="camera-outline"
                style={{
                  alignSelf: "center",
                }}
              />
            </View>
            <Image
              source={{
                uri: profile?.avatar_url,
              }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                alignSelf: "center",
                marginTop: 15,
                marginBottom: 20,
              }}
            />
          </View>
        </TouchableOpacity>
        <ButtonCustom
          title="Nama"
          description={profile?.username!}
          icon="account-outline"
          onPress={() => {}}
        />
        <ButtonCustom
          title="About"
          description={profile?.status!}
          icon="information-outline"
          onPress={() => {}}
        />
        <ButtonCustom
          title="Email"
          description={profile?.email!}
          icon="email-outline"
          onPress={() => {}}
        />
      </ScrollView>
    </>
  );
}

type ButtonCustomProps = {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
};

const ButtonCustom: FC<ButtonCustomProps> = ({
  description,
  icon,
  title,
  onPress,
}) => {
  return (
    <TouchableRipple
      onPress={onPress}
      style={{
        paddingLeft: 15,
      }}
    >
      <List.Item
        title={title}
        description={description}
        descriptionStyle={{
          color: "grey",
        }}
        left={() => <List.Icon icon={icon} />}
      ></List.Item>
    </TouchableRipple>
  );
};
