"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AuthCardProps {
    title: string
    description: string
    children: React.ReactNode
    footerText: string
    footerLinkText: string
    onFooterLinkClick?: () => void
}

export function AuthCard({
                             title,
                             description,
                             children,
                             footerText,
                             footerLinkText,
                             onFooterLinkClick,
                         }: AuthCardProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
                    <CardDescription className="text-center">{description}</CardDescription>
                </CardHeader>
                <CardContent>{children}</CardContent>
                <CardFooter>
                    <div className="text-center text-sm text-muted-foreground w-full">
                        {footerText}{" "}
                        <Button variant="link" className="p-0 h-auto font-normal text-primary" onClick={onFooterLinkClick}>
                            {footerLinkText}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}


