"use client";

// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import styles from "./page.module.css";
import Map from "@/components/Map_add_ons"

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Austrian Flood Monitoring - Home page</h1>
      <Map />
    </div>
  );
}
