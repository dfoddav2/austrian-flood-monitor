import { create } from "zustand";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  clearAuth: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  clearAuth: () => {
    Cookies.remove("token");
    Cookies.remove("authCookie");
    set({ token: null, user: null });
  },
  initializeAuth: () => {
    const authCookie = Cookies.get("authCookie");
    console.log("Initializing auth with authCookie:", authCookie);
    if (authCookie) {
      try {
        const decodedUser: User = jwtDecode(authCookie);
        set({ authCookie: authCookie, user: decodedUser });
      } catch (error) {
        console.error("Invalid token:", error);
        set({ token: null, user: null });
      }
    } else {
      console.warn("No authCookie found.");
      set({ token: null, user: null });
    }
  },
}));
