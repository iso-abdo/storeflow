import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { ProductsPage } from "@/components/products-page";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Products() {
  return (
    <SidebarProvider>
      <Sidebar side="right">
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="p-4 lg:p-6">
          <ProductsPage />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
