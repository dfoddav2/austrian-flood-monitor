"use client";

import { useEffect, useState } from "react";
import { eden } from "@/utils/api";

type TestingResponse = {
  data: any;
  error: null | string;
  response: Response;
  status: number;
  headers: Headers;
};

export default function Testing() {
  const [data, setData] = useState<TestingResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This code runs when the component mounts
    console.log("Component mounted");

    // Fetch data from the server or perform other side effects here
    eden.testing
      .get()
      .then((data) => {
        setData(data);
        console.log(data);
      })
      .catch((error) => {
        setError(error.message);
        console.error(error);
      })
      .finally(() => {
        console.log("Request completed");
        setLoading(false);
      });

    // Cleanup function (optional)
    return () => {
      console.log("Component unmounted");
    };
  }, []);

  return (
    <div>
      <h1>This is a page for testing purposes</h1>
      <p>
        Here we show that we can make requests to the server and fetch from the
        DB.
      </p>
      {loading ? <p>Loading...</p> : null}
      {error ? <p>Error: {error}</p> : null}
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : null}
    </div>
  );
}
