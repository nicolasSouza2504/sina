import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ava UniSenai - Admin",
  description: "Ava UniSenai Admin",
  generator: "Ava UniSenai",
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
