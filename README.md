# Austrian Flood Monitor

Repository for the "group work" of WS24/25 Software Engineering and Project Management. The latest version of `main` can always be found hosted online at the following link:
[Austrian Flood Monitor](https://austrian-flood-monitor.vercel.app/). (Server and database may need half a minute to spin up.)

## Overview

Austrian Flood Monitoring is a comprehensive community driven platform for reporting, monitoring, and managing floods in Austria, collecting and visualizing publicly available data (both current and historic) mixed with reports / sightings made by our users.

The main goal of the application is to better inform people about floodings and water levels in Austria and aid the work of emergency responders trying to get an overview of the situation, by giving them as much information as possible.

There are four main user types of this application with different needs and capabilities:
- **Visitor without account**: (Goal: get informed about current situation)
   - They can see historical data, visualizations and even user reports, but can not interact with them. (Can't comment, upvote, etc...)
   - This alligns with our goal of spreading information without barriers, trying to inform people in need as quick as possible.
- **Regular users with accounts**: (Goal: get informed and contribute information to others like them)
   - Once the user has registered they are sent a verification email, allowing them to verify their email. This status is showed on the user's profile page and can be used to prohibit them from using features until verified.
   - They have all the capabilities that visitors without accounts have, but they can actually create and interact with reports, upvote / downvote them and commenting on / editing / deleting reports created by themselves.
      - This voting system of reports is what gives credibility to reports created by users.
- **Emergency Responders**: (Goal: get a quick overview of new sightings and communicate with users)
   - They are special registered users, who have elevated privileges, capable of doing everything a regular signed in verified user can do.
   - Additionally, they can comment on any report, not just their own with the goal of asking for more information or following up with the creators of reports, aiding their work of mitigating damages.
- **Admins**: (Goal: manage the platform, it's users and reports, keeping it useful and helpful for it's users)
   - They have all capabilities from before, plus they have access to a special admin's page, allowing them to search, filter and find users / reports via tables, then edit / delete them according to the platform's needs.

### Tech stack

The project consists of a Next.js frontend and a Bun + Elysia.js backend, with a PostgreSQL database managed using Prisma ORM, ran in Docker.

Additionally here are some of the main libraries and packages used:
- TailwindCSS
- Shadcn
- Leaflet
- Nodemailer
- Recharts
- Zod

### Services used

For my own deployment of the application I used the following services, which allowed me to (of course with some caveats like spin up time) host my whole application completely freely:
- [Vercel](https://vercel.com/) - Which is a natural fit for the Next.js frontend
- [Render](https://render.com/) - For the Bun.js server
- [Supabase](https://supabase.com/) - A very nice and modern database service for Postgres databases
- [Mailtrap](https://mailtrap.io/) - As the SMTP provided for the Nodemailer of the application
- [Cloudinary](https://cloudinary.com/) - For the image provided of the application, where the images of user reports get uploaded to and fetched from

### Security considerations

The project uses a Stateless Authentication system where upon registering / logging in / verifying ones email an authentication JWT token is created on server side and stored on the client's browser in the cookies.

This combined with another cookie allows us to reinitialize the authentication state of the user even after leaving the website and returning to it and these credentials are included with every request to the server, which decodes the JWT matching the request with a user in our database, then acting accordingly.

The JWT also has an expiry date variable baked into it, which right now isn't being utilized to return 401 to the user, (because it would also need to be handled on the frontend) but it could be relatively easily implemented given enough time.

Another security measure that is not being utilized so much yet, but has been implemented is the user email verification, which similarly uses a JWT with expiry date baked into it. (This time around the expiry date is respected and expired tokens can not be used, need to request a new token.)

## Code structure and contribution

Code structure of the application can always be found in the relevant directory's `README.md` file, with a short guide on how to run and contribute.

```plaintext
Top Level
├── client
│   └── Next.js frontend
│   └── README.md
├── server
│   ├── Bun + Elysia.js backend
│   └── Database setup logic + Prisma
│   └── README.md
├── start-all.bat/.sh
│   └── Scripts to run the whole application with one line
└── README.md (<- Yes, you are reading me at the moment)
```

Links to the other `README` files:
- [Client README.md](./client/README.md)
- [Server README.md](./server/README.md)

## How to run / Setup

### Set up environment variables:

This depends on whether you are part of our inner development team for the project or not.

#### For group members

Download the `.env` files from `Team 3` of the `Software Engineering` class on `Teams`. As it may contain secret information like access tokens, we can not track it in the repository.
Once you have downloaded the `.env` file, make sure to put it in its rightful place, which is in the server directory: `.\server`.

> [!NOTE]  
> The file must be named `.env` with no file extension at all. If you have leftover `.env` files from the previous branches, then make sure to delete those and get the new one.

#### For outsiders

Here is an outline of what it may look like, of course your used services may require you to change these:

```env
# Secrets
POSTGRES_PASSWORD=   ...
JWT_SECRET=          ...
CLOUDINARY_URL=      ...

# Database connections
POSTGRES_HOST=       ...
POSTGRES_DB=         ...
POSTGRES_PORT=       ...
DATABASE_URL=        ...
# Direct connection URL for migrations (same as DATABASE_URL for local development)
DIRECT_URL=          ...

# Dev environment
NODE_ENV=development/deployment

# Sessions, stores and cookies
EXPIRES_IN=604800 # 7 days in seconds

# SMTP and verification email (exact config depends on your chosen service)
SMTP_SENDER=         ...
SMTP_HOST=           ...
SMTP_PORT=           ...
SMTP_USER=           ...
SMTP_PASS=           ...
EXAMPLE_RECEIVER=    ...
VERIFICATION_EXPIRY=86400 # 24 hours in seconds
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Bun
- Docker

### Installation

Start by cloning the repository. The repository is public, so you should easily be able to do this.

**Clone the repository:**

```sh
git clone https://github.com/yourusername/austrian-flood-monitor.git
cd austrian-flood-monitor
```

### Installing dependencies:

For the frontend:

```sh
cd client # Depends on your CWD
npm install
```

For the backend (if you only ever run it in docker then this is not needed):

```sh
cd server # Depends on your CWD
bun install
```

### Running the Application

I myself recommend starting the backend and frontend in separate terminals, so that I can easily keep track of the separate logs, and the hot-reload of Next.js does not pollute the logs. But you also have the option of starting everything at once.

#### Start eveything all at once with a single line

Depending on your OS you can start all parts of the application with just a single `bat` or `sh` script from the source directory:

> [!NOTE]
> You still have to install packages and `.env` variables as outlined before.

For Windows:

```powershell
./start-all.bat
```

For Linux / MacOS:

```sh
./start-all.sh
```

#### Start things separately (recommended for development)

1. **Start the backend:**

   The backend can be started from the `server` directory of the application using a `docker-compose` file. This file has three services, first one initiates the database and another one that sets up the database, applying the Prisma schema, migrations, running a seeding script and then the Bun server also starts up.

   ```sh
   cd server # Depends on your CWD
   docker-compose up
   ```

   You may wish to detach from the containers, to do so just add the tag `-d` to the end of the compose, or `--build` to build it.

2. **Start the frontend:**

   Simply move into the client directory and run the application. You may also run using `bun run dev`, but that may have some bugs related to [this issue](https://github.com/oven-sh/bun/issues/14699).

   ```sh
   cd client # Depends on your CWD
   npm run dev
   ```

3. **See database status, Prisma Studio:** (optional)

   Optionally you can also see the current state / make changes in the database via the intuitive and easy-to-use Prisma Studio.

   To start it up, you just simply have to move into the server directory and invoke it. (You may also start it via `bun prisma studio`)
   
   The `DATABASE_URL` is needed before the command (just like with `prisma migrate`) because our `.env` file is set up for connecting inside of Docker, but when we are connecting from our device, we connect via `localhost` rather than the service name.

   ```sh
   cd server # Depends on your CWD
   DIRECT_URL=postgres://postgres:your-super-secret-and-long-postgres-password@localhost:5432/postgres npx prisma studio
   ```

4. **Swagger UI:** (optional)

   The backend also implements Swagger UI based docs, giving you a quick overivew of the available endpoints, and allowing you to send requests to them directly from the web interface. The interface can be found on the `/docs` endpoint of the server url, meaning that you can find it from your browser at:
   [http://localhost:9512/docs](http://localhost:9512/docs)

### Accessing the Application

When you start the separate parts of the application, their access points will get logged onto the console, or even automatically open in your browser in some cases.

- Frontend: Open [http://localhost:3000](http://localhost:3000) in your browser.
- Backend: The backend server will be running on [http://localhost:9512](http://localhost:9512).
- Prisma Studio: Open [http://localhost:5000](http://localhost:5000) in your browser.

## Docs / Learn More

To learn more about the technologies used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Bun Documentation](https://bun.sh/docs)
- [Elysia.js Documentation](https://elysia.js.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## Recommended extensions

I recommend you install the following extensions for this stack if you are using VSC as your IDE. (If you are not using VSC you may still find similar alternatives.)

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [GitLens — Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- [Pretty TypeScript Errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors)
- Prettier
- GitHub Copilot

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
