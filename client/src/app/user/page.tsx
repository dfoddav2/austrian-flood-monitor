"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { eden } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function UserPage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const clearToken = useAuthStore((state) => state.clearToken);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (!user) return;
    const getUserDetails = async () => {
      try {
        const response = await eden.user["user-details"].post({
          id: user.id,
          $fetch: {
            mode: "cors",
            credentials: "include",
            method: "POST",
          },
        });

        if (response.status !== 200) {
          console.error(response.error.value);
        } else {
          setUserDetails(response.data);
        }
      } catch (error) {
        console.error(error);
      }
      // eden.user["user-details"]
      //   .post({ id: user.id })
      //   .then((response) => {
      //     if (response.status !== 200) {
      //       console.error(response.error.value);
      //     } else {
      //       setUserDetails(response.data);
      //     }
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //   });
    };
    console.log("Getting user details for user:", user);
    getUserDetails();
  }, [user]); // Only re-run the effect if 'user' changes

  const handleDeleteUser = () => {
    eden.user["delete-account"]
      .delete({
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response);
        if (response.status !== 200) {
          console.error(response.error.value);
        } else {
          clearToken();
          console.log("User deleted");
          router.push("/");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">User page</h1>
      {!user && (
        <>
          <p>You are not logged in.</p>
          <Link href="/login" passHref>
            <Button>Login</Button>
          </Link>
        </>
      )}
      {user && (
        <>
          <p>Welcome, {user.username}!</p>
          <Button variant="destructive" onClick={handleDeleteUser}>
            Delete user
          </Button>
          {userDetails ? (
            <div>
              <h1>User Details</h1>
              <p>Name: {userDetails.name}</p>
              <p>Email: {userDetails.email}</p>
              {/* Display other user details as needed */}
            </div>
          ) : (
            <p>Loading user details...</p>
          )}
        </>
      )}
    </div>
  );
}
