import "./globals.css";
import { ReactNode } from "react";
import NavBar from "@/components/NavBar";
import Providers from "@/components/Providers";

export const metadata = {
  title: "MERN Full-Stack App",
  description: "A production-grade web application using Next.js 15",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-900">
        <Providers>
          <NavBar />
          <main className="p-6">{children}</main>
          <footer className="mt-auto bg-white p-4 text-center text-sm border-t">
            &copy; 2025 MERN Full-Stack Tutorial
          </footer>
        </Providers>
      </body>
    </html>
  );
}
