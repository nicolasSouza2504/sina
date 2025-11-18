import type React from "react";
import type { Metadata } from "next";
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
    <div>
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
    </div>
  );
}
