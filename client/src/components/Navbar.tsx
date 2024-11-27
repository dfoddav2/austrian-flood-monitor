"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const clearToken = useAuthStore((state) => state.clearToken);

  const handleLogout = () => {
    clearToken();
    router.push("/");
  };

  return (
    <nav className="bg-gray-800 dark:bg-gray-900 p-4 w-full flex justify-between items-center">
      <Link href="/" className="text-white text-2xl font-bold">
        AFM
      </Link>
      <div className="flex gap-2 items-center">
        <NavigationMenu>
          <NavigationMenuList>
            {!user && (
              <NavigationMenuItem>
                <Link href="/login" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Login
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
            {user && (
              <>
                <NavigationMenuItem className="cursor-pointer">
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    onClick={handleLogout}
                  >
                    Log out
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/user" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {user.username}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        <ModeToggle />
      </div>
    </nav>
  );
}