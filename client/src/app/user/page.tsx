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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AssociatedReport {
  id: string;
  title: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
}

export default function UserPage() {
  const router = useRouter();
  const { toast } = useToast();

  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [userDetails, setUserDetails] = useState<{
    username: string;
    userRole: string;
    name: string;
    email: string;
    verified: boolean;
  } | null>(null);
  const [loadingReports, setLoadingReports] = useState<boolean>(true);
  const [associatedReports, setAssociatedReports] = useState<
    AssociatedReport[] | null
  >(null);
  const [totalScore, setTotalScore] = useState<number>(0);

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
            setError(response.error.value?.error || "Something went wrong");
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
    const getReportsAssociatedWithUser = async () => {
      eden.reports["reports-by-author-id"]
        .post({ authorId: user.id })
        .then((response) => {
          if (response.status !== 200) {
            setError(response.error.value?.error || "Something went wrong");
            console.error(response.error.value);
          } else {
            console.log("Reports associated with user:", response.data);
            setAssociatedReports(response.data);
            setTotalScore(
              response.data.reduce(
                (acc: number, report: AssociatedReport) =>
                  acc + report.upvotes - report.downvotes,
                0
              )
            );
          }
        })
        .catch((error) => {
          setError(error);
          console.error(error);
        })
        .finally(() => setLoadingReports(false));
    };
    console.log("Getting user details for user:", user);
    getUserDetails();
    getReportsAssociatedWithUser();
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
    <>
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
        <div className="relative min-w-full sm:min-w-128 md:min-w-160 lg:min-w-192 xl:min-w-224 mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-20">
          <Alert
            variant="destructive"
            className="relative min-w-full sm:min-w-128 md:min-w-160 lg:min-w-192 xl:min-w-224 mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-20 mb-5"
          >
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
        </div>
      )}
      {user && (
        <Card className="relative min-w-full sm:min-w-128 md:min-w-160 lg:min-w-192 xl:min-w-224 mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-20 my-4">
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
              {!userDetails.verified && (
                <CardContent>
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="font-bold text-base">
                      Email not verified
                    </AlertTitle>
                    <AlertDescription>
                      <p>
                        Please verify via the email we sent you, or{" "}
                        <Link
                          href="/user/verify"
                          className="font-bold underline"
                        >
                          get a new one here.
                        </Link>
                      </p>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              )}
              <CardContent>
                User details:
                <CardDescription>
                  <div>
                    Role: <Badge>{userDetails.userRole}</Badge>
                  </div>
                  <p>Username: {userDetails.username}</p>
                  <p>Email: {userDetails.email}</p>
                  <p>Name: {userDetails.name}</p>
                  <p>Verified: {userDetails.verified ? "True" : "False"}</p>
                  <strong>Total score: {totalScore}</strong>
                </CardDescription>
              </CardContent>
              <CardContent>
                <Button className="mr-3">
                  <Link href="/user/edit" passHref>
                    Edit User
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
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
              </CardContent>
              <CardFooter>
                {loadingReports ? (
                  <Skeleton className="w-64 h-24 rounded-lg" />
                ) : (
                  <div className="flex flex-col space-y-4 w-full">
                    <CardDescription>Your reports:</CardDescription>
                    {associatedReports ? (
                      associatedReports.map((report) => (
                        <Card key={report.id}>
                          <CardHeader>
                            <CardTitle>{report.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription>
                              Score: {report.upvotes - report.downvotes}
                            </CardDescription>
                            <CardDescription>
                              {new Date(report.createdAt).toLocaleString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </CardDescription>
                          </CardContent>
                          <CardFooter>
                            <Link href={`/reports/${report.id}`} passHref>
                              <Button variant="secondary">View Report</Button>
                            </Link>
                          </CardFooter>
                        </Card>
                      ))
                    ) : (
                      <CardDescription>No reports yet...</CardDescription>
                    )}
                  </div>
                )}
              </CardFooter>
            </>
          ) : (
            <CardContent className="space-y-4">
              <Skeleton className="w-40 h-16 rounded-lg" />
              <Skeleton className="w-40 h-10 rounded-lg" />
              <Skeleton className="w-40 h-10 rounded-lg" />
            </CardContent>
          )}
        </Card>
      )}
    </>
  );
}
