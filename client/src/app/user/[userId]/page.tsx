"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { eden } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
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
  const targetUserId = useParams().userId;

  const [userDetails, setUserDetails] = useState<{
    username: string;
    userRole: string;
    name: string;
    email: string;
    verified: boolean;
  } | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
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
    if (!targetUserId) return;
    const getUserDetails = async () => {
      setLoadingUser(true);
      await delay(1000); // This is a delay function to test the loading spinner
      eden.user["user-details"]
        .post({ id: targetUserId as string })
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
        })
        .finally(() => setLoadingUser(false));
    };
    const getReportsAssociatedWithUser = async () => {
      eden.reports["reports-by-author-id"]
        .post({ authorId: targetUserId as string })
        .then((response) => {
          if (response.status !== 200) {
            setError(response.error.value);
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
    getUserDetails();
    getReportsAssociatedWithUser();
  }, [targetUserId]); // Only re-run the effect if 'targetUserId' changes (never)

  const handleDeleteUser = async () => {
    setLoadingDelete(true);
    // TODO: The delay doesn't work here, look into it
    await delay(2000); // This is a delay function to test the loading spinner
    eden.admin["delete-account"]
      .delete({ userId: targetUserId as string })
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
    <div>
      {!user && (
        <Card>
          <CardHeader>
            <CardTitle>You are not logged in</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              You need to be logged in to view a user&apos;s page.
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
      {user && userDetails ? (
        // START OF CARD - USER && USERDETAILS
        <Card>
          {/* USERDETAILS CARD HEADER */}
          <CardHeader>
            <CardTitle>{userDetails.username}</CardTitle>
          </CardHeader>
          {/* USERDETAILS CARD CONTENT */}
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
          {/* USERDETAILS CARD CONTENT */}
          {user.userRole === "ADMIN" && (
            <CardContent>
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
                      This action cannot be undone. This will permanently delete
                      the account and remove all their data from our servers.
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
          )}
          {/* USERDETAILS CARD FOOTER */}
          <CardFooter>
            {/* LOADING USER'S REPORTS */}
            {loadingReports ? (
              <Skeleton className="w-64 h-24 rounded-lg" />
            ) : (
              <div className="flex flex-col space-y-4 w-full">
                <CardDescription>User&apos;s reports:</CardDescription>
                {/* IF THERE ARE REPORTS RENDER */}
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
                  // END OF RENDER ALL OF THE USER'S REPORTS IN CARDS
                  // IF THERE ARE NO REPORTS RENDER
                  <CardDescription>No reports yet...</CardDescription>
                )}
              </div>
            )}
          </CardFooter>
        </Card>
      ) : loadingUser ? (
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="w-40 h-16 rounded-lg" />
            <Skeleton className="w-40 h-10 rounded-lg" />
            <Skeleton className="w-40 h-10 rounded-lg" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>User not found</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              The user with ID: {targetUserId} could not be found.
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
