"use client";

import { eden } from "@/utils/api";
import { useEffect, useState } from "react";
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

interface Report {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReports = async () => {
      eden.reports["all-reports"].get().then((response) => {
        if (response.status !== 200) {
          console.error(response.error.value);
        } else {
          setReports(response.data);
        }
        setLoading(false);
      });
    };

    fetchReports();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : reports ? (
        <div>
          {reports.map((report: Report) => (
            <Card key={report.id} className="mt-5">
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
    </div>
  );
}
