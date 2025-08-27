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
        <div className="min-h-screen w-3/5 flex items-center justify-center bg-background px-4 py-8">
            <Card className="w-full shadow-none border-0 ">
                <CardHeader className="space-y-1">
                   <div className="flex flex-col items-center pb-6">
                       <img src="/img/logo-nova-sesi-senai.png" className="size-3/5" />
                   </div>
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


