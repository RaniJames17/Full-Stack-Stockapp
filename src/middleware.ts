import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    
    // If user is authenticated but not admin, and trying to access admin routes
    if (pathname.startsWith("/admin") && req.nextauth.token && req.nextauth.token.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      url.searchParams.set("error", "access-denied");
      return NextResponse.redirect(url);
    }
    
    // Allow access to other protected routes for authenticated users
    if (req.nextauth.token) {
      return NextResponse.next();
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // If accessing admin routes
        if (pathname.startsWith("/admin")) {
          // Allow if user has admin role
          return token?.role === "admin";
        }
        
        // For other protected routes, just check if user is authenticated
        if (pathname.startsWith("/stock-predictor") || 
            pathname.startsWith("/audit-logs") || 
            pathname.startsWith("/dashboard")) {
          return !!token;
        }
        
        // Allow access to all other routes
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
    "/stock-predictor/:path*",
    "/audit-logs/:path*",
    "/dashboard/:path*"
  ],
};
