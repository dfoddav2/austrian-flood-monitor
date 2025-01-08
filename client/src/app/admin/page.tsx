"use client";

import { useAuthStore } from "@/store/authStore";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <>
      {user?.userRole !== "ADMIN" ? (
        <Card className="relative min-w-full sm:min-w-128 md:min-w-160 lg:min-w-192 xl:min-w-224 mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-20">
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
        <Card className="relative min-w-full sm:min-w-128 md:min-w-160 lg:min-w-192 xl:min-w-224 mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-20">
          <CardHeader>
            <CardTitle>Admin Page</CardTitle>
            <CardDescription>
              You can either see and edit users or reports from here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-x-2">
            <Button asChild>
              <Link href="/admin/users">Users</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/reports">Reports</Link>
            </Button>
          </CardContent>
          <CardContent>
            <Card>
              <CardHeader>News Dashboard</CardHeader>
              <CardContent>
                <CardDescription>
                  TODO: You will be able to see latest new from here via cards.
                </CardDescription>
              </CardContent>
            </Card>
          </CardContent>
          <CardFooter>
            <CardDescription>Only admins can access this page.</CardDescription>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
