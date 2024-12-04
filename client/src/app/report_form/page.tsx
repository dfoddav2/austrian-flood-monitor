"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  location: z.string().min(1, "Location must not be empty."),
  description: z.string().min(1, "Description must not be empty."),
});

type FormData = z.infer<typeof formSchema>;

export default function FloodReportPage() {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    console.log("Form Submitted:", data);
    setLoading(true);

    // Simulating a submission delay
    setTimeout(() => {
      setLoading(false);
      setSubmitSuccess("Your flood report has been submitted successfully!");
      setTimeout(() => setSubmitSuccess(null), 5000); // Message disappears after 5 seconds

      // Reset form after successful submission
      reset(); // Reset all form fields
      setPhotoPreview([]); // Clear photo previews
    }, 2000);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setValue("photos", Array.from(files)); // Update form value with the selected files

      // Preview photos
      const previews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPhotoPreview(previews);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Flood Report</CardTitle>
          <CardDescription>
            Please provide accurate details about the flood event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Location Field */}
            <div>
              <label>Location</label>
              <Input
                {...register("location")}
                className="border p-2 w-full"
                placeholder="Enter location"
              />
              {errors.location && <p className="text-red-500">{errors.location.message}</p>}
            </div>

            {/* Description Field with Improved Styling */}
            <div>
              <label>Description</label>
              <textarea
                {...register("description")}
                className="border p-4 w-full h-36 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the flood event"
              />
              {errors.description && <p className="text-red-500">{errors.description.message}</p>}
            </div>

            {/* Flood Severity Field */}
            <div>
              <label>Flood Severity</label>
              <select {...register("severity")} className="border p-2 w-full">
                <option value="">Select severity</option>
                <option value="Minor">Minor</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
              {errors.severity && <p className="text-red-500">{errors.severity.message}</p>}
            </div>

            {/* Photo Upload Field */}
            <div>
              <label>Upload Photos (up to 3)</label>
              <Input
                {...register("photos")}
                type="file"
                accept="image/*"
                multiple
                className="border p-2 w-full"
                onChange={handleFileChange}
              />
              {errors.photos && <p className="text-red-500">{errors.photos.message}</p>}
              <div className="mt-2 flex space-x-2">
                {photoPreview.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Photo preview ${index + 1}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </form>

          {/* Success Message */}
          {submitSuccess && (
            <div className="mt-4 text-green-400 font-semibold">
              {submitSuccess}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <CardDescription className="text-center">
            Thank you for contributing to flood monitoring efforts.
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
