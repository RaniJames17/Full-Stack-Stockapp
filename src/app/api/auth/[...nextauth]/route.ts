import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import clientPromise from "@/lib/mongodb";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
  
  interface User {
    id: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection("users").findOne({ email: credentials?.email });

        if (!user) throw new Error("User not found");
        const isValid = await compare(credentials?.password || "", user.password);
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || "user",
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Refresh session every 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      },
    },
  },
  useSecureCookies: process.env.NODE_ENV === 'production', // Enable secure cookies in production
  callbacks: {
    async signIn({ user, account }) {
      const client = await clientPromise;
      const db = client.db();
      const users = db.collection("users");
      
      // For OAuth accounts
      if (account && account.provider !== "credentials") {
        const existing = await users.findOne({ email: user.email });
        
        if (existing && !existing.oauthProvider) {
          // Optional: update user record to indicate OAuth linkage
          await users.updateOne(
            { _id: existing._id },
            { $set: { oauthProvider: account.provider } }
          );
          user.id = existing._id.toString();
          user.role = existing.role || "user";
          return true;
        }
        
        if (!existing) {
          // Create new record for OAuth user
          const newUser = await users.insertOne({
            email: user.email,
            name: user.name,
            oauthProvider: account.provider,
            role: "user",
            createdAt: new Date(),
          });
          user.id = newUser.insertedId.toString();
          user.role = "user";
        } else {
          // User exists and has OAuth provider
          user.id = existing._id.toString();
          user.role = existing.role || "user";
        }
      }
      
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id;
      }
      if (token?.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
