import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { ReturnsPage } from "@/components/returns-page";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Returns() {
  return (
    <SidebarProvider>
      <Sidebar side="right">
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="p-4 lg:p-6">
          <ReturnsPage />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
