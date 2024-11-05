# Austrian Flood Monitor

Repository for the group work of WS24/25 Software Engineering and Project Management.

## Overview

Austrian Flood Monitoring is a comprehensive platform for reporting, monitoring, and managing floods in Austria. The project consists of a Next.js frontend and a Bun + Elysia.js backend, with a PostgreSQL database managed using Prisma.

## Code structure

On the top level:

```plaintext
Top Level
├── client
│   └── Next.js frontend
├── server
│   ├── Bun + Elysia.js backend
│   └── Database setup logic + Prisma
├── .env
│   └── Variables related to the docker composition
└── docker-compose.yaml
    └── Starting up and seeding the database
```

### Structure of `client`

The `client` directory contains the Next.js frontend application.
Our project utilizes the newer App Router feature of Next.js (instead of Pages Router) and the routes can be defined via the filesystem.
In general, `page.tsx` files define endpoints, `layout.tsx` files define wrappers and any general React component should be in the `components` directory. Like with many other frameworks, media, fonts and the like should all go into the `public` directory.

```plaintext
client
├── .eslintrc.json
├── .gitignore
├── .next
├── next-env.d.ts
├── next.config.ts
├── package.json
├── public
├── README.md
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── styles/
│   └── components/
├── tsconfig.json
└── types/
```

### Structure of `server`

The `server` directory contains the Bun + Elysia.js backend application and database setup logic using Prisma. In general API endpoints can be created from the `src` folder and changes to the database can be done inside the `prisma.schema` file.

You can find actual database queries made via Prisma Client in the `sql.ts` if you want to create any new query, write it here. And use it inside the `index.ts` or any other route of the Elysia application.

> [!IMPORTANT]  
> Database changes must be migrated by starting the database and then running `bun prisma migrate dev` inside the `server` directory

```plaintext
server
├── .env
│   └── For storing variables related to local development
├── .gitignore
├── bun.lockb
│   └── Lockfile used by Bun, similar to package lock
├── package.json
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── utils/
│       └── seed.mjs
├── src/
│   └── index.ts
|   └── prisma.ts
|   └── sql.ts
├── tsconfig.json
└── README.md
```

2. **Set up environment variables:**

   **For group members**

   Download the `.env` files from Jira. As it may contain secret information like access tokens, we can not track it in the repository. Once you have downloaded the `.env` files, make sure to put them in their corresponding directory (as also seen in the file structure tree) and rename them to simply `.env`, strip anything after or before it.

   > [!NOTE]  
   > There are two separate `.env` files, one for the main directory and one for the `server` directory - this is needed because of the different scopes of accessing the database from Docker / local dev environment.

   **For outsiders**

   We will in the future create an outline of how you may set up your own `.env` files to work in the project.

3. **Install dependencies:**

   - For the frontend:

     ```sh
     cd client # Depends on your CWD
     npm install
     ```

   - For the backend:

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

Start by cloning the repository. For now, the repository has been set to private so make sure you have your GitHub account set up in you preferred IDE / git credentials manager.

**Clone the repository:**

```sh
git clone https://github.com/yourusername/austrian-flood-monitor.git
cd austrian-flood-monitor
```

### Running the Application

The application currently focuses on a local development approach, so for development I recommend starting them separately in different terminals, so that you can see all of their logs. However, for a quick glance into the application we also offer a single line setup.

#### Start eveything all at once with a single line

#### Start things separately (recommended for development)

1. **Start the PostgreSQL database using Docker:**

The database can be started from the root of the application using a `docker-compose` file. This file has two services, one initiates the database and another one that sets up the database, applying the Prisma schema, migrations and then runs a seeding script.

```sh
docker-compose up -d
```

You may wish to stay attached to the containers to see the logs, to do so just leave out the tag `-d`.

2. **Start the frontend:**

   Simply move into the client directory and run the application. You may also run using `bun run dev`, but that may have some bugs related to [this issue](https://github.com/oven-sh/bun/issues/14699).

   ```sh
   cd client # Depends on your CWD
   npm run dev
   ```

3. **Start the backend:**

   Move into the server directory and

   ```sh
   cd server # Depends on your CWD
   bun serve
   ```

4. **See database status: (optional)**

   Optionally you can also see the current state / make changes in the database via the intuitive and easy-to-use prisma studio.
   To start it up, you just simply have to move into the server directory and invoke it. (You may also start it via `bun prisma studio`)

   ```sh
   cd server # Depends on your CWD
   npx prisma studio
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
- GitHub Copilot

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
