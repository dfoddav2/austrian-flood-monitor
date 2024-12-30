"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { eden } from "@/utils/api";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
  CldImage,
} from "next-cloudinary";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportEditPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { reportId } = useParams<{ reportId: string | string[] }>();

  const [report, setReport] = useState<Report | null>(null);
  const [loadingReport, setLoadingReport] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<string[] | []>([]);

  // Set up form
  const formSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(500, "Description is too long"),
    images: z.array(z.string()).default([]), // Array of image URLs
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      images: [], // Initialize as an empty array
    },
  });

  useEffect(() => {
    if (!reportId) return;
    const idStr = Array.isArray(reportId) ? reportId[0] : reportId;
    setLoadingReport(true);
    eden.reports["report-by-id"]
      .post({ reportId: idStr })
      .then((response) => {
        if (response.status === 200) {
          const fetchedImages = response.data.images.map((img) => img.source);
          setReport(response.data);
          form.reset({
            title: response.data.title,
            description: response.data.description,
            images: fetchedImages,
          });
          setImages(fetchedImages); // <-- Update the component state
        } else {
          setError("Failed fetching report");
        }
      })
      .catch(() => setError("Something went wrong"))
      .finally(() => setLoadingReport(false));
  }, [reportId, form]);

  // On submit of report upload
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!report) return;
    setLoading(true);
    console.log("Submitting form", values);
    eden.reports["edit-report"]
      .post({
        reportId: reportId as string,
        title: values.title,
        description: values.description,
        images: values.images.map((url, i) => ({
          source: url,
          description: `${values.title} image ${i}`,
        })),
      })
      .then((response) => {
        if (response.status === 200) {
          toast({ title: "Success", description: "Report updated" });
          router.push(`/reports/${report.id}`);
        } else {
          setError(response.error.value?.error || "Update failed");
        }
      })
      .catch((error) => setError(error.message || "An error occurred"))
      .finally(() => setLoading(false));
  }

  interface CloudinaryUploadWidgetInfo {
    secure_url: string;
    // Add other properties if needed
  }

  // Handle image upload
  const handleUpload = (results: CloudinaryUploadWidgetResults) => {
    if (results.event === "success" && results.info) {
      const info = results.info as CloudinaryUploadWidgetInfo;
      const imageUrl = info.secure_url;
      const currentImages = form.getValues("images") || [];
      form.setValue("images", [...currentImages, imageUrl]);
      setImages([...currentImages, imageUrl]);
    }
  };

  // Remove image
  const removeImage = (imageUrl: string) => {
    const currentImages = form.getValues("images") || [];
    const updatedImages = currentImages.filter((image) => image !== imageUrl);
    form.setValue("images", updatedImages);
    setImages(images.filter((image) => image !== imageUrl));
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
      <Card className="min-w-96">
        <CardHeader>
          <CardTitle>Edit report</CardTitle>
          <CardDescription>Please note the requirements</CardDescription>
        </CardHeader>
        {loadingReport ? (
          <CardContent>
            <Skeleton className="w-60 h-24 rounded-lg" />
          </CardContent>
        ) : (
          <>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Title" {...field} />
                        </FormControl>
                        <FormDescription>
                          Make it short and descriptive
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          {/* <Input placeholder="Description" {...field} /> */}
                          <Textarea
                            placeholder="Description"
                            className="min-h-5"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Give as much detail as possible in max 500 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <div>
                        <CldUploadWidget
                          uploadPreset="unsigned_flooding"
                          onSuccess={(results) => {
                            console.log("Upload success", results);
                            // console.log("Public ID", results.info.public_id);
                            // console.log("Public ID", results.info.secure_url);
                            handleUpload(results);
                          }}
                          options={{ multiple: true, maxFiles: 3 }}
                          onError={(error) => console.error(error)}
                        >
                          {({ open }) => (
                            <Button type="button" onClick={() => open()}>
                              Upload Image
                            </Button>
                          )}
                        </CldUploadWidget>
                      </div>
                    </FormControl>
                    {images.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {images.map((image, index) => (
                          <div key={index} className="relative">
                            <CldImage
                              // key={index}
                              src={image}
                              alt="Uploaded image"
                              width={200}
                              height={200}
                              className="rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1"
                              onClick={() => removeImage(image)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <FormDescription>
                      Upload at max three images
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                  <Button
                    type="submit"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="animate-spin" />}
                    Submit
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter>
              <CardDescription>
                <p>Please make sure to give as much detail as possible.</p>
                <p>This data could help aid countermeasures.</p>
              </CardDescription>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
