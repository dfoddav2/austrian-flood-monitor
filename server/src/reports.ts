import { Elysia, t } from "elysia";

import { sql } from "@server/sql";
import { expect } from "bun:test";
import { AuthContextWithBody } from "@utils/types";
import { auth } from "./auth";
// import { AuthContextWithBody, RegisterBody, LoginBody } from "@utils/types";

export const reports = new Elysia({ prefix: "/reports" })
  .get(
    "/all-reports",
    async ({ set }) => {
      try {
        const reports = await sql.getAllReports();
        set.status = 200;
        return reports;
      } catch (error) {
        set.status = 500;
        return { error: "Something went wrong" };
      }
    },
    {
      detail: {
        tags: ["reports"],
        description: "Get all reports",
      },
    }
  )
  .post(
    "/reports-by-author-id",
    async ({ set, body: { authorId } }) => {
      try {
        const report = await sql.getReportsAssociatedWithUser(authorId);
        set.status = 200;
        return report;
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("not found")) {
            set.status = 404; // Not Found
            return { error: error.message };
          } else {
            set.status = 500; // Internal Server Error
            return { error: "Something went wrong" };
          }
        } else {
          set.status = 500; // Internal Server Error
          return { error: "Unknown error occurred" };
        }
      }
    },
    {
      body: t.Object({
        authorId: t.String(),
      }),
      detail: {
        tags: ["reports"],
        description: "Get all reports by author ID",
      },
    }
  )
  .post(
    "/report-by-id",
    async ({ set, body: { reportId } }) => {
      try {
        const report = await sql.getReportById(reportId);
        set.status = 200;
        return report;
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("not found")) {
            set.status = 404; // Not Found
            return { error: error.message };
          } else {
            set.status = 500; // Internal Server Error
            return { error: "Something went wrong" };
          }
        } else {
          set.status = 500; // Internal Server Error
          return { error: "Unknown error occurred" };
        }
      }
    },
    {
      body: t.Object({
        reportId: t.String(),
      }),
      detail: {
        tags: ["reports"],
        description: "Get report by its ID",
      },
    }
  )
  .post(
    "/create-report",
    async ({
      set,
      id,
      body: { title, description, latitude, longitude, images },
    }: AuthContextWithBody<{
      title: string;
      description: string;
      latitude: number;
      longitude: number;
      images: { source: string; description: string }[];
    }>) => {
      if (!id) {
        set.status = 401; // Unauthorized
        return { error: "Not authorized" };
      }
      console.log("Creating report for user with ID:", id);
      const report = await sql.createReport(
        id,
        title,
        description,
        latitude,
        longitude,
        images
      );
      console.info("Report created:", report);
      set.status = 201;
      return report;
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.String(),
        latitude: t.Number(),
        longitude: t.Number(),
        images: t.Optional(
          t.Array(
            t.Object({
              source: t.String(),
              description: t.String(),
            })
          )
        ),
      }),
      detail: {
        tags: ["reports"],
        description: "Create a new report",
      },
    }
  );
