"use client";

import React from "react";
import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { eden } from "@/utils/api";
import { Loader2 } from "lucide-react";
import { Users } from "./columns";

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

interface DeleteUserMenuItemProps {
  user: Users;
  removeUser: (userId: string) => void;
}

const DeleteUserMenuItem: React.FC<DeleteUserMenuItemProps> = ({
  user,
  removeUser,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State to control AlertDialog

  const handleDeleteUser = async () => {
    setLoading(true);
    await eden.admin["delete-account"]
      .delete({ userId: user.id })
      .then((response) => {
        if (response.status !== 200) {
          setIsOpen(false);
          toast({
            title: "Deletion failed",
            description: response.error?.value || "An error occurred.",
            variant: "destructive",
          });
        } else {
          removeUser(user.id);
          setIsOpen(false);
          toast({
            title: "User deleted",
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
        Delete User
      </DropdownMenuItem>
      {isOpen && (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                account and remove their data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-400 dark:bg-red-800 dark:hover:bg-red-900 dark:text-primary"
                onClick={handleDeleteUser}
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

export default DeleteUserMenuItem;
