"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { eden } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UserPage() {
  const router = useRouter();
  const { toast } = useToast();

  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [userDetails, setUserDetails] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    if (!user) return;
    const getUserDetails = async () => {
      await delay(1000); // This is a delay function to test the loading spinner
      eden.user["user-details"]
        .post({ id: user.id })
        .then((response) => {
          if (response.status !== 200) {
            setError(response.error.value);
            console.error(response.error.value);
          } else {
            console.log("User details:", response.data);
            setUserDetails(response.data);
          }
        })
        .catch((error) => {
          setError(error);
          console.error(error);
        });
    };
    console.log("Getting user details for user:", user);
    getUserDetails();
  }, [user]); // Only re-run the effect if 'user' changes

  const handleDeleteUser = async () => {
    setLoadingDelete(true);
    // TODO: The delay doesn't work here, look into it
    await delay(2000); // This is a delay function to test the loading spinner
    eden.user["delete-account"]
      .delete()
      .then((response) => {
        console.log(response);
        if (response.status !== 200) {
          toast({
            title: "Error",
            description: response.error.value,
          });
          console.error(response.error.value);
        } else {
          setLoadingDelete(false);
          clearAuth();
          console.log("User deleted");
          router.push("/");
          // TODO: Open toaster here
          toast({
            title: "Success",
            description: "User deleted successfully",
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error,
        });
        console.error(error);
      })
      .finally(() => setLoadingDelete(false));
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
            <CardTitle>Welcome, {user.username}!</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Here you can view and edit your user details.
            </CardDescription>
          </CardContent>
          {userDetails ? (
            <>
              <CardContent>
                <div>
                  <h1>User Details</h1>
                  <p>Name: {userDetails.name}</p>
                  <p>Email: {userDetails.email}</p>
                  <p>Upvotes: TODO</p>
                  {/* Display other user details as needed */}
                </div>
              </CardContent>
              <CardContent>
                <div>
                  <h1>Your reports:</h1>
                  <p>LINK TO REPORTS OF THE USER MAYBE EVEN WITH A THUMBNAIL</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="mr-3"
                >
                  <Link href="/user/edit" passHref>
                    Edit User
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button variant="destructive">Delete User</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 hover:bg-red-400 dark:bg-red-800 dark:hover:bg-red-900 dark:text-primary"
                        onClick={handleDeleteUser}
                        disabled={loadingDelete}
                      >
                        {loadingDelete && <Loader2 className="animate-spin" />}
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </>
          ) : (
            <CardContent>
              <Skeleton className="w-[100px] h-[20px] rounded-full" />
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
