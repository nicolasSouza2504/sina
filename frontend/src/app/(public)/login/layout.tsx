import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { systemName, systemAbreviation } from "@/lib/systemName";

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
  children: ReactNode;
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
