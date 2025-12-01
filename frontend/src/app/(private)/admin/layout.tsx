import type { ReactNode } from "react";
import type { Metadata } from "next";
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
export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="w-full">
      {children}
    </div>
  );
}
