"use client";

// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import styles from "./page.module.css";
import dynamic from "next/dynamic";

const MapWithRivers = dynamic(() => import("@/components/MapAddOns"), {
  ssr: false,
  loading: () => <p>A map is loading...</p>,
});

export default function Home() {

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Austrian Flood Monitoring - Home page
      </h1>
      <div className="mt-4 map-container">
        <MapWithRivers />
      </div>
    </div>
  );
}
