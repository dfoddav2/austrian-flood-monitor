"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { eden } from "@/utils/api";
import { useAuthStore } from "@/store/authStore";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Reports, getColumns } from "./columns";
import { DataTable } from "./data-table";

export default function AdminReportsPage() {
  const user = useAuthStore((state) => state.user);

  const [data, setData] = useState<Reports[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      eden.admin["get-all-reports"]
        .get()
        .then((response) => {
          if (response.status !== 200) {
            console.error("Error fetching reports", response.error.value);
            return;
          }
          console.log("Reports fetched", response.data);
          setData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching reports", error);
        })
        .finally(() => {
          setLoadingReports(false);
        });
    }
    fetchReports();
  }, []);

  // Function to remove a user from the state
  const removeReport = useCallback((reportId: string) => {
    setData((prevData) => prevData.filter((report) => report.id !== reportId));
  }, []);

  // Memoize columns to prevent unnecessary re-renders
  const columns = useMemo(() => getColumns(removeReport), [removeReport]);

  return (
    <>
      {user?.userRole !== "ADMIN" ? (
        <Card>
          <CardHeader>
            <CardTitle>Admin Page</CardTitle>
          </CardHeader>
          <CardContent>You are not authorized to access this page.</CardContent>
          <CardContent>
            <Button asChild>
              <Link href="/">To main page</Link>
            </Button>
          </CardContent>
          <CardFooter>
            <CardDescription>Only admins can access this page.</CardDescription>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Admin Reports Page</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingReports ? (
              [...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-56 h-20 rounded-lg mt-2" />
              ))
            ) : (
              <DataTable columns={columns} data={data} />
            )}
          </CardContent>
          <CardFooter>
            <CardDescription>
              Here you may view and edit the reports of the application.
            </CardDescription>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
