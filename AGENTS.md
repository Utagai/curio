## Project Overview

This project is a Next.js web application called Curio. It allows users to post images of interesting things they find, which other users can then try to find and submit their own pictures of.

## Important Note for AI Agents

**UI Testing Limitation**: AI agents cannot directly test UI changes, click buttons, or interact with the web interface. When implementing UI features, agents should:
1. Complete the implementation based on requirements
2. Ensure the code compiles without errors
3. Explicitly inform the user that manual testing is needed
4. Be prepared to iterate based on user feedback from actual UI testing

This approach allows for efficient development cycles where agents handle the implementation and users provide real-world UI feedback.

**Update the changelog**: For any non-trivial, user-facing change, add an entry to the changelog shown on the About page. See the [Changelog](#changelog) section below.

## Tech Stack

*   **Framework**: Next.js (App Router)
*   **Language**: TypeScript
*   **Database**: MongoDB
*   **Authentication**: Clerk
*   **Blob Storage**: Vercel Blob / Local
*   **Styling**: Tailwind CSS
*   **Mapping**: Leaflet
*   **UI Components**: react-switch (for toggle switches)

## Key Files and Directories

*   `src/app/actions.ts`: **Main server actions file** - Contains all server-side functions that components can call, including `createPost`, `submitFind`, `getAllPosts`, `getPostById`, `getSubmissionsById`, and `closePost`. This is the primary interface between the frontend and backend.
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
    *   `post.ts`: Defines the `Post` type, which includes submissions and a `closed` boolean field.
    *   `submission.ts`: Defines the `Submission` type for user-submitted finds.
    *   `difficulty.ts`: Defines the `Difficulty` enum.
    *   `latlng.ts`: Defines the `Latlng` type.
*   `src/app/posts/`: Contains the pages for viewing and creating posts.
    *   `page.tsx`: Displays a list of all posts with filtering for closed posts.
    *   `PostsList.tsx`: Client component that handles post filtering and toggle switch.
    *   `new/page.tsx`: The page for creating a new post.
*   `src/app/post/[id]/`: Contains the page for viewing a single post and submitting finds.
    *   `page.tsx`: Main post view page with close button for post authors.
    *   `SubmissionForm.tsx`: Component for submitting finds to a post (disabled when post is closed).
    *   `Submission.tsx`: Component for displaying individual submissions.
    *   `ClosePostButton.tsx`: Component for closing posts (only visible to post authors).
*   `src/app/about/`: Contains the About page.
    *   `page.tsx`: Renders the definition card and the changelog.
    *   `changelog.ts`: **The changelog data source** (see [Changelog](#changelog)).
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
*   **Closing posts:** Posts can be closed by their authors using the `closePost` server action. Closed posts are filtered out by default on the posts page but can be shown using the toggle switch.
*   **Updating the changelog:** After a non-trivial change, add an entry to `src/app/about/changelog.ts`. See the [Changelog](#changelog) section for the format.

## Post Closing Feature

Curio includes a post closing feature that allows users to mark posts as no longer active:

### Backend Implementation
*   **Data Model**: Posts have a `closed` boolean field (defaults to `false`)
*   **Database Interface**: `closePost(id: string)` method in database interface
*   **Server Action**: `closePost` function in `actions.ts` with authorization (only post authors can close their posts)
*   **Database Support**: Implemented in both FileDB and MongoDB implementations

### Frontend Features
*   **Posts Page**: Filters out closed posts by default with a toggle switch to show/hide them
*   **Individual Post Page**: Shows close button for post authors, disables submission form when closed
*   **Visual Indicators**: Closed posts show strikethrough titles on both pages
*   **Toggle Switch**: Uses react-switch component with "Open"/"Closed" labels

### Authorization
*   Only the original post author can close their own posts
*   Verification is done server-side using Clerk authentication
*   Closed posts cannot accept new submissions

## Changelog

Curio displays a user-facing changelog below the definition card on the About page (`/about`).

*   **Data source**: `src/app/about/changelog.ts` exports a `changelog` array of `{ date, changes }` entries.
*   **Rendering**: `src/app/about/page.tsx` imports the data and renders it. Keep presentation concerns in the page, not in the data file.

### When to update

Update the changelog for any **non-trivial** change, such as a new feature, a user-visible behavior change, a notable bug fix, or a dependency/security change. Skip it for purely internal chores (typos, refactors with no behavior change, CI tweaks).

### How to update

1.  Open `src/app/about/changelog.ts`.
2.  Add a bullet to the entry for today's date. If there is no entry for today, add a new `{ date: "YYYY-MM-DD", changes: [...] }` object at the **top** of the array (entries are reverse-chronological, newest first).
3.  Write each change as a short, user-facing sentence. Avoid commit hashes and internal jargon.
4.  Keep dates as ISO `YYYY-MM-DD` strings — they are formatted for display by the page.
