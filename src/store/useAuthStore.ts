import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminUser {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: true, // Default active session for smooth demo
      user: {
        name: "Devon Vance",
        email: "admin@smartworkload.internal",
        role: "Head of Engineering Operations",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },

      login: (email: string, password?: string) => {
        // Validate or allow demo sign-in
        const adminUser: AdminUser = {
          name: email.split("@")[0].replace(/[^a-zA-Z]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Devon Vance",
          email: email.trim(),
          role: "Head of Engineering Operations",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        };

        set({
          isAuthenticated: true,
          user: adminUser,
        });

        return true;
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
      },
    }),
    {
      name: "smart_workload_auth",
    }
  )
);
