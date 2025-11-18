"use client";

import type React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface AuthCardProps {
  children: React.ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="min-h-screen sm:w-3/5 w-full flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full shadow-lg border-2 border-gray-200 rounded-xl">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex flex-col items-center pb-6">
            <img 
              src="/img/logo-nova-sesi-senai.png" 
              alt="SESI SENAI Logo" 
              className="w-3/5 h-auto object-contain"
            />
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">{children}</CardContent>
      </Card>
    </div>
  );
}
