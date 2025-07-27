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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const client = await clientPromise;
          const db = client.db();
          const user = await db.collection("users").findOne({ email: credentials.email });

          if (!user) {
            throw new Error("User not found");
          }

          const isValid = await compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || "user",
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error("Authentication failed");
        }
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
    maxAge: 7 * 24 * 60 * 60, // 7 days - shorter for better security
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        const client = await clientPromise;
        const db = client.db();
        const users = db.collection("users");
        
        // For OAuth accounts
        if (account && account.provider !== "credentials") {
          const existing = await users.findOne({ email: user.email });
          
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
            user.id = existing._id.toString();
            user.role = existing.role || "user";
          }
        }
        
        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
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
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
