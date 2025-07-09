'use client';

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthGuard } from "@/components/auth-guard";
import { ReportsPage } from "@/components/reports-page";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Reports() {
  return (
    <AuthGuard>
      <SidebarProvider>
        <Sidebar side="right">
          <AppSidebar />
        </Sidebar>
        <SidebarInset>
          <AppHeader />
          <main className="p-4 lg:p-6">
            <ReportsPage />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
