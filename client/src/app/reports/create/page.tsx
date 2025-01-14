"use client";

import { useRouter } from "next/navigation";
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
import { Loader2, AlertCircle, CircleCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
});

export default function ReportCreationPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<string[] | []>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  // Get user's location
  const fetchLocation = () => {
    setLoadingLocation(true);
    if ("geolocation" in navigator) {
      const handleSuccess = (position: GeolocationPosition) => {
        console.log("Latitude is", position.coords.latitude);
        console.log("Longitude is", position.coords.longitude);
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLoadingLocation(false);
      };

      const handleError = (error: GeolocationPositionError) => {
        console.error("Error obtaining location:", error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError("Location access denied by the user.");
            break;
          case error.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setError("The request to get user location timed out.");
            break;
          default:
            setError("An unknown error occurred while obtaining location.");
            break;
        }
        setLoadingLocation(false);
      };

      const options = {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        options
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoadingLocation(false);
    }
  };

  // Fetch location on component mount
  useEffect(() => {
    fetchLocation();
  }, []);

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

  // On submit of report upload
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000); // This is a delay function to test the loading spinner
    // print(values);
    eden.reports["create-report"]
      .post({
        title: values.title,
        description: values.description,
        latitude: latitude || 0,
        longitude: longitude || 0,
        images: values.images.map((imageUrl, index) => ({
          source: imageUrl,
          description: `${values.title} image ${index}`,
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
          toast({
            title: "Success",
            description: "Report created successfully",
          });
        }
      })
      .catch((error) => {
        console.error(error);
        setError(error.message || "An unexpected error occurred.");
      })
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
    <>
      {error && (
        <div className="relative min-w-full sm:min-w-128 md:min-w-160 lg:min-w-192 xl:min-w-224 mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-20">
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
        </div>
      )}
      <Card className="relative min-w-full sm:min-w-128 md:min-w-160 lg:min-w-192 xl:min-w-224 mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-20 my-4">
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
                <FormDescription>Upload at max three images</FormDescription>
                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>Location</FormLabel>
                {latitude ? (
                  <div>
                    <FormControl>
                      <Button
                        type="button"
                        onClick={fetchLocation}
                        disabled={loadingLocation}
                      >
                        {loadingLocation && (
                          <Loader2 className="animate-spin" />
                        )}
                        Refresh location
                      </Button>
                    </FormControl>
                    <div className="mt-2">
                      <Map latitude={latitude} longitude={longitude} />
                    </div>
                    <div className="flex justify-start items-center gap-2 text-sm mt-1">
                      <CircleCheck className="h-4 w-4" />
                      <span>Location fetched successfully</span>
                    </div>
                  </div>
                ) : loadingLocation ? (
                  <div>
                    <FormControl>
                      <Button type="button" disabled>
                        <Loader2 className="animate-spin" />
                        Fetching location
                      </Button>
                    </FormControl>
                  </div>
                ) : (
                  <div>
                    <FormControl>
                      <Button
                        type="button"
                        onClick={fetchLocation}
                        disabled={loadingLocation}
                      >
                        {loadingLocation && (
                          <Loader2 className="animate-spin" />
                        )}
                        Retry location fetch
                      </Button>
                    </FormControl>
                    <div className="flex justify-start items-center gap-2 text-red-500 text-sm mt-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>Location could not be fetched</span>
                    </div>
                  </div>
                )}
                <FormDescription>
                  Please give access to your location when prompted
                </FormDescription>
                <FormMessage />
              </FormItem>
              <Button
                type="submit"
                disabled={!latitude || !longitude || loading}
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
      </Card>
    </>
  );
}
