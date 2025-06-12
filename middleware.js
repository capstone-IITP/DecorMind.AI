import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/api/webhooks(.*)",
  "/sign-in",
  "/sign-up",
  "/pricing",
  "/contact",
  "/about",
  "/api/ably-token",
  "/api/admin/debug",
  "/api/auth-status",
  "/api/admin/auth-test",
  "/api/admin/debug-auth",
  "/api/admin/check-role",
  "/api/admin/check-mongodb",
  "/api/admin/check-ably",
  "/api/admin/users",
  "/api/admin/add-credits",
  "/api/admin/create-test-user",
  "/api/admin/set-admin",
  "/api/admin/fix-role",
  "/admin-login",
  "/admin-setup",
  "/admin-auth-test",
  "/admin-debug",
]);

// Define admin routes
const isAdminRoute = createRouteMatcher([
  "/admin",
  "/api/admin/(.*)",
]);

export default clerkMiddleware((auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return;
  }
  
  // For admin routes, we'll let the API routes handle authentication
  if (isAdminRoute(req)) {
    return;
  }
  
  // For all other routes, protect them
  return auth.protect();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 