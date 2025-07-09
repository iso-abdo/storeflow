'use client';

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthGuard } from "@/components/auth-guard";
import { InventoryPage } from "@/components/inventory-page";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Inventory() {
  return (
    <AuthGuard>
      <SidebarProvider>
        <Sidebar side="right">
          <AppSidebar />
        </Sidebar>
        <SidebarInset>
          <AppHeader />
          <main className="p-4 lg:p-6">
            <InventoryPage />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
