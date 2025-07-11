## Project Overview

This project is a Next.js web application called Curio. It allows users to post images of interesting things they find, which other users can then try to find and submit their own pictures of.

## Tech Stack

*   **Framework**: Next.js (App Router)
*   **Language**: TypeScript
*   **Database**: MongoDB
*   **Authentication**: Clerk
*   **Blob Storage**: Vercel Blob / Local
*   **Styling**: Tailwind CSS
*   **Mapping**: Leaflet

## Key Files and Directories

*   `src/app/api/`: Contains the backend API routes.
    *   `src/app/api/factory.ts`: This file contains factory functions (`dbFactory`, `blobStorageFactory`) that return the appropriate database and blob storage implementations based on the environment.
    *   `src/app/api/db/`: Database-related files.
        *   `interface.ts`: Defines the interface for database operations.
        *   `local.ts`: Local database implementation (for development).
        *   `mongodb.ts`: MongoDB implementation (for production).
    *   `src/app/api/blob/`: Blob storage-related files.
        *   `interface.ts`: Defines the interface for blob storage operations.
        *   `local.ts`: Local blob storage implementation (for development).
        *   `vercel.ts`: Vercel Blob storage implementation (for production).
    *   `src/app/api/post/`: API routes for managing posts.
*   `src/app/model/`: Contains the data models for the application.
    *   `post.ts`: Defines the `Post` type.
    *   `submission.ts`: Defines the `Submission` type.
    *   `difficulty.ts`: Defines the `Difficulty` enum.
    *   `latlng.ts`: Defines the `Latlng` type.
*   `src/app/posts/`: Contains the pages for viewing and creating posts.
    *   `page.tsx`: Displays a list of all posts.
    *   `new/page.tsx`: The page for creating a new post.
*   `src/app/post/[id]/`: Contains the page for viewing a single post.
*   `package.json`: Defines the project's dependencies and scripts.
    *   `dev`: Starts the development server with a local MongoDB instance.
    *   `freshdev`: Clears the local database and starts the development server.

## Common Tasks

*   **Adding a new API endpoint:** Create a new `route.ts` file in the appropriate subdirectory of `src/app/api/`.
*   **Adding a new data model:** Create a new file in `src/app/model/` that defines the TypeScript type.
*   **Modifying the database schema:** Update the `InsertPost` and `Post` types in `src/app/model/post.ts` and the database implementation in `src/app/api/db/`.
*   **Changing the blob storage provider:** Modify the `blobStorageFactory` in `src/app/api/factory.ts` to return a different implementation of the `IBlobStorage` interface.
