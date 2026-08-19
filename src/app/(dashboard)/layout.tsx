import React from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar } from "../../components/layout/Topbar";
import { MobileNav } from "../../components/layout/MobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Desktop Sidebar (>=640px) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 sm:pb-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (<640px) */}
      <MobileNav />
    </div>
  );
}
