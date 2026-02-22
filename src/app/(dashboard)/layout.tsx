"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";

const Topbar = dynamic(
  () => import("@/components/layout/topbar").then((mod) => mod.Topbar),
  {
    ssr: false,
    loading: () => <div className="h-16 border-b bg-card" />,
  }
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
