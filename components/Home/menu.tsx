import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useState } from "react";
import { Appbar, Menu, Portal, useTheme } from "react-native-paper";
import DialogLogout from "./dialog-logout";

const MenuComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { colors } = useTheme();
  return (
    <>
      <Menu
        visible={isVisible}
        contentStyle={{
          marginTop: 50,
          marginRight: 10,
          backgroundColor: colors.background,
        }}
        anchorPosition="bottom"
        anchor={
          <Appbar.Action
            icon="dots-vertical"
            onPress={() => setIsVisible(true)}
          />
        }
        onDismiss={() => setIsVisible(false)}
      >
        <Menu.Item
          title="Settings"
          onPress={() => {
            setIsVisible(false);
            router.push("/settings");
          }}
        />
      </Menu>
    </>
  );
};

export default MenuComponent;
