"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { eden } from "@/utils/api";
import { useAuthStore } from "@/store/authStore";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Users, getColumns } from "./columns";
import { DataTable } from "./data-table";

export default function AdminUsersPage() {
  const user = useAuthStore((state) => state.user);

  const [data, setData] = useState<Users[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      eden.admin["get-all-users"]
        .get()
        .then((response) => {
          if (response.status !== 200) {
            console.error("Error fetching users", response.error.value.error);
            return;
          }
          console.log("Users fetched", response.data);
          setData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching users", error);
        })
        .finally(() => {
          setLoadingUsers(false);
        });
    }
    fetchUsers();
  }, []);

  // Function to remove a user from the state
  const removeUser = useCallback((userId: string) => {
    setData((prevData) => prevData.filter((user) => user.id !== userId));
  }, []);

  // Function to update a single user in the state
  const updateUser = useCallback((updatedUser: Users) => {
    setData((prevData) =>
      prevData.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  }, []);

  // Memoize columns to prevent unnecessary re-renders
  const columns = useMemo(() => getColumns(removeUser, updateUser), [removeUser, updateUser]);

  return (
    <>
      {user?.userRole !== "ADMIN" ? (
        <Card>
          <CardHeader>
            <CardTitle>Admin Page</CardTitle>
          </CardHeader>
          <CardContent>You are not authorized to access this page.</CardContent>
          <CardContent>
            <Button asChild>
              <Link href="/">To main page</Link>
            </Button>
          </CardContent>
          <CardFooter>
            <CardDescription>Only admins can access this page.</CardDescription>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Admin Users Page</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              [...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-56 h-20 rounded-lg mt-2" />
              ))
            ) : (
              <DataTable columns={columns} data={data} />
            )}
          </CardContent>
          <CardFooter>
            <CardDescription>
              Here you may view and edit the users of the application.
            </CardDescription>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
