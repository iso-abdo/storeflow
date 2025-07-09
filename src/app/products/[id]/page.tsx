'use client';

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthGuard } from "@/components/auth-guard";
import { ProductDetailPage } from "@/components/product-detail-page";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Product({ params }: { params: { id: string } }) {
  return (
    <AuthGuard>
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
    </AuthGuard>
  );
}
