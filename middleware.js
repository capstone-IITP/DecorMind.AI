import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Using a more specific route matcher to avoid static route warnings
const isProtectedRoute = createRouteMatcher([
  "/dashboard", 
  "/dashboard/(.*)",
  "/pricing",  // Add pricing route to protected routes
  "/redesign"  // Also protect redesign route since it's mentioned in the flow
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};