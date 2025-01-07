"use client";

import React from "react";
import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { eden } from "@/utils/api";
import { Loader2 } from "lucide-react";
import { Users } from "./columns";

interface MakeResponderMenuItemProps {
  user: Users;
  updateUser: (user: Users) => void;
}

const MakeResponderMenuItem: React.FC<MakeResponderMenuItemProps> = ({
  user,
  updateUser,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    eden.admin["make-responder"]
      .post({ userId: user.id })
      .then((response) => {
        if (response.status !== 200) {
          toast({
            title: "Could not make user a responder",
            description: response.error?.value || "An error occurred.",
            variant: "destructive",
          });
        } else {
          updateUser({ ...user, userRole: "RESPONDER" });
          toast({
            title: "User turned to responder",
            description: "The user's role successfully changed to Responder.",
            variant: "default",
          });
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <DropdownMenuItem
      onSelect={handleVerify}
      className="cursor-pointer hover:bg-gray-100"
    >
      {loading && <Loader2 className="animate-spin" />}
      Make Responder
    </DropdownMenuItem>
  );
};

export default MakeResponderMenuItem;
