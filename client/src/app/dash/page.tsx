"use client";

import { useState } from "react";
import { useEffect } from "react";
import { eden } from "@/utils/api";
import Link from "next/link";
import dynamic from "next/dynamic";

// import { Button } from "@/components/ui/button";
// import styles from "./page.module.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CldImage } from "next-cloudinary";

interface Image {
  id: string;
  source: string;
  description: string;
}

interface Report {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  images?: Image[];
}

const MapWithRivers = dynamic(() => import("@/components/MapAddOns"), {
  ssr: false,
  loading: () => <Skeleton className="h-40 w-full" />,
});

export default function Home() {
  const [latestReports, setLatestReports] = useState<Report[]>([]);
  const [loadingLatestReports, setLoadingLatestReports] = useState(true);

  useEffect(() => {
    async function fetchLatestReports() {
      eden.reports["get-latest-reports"]
        .get()
        .then((response) => {
          if (response.status !== 200) {
            console.error("Failed to fetch latest reports");
          } else {
            setLatestReports(response.data);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch latest reports", error);
        })
        .finally(() => {
          setLoadingLatestReports(false);
        });
    }
    fetchLatestReports();
  }, []);

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
              {loadingLatestReports && <Skeleton className="h-40 w-full" />}
              {!loadingLatestReports && (
                <div className="space-y-4">
                  {latestReports.length > 0 ? (
                    latestReports.map((report) => (
                      <Card key={report.id}>
                        <CardHeader>
                          <CardTitle>{report.title}</CardTitle>
                          <CardDescription>
                            {new Date(report.createdAt).toLocaleString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>
                            {report.description}
                          </CardDescription>
                          {report.images && (
                            <div className="flex space-x-2 mt-2 flex-wrap">
                              {report.images.map((image) => (
                                <CldImage
                                  key={image.id}
                                  width={200}
                                  height={150}
                                  src={image.source}
                                  // sizes="100vw"
                                  alt={image.description}
                                  className="rounded-lg"
                                />
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <CardDescription>No reports available</CardDescription>
                  )}
                  <Button asChild>
                    <Link href="/reports">View all reports...</Link>
                  </Button>
                </div>
              )}
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
