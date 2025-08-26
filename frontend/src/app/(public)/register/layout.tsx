import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "next-themes"

export const metadata: Metadata = {
    title: "Financial Software - Register",
    description: "Financial Software - Register",
    generator: "Financial Software",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
    )
}
