"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
import { Loader2, AlertCircle } from "lucide-react";

export default function ReportCreationPage() {
  const router = useRouter();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const formSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(500, "Description is too long"),
    images: z.array(z.string()).optional(), // Array of image URLs
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      images: [], // Initialize as an empty array
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000); // This is a delay function to test the loading spinner
    // print(values);
    // TODO: Implement the actual API call
    eden.reports["create-report"]
      .post({
        title: values.title,
        description: values.description,
        latitude: 0,
        longitude: 0,
        images: values.images.map((imageUrl, index) => ({
          source: imageUrl,
          description: values.title + " image " + index,
        })),
      })
      .then((response) => {
        console.log("Outcome: ", response);
        if (response.status !== 201) {
          console.error(response.error.value.error);
          setError(
            response.error.value.error || "An unexpected error occurred."
          );
        } else {
          console.log("Report created successfully");
          router.push(`/reports/${response.data.id}`);
        }
      })
      .catch((error) => {
        console.error(error);
        setError(error.message || "An unexpected error occurred.");
      })
      .finally(() => setLoading(false));
  }

  const handleUpload = (results: CloudinaryUploadWidgetResults) => {
    if (results.event === "success") {
      const imageUrl = results.info.secure_url;
      const currentImages = form.getValues("images") || [];
      form.setValue("images", [...currentImages, imageUrl]);
      setImages([...currentImages, imageUrl]);
    }
  };

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
          <CardTitle>Create a report</CardTitle>
          <CardDescription>Please note the requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <Input placeholder="Description" {...field} />
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
                        console.log("Public ID", results.info.public_id);
                        console.log("Public ID", results.info.secure_url);
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
                  Upload an image related to your report
                </FormDescription>
                <FormMessage />
              </FormItem>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <CardDescription>
            Please make sure to give as much detail as possible.
          </CardDescription>
          <CardDescription>
            This data may be used to aid countermeasures.
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
