// src/app/layout.tsx (or .jsx)
import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { systemName } from "@/lib/systemName";
import { systemAbreviation } from "@/lib/systemName";

export const metadata: Metadata = {
    title: `${systemAbreviation} - ${systemName}`,
    description: systemName,
    generator: systemAbreviation,
    icons: {
    icon: "/favicon.ico",
    shortcut: "/img/logo-senai.png",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className={GeistSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="white"
          enableSystem
          enableColorScheme={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
