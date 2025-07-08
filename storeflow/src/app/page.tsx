import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardPage } from "@/components/dashboard-page";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <SidebarProvider>
      <Sidebar side="right">
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="p-4 lg:p-6">
          <DashboardPage />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
