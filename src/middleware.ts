import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    
    // Only redirect for admin routes if user is not admin
    if (pathname.startsWith("/admin") && req.nextauth.token?.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      url.searchParams.set("error", "access-denied");
      return NextResponse.redirect(url);
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Admin routes require admin role
        if (pathname.startsWith("/admin")) {
          return token?.role === "admin";
        }
        
        // Other protected routes just need authentication
        return !!token;
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
    "/stock-predictor",
    "/audit-logs",
    "/dashboard"
  ],
};
