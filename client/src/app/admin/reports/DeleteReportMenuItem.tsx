"use client";

import React from "react";
import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { eden } from "@/utils/api";
import { Loader2 } from "lucide-react";
import { Reports } from "./columns";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteReportMenuItemProps {
  report: Reports;
  removeReport: (reportId: string) => void;
}

const DeleteReportMenuItem: React.FC<DeleteReportMenuItemProps> = ({
  report,
  removeReport,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State to control AlertDialog

  const handleDeleteReport = async () => {
    setLoading(true);
    await eden.reports["delete-report"]
      .delete({ reportId: report.id })
      .then((response) => {
        if (response.status !== 204) {
          setIsOpen(false);
          toast({
            title: "Deletion failed",
            description: response.error?.value || "An error occurred.",
            variant: "destructive",
          });
        } else {
          removeReport(report.id);
          setIsOpen(false);
          toast({
            title: "Report deleted",
            description: "Successfull deletion.",
            variant: "default",
          });
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        setIsOpen(false);
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <DropdownMenuItem
        className="cursor-pointer bg-red-500 hover:bg-red-400 dark:bg-red-800 dark:hover:bg-red-900 dark:text-primary"
        onClick={(e) => {
          e.preventDefault(); // Prevent the dropdown from closing immediately
          setIsOpen(true);
        }}
      >
        Delete Report
      </DropdownMenuItem>

      {isOpen && (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                report and remove it&apos;s data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-400 dark:bg-red-800 dark:hover:bg-red-900 dark:text-primary"
                onClick={handleDeleteReport}
                disabled={loading}
              >
                {loading && <Loader2 className="animate-spin mr-2" />}
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default DeleteReportMenuItem;
