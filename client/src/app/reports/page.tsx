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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownUp } from "lucide-react";

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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const user = useAuthStore((state) => state.user);

  // const delay = (ms: number) =>
  //   new Promise((resolve) => setTimeout(resolve, ms));
  // await delay(1000); // This is a delay function to test the loading spinner

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      eden.reports["get-reports"]
        .post({
          page: currentPage,
          pageSize: pageSize,
          sortBy,
          sortOrder,
        })
        .then((response) => {
          if (response.status !== 200) {
            console.error(response.error.value);
          } else {
            setReports(response.data.reports);
            const totalReports = response.data.totalReports;
            setTotalPages(Math.ceil(totalReports / pageSize));
          }
          setLoading(false);
        });
    };

    fetchReports();
  }, [currentPage, sortBy, sortOrder, pageSize]);

  return (
    <Card className="relative">
      <div className="min-w-96"></div>
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
        <div>
          <Dialog>
            <DialogTrigger>
              <Button variant="outline">
                <ArrowDownUp />
                Sort / Filter / Size
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sort / Filter / Size</DialogTitle>
                <DialogDescription>
                  Here you can customize the sorting, ordering and page size of
                  the reports page.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 pt-2">
                <div>
                  <p className="text-sm mb-2">Sort by:</p>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Set ordering">
                        {sortBy
                          ? sortBy === "createdAt"
                            ? "Time of creation"
                            : "Score"
                          : "Set ordering"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">
                        Time of creation
                      </SelectItem>
                      <SelectItem value="score">Score</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select
                    value={sortOrder}
                    onValueChange={(value) =>
                      setSortOrder(value as "asc" | "desc")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Set ordering">
                        {sortBy
                          ? sortBy === "asc"
                            ? "Ascending"
                            : "Descending"
                          : "Set sorting"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-sm mb-2">Page size:</p>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => setPageSize(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Set page size">
                        {pageSize} items
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 items</SelectItem>
                      <SelectItem value="5">5 items</SelectItem>
                      <SelectItem value="10">10 items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          [...Array(pageSize)].map((_, i) => (
            <Skeleton key={i} className="w-96 h-40 rounded-lg mt-5" />
          ))
        ) : !loading && reports ? (
          <div className="flex flex-col gap-5">
            {reports.map((report: Report) => (
              <Card key={report.id} className="relative max-w-96">
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
      <CardFooter>
        <Pagination>
          <PaginationContent>
            {/* Previous Page Button */}
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(currentPage - 1);
                  }}
                />
              </PaginationItem>
            )}
            {/* If there are more than 5 pages, show ellipsis */}
            {currentPage > 3 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(1);
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationEllipsis />
              </>
            )}
            {/* Display up to 5 page numbers around the current page */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === currentPage ||
                  page === currentPage - 1 ||
                  page === currentPage + 1
              )
              .map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
            {/* If there are more pages ahead, show ellipsis */}
            {currentPage < totalPages - 2 && (
              <>
                <PaginationEllipsis />
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(totalPages);
                    }}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            {/* Next Page Button */}
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(currentPage + 1);
                  }}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
