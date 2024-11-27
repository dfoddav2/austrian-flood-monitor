"use client";

import { eden } from "@/utils/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

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

const ReportPage = () => {
  const { reportId } = useParams();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reportId) {
      return;
    }
    const fetchReport = async () => {
      eden.reports["report-by-id"]
        .post({ reportId })
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
                      <Image
                        src={image.source}
                        alt={image.description}
                        width={800}
                        height={500}
                        layout="responsive"
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
        // <>
        //   <p>Report ID: {report.id}</p>
        //   <p>Title: {report.title}</p>
        //   <p>Description: {report.description}</p>
        //   <p>Latitude: {report.latitude}</p>
        //   <p>Longitude: {report.longitude}</p>
        // </>
        <p>Report not found.</p>
      )}
      {/* Render other report details as needed */}
    </div>
  );
};

export default ReportPage;
