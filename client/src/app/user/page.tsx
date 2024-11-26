"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import styles from "./page.module.css";

export default function UserPage() {
  const user = useAuthStore((state) => state.user);
  

  return (
    <div>
      <h1 className="text-3xl font-bold">User page</h1>
      {user && <p>Welcome, {user.username}!</p>}
      {!user && (
        <>
          <p>You are not logged in.</p>
          <Link href="/login" passHref>
            <Button>Login</Button>
          </Link>
        </>
      )}
    </div>
  );
}
