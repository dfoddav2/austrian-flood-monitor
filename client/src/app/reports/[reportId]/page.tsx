"use client";

import { eden } from "@/utils/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
import { Separator } from "@/components/ui/separator";
import { CldImage } from "next-cloudinary";

interface Report {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  images: { id: string; source: string; description: string }[];
}

const ReportPage = () => {
  const { reportId } = useParams<{ reportId: string | string[] }>();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : report ? (
        <Card className="max-w-2xl">
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
              <Image
                src="https://bufferwall.com/download/B20190923T000000374_1200x600.jpg"
                alt="Placeholder of a map showing the location of the report"
                width={800}
                height={500}
                layout="responsive"
                className="rounded-lg"
              />
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
        </Card>
      ) : (
        <Card>
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
        </Card>
      )}
    </div>
  );
};

export default ReportPage;
