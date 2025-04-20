import { View, Image, ScrollView, useColorScheme } from "react-native";
import React, { FC, useState } from "react";
import {
  Appbar,
  useTheme as useThemePaper,
  Text,
  Divider,
  TouchableRipple,
  List,
  Portal,
  Modal,
  ActivityIndicator,
  Dialog,
  RadioButton,
  Button,
} from "react-native-paper";
import { router } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import DialogLogout from "@/components/Home/dialog-logout";
import { useColorSchemeContext } from "../_layout";
import { Theme } from "@/hooks/useTheme";

export default function Settings() {
  const { colors } = useThemePaper();
  const colorSchemeSystem = useColorScheme();
  const { toggleTheme, colorScheme } = useColorSchemeContext();
  const { profile } = useAuth();
  const [showDialogLogout, setShowDialogLogout] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [showDialogTheme, setShowDialogTheme] = useState(false);
  const [valueTheme, setValueTheme] = useState(colorScheme as string);

  const handleChangeTheme = () => {
    if (valueTheme === "system") {
      toggleTheme(colorSchemeSystem as Theme);
      setShowDialogTheme(false);
      return;
    }
    toggleTheme(valueTheme as Theme);
    setShowDialogTheme(false);
  };

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
            description="Informasi tentang akun kamu"
            icon="key-outline"
            onPress={() => {}}
          />
          <ButtonOption
            title="Lists"
            description="Daftar kontak kamu"
            icon="account-box-multiple-outline"
            onPress={() => {}}
          />
          <ButtonOption
            title="Tema"
            description="Ganti tema"
            icon="palette-outline"
            onPress={() => setShowDialogTheme(true)}
          />
          <ButtonOption
            title="Help"
            description="Pusat bantuan, hubungi kami!"
            icon="progress-question"
            onPress={() => {}}
          />
          <ButtonOption
            title="Logout"
            description="Keluar dari akun ini"
            icon="logout"
            onPress={() => setShowDialogLogout(true)}
          />
        </View>
      </ScrollView>
      <DialogLogout
        isVisible={showDialogLogout}
        setLoading={setLoadingLogout}
        setIsVisible={setShowDialogLogout}
      />
      <Portal>
        <Dialog
          visible={showDialogTheme}
          onDismiss={() => setShowDialogTheme(false)}
        >
          <Dialog.Title>Pilih Tema</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group onValueChange={setValueTheme} value={valueTheme}>
              <RadioButton.Item label="System Default" value="system" />
              <RadioButton.Item label="Light" value="light" />
              <RadioButton.Item label="Dark" value="dark" />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialogTheme(false)}>Cancel</Button>
            <Button onPress={handleChangeTheme}>OK</Button>
          </Dialog.Actions>
        </Dialog>
        <Modal visible={loadingLogout}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator color={colors.primary} size={60} />
          </View>
        </Modal>
      </Portal>
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
