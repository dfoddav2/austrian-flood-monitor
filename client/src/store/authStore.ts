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
  // setToken: (token: string) => void;
  clearToken: () => void;
  initializeAuth: () => void; // Add this line
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  // setToken: (token: string) => {
  //   console.log("Setting token:", token);
  //   // Store the token in cookies
  //   Cookies.set("token", token, {
  //     expires: 7,
  //     // httpOnly: true,
  //     // secure: true,
  //     sameSite: 'Lax'
  //   });

  //   // Decode the token to get user info
  //   console.log("Decoding user from tokend:", token);
  //   const decodedUser: User = jwtDecode(token);
  //   console.log("Decoded user:", decodedUser);
  //   set({ token, user: decodedUser });
  // },
  clearToken: () => {
    Cookies.remove("token");
    set({ token: null, user: null });
  },
  getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  },
  initializeAuth: () => {
    const token = Cookies.get("token");
    console.log("Initializing auth with token:", token);
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
