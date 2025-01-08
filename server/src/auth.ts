import { Elysia, t } from "elysia";

import { sql } from "@server/sql";
import {
  AuthContextWithBody,
  RegisterBody,
  LoginBody,
  AuthContext,
} from "@utils/types";
import { panic } from "@utils/panic";
import { sendVerificationEmail } from "@utils/emailVerification";
import { hashPassword } from "@utils/hashPassword";

const expiresIn = Number(process.env.EXPIRES_IN) ?? panic("EXPIRES_IN not set");
const nodeEnv = process.env.NODE_ENV ?? panic("NODE_ENV not set");

export const auth = new Elysia({ prefix: "/auth" })
  .post(
    "/register",
    async ({
      jwt,
      set,
      body: { email, name, username, password },
      cookie: { token },
    }: AuthContextWithBody<RegisterBody>): Promise<
      { authCookie: string; verificationToken: string } | { error: string }
    > => {
      try {
        // Hash the password
        password = await hashPassword(password);
        const user = await sql.createUser(email, name, username, password);
        set.status = 201;

        // Authentication token for the backend
        const token_value = await jwt.sign({
          id: user.id,
          expiry: Math.floor(Date.now() / 1000) + expiresIn, // 7 days
        });
        token.set({
          httpOnly: nodeEnv === "production",
          secure: true,
          sameSite: "none",
          path: "/", // default
          maxAge: expiresIn, // 7 days
          value: token_value,
        });

        // Authentication token for the store on the frontend
        const authCookie_value = await jwt.sign({
          id: user.id,
          username: user.username,
          verified: user.verified,
          userRole: user.userRole,
        });

        // Send verification email
        let verificationToken = "";
        try {
          verificationToken = await sendVerificationEmail(jwt, email, username);
        } catch (error) {
          console.error(
            "Error sending verification email of registering user:",
            error
          );
          set.status = 201;
          return {
            authCookie: authCookie_value,
            error: "Error sending verification email, please try again later",
          };
        }

        set.status = 201;
        return {
          authCookie: authCookie_value,
          verificationToken,
        };
      } catch (error) {
        console.log("Error in register:", error);
        if (error instanceof Error) {
          if (error.message.includes("already exists")) {
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
        email: t.String({ minLength: 8 }),
        name: t.String({ minLength: 5 }),
        username: t.String({ minLength: 5 }),
        password: t.String({ minLength: 8 }),
      }),
      cookie: t.Cookie({
        token: t.Optional(t.String()),
      }),
      detail: {
        tags: ["auth"],
        description: "Register a new user by giving it's details",
      },
    }
  )
  .post(
    "/login",
    async ({
      jwt,
      set,
      body: { email, password },
      cookie: { token },
    }: AuthContextWithBody<LoginBody>): Promise<
      { authCookie: string } | { error: string }
    > => {
      // const user = await sql.getUserByName(name);
      try {
        const user = await sql.checkCredentials({ email, password });

        if (!user) {
          set.status = 401; // Unauthorized
          return { error: "Invalid credentials" };
        }

        // Authentication token for the backend
        const token_value = await jwt.sign({
          id: user.id,
          expiry: Math.floor(Date.now() / 1000) + expiresIn, // 7 days
        });
        token.set({
          httpOnly: nodeEnv === "production",
          secure: true,
          sameSite: "none",
          path: "/", // default
          maxAge: expiresIn, // 7 days
          value: token_value,
        });

        // Authentication token for the store on the frontend
        const authCookie_value = await jwt.sign({
          id: user.id,
          username: user.username,
          verified: user.verified,
          userRole: user.userRole,
        });

        set.status = 200;
        return { authCookie: authCookie_value };
      } catch (error) {
        console.log("Error in login:", error);
        if (error instanceof Error) {
          if (error.message.includes("Invalid credentials")) {
            set.status = 401; // Unauthorized
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
        email: t.String({ minLength: 8 }),
        password: t.String({ minLength: 8 }),
      }),
      cookie: t.Cookie({
        token: t.Optional(t.String()),
      }),
      detail: {
        tags: ["auth"],
        description: "Login with a username",
      },
    }
  )
  .post(
    "/verify",
    async ({
      jwt,
      set,
      body: { verificationToken },
      cookie: { token },
    }: AuthContextWithBody<{ verificationToken: string }>) => {
      interface Token {
        email: string;
        expiresAt: string;
      }
      try {
        let jwtToken: Token | null = null;
        // console.log("Token:", token);
        try {
          const verifiedToken = await jwt.verify(verificationToken);
          // console.log("Verified token:", verifiedToken);
          if (
            typeof verifiedToken === "object" &&
            verifiedToken !== null &&
            "email" in verifiedToken &&
            "expiresAt" in verifiedToken
          ) {
            jwtToken = verifiedToken as Token;
          } else {
            set.status = 401; // Unauthorized
            return { error: "Token is not valid" };
          }
        } catch (error) {
          set.status = 401; // Unauthorized
          return { error: "Token could not be verified" };
        }
        await sql.verifyEmail(jwtToken.email, jwtToken.expiresAt);

        // Get user detals to set the user in the store
        const user = await sql.getUserByEmail(jwtToken.email);
        if (!user) {
          set.status = 404; // Not Found
          return { error: "User not found" };
        }

        // Authentication token for the backend
        const token_value = await jwt.sign({
          id: user.id,
          expiry: Math.floor(Date.now() / 1000) + expiresIn, // 7 days
        });
        token.set({
          httpOnly: nodeEnv === "production",
          secure: true,
          sameSite: "none",
          path: "/", // default
          maxAge: expiresIn, // 7 days
          value: token_value,
        });

        // Authentication token for the store on the frontend
        const authCookie_value = await jwt.sign({
          id: user.id,
          username: user.username,
          verified: user.verified,
          userRole: user.userRole,
        });
        set.status = 200;
        return { authCookie: authCookie_value };
      } catch (error) {
        console.log("Error in verify:", error);
        if (error instanceof Error) {
          if (error.message.includes("expired")) {
            set.status = 401; // Unauthorized
            return { error: error.message };
          } else if (error.message.includes("not found")) {
            set.status = 404; // Not Found
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
        verificationToken: t.String(),
      }),
      cookie: t.Cookie({
        token: t.Optional(t.String()),
      }),
      detail: {
        tags: ["auth"],
        description: "Verify a user's email based off a token",
      },
    }
  )
  .post(
    "/request-verification",
    async ({ jwt, set, id }: AuthContext) => {
      if (!id) {
        set.status = 401; // Unauthorized
        return { error: "Unauthorized" };
      }
      const user = await sql.getUserById(id);
      if (!user) {
        set.status = 404; // Not Found
        return { error: "User not found" };
      }
      if (user.verified) {
        set.status = 409; // Bad Request
        return { error: "User is already verified" };
      }
      // Send verification email
      let verificationToken = "";
      try {
        verificationToken = await sendVerificationEmail(
          jwt,
          user.email,
          user.username
        );
      } catch (error) {
        console.error(
          "Error sending verification email of registering user:",
          error
        );
        set.status = 400;
        return {
          error: "Error sending verification email, please try again later",
        };
      }
      set.status = 200;
      return {
        message: "Verification email sent successfully",
        verificationToken,
      };
    },
    {
      detail: {
        tags: ["auth"],
        description: "Request a verification email to be sent",
      },
    }
  );
