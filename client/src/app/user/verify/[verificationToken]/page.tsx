"use client";

import { eden } from "@/utils/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";

export default function VerifyTokenPage() {
  let { verificationToken } = useParams();
  verificationToken = Array.isArray(verificationToken)
    ? verificationToken[0]
    : verificationToken;

  const user = useAuthStore((state) => state.user);
  const setCookie = useAuthStore((state) => state.setCookie);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!verificationToken) {
      setError("Verification token not provided");
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      eden.auth.verify
        .post({ verificationToken })
        .then((response) => {
          if (response.status !== 200) {
            setError(response.error.value.error);
            console.error(response.error.value.error);
          } else {
            setCookie("authCookie", response.data.authCookie);
            initializeAuth();
            // router.push("/");
          }
        })
        .catch((error) => {
          setError(error);
          console.error(error);
        })
        .finally(() => setLoading(false));
    };

    verifyEmail();
  }, [verificationToken, initializeAuth, setCookie]);

  return (
    <div>
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
      <Card className="min-w-96">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex flex-col gap-2">
              <CardDescription>
                <Loader2 className="w-4 h-4" />
              </CardDescription>
              <CardDescription>Verifying your email...</CardDescription>
            </div>
          )}
          {!loading && !error ? (
            <div className="flex flex-col gap-2">
              <CardDescription>
                Your email has been successfully verified!
              </CardDescription>
              <Link href="/user" passHref>
                <Button>To user page</Button>
              </Link>
            </div>
          ) : user && !user.verified ? (
            <div className="flex flex-col gap-2">
              <CardDescription>
                Email could not be verified, request new verification link here
              </CardDescription>
              <Link href="/user/verify" passHref>
                <Button>To verification request</Button>
              </Link>
            </div>
          ) : user && user.verified ? (
            <div className="flex flex-col gap-2">
              <CardDescription>
                You have already verified your email address
              </CardDescription>
              <Link href="/user" passHref>
                <Button>User page</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <CardDescription>
                Email could not be verified, sign in to request new verification
                link
              </CardDescription>
              <Link href="/login" passHref>
                <Button>Sign in</Button>
              </Link>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex flex-col">
            <CardDescription>
              Verification link not working? Request a new one here:
            </CardDescription>
            <Link
              href="/user/verify"
              className="text-blue-500 hover:text-blue-700 hover:underline text-sm"
            >
              Verification page
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
