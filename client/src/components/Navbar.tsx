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

export default function Navbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="bg-gray-800 dark:bg-gray-900 p-4 w-full flex justify-between items-center">
      <Link href="/" className="text-white text-2xl font-bold">
        AFM
      </Link>
      <div className="flex gap-1">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/testing" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Testing
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/login" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Login
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        {user && (
          <span className="text-white ml-4">Welcome, {user.username}</span>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
}
