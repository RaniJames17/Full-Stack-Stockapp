import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If user is authenticated but not admin, redirect to dashboard with error
    if (req.nextauth.token && req.nextauth.token.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      url.searchParams.set("error", "access-denied");
      return NextResponse.redirect(url);
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
  matcher: ["/admin/:path*"],
};
