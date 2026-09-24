"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin-template/app-sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider className="min-h-screen">
      <AppSidebar />

      <main className="min-h-screen w-full bg-[#f6f3eb] md:ml-[143px]">
        {children}
      </main>
    </SidebarProvider>
  );
}