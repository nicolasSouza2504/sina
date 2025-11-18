import type { Metadata } from "next";
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
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      {children}
    </div>
  );
}
