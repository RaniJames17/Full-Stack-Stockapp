import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const client = await clientPromise;
          const db = client.db();
          const user = await db.collection("users").findOne({ email: credentials.email });

          if (!user) return null;
          
          const isValid = await compare(credentials.password, user.password);
          if (!isValid) return null;

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || "user",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === 'development', // Enable debug logs in development
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 1 day
  },
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
};
