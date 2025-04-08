import { useGlobalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

export const useTheme = () => {
  const router = useRouter();
  const { colorScheme: globalColorScheme } = useGlobalSearchParams();
  const [localColorScheme, setLocalColorScheme] = useState(
    globalColorScheme || "light"
  );
  const toggleColorScheme = () => {
    const newScheme = localColorScheme === "light" ? "dark" : "light";
    setLocalColorScheme(newScheme);
    router.setParams({
      colorScheme: newScheme,
    });
  };
  useEffect(() => {
    if (globalColorScheme && globalColorScheme !== localColorScheme) {
      setLocalColorScheme(globalColorScheme);
    }
  }, [globalColorScheme]);
  return {
    colorScheme: localColorScheme,
    toggleColorScheme,
  };
};
