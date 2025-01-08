"use client";

// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import styles from "./page.module.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
// import Link from "next/link";

const MapWithRivers = dynamic(() => import("@/components/MapAddOns"), {
  ssr: false,
  loading: () => <Skeleton className="h-40 w-full" />,
});

export default function Home() {
  return (
    <>
      <Card className="relative min-w-full sm:min-w-128 md:min-w-160 lg:min-w-192 xl:min-w-224 mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-20 my-4">
        <CardHeader>
          <CardTitle>Welcome to the dashboard</CardTitle>
          <CardDescription>
            This dashboard provides an overview of the current flood situation
            in Austria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription>Map overview</CardDescription>
          <MapWithRivers />
          <Card className="mt-5">
            <CardHeader>
              <CardTitle>Newest reports</CardTitle>
              <CardDescription>Latest reports from the field</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                TODO: here add as a carousel 4 reports, the descriptions,
                timestamps and as the last reports a See more card that takes to
                reports page
              </p>
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter>
          <CardDescription>
            Be vigilant, the data and reports may not be the most up to date,
            nor correct. Do not rely solely on one source.
          </CardDescription>
        </CardFooter>
      </Card>
    </>
  );
}
