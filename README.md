# Austrian Flood Monitor

Repository for the group work of WS24/25 Software Engineering and Project Management. The latest version of `main` can always be found hosted online at the following link:
[Austrian Flood Monitor](https://austrian-flood-monitor.vercel.app/)

## Overview

Austrian Flood Monitoring is a comprehensive platform for reporting, monitoring, and managing floods in Austria. The project consists of a Next.js frontend and a Bun + Elysia.js backend, with a PostgreSQL database managed using Prisma ORM.

## Code structure and contribution

Code structure of the application can always be found in the relevant directory's `README.md` file, with a short guide on how to contribute.

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
├── docker-compose.yaml
│    └── Starting up and seeding the database
└── README.md (Yes, you are reading me at the moment :D)
```

Links to the other `README` files:
- [Client README.md](./client/README.md)
- [Server README.md](./server/README.md)

## Setup

### Set up environment variables:

This depends on whether you are part of our inner development team for the project or not.

#### For group members

Download the `.env` files from `Team 3` of the `Software Engineering` class on `Teams`. As it may contain secret information like access tokens, we can not track it in the repository.
Once you have downloaded the `.env` file, make sure to put it in its rightful place, which is in the server directory: `.\server`.

> [!NOTE]  
> The file must be named `.env` with no file extension at all. If you have leftover `.env` files from the previous branches, then make sure to delete those and get the new one.

#### For outsiders

Here is an outline of what it may look like:

```env
POSTGRES_PASSWORD=   ...
POSTGRES_HOST=       ...
POSTGRES_DB=         ...
POSTGRES_PORT=       ...
DATABASE_URL=        ...
```

### Install dependencies:

For the frontend:

```sh
cd client # Depends on your CWD
npm install
```

For the backend:

```sh
cd server # Depends on your CWD
bun install
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

   You may wish to detach from the containers, to do so just add the tag `-d` to the end of the compose.

2. **Start the frontend:**

   Simply move into the client directory and run the application. You may also run using `bun run dev`, but that may have some bugs related to [this issue](https://github.com/oven-sh/bun/issues/14699).

   ```sh
   cd client # Depends on your CWD
   npm run dev
   ```

3. **See database status, Prisma Studio: (optional)**

   Optionally you can also see the current state / make changes in the database via the intuitive and easy-to-use Prisma Studio.

   To start it up, you just simply have to move into the server directory and invoke it. (You may also start it via `bun prisma studio`)
   
   The `DATABASE_URL` is needed before the command (just like with `prisma migrate`) because our `.env` file is set up for connecting inside of Docker, but when we are connecting from our device, we connect via `localhost` rather than the service name.

   ```sh
   cd server # Depends on your CWD
   DATABASE_URL=postgres://postgres:your-super-secret-and-long-postgres-password@localhost:5432/postgres npx prisma studio
   ```

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
