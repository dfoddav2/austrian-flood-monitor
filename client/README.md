# Austrian Flood Monitor - Client

Welcome to the Client application of the Austrian Flood Monitor project. This is the frontend part comprising of a Next.js application.

See the top level [README.md here](../README.md).

## Prerequisites

You need:
- Node.js (v16 or later)

And run `npm install` once before running anything locally.

## Starting the frontend

Simply move into the `client` directory root and run the application. You may also run using `bun run dev`, but that may have some bugs related to [this issue](https://github.com/oven-sh/bun/issues/14699).

```sh
npm run dev
```

## Structure of `client`

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
├── package-lock.json
├── tsconfig.json
├── README.md (<- You are reading me)
├── public
│   └── The public folder holds public assets like images
└── src/
    ├── app/
    │   ├── [example_directory]
    │   │   └── File based routing
    │   ├── layout.tsx
    │   │   └── Page wrapper component definitions
    │   ├── page.tsx
    │   │   └── Page definition
    │   └── globals.css
    │       └── Top level CSS definitions, vars
    ├── styles/
    │   └── Reusable component and page styles go here
    └── utils/
        └── api.ts
            └── Sets up connection to the backend
```

## Quick guide for contributing

- All you have to worry about in this directory is the `src` and `public` directory. Inside `/src/app` use `page.tsx` and `layout.tsx` files in a folder based routing fashion to create endpoints.
- Define reusable styles in the `/src/styles` directory or in the `globals.css` for global styles.
- Put reusable functions and utility logic into the `/src/utils` directory.

## Relevant docs and guides online

- [Next.JS](https://nextjs.org/docs)