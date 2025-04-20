import { useGlobalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

export const useTheme = () => {
  const router = useRouter();
  const { colorScheme: globalColorScheme } = useGlobalSearchParams();
  const [localColorScheme, setLocalColorScheme] = useState(
    globalColorScheme || "dark"
  );
  const toggleTheme = (theme: Theme) => {
    const newScheme = theme;
    setLocalColorScheme(newScheme);
    router.setParams({
      colorSchme: newScheme,
    });
  };
  useEffect(() => {
    if (globalColorScheme && globalColorScheme !== localColorScheme) {
      setLocalColorScheme(globalColorScheme);
    }
  }, [globalColorScheme]);
  return { toggleTheme, colorScheme: localColorScheme };
};
