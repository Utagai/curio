import { clerkMiddleware } from "@clerk/nextjs/server";

// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default clerkMiddleware({});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
