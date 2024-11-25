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
  setToken: (token: string) => void;
  clearToken: () => void;
  initializeAuth: () => void; // Add this line
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setToken: (token: string) => {
    console.log("Setting token:", token);
    // Store the token in cookies
    Cookies.set("token", token, { expires: 7 });

    // Decode the token to get user info
    console.log("Decoding user from tokend:", token);
    const decodedUser: User = jwtDecode(token);
    console.log("Decoded user:", decodedUser);
    set({ token, user: decodedUser });
  },
  clearToken: () => {
    // Remove the token from cookies
    Cookies.remove("token");
    set({ token: null, user: null });
  },
  initializeAuth: () => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedUser: User = jwtDecode(token);
        set({ token, user: decodedUser });
      } catch (error) {
        console.error("Invalid token:", error);
        set({ token: null, user: null });
      }
    }
  },
}));
