"use client";

import { eden } from "@/utils/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

import {
  Card,
  CardContent,
  CardDescription,
  //   CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
// import { useToast } from "@/hooks/use-toast";

import { Bar, BarChart, CartesianGrid, XAxis, TooltipProps } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface HistoricData {
  id: string;
  stationName: string;
  waterBody: string;
  catchmentArea: string;
  operatingAuthority: string;
  measurements: {
    year: string;
    value: number;
  }[];
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "4px",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold" }}>{`Year: ${label}`}</p>
        <p style={{ margin: 0 }}>{`Waterflow: ${payload[0].value?.toFixed(2)} m³/s`}</p>
      </div>
    );
  }

  return null;
};

const HistoricDataPage = () => {
  //   const { toast } = useToast();

  const user = useAuthStore((state) => state.user);
  console.log("user", user);

  const { hzbnr } = useParams<{ hzbnr: string | string[] }>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historicData, setHistoricData] = useState<HistoricData[] | null>(null);

  const chartConfig = {
    value: {
      label: "Waterflow (m³/s)",
      color: "#2563eb",
    },
    // mobile: {
    //   label: "Mobile",
    //   color: "#60a5fa",
    // },
  } satisfies ChartConfig;

  useEffect(() => {
    async function fetchHistoricData() {
      eden.reports["get-historic-data"]
        .post({ hzbnr: hzbnr as string })
        .then((response) => {
          if (response.status !== 200) {
            setError(
              response.error.value?.error || "Failed to fetch historic data"
            );
          } else {
            setHistoricData(response.data);
            console.log("Historic data fetched", response.data);
          }
        })
        .catch((error) => {
          setError("Failed to fetch historic data");
          console.error("Failed to fetch historic data", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    fetchHistoricData();
  }, [hzbnr]);

  return (
    <>
      {error && (
        <div className="relative min-w-full sm:min-w-128 md:min-w-160 lg:min-w-192 xl:min-w-224 mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-20">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-bold text-base">Error</AlertTitle>
            <AlertDescription>
              <div className="flex justify-between items-center">
                {error}
                <Button
                  variant="destructive"
                  onClick={() => {
                    setError(null);
                  }}
                >
                  Dismiss
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Historic Data</CardTitle>
        </CardHeader>
        {loading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <CardContent>
            {historicData ? (
              <>
                <CardDescription>
                  <p>Historic data fetched successfully</p>
                  <p>TODO: Display historic data here</p>
                </CardDescription>
                <ChartContainer
                  config={chartConfig}
                  className="min-h-48 min-w-160"
                >
                  <BarChart
                    accessibilityLayer
                    data={historicData[0].measurements}
                  >
                    <CartesianGrid vertical={false} />
                    <ChartTooltip content={<CustomTooltip />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <XAxis
                      dataKey="year"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      //   tickFormatter={(value) => value.slice(0, 4)}
                    />
                    <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                    {/* <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} /> */}
                  </BarChart>
                </ChartContainer>
              </>
            ) : (
              <CardDescription>
                <p>No historic data found for id: {hzbnr}</p>
              </CardDescription>
            )}
          </CardContent>
        )}
      </Card>
    </>
  );
};

export default HistoricDataPage;
