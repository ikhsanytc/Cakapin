import { View, Image, ScrollView } from "react-native";
import React, { FC } from "react";
import {
  Appbar,
  useTheme,
  Text,
  Divider,
  TouchableRipple,
  List,
} from "react-native-paper";
import { router } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";

export default function Settings() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: colors.background,
        }}
      >
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>
      <Divider />
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
      >
        <TouchableRipple
          onPress={() => router.push(`/settings/profile`)}
          style={{
            paddingLeft: 15,
            paddingTop: 10,
            paddingBottom: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <>
            <Image
              source={{
                uri: profile?.avatar_url,
              }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 100,
              }}
            />
            <View
              style={{
                marginLeft: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "bold",
                }}
              >
                {profile?.username}
              </Text>
              <Text>{profile?.status}</Text>
            </View>
          </>
        </TouchableRipple>
        <Divider />
        <View
          style={{
            paddingTop: 10,
          }}
        >
          <ButtonOption
            title="Account"
            description="Information about your account"
            icon="key-outline"
            onPress={() => {}}
          />
          <ButtonOption
            title="Lists"
            description="Lists your contact"
            icon="account-box-multiple-outline"
            onPress={() => {}}
          />
          <ButtonOption
            title="Help"
            description="Help center, contact us!"
            icon="progress-question"
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </>
  );
}

type ButtonOptionProps = {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
};

const ButtonOption: FC<ButtonOptionProps> = ({
  description,
  icon,
  onPress,
  title,
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
      />
    </TouchableRipple>
  );
};
