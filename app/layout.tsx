import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Track your habits, streaks, and stats.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav className="flex gap-6 p-4 border-b border-gray-200">
          <Link href="/">Dashboard</Link>
          <Link href="/habits">Habits</Link>
          <Link href="/calendar">Calendar</Link>
          <Link href="/stats">Stats</Link>
          <Link href="/health">Health</Link>
        </nav>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
