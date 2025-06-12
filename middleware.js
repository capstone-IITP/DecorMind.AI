import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
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
  ],
  // Routes that can be accessed by admins
  ignoredRoutes: [
    "/admin",
    "/api/admin/(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 