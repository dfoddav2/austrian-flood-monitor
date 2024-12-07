import { Elysia, t } from "elysia";

import { sql } from "@server/sql";
import { AuthContextWithBody } from "@utils/types";
// import { AuthContextWithBody, RegisterBody, LoginBody } from "@utils/types";

export const reports = new Elysia({ prefix: "/reports" })
  .post(
    "/get-reports",
    async ({
      set,
      body: {
        page = 1,
        pageSize = 5,
        sortBy,
        sortOrder,
        userLatitude,
        userLongitude,
      },
    }) => {
      try {
        // Validate and cast sortOrder
        const validSortOrder: "asc" | "desc" | undefined =
          sortOrder === "asc" || sortOrder === "desc" ? sortOrder : undefined;

        const reports = await sql.getReports({
          page: Number(page),
          pageSize: Number(pageSize),
          sortBy,
          sortOrder: validSortOrder,
          userLatitude: userLatitude ? Number(userLatitude) : undefined,
          userLongitude: userLongitude ? Number(userLongitude) : undefined,
        });
        set.status = 200;
        return reports;
      } catch (error) {
        set.status = 500;
        return { error: "Something went wrong" };
      }
    },
    {
      body: t.Object({
        page: t.Optional(t.Number()),
        pageSize: t.Optional(t.Number()),
        sortBy: t.Optional(t.String()),
        sortOrder: t.Optional(t.String()),
        userLatitude: t.Optional(t.Number()),
        userLongitude: t.Optional(t.Number()),
      }),
      detail: {
        tags: ["reports"],
        description: "Get all reports, paginated, sorted",
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
    async ({
      set,
      id,
      body: { reportId },
    }: AuthContextWithBody<{ reportId: string }>) => {
      try {
        console.log("Getting report with ID:", reportId);
        console.log("User ID:", id);
        const report = await sql.getReportById(reportId, id);
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
  )
  .delete(
    "/delete-report",
    async ({
      set,
      id,
      body: { reportId },
    }: AuthContextWithBody<{ reportId: string }>) => {
      if (!id) {
        set.status = 401; // Unauthorized
        return { error: "Not authorized" };
      }
      try {
        await sql.deleteReport(id, reportId);
        set.status = 204;
        return;
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("not found")) {
            set.status = 404; // Not Found
            return { error: error.message };
          } else if (error.message.includes("author")) {
            set.status = 403; // Forbidden
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
        description: "Delete a report by its ID",
      },
    }
  )
  .post(
    "edit-report",
    async ({
      set,
      id,
      body: { reportId, title, description, latitude, longitude, images },
    }: AuthContextWithBody<{
      reportId: string;
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
      try {
        const report = await sql.updateReport(
          id,
          reportId,
          title,
          description,
          latitude,
          longitude,
          images
        );
        set.status = 200;
        return report;
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("not found")) {
            set.status = 404; // Not Found
            return { error: error.message };
          } else if (error.message.includes("author")) {
            set.status = 403; // Forbidden
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
        id: t.String(),
        reportId: t.String(),
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        latitude: t.Optional(t.String()),
        longitude: t.Optional(t.String()),
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
        description: "Edit a report by its ID",
      },
    }
  )
  .post(
    "upvote-report",
    async ({
      set,
      id,
      body: { reportId },
    }: AuthContextWithBody<{ reportId: string }>) => {
      if (!id) {
        set.status = 401; // Unauthorized
        return { error: "Not authorized" };
      }
      try {
        console.info("Upvoting report with ID:", reportId);
        await sql.upvoteReport(id, reportId);
        set.status = 200;
        return { message: "Successfully upvoted report" };
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("not found")) {
            set.status = 404; // Not Found
            return { error: error.message };
          } else if (error.message.includes("own")) {
            set.status = 403; // Forbidden
            return { error: error.message };
          } else if (error.message.includes("already")) {
            set.status = 409; // Conflict
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
        description: "Upvote a report based on its ID",
      },
    }
  )
  .post(
    "downvote-report",
    async ({
      set,
      id,
      body: { reportId },
    }: AuthContextWithBody<{ reportId: string }>) => {
      if (!id) {
        set.status = 401; // Unauthorized
        return { error: "Not authorized" };
      }
      try {
        await sql.downvoteReport(id, reportId);
        set.status = 200;
        return { message: "Successfully downvoted report" };
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("not found")) {
            set.status = 404; // Not Found
            return { error: error.message };
          } else if (error.message.includes("own")) {
            set.status = 403; // Forbidden
            return { error: error.message };
          } else if (error.message.includes("already")) {
            set.status = 409; // Conflict
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
        description: "Downvote a report based on its ID",
      },
    }
  );
