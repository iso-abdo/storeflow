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
      height="44"
      viewBox="0 0 110 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M22.8,32.1c-3.1-6.2,1.9-15.8,13-16.1c11.1-0.3,16.8,9.4,13.4,16.9c-3.4,7.5-15.7,6.5-19.8-0.1Z" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round"/>
        <path d="M30,25H46" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round"/>
        <path d="M59,32V24" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="59" cy="20.5" r="1.2" stroke="hsl(var(--accent))" strokeWidth="1.2"/>
        <circle cx="52.5" cy="32.5" r="1.2" fill="hsl(var(--accent))"/>
        <text x="55" y="38" fontFamily="Tajawal, sans-serif" fontSize="14" fontWeight="bold" fill="currentColor" textAnchor="middle">
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
