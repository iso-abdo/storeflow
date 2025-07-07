'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AreaChart, Boxes, LayoutDashboard, Warehouse, Undo2 } from 'lucide-react';

import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import Image from 'next/image';

const Logo = () => (
  <svg
    width="110"
    height="60"
    viewBox="0 0 110 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* A.i part, using accent color */}
    <path
      d="M31.5,41.4C21.9,39,18.8,26.7,25.3,17.8c6.5-8.9,20.4-9.6,29.3-3.1c11.9,8.5,13.9,26.2,4.8,37.3"
      stroke="hsl(var(--accent))"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M39,32H61"
      stroke="hsl(var(--accent))"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M87.2,41.9c-2-6.5-8.3-10-15-8.5"
      stroke="hsl(var(--accent))"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <circle cx="86" cy="27" r="3" fill="hsl(var(--accent))" />
    <circle cx="70" cy="42" r="3" fill="hsl(var(--accent))" />

    {/* StoreFlow text, using muted-foreground */}
    <text
      x="55"
      y="55"
      fontFamily="Tajawal, sans-serif"
      fontSize="16"
      fontWeight="bold"
      fill="hsl(var(--muted-foreground))"
      textAnchor="middle"
    >
      StoreFlow
    </text>
  </svg>
);


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
        <div className="flex items-center justify-center p-2">
           <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={isActive(item.href)}>
                <Link href={item.href}>
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
