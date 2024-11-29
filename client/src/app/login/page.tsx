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
// import { useEffect, useState } from "react";
// import { eden } from "@/utils/api";

export default function LoginPage() {
  // const setToken = useAuthStore((state) => state.setToken);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const router = useRouter();

  const formSchema = z.object({
    email: z.string().email().min(8).max(50),
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
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    eden.auth.login
      .post(values)
      .then((response) => {
        console.log("Outcome: ", response);

        if (response.status !== 200) {
          console.error(response.error.value.error);
        } else {
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
      <h1 className="text-3xl font-bold pb-4">This is the login page</h1>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
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
            <CardDescription>No account yet?</CardDescription>
            <Link
              href="/register"
              className="text-blue-500 hover:text-blue-700 hover:underline text-sm"
            >
              Register here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
