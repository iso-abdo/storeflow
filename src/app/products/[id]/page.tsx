import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { ProductDetailPage } from "@/components/product-detail-page";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Product({ params }: { params: { id: string } }) {
  return (
    <SidebarProvider>
      <Sidebar side="right">
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="p-4 lg:p-6">
          <ProductDetailPage productId={params.id} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
