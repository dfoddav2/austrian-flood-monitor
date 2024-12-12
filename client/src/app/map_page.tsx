"use client";

// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import styles from "./page.module.css";
import Map_add_on from "@/components/Map_add_ons.tsx"

export default function Map() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Information Map</h1>
        <Map_add_on />
    </div>
  );
}