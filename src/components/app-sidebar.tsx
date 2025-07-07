'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AreaChart, Boxes, LayoutDashboard, Package, Warehouse, Undo2 } from 'lucide-react';

import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import Image from 'next/image';

export function AppSidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { href: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
    { href: '/products', label: 'المنتجات', icon: Boxes },
    { href: '/inventory', label: 'المخزون', icon: Warehouse },
    { href: '/returns', label: 'المرتجعات', icon: Undo2 },
    { href: '/reports', label: 'التقارير', icon: AreaChart },
  ];

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10 text-primary hover:bg-primary/10">
            <Package className="h-6 w-6" />
          </Button>
          <div className="flex flex-col">
            <h2 className="font-headline text-lg font-bold tracking-tight">
              تدفق المتجر
            </h2>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={isActive(item.href)}>
                <Link href={item.href === '/' ? '/' : '#'}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Separator className="my-2" />
        <div className="flex items-center gap-3 p-2">
          <Avatar>
            <Image src="https://placehold.co/40x40.png" alt="User" width={40} height={40} data-ai-hint="person portrait" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <span className="truncate text-sm font-semibold">المسؤول</span>
            <span className="truncate text-xs text-muted-foreground">admin@storeflow.com</span>
          </div>
        </div>
      </SidebarFooter>
    </>
  );
}
