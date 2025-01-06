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
import { AlertCircle, CircleCheck, Loader2, ArrowDownUp } from "lucide-react";

import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
});

interface Report {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  distance?: number;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [userLatitude, setUserLatitude] = useState<number | null>(null);
  const [userLongitude, setUserLongitude] = useState<number | null>(null);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);

  // const delay = (ms: number) =>
  //   new Promise((resolve) => setTimeout(resolve, ms));
  // await delay(1000); // This is a delay function to test the loading spinner

  const fetchLocation = () => {
    setLoadingLocation(true);
    setLocationError(null);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLatitude(position.coords.latitude);
          setUserLongitude(position.coords.longitude);
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error obtaining location:", error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("Location access denied by the user.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setLocationError("The request to get user location timed out.");
              break;
            default:
              setLocationError(
                "An unknown error occurred while obtaining location."
              );
              break;
          }
          setLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // 10 seconds
          maximumAge: 0,
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);

      // Prepare the request data
      const requestData: {
        page: number;
        pageSize: number;
        sortBy: string;
        sortOrder: string;
        userLatitude?: number;
        userLongitude?: number;
      } = {
        page: currentPage,
        pageSize: pageSize,
        sortBy,
        sortOrder,
      };

      // Include user's location if sorting by proximity
      if (sortBy === "distance" && userLatitude && userLongitude) {
        requestData.userLatitude = userLatitude;
        requestData.userLongitude = userLongitude;
      }

      eden.reports["get-reports"]
        .post(requestData)
        .then((response) => {
          if (response.status !== 200) {
            console.error(response.error.value);
          } else {
            setReports(response.data.reports);
            const totalReports = response.data.totalReports;
            setTotalPages(Math.ceil(totalReports / pageSize));
          }
        })
        .catch((error) => {
          // TODO: Nicer error handling of fetch here
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchReports();
  }, [currentPage, sortBy, sortOrder, pageSize, userLatitude, userLongitude]);

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
            <DialogTrigger asChild>
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
                  the reports page. To sort by proximity, please allow location,
                  click the button below and then set the ordering to Distance.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 pt-2">
                <div>
                  <p className="text-sm mb-2">Sort by:</p>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => {
                      setCurrentPage(1);
                      setSortBy(value);
                      if (
                        value === "distance" &&
                        !userLatitude &&
                        !userLongitude
                      ) {
                        fetchLocation();
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Set ordering">
                        {sortBy
                          ? sortBy === "createdAt"
                            ? "Time of creation"
                            : sortBy === "score"
                            ? "Score"
                            : "Distance"
                          : "Set ordering"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">
                        Time of creation
                      </SelectItem>
                      <SelectItem value="score">Score</SelectItem>
                      <SelectItem
                        value="distance"
                        disabled={!userLatitude || !userLongitude}
                      >
                        Proxmity
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select
                    value={sortOrder}
                    onValueChange={(value) => {
                      setCurrentPage(1);
                      setSortOrder(value as "asc" | "desc");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Set ordering">
                        {sortOrder
                          ? sortOrder === "asc"
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
                {/* Location Fetching Section */}
                <div>
                  <p className="text-sm mb-2">Location:</p>
                  {userLatitude && userLongitude ? (
                    <>
                      <Button
                        onClick={fetchLocation}
                        disabled={loadingLocation}
                        className="mb-2"
                      >
                        {loadingLocation && (
                          <Loader2 className="animate-spin" />
                        )}
                        Refetch Location
                      </Button>
                      <div className="flex items-center gap-2 text-sm">
                        <CircleCheck className="h-4 w-4" />
                        <span>Location fetched successfully</span>
                      </div>

                      <div className="mt-2">
                        <Map
                          latitude={userLatitude}
                          longitude={userLongitude}
                        />
                      </div>
                    </>
                  ) : loadingLocation ? (
                    <Button disabled>
                      <Loader2 className="animate-spin" />
                      Fetching location...
                    </Button>
                  ) : (
                    <div>
                      {locationError && (
                        <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{locationError}</span>
                        </div>
                      )}
                      <Button
                        onClick={fetchLocation}
                        disabled={loadingLocation}
                      >
                        {loadingLocation && (
                          <Loader2 className="animate-spin mr-2" />
                        )}
                        Fetch Location
                      </Button>
                    </div>
                  )}
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
            <Skeleton key={i} className="w-52 h-20 rounded-lg mt-2" />
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
                  {sortBy === "distance" && report.distance !== undefined && (
                    <p>
                      Distance:{" "}
                      <span className="font-bold">
                        {report.distance.toFixed(2)} km
                      </span>
                    </p>
                  )}
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
