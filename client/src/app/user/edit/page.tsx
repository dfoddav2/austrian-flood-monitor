"use client";

import { useAuthStore } from "@/store/authStore";
import { eden } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EditUserPage() {
  const router = useRouter();
  const { toast } = useToast();

  const user = useAuthStore((state) => state.user);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    username: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;
    const getUserDetails = async () => {
      eden.user["user-details"]
        .post({ id: user.id })
        .then((response) => {
          if (response.status !== 200) {
            setError(response.error.value);
            console.error(response.error.value);
          } else {
            setUserDetails(response.data);
          }
        })
        .catch((error) => {
          setError(error);
          console.error(error);
        });
    };
    getUserDetails();
  }, [user]);

  const handleUpdateUser = async () => {
    setLoading(true);
    eden.user["edit-profile"]
      .post({
        id: user.id,
        email: userDetails.email,
        name: userDetails.name,
        username: userDetails.username,
      })
      .then((response) => {
        if (response.status !== 200) {
          toast({
            title: "Error",
            description: response.error.value,
          });
          console.error(response.error.value);
        } else {
          toast({
            title: "Success",
            description: "User details updated successfully",
          });
          router.push("/user");
        }
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error,
        });
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      {!user && (
        <Card>
          <CardHeader>
            <CardTitle>You are not logged in</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              You need to be logged in to view this page.
            </CardDescription>
          </CardContent>
          <CardContent>
            <Link href="/login" passHref>
              <Button>Login</Button>
            </Link>
          </CardContent>
        </Card>
      )}
      {error && (
        <Alert variant="destructive" className="mb-5">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold text-base">Error</AlertTitle>
          <AlertDescription>
            <div className="flex justify-between items-center">
              {error}
              <Button
                variant="destructive"
                onClick={() => {
                  setError(null);
                }}
              >
                Dismiss
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Edit User Details</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Here you can edit your user details.
            </CardDescription>
          </CardContent>
          <CardContent>
            <div>
              <label>Name</label>
              <Input
                value={userDetails.name}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, name: e.target.value })
                }
              />
            </div>
            <div>
              <label>Email</label>
              <Input
                value={userDetails.email}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, email: e.target.value })
                }
              />
            </div>
            <div>
              <label>Username</label>
              <Input
                value={userDetails.username}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, username: e.target.value })
                }
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleUpdateUser} disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}