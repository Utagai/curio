# Curio

Curio is a web application that allows users to post pictures of interesting things they find in the real world. Other users can then try to find these "curiosities" and submit their own findings.

## Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (using the App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Database**: [MongoDB](https://www.mongodb.com/) (production), File-based (development)
*   **Authentication**: [Clerk](https://clerk.com/)
*   **Blob Storage**: [Vercel Blob](https://vercel.com/storage/blob)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Mapping**: [Leaflet](https://leafletjs.com/)

## Project Structure

The project follows the standard Next.js App Router structure.

```
/
├── public/              # Static assets
├── rsrc/                # Local image resources for testing
│   └── localdb/ # Default directory for file-based database
├── src/
│   ├── app/
│   │   ├── api/         # API routes
│   │   │   ├── blob/    # Blob storage implementation (local and Vercel)
│   │   │   ├── db/      # Database implementation (file-based for development, MongoDB for production)
│   │   │   └── post/    # API routes for posts
│   │   ├── model/       # Data models (TypeScript types)
│   │   ├── post/        # Pages for individual posts
│   │   └── posts/       # Pages for listing and creating posts
│   └── middleware.ts    # Next.js middleware
├── .env.local           # Local environment variables (not checked in)
├── next.config.js       # Next.js configuration
├── package.json         # Project dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Getting Started

### Prerequisites

*   Node.js (v18 or later)
*   npm
*   MongoDB

### Installation and Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd curio
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of the project and add the necessary environment variables for Clerk, MongoDB, and Vercel Blob Storage.

    ```
    # Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=

    # MongoDB
    MONGODB_URI=

    # Vercel Blob Storage
    BLOB_READ_WRITE_TOKEN=
    ```

4.  **Run the development server:**

    The `dev` script will run the Next.js development server, using the file-based database by default.

    ```bash
    npm run dev
    ```

    The file-based database stores its data in `rsrc/localdb/default.json` by default. You can change this path by setting the `CURIO_FILE_DB_PATH` environment variable.

    For example, to use a different database file:

    ```bash
    CURIO_FILE_DB_PATH=rsrc/localdb/test.json npm run dev
    ```

    To start with a clean database, simply delete the `rsrc/localdb/default.json` file (or your custom file).

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

*   `npm run dev`: Starts the development server with a local MongoDB instance.
*   `npm run freshdev`: Clears the local database and then starts the development server.
*   `npm run build`: Builds the application for production.
*   `npm run start`: Starts a production server.
*   `npm run lint`: Lints the codebase using ESLint.
*   `npm run test`: Runs tests using Jest.
*   `npm run mongod`: Starts a local MongoDB instance.
*   `npm run cleandata`: Deletes all data from the local MongoDB instance and the file-based database.
