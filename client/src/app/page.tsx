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
        <p>We provide the public with real-time information about flooding activity, including warnings, visualization and additional information about current and projected threats.</p>
        <br></br>
        <p><Link href="/dash"><u>Here</u></Link> you will be able to view a map of Austria that displays water-levels both historical and current, as well as reports of local floods, so that you can recognize when dangerous water-levels are occuring.</p>
        <br></br>
        <p>Once registered, you may submit your own reports of floods, to inform others as well as relevant authorities who use the system to coordinate rescue and protective efforts.</p>
        <p>You will also be able to see more information on reports, and recieve notifications about rising water-levels near your location.</p>
        <br></br>
      </div>
      <div className={styles.home_nav}>
        <p className="text-1xl font-bold">In order to use this service, you must have an account.</p>
        <Link href="/register"><Button className={styles.button}>Register</Button></Link>
        <br></br>
        <p className="text-1xl font-bold">If you already have an account, please log in.</p>
        <Link href="/login"><Button className={styles.button}>Login</Button></Link>
      </div>
  );
}
