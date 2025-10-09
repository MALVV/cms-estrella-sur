import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/query-provider";
import { AuthSessionProvider } from "@/lib/providers/session-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Charix Charity",
  description: "Changing childhoods. Changing lives.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Special+Gothic+Condensed:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${poppins.variable} font-display antialiased bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark`}
      >
        <AuthSessionProvider>
          <QueryProvider>
            {children}
            <Toaster />
            <SonnerToaster />
          </QueryProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
