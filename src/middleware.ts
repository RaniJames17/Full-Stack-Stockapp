import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // Allow access only to users with role 'admin'
      return token?.role === "admin";
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
