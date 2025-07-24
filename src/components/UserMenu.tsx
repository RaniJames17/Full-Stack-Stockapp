"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function UserMenu() {
  const { data: session } = useSession();

  return session ? (
    <div>
      <p>Welcome, {session.user?.email}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  ) : (
    <button onClick={() => signIn()}>Sign in</button>
  );
}
