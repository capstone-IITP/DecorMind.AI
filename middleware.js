import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Using a more specific route matcher to avoid static route warnings
const isProtectedRoute = createRouteMatcher([
  "/dashboard", 
  "/dashboard/(.*)",
  "/dashboard-contact-us", // Add dashboard-contact-us as a protected route
  "/pricing/(.*)",  // Add pricing routes as protected
  "/api/razorpay",  // Protect the payment API route
  "/redesign/(.*)"  // Protect redesign routes
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