"use client";

import { eden } from "@/utils/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { CldImage } from "next-cloudinary";

import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
});

interface Report {
  id: string;
  authorId: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  images: { id: string; source: string; description: string }[];
  comments: {
    id: string;
    user: { name: string };
    content: string;
    timestamp: string;
  }[];
  upvotes: number;
  downvotes: number;
  upvotedByUser: boolean;
  downvotedByUser: boolean;
}

const ReportPage = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  console.log("user", user);

  const { reportId } = useParams<{ reportId: string | string[] }>();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingUpvote, setLoadingUpvote] = useState<boolean>(false);
  const [loadingDownvote, setLoadingDownvote] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [loadingComment, setLoadingComment] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) {
      return;
    }

    const reportIdStr = Array.isArray(reportId) ? reportId[0] : reportId;

    const fetchReport = async () => {
      eden.reports["report-by-id"]
        .post({ reportId: reportIdStr })
        .then((response) => {
          if (response.status !== 200) {
            console.error(response.error.value);
          } else {
            console.log("Report", response.data);
            setReport(response.data);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    };

    fetchReport();
  }, [reportId]);

  const handleUpvote = async () => {
    if (!report) {
      return;
    }

    setLoadingUpvote(true);
    eden.reports["upvote-report"]
      .post({ reportId: report.id })
      .then((response) => {
        if (response.status !== 200) {
          // console.log("response", response);
          setError(response.error.value.error);
          console.error(response.error.value.error);
        } else {
          setReport((prevReport) => {
            if (prevReport) {
              const increment = prevReport.downvotedByUser ? 2 : 1;
              return {
                ...prevReport,
                upvotedByUser: true,
                downvotedByUser: false,
                upvotes: prevReport.upvotes + increment,
              };
            }
            return prevReport;
          });
        }
      })
      .catch((error) => {
        console.error(error);
        setError("Something went wrong");
      })
      .finally(() => {
        setLoadingUpvote(false);
      });
  };

  const handleDownvote = async () => {
    if (!report) {
      return;
    }

    setLoadingDownvote(true);
    eden.reports["downvote-report"]
      .post({ reportId: report.id })
      .then((response) => {
        if (response.status !== 200) {
          setError(response.error.value.error);
          console.error(response.error.value.error);
        } else {
          setReport((prevReport) => {
            if (prevReport) {
              const decrement = prevReport.upvotedByUser ? 2 : 1;
              return {
                ...prevReport,
                upvotedByUser: false,
                downvotedByUser: true,
                upvotes: prevReport.upvotes - decrement,
              };
            }
            return prevReport;
          });
        }
      })
      .catch((error) => {
        console.error(error);
        setError("Something went wrong");
      })
      .finally(() => {
        setLoadingDownvote(false);
      });
  };

  const handleDeleteReport = async () => {
    if (!report) {
      return;
    }

    setLoadingDelete(true);
    eden.reports["delete-report"]
      .delete({ reportId: report.id })
      .then((response) => {
        if (response.status !== 204) {
          setError(response.error.value);
          console.error(response.error.value);
        } else {
          router.push("/reports");
        }
      })
      .catch((error) => {
        console.error(error);
        setError("Something went wrong");
      })
      .finally(() => {
        setLoadingDelete(false);
      });
  };

  const handleNewComment = async () => {
    if (!report) {
      return;
    }

    setLoadingComment(true);
    console.log("Creating new comment");
    eden.reports["comment-on-report"]
      .post({ reportId: report.id, content: "New comment" })
      .then((response) => {
        if (response.status !== 201) {
          setError(response.error.value.error);
          console.error(response.error.value.error);
        } else {
          console.log("Comment created", response.data);
          setReport((prevReport) => {
            if (prevReport) {
              return {
                ...prevReport,
                comments: [
                  ...prevReport.comments,
                  {
                    id: response.data.id,
                    user: { name: user?.username || "Unknown" },
                    content: "New comment",
                    timestamp: response.data.timestamp,
                  },
                ],
              };
            }
            return prevReport;
          });
        }
      })
      .catch((error) => {
        console.error(error);
        setError("Something went wrong");
      })
      .finally(() => {
        setLoadingComment(false);
      });
  };

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-5">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold text-base">Error</AlertTitle>
          <AlertDescription>
            <div className="flex justify-between items-center">
              {error.toString()}
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
      <Card className="max-w-2xl relative">
        {loading ? (
          <>
            <CardHeader>
              <CardTitle>
                <Skeleton className="w-24 h-8 rounded-lg mt-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <Skeleton className="w-24 h-6 rounded-lg" />
                <Skeleton className="w-40 h-6 rounded-lg mt-2" />
              </CardDescription>
              <Skeleton className="w-96 h-40 rounded-lg mt-5" />
            </CardContent>
          </>
        ) : report ? (
          <>
            {user && user.id === report.authorId ? (
              <div className="absolute top-5 right-5">
                <div className="flex flex-col">
                  <div className="flex gap-2">
                    {/* TODO: Create edit report page */}
                    <Link href={`/reports/${report.id}/edit`} passHref>
                      <Button>Edit report</Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete report</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="z-50">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your report and its associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-400 dark:bg-red-800 dark:hover:bg-red-900 dark:text-primary"
                            onClick={handleDeleteReport}
                            disabled={loadingDelete}
                          >
                            {loadingDelete && (
                              <Loader2 className="animate-spin" />
                            )}
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <p className="ml-auto">
                    Score:{" "}
                    <span className="font-bold">
                      {report.upvotes - report.downvotes}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="absolute top-5 right-5 flex gap-2 items-center">
                <Button
                  onClick={handleUpvote}
                  // className="w-6 h-6 text-green-500 hover:text-green-700 focus:outline-none"
                  className={report.upvotedByUser ? "text-green-500" : ""}
                  aria-label="Upvote"
                  disabled={
                    loadingUpvote ||
                    loadingDownvote ||
                    !user ||
                    report.upvotedByUser
                  }
                >
                  {loadingUpvote && <Loader2 className="animate-spin" />}
                  {!loadingUpvote && <ThumbsUp className="w-6 h-6" />}
                </Button>
                <p className="font-bold">{report.upvotes - report.downvotes}</p>
                <Button
                  onClick={handleDownvote}
                  // className="w-6 h-6 text-red-500 hover:text-red-700 focus:outline-none"
                  className={report.downvotedByUser ? "text-red-500" : ""}
                  aria-label="Downvote"
                  disabled={
                    loadingUpvote ||
                    loadingDownvote ||
                    !user ||
                    report.downvotedByUser
                  }
                >
                  {loadingDownvote && <Loader2 className="animate-spin" />}
                  {!loadingDownvote && <ThumbsDown className="w-6 h-6" />}
                </Button>
              </div>
            )}
            <CardHeader>
              <CardTitle>{report.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <p className="font-bold">Description:</p>
                <p>{report.description}</p>
              </CardDescription>
              {report.images.length > 0 && (
                <Carousel className="mx-8 mt-5">
                  <CarouselPrevious />
                  <CarouselContent>
                    {report.images.map((image) => (
                      <CarouselItem key={image.id}>
                        <CldImage
                          width={800}
                          height={500}
                          src={image.source}
                          // sizes="100vw"
                          alt={image.description}
                          className="rounded-lg"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselNext />
                </Carousel>
              )}
              <CardDescription className="mt-5">
                <p className="font-bold">Location:</p>
                <Map latitude={report.latitude} longitude={report.longitude} />
              </CardDescription>
            </CardContent>
            <Separator className="mb-5" />
            <CardFooter>
              <CardDescription>
                <p className="font-bold">Metadata:</p>
                <p>{`Coordinates: ${report.latitude.toFixed(
                  5
                )}, ${report.longitude.toFixed(5)}`}</p>
                <p>Report ID: {report.id}</p>
              </CardDescription>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Report could not found</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <p>The report you are looking for does not exist</p>
                <Link
                  href="/reports"
                  className="text-blue-500 hover:text-blue-700 hover:underline text-sm"
                >
                  Browse other reports
                </Link>
              </CardDescription>
            </CardContent>
            <CardFooter>
              <CardDescription>
                <p>Report ID: {reportId}</p>
              </CardDescription>
            </CardFooter>
          </>
        )}
      </Card>
      {(user?.userRole === "RESPONDER" ||
        user?.userRole === "ADMIN" ||
        user?.id === report?.authorId) && (
        <Card className="max-w-2xl mt-5 relative">
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent className="mt-5">
            {report?.comments?.map((comment) => (
              <Card key={comment.id} className="mb-4">
                <CardHeader>
                  <CardTitle>{comment.user.name}</CardTitle>
                  <CardDescription>
                    {" "}
                    {new Date(comment.timestamp).toLocaleString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{comment.content}</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
          <div className="absolute top-5 right-5 flex gap-2 items-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button aria-label="Comment">Comment</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Comment on this report</AlertDialogTitle>
                  <AlertDialogDescription>
                    Here you can give additional information or ask questions
                    regarding the report.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleNewComment}
                    disabled={loadingComment}
                  >
                    {loadingComment && <Loader2 className="animate-spin" />}
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReportPage;
