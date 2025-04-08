import { getProfileUserById, getUser, supabase } from "@/lib/supabase";
import { ProfilesDB } from "@/types/profiles";
import { User } from "@supabase/supabase-js";
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextType = {
  user: User | null;
  profile: ProfilesDB | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfilesDB | null>(null);
  useEffect(() => {
    (async () => {
      const user = await getUser();
      if (!user) return;
      setUser(user);
      const profile = await getProfileUserById(user.id);
      setProfile(profile);
    })();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (e, session) => {
      if (e === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
      }
      if (e === "SIGNED_IN") {
        setUser(session?.user!);
        const profile = await getProfileUserById(session?.user.id!);
        setProfile(profile);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return (
    <AuthContext.Provider value={{ profile, user }}>
      {children}
    </AuthContext.Provider>
  );
};
