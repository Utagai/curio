## Project Overview

This project is a Next.js web application called Curio. It allows users to post images of interesting things they find, which other users can then try to find and submit their own pictures of.

## Important Note for AI Agents

**UI Testing Limitation**: AI agents cannot directly test UI changes, click buttons, or interact with the web interface. When implementing UI features, agents should:
1. Complete the implementation based on requirements
2. Ensure the code compiles without errors
3. Explicitly inform the user that manual testing is needed
4. Be prepared to iterate based on user feedback from actual UI testing

This approach allows for efficient development cycles where agents handle the implementation and users provide real-world UI feedback.

## Tech Stack

*   **Framework**: Next.js (App Router)
*   **Language**: TypeScript
*   **Database**: MongoDB
*   **Authentication**: Clerk
*   **Blob Storage**: Vercel Blob / Local
*   **Styling**: Tailwind CSS
*   **Mapping**: Leaflet

## Key Files and Directories

*   `src/app/actions.ts`: **Main server actions file** - Contains all server-side functions that components can call, including `createPost`, `submitFind`, `getAllPosts`, `getPostById`, and `getSubmissionsById`. This is the primary interface between the frontend and backend.
*   `src/app/api/`: Contains factory functions and implementation details.
    *   `src/app/api/factory.ts`: Contains factory functions (`dbFactory`, `blobStorageFactory`) that return the appropriate database and blob storage implementations based on the environment.
    *   `src/app/api/db/`: Database-related files.
        *   `interface.ts`: Defines the database interface including operations for posts and submissions.
        *   `file.ts`: File-based database implementation (for development).
        *   `mongodb.ts`: MongoDB implementation (for production).
    *   `rsrc/localdb/default.json`: The default file used by `FileDB` to store data. Can be overridden by `CURIO_FILE_DB_PATH` environment variable.
    *   `src/app/api/blob/`: Blob storage-related files.
        *   `interface.ts`: Defines the interface for blob storage operations.
        *   `local.ts`: Local blob storage implementation (for development).
        *   `vercel.ts`: Vercel Blob storage implementation (for production).
    *   `src/app/api/post/image/`: API route for serving post images.
*   `src/app/model/`: Contains the data models for the application.
    *   `post.ts`: Defines the `Post` type, which includes submissions.
    *   `submission.ts`: Defines the `Submission` type for user-submitted finds.
    *   `difficulty.ts`: Defines the `Difficulty` enum.
    *   `latlng.ts`: Defines the `Latlng` type.
*   `src/app/posts/`: Contains the pages for viewing and creating posts.
    *   `page.tsx`: Displays a list of all posts.
    *   `new/page.tsx`: The page for creating a new post.
*   `src/app/post/[id]/`: Contains the page for viewing a single post and submitting finds.
    *   `page.tsx`: Main post view page.
    *   `SubmissionForm.tsx`: Component for submitting finds to a post.
    *   `Submission.tsx`: Component for displaying individual submissions.
*   `package.json`: Defines the project's dependencies and scripts.
    *   `dev`: Starts the development server with a local MongoDB instance.
    *   `freshdev`: Clears the local database and starts the development server.

## Common Tasks

*   **Adding a new server action:** Add a function to `src/app/actions.ts` that can be called from client components. This is the preferred approach for most data operations.
*   **Adding a new API endpoint:** Create a new `route.ts` file in the appropriate subdirectory of `src/app/api/` (mainly for non-form data operations or external API calls).
*   **Adding a new data model:** Create a new file in `src/app/model/` that defines the TypeScript type.
*   **Modifying the database schema:** Update the relevant types in `src/app/model/` and the database interface in `src/app/api/db/interface.ts`, then implement in both `file.ts` and `mongodb.ts`.
*   **Adding submission functionality to posts:** Use the existing pattern - extend the database interface, implement in both database classes, add a server action in `actions.ts`, and create UI components that call the action.
*   **Changing the blob storage provider:** Modify the `blobStorageFactory` in `src/app/api/factory.ts` to return a different implementation of the `IBlobStorage` interface.
