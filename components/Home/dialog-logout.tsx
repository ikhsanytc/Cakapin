import { View } from "react-native";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { Button, Dialog, Text } from "react-native-paper";
import { logout } from "@/lib/supabase";

type DialogLogoutProps = {
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  isVisible: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

const DialogLogout: FC<DialogLogoutProps> = ({
  setIsVisible,
  isVisible,
  setLoading,
}) => {
  const showDialog = () => setIsVisible(true);
  const hideDialog = () => setIsVisible(false);
  return (
    <Dialog visible={isVisible} onDismiss={hideDialog}>
      <Dialog.Title>Logout</Dialog.Title>
      <Dialog.Content>
        <Text>Apakah kamu yakin untuk logout?</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          onPress={async () => {
            hideDialog();
            setLoading(true);
            await logout();
          }}
        >
          Ya
        </Button>
        <Button onPress={hideDialog}>Tidak</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default DialogLogout;
