import nodemailer from "nodemailer";
import { panic } from "@utils/panic";

interface jwtInterface {
  sign: (payload: object) => string;
  verify: (token: string) => object;
}

export const sendVerificationEmail = async (
  jwt: jwtInterface,
  email: string,
  username: string
) => {
  const expireInSeconds =
    Number(Bun.env.VERIFICATION_EXPIRY) ||
    panic("VERIFICATION_EXPIRY environment variable not set");
  const verificationToken = await jwt.sign({
    email: email,
    expiresAt: new Date(Date.now() + expireInSeconds * 1000).toISOString(),
  });
  console.log(`Verification token created: ${verificationToken}`);

  const transporter = nodemailer.createTransport({
    // host: Bun.env.SMTP_HOST ?? panic("SMTP_HOST environment variable not set"),
    host: Bun.env.SMTP_HOST ?? panic("SMTP_HOST environment variable not set"),
    port: 587,
    auth: {
      user:
        Bun.env.SMTP_USER ??
        panic("SMTP_USER environment variable not set"),
      pass:
        Bun.env.SMTP_PASS ??
        panic("SMTP_PASS environment variable not set"),
      // user: Bun.env.SMTP_USER ?? panic("SMTP_USER environment variable not set"),
      // pass: Bun.env.SMTP_PASS ?? panic("SMTP_USER environment variable not set"),
    },
    logger: true,
    debug: true,
  });

  const environment =
    Bun.env.NODE_ENV ?? panic("NODE_ENV environment variable not set");
  const verificationLink =
    environment === "production"
      ? `https://austrian-flood-monitor.vercel.app/user/verify/${verificationToken}`
      : `http://localhost:3000/user/verify/${verificationToken}`;
  // Define email options
  const mailOptions = {
    from: `"Austrian Flood Monitor Team" <${
      Bun.env.SMTP_SENDER ?? panic("SMTP_SENDER environment variable not set")
    }>`, // Sender address
    to:
      Bun.env.EXAMPLE_RECEIVER ??
      panic("EXAMPLE_RECEIVER environment variable not set"), // TODO: Change to `body.email` once SMTP is set up and it is prod
    subject: "Austrian Flood Monitor - Email Verification", // Subject line
    text: `Hello ${username}, please verify your email by clicking the following link: ${verificationLink}`, // Plain text body
    html: getEmailTemplate(username, verificationLink), // HTML body
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Message sent: %s", info.messageId);

  return verificationToken;
};

const getEmailTemplate = (username: string, verificationLink: string) => {
  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #121212">
    <!-- Main wrapper -->
    <table
      role="presentation"
      style="width: 100%; border-collapse: collapse; background-color: #121212; padding: 20px"
      cellpadding="0"
      cellspacing="0"
    >
      <tr>
        <td align="center">
          <!-- Email container -->
          <table
            role="presentation"
            style="width: 100%; max-width: 600px; background-color: #292929; padding: 20px; border-radius: 8px"
            cellpadding="0"
            cellspacing="0"
          >
            <!-- Header -->
            <tr>
              <td align="center" style="padding: 10px 0">
                <img
                  src="https://via.placeholder.com/150x50?text=Your+Logo"
                  alt="Your Logo"
                  style="border: 0; max-width: 100%; height: auto"
                />
              </td>
            </tr>

            <!-- Main content -->
            <tr>
              <td style="padding: 20px; text-align: left; color: #ffffff">
                <h1 style="color: #ffffff; font-size: 24px">Verify Your Email Address</h1>
                <p style="font-size: 16px; line-height: 1.5; color: #ffffff">Hi <strong>${username}</strong>,</p>
                <p style="font-size: 16px; line-height: 1.5; color: #ffffff">
                  Thank you for signing up at <strong>Austrian Flood Monitor</strong>. To complete your registration, please verify
                  your email address by clicking the button below:
                </p>

                <!-- Verification Button -->
                <table
                  role="presentation"
                  style="width: 100%; border-collapse: collapse; margin: 20px 0"
                  cellpadding="0"
                  cellspacing="0"
                >
                  <tr>
                    <td align="center">
                      <a
                        href="${verificationLink}"
                        style="
                          background-color: #ffffff;
                          color: #292929;
                          padding: 12px 20px;
                          text-decoration: none;
                          font-size: 18px;
                          border-radius: 8px;
                          display: inline-block;
                        "
                        >Verify Email</a
                      >
                    </td>
                  </tr>
                </table>

                <!-- Optional message -->
                <p style="font-size: 14px; color: #aaaaaa">
                  If the button doesn't work, please open this link in your browser:
                </p>
                <p style="font-size: 14px; color: #5d54a4; word-break: break-all">${verificationLink}</p>
                <p style="font-size: 14px; color: #aaaaaa">
                  If you did not sign up for this account, please ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding: 20px; background-color: #292929">
                <p style="font-size: 12px; color: #ffffff">2024 Austrian Flood Monitor.</p>
                <p style="font-size: 12px; color: #ffffff">Krems an der Doanu, Austria</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};
