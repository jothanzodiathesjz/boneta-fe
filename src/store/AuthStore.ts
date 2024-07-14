import { create } from 'zustand';
import { DomainUserWithProfile } from '@/domain/Users';
import { parseCookies, setCookie, destroyCookie } from 'nookies'

export type AuthStore = {
    user: DomainUserWithProfile | null;
    isAuthenticated: boolean;
    setUser: (user: DomainUserWithProfile | null) => void;
    fetchUser: (token: string) => Promise<void>;
}

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
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.data) {
                    set({ user: new DomainUserWithProfile(data.data), isAuthenticated: true });
                    setCookie(null,'user', JSON.stringify(data.data), {maxAge: 30 * 24 * 60 * 60})
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
}));

// Usage example (in a component):
// import { parseCookies } from 'nookies';
// const { user, isAuthenticated, fetchUser, setUser } = useAuthStore();
// useEffect(() => {
//   const { accessToken } = parseCookies();
//   fetchUser(accessToken);
// }, []);