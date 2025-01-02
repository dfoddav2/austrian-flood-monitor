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
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";

export default function EditUserPage() {
  const router = useRouter();
  const { toast } = useToast();

  const user = useAuthStore((state) => state.user);
  const setCookie = useAuthStore((state) => state.setCookie);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  const [userDetails, setUserDetails] = useState({
    name: "",
    username: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);

  // Fetch user details on mount
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
        })
        .finally(() => setLoading(false));
    };
    getUserDetails();
  }, [user]);

  // Update user details
  const formSchema = z.object({
    name: z.preprocess(
      (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
      z.string().min(5, "Name must be at least 5 characters").optional()
    ),
    username: z.preprocess(
      (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
      z.string().min(5, "Username must be at least 5 characters").optional()
    ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoadingUpdate(true);
    eden.user["edit-profile"]
      .post(values)
      .then((response) => {
        if (response.status !== 200) {
          setError(response.error.value);
          console.error(response.error.value);
        } else {
          setCookie("authCookie", response.data.authCookie);
          initializeAuth();
          toast({
            title: "Success",
            description: "User details updated successfully",
          });
          router.push("/user");
        }
      })
      .catch((error) => {
        setError(error.message || "An unknown error occurred");
        console.error(error);
      })
      .finally(() => setLoadingUpdate(false));
  }

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
            <CardDescription>
              Here you may edit your name and username.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name={"name"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder={userDetails.name} {...field} />
                      </FormControl>
                      <FormDescription>
                        Must be between 5 and 50 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={"username"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder={userDetails.username} {...field} />
                      </FormControl>
                      <FormDescription>
                        Must be between 5 and 50 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-x-2">
                  <Button type="submit" disabled={loadingUpdate || loading}>
                    {loadingUpdate && <Loader2 className="animate-spin" />}
                    Submit
                  </Button>
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={() => router.push("/user")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <CardDescription>
              You may change just one of the fields by leaving the other blank.
            </CardDescription>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
