"use client";

import Link from "next/link";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import VerifyUserMenuItem from "./VerifyUserMenuItem";
import MakeResponderMenuItem from "./MakeResponderMenuItem";
import DeleteUserMenuItem from "./DeleteUserMenuItem";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Users = {
  id: string;
  email: string;
  username: string;
  userRole: "USER" | "RESPONDER" | "ADMIN";
  verified: boolean;
};

export const getColumns = (
  removeUser: (userId: string) => void,
  updateUser: (updatedUser: Users) => void
): ColumnDef<Users>[] => [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => getValue<string>(),
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Username
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => getValue<string>(),
  },
  {
    accessorKey: "userRole",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        User Role
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => getValue<Users["userRole"]>(),
  },
  {
    accessorKey: "verified",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Verified
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (row.original.verified ? "🟢" : "🔴"),
  },
  {
    accessorKey: "_count.reports",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Num reports
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "reports._sum.upvotes",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Upvotes
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "reports._sum.downvotes",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Downvotes
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link
                href={`/user/${user.id}`}
                className="w-full h-full flex items-center cursor-pointer"
              >
                See User
              </Link>
            </DropdownMenuItem>
            {/* Manually verify the user if unverified */}
            {!user.verified && (
              <VerifyUserMenuItem user={row.original} updateUser={updateUser} />
            )}
            {/* Make regular user a RESPONDER */}
            {user.userRole === "USER" && user.verified && (
              <MakeResponderMenuItem
                user={row.original}
                updateUser={updateUser}
              />
            )}
            {/* Editing and deleting the users */}
            {user.userRole !== "ADMIN" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Edit user</DropdownMenuItem>
                <DeleteUserMenuItem
                  user={row.original}
                  removeUser={removeUser}
                />
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
