"use client";

import { eden } from "@/utils/api";
import { useState } from "react";
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
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VerifyPage() {
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);

  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const requestVerificationEmail = async () => {
    setLoading(true);
    eden.auth["request-verification"]
      .post(undefined)
      .then((response) => {
        if (response.status !== 200) {
          setError(response.error.value?.error || "Something went wrong");
          console.error(response.error.value.error);
        } else {
          console.log("Email verification outcome:", response.data);
          toast({
            title: "Success",
            description: "We have sent you a verification email",
          });
          setSuccess(true);
        }
      })
      .catch((error) => {
        setError(error);
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

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
          <CardTitle>Request Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          {user && !user.verified ? (
            <div className="flex flex-col gap-2">
              {!success ? (
                <>
                  <CardDescription>
                    Please verify your email address to access all features.
                  </CardDescription>
                  <div>
                    <Button
                      onClick={requestVerificationEmail}
                      disabled={loading}
                    >
                      {loading && <Loader2 className="animate-spin" />}
                      Request Verification Email
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    <p>Success</p>
                  </div>
                  <CardDescription className="inline">
                    We have sent you a verification email. Please verify your
                    profile by clicking the link in the email.
                  </CardDescription>
                </>
              )}
            </div>
          ) : user && user.verified ? (
            <div className="flex items-center gap-1">
              <CardDescription>
                <CheckCircle className="h-4 w-4" />
              </CardDescription>
              <CardDescription>
                You are already verified, no need to request verification.
              </CardDescription>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <CardDescription>
                  <AlertCircle className="h-4 w-4" />
                </CardDescription>
                <CardDescription>
                  You need to be logged in to request email verification.
                </CardDescription>
              </div>

              <Link href="/login" passHref>
                <Button>Login</Button>
              </Link>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex flex-col">
            <CardDescription>
              Sending the email may take up to a few minutes.
            </CardDescription>
            <Link
              href="/reports"
              className="text-blue-500 hover:text-blue-700 hover:underline text-sm"
            >
              Browse reports here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
