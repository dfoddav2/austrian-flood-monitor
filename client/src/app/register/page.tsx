"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { eden } from "@/utils/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const setCookie = useAuthStore((state) => state.setCookie);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const router = useRouter();

  const formSchema = z.object({
    email: z.string().email().min(8).max(50),
    name: z.string().min(5).max(50),
    username: z.string().min(5).max(50),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(50, "Password must be at most 50 characters long"),
    // TODO: Password validation, hashing and security may come late
    // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .regex(/[0-9]/, "Password must contain at least one number")
    // .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    eden.auth.register
      .post(values)
      .then((response) => {
        console.log("Outcome: ", response);

        if (response.status !== 200) {
          console.error(response.data.error);
        } else {
          setCookie("authCookie", response.data.authCookie);
          setCookie("token", response.data.token);
          initializeAuth();
          router.push("/");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div>
      <h1 className="text-3xl font-bold pb-4">This is the register page</h1>
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Please note the requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="E-mail" type="email" {...field} />
                    </FormControl>
                    <FormDescription>
                      Must be a valid E-mail address
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormDescription>Your full name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormDescription>Minimum 5 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Minimum 8 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col">
            <CardDescription>Already have an account?</CardDescription>
            <Link
              href="/login"
              className="text-blue-500 hover:text-blue-700 hover:underline text-sm"
            >
              Login here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
