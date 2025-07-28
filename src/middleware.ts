import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // Just pass through - let individual pages handle their own auth
    return;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Only protect admin routes
        if (pathname.startsWith("/admin")) {
          return token?.role === "admin";
        }
        
        // For dashboard, stock-predictor, audit-logs - require any valid token
        if (pathname.startsWith("/dashboard") || 
            pathname.startsWith("/stock-predictor") || 
            pathname.startsWith("/audit-logs")) {
          return !!token;
        }
        
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard",
    "/stock-predictor", 
    "/audit-logs"
  ],
};
