import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { ReportsPage } from "@/components/reports-page";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Reports() {
  return (
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
  );
}
