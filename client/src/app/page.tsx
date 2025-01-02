"use client";

// import { Link } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
// import styles from "./page.module.css";
import styles from "../styles/home.module.css"

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.home_text}>
        <h1 className="text-3xl font-bold">Austrian Flood Monitoring - Home page</h1>
        <br></br>
        <p>We provide the public with real-time* information about flooding activity, including warnings, visualization and additional information about current and projected threats.</p>
        <br></br>
        <p>User are able to view a map of Austria that displays water-levels and reports of local floods.</p>
        <p>Our service allows registered users to submit their own reports of floods, to inform others as well as relevant authorities who use the system to coordinate rescue and protective efforts.</p>
        <p>Reports can have a description and images included.</p>
        <br></br>
        <h1>WIP</h1>
      </div>
      <div className={styles.home_nav}>
        <p className="text-1xl font-bold">In order to use this service, you must have an account.</p>
        <Link href="/register"><Button className={styles.button}>Register</Button></Link>
        <br></br>
        <p className="text-1xl font-bold">If you already have an account, please log in.</p>
        <Link href="/login"><Button className={styles.button}>Login</Button></Link>
      </div>
    </div>
  );
}
