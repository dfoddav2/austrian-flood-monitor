"use client";

import { eden } from "@/utils/api";
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Report {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchReports = async () => {
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      await delay(1000); // This is a delay function to test the loading spinner
      eden.reports["all-reports"].get().then((response) => {
        if (response.status !== 200) {
          console.error(response.error.value);
        } else {
          console.log("Reporst list: ", response.data);
          setReports(response.data);
        }
        setLoading(false);
      });
    };

    fetchReports();
  }, []);

  return (
    <Card className="relative">
      {user && (
        <div className="absolute top-5 right-5">
          <Link href="/reports/create" passHref>
            <Button>Create new report</Button>
          </Link>
        </div>
      )}
      <CardHeader>
        <CardTitle>Reports</CardTitle>
        <CardDescription>View all reports</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          [...Array(4)].map((_, i) => (
            <Skeleton key={i} className="w-96 h-40 rounded-lg mt-5" />
          ))
        ) : reports ? (
          <div>
            {reports.map((report: Report) => (
              <Card key={report.id} className="mt-5 max-w-96 relative">
                <div className="absolute top-5 right-5">
                  <p>
                    Score:{" "}
                    <span className="font-bold">
                      {report.upvotes - report.downvotes}
                    </span>
                  </p>
                </div>
                <CardHeader>
                  <CardTitle>{report.title}</CardTitle>
                  <p>{new Date(report.createdAt).toLocaleDateString()}</p>
                </CardHeader>
                <CardContent>
                  <CardDescription>{report.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <CardDescription>
                    <Link href={"/reports/" + report.id} passHref>
                      <Button>Visit</Button>
                    </Link>
                  </CardDescription>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p>No reports found</p>
        )}
      </CardContent>
    </Card>
  );
}
