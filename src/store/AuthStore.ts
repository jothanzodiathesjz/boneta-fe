import { create } from "zustand";
import { DomainUserWithProfile } from "@/domain/Users";
import { setCookie, destroyCookie } from "nookies";
import { deleteCookie } from "@/utils/cookies";

export type AuthStore = {
  user: DomainUserWithProfile | null;
  isAuthenticated: boolean;
  setUser: (user: DomainUserWithProfile | null) => void;
  fetchUser: (token: string) => Promise<void>;
  logOut: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user: DomainUserWithProfile | null) => {
    set({ user, isAuthenticated: user !== null });
  },
  fetchUser: async (token: string) => {
    const currentUser = get().user;
    if (currentUser !== null) return;
    if (!token) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          set({
            user: new DomainUserWithProfile(data.data),
            isAuthenticated: true,
          });
          setCookie(null, "user", JSON.stringify(data.data), {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          });
        } else {
          set({ user: null, isAuthenticated: false });
        }
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (err) {
      console.log(err);
      set({ user: null, isAuthenticated: false });
    }
  },
  logOut: async () => {
    set({ user: null, isAuthenticated: false });
    destroyCookie(null, "user");
    destroyCookie(null, "accessToken");
    localStorage.removeItem("access_token");
    deleteCookie("user");
    deleteCookie("accessToken");
    window.location.href = "/";
  },
}));

// Usage example (in a component):
// import { parseCookies } from 'nookies';
// const { user, isAuthenticated, fetchUser, setUser } = useAuthStore();
// useEffect(() => {
//   const { accessToken } = parseCookies();
//   fetchUser(accessToken);
// }, []);
