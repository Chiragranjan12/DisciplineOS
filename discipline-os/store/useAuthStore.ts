import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { apiClient } from "@/lib/apiClient";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    setAuth: (user: User, token: string) => void;
    clearAuth: () => void;
    setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            setAuth: (user, token) => {
                if (typeof window !== "undefined") {
                    localStorage.setItem("discipline_token", token);
                    // Also set as cookie so Next.js middleware can read it for route protection
                    document.cookie = `discipline_token=${token}; path=/; max-age=86400; SameSite=Strict`;
                }
                set({ user, token, isAuthenticated: true, error: null });
            },
            clearAuth: () => {
                if (typeof window !== "undefined") {
                    localStorage.removeItem("discipline_token");
                    document.cookie = "discipline_token=; path=/; max-age=0";
                }
                set({ user: null, token: null, isAuthenticated: false, error: null });
            },
            setError: (error) => set({ error }),
        }),
        {
            name: "discipline-auth-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
        }
    )
);
