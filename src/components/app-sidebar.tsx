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
  <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Oblique Cube - side face */}
      <path d="M 70,22 L 78,14 L 78,38 L 70,46 Z" 
          fill="hsl(var(--sidebar-border))" 
          stroke="hsl(var(--sidebar-foreground))" 
          strokeWidth="1.5" 
          strokeLinejoin="round"
      />
      {/* Oblique Cube - top face */}
      <path d="M 46,22 L 54,14 L 78,14 L 70,22 Z" 
          fill="hsl(var(--sidebar-accent))" 
          stroke="hsl(var(--sidebar-foreground))" 
          strokeWidth="1.5"
          strokeLinejoin="round"
      />
      {/* Oblique Cube - front face */}
      <path d="M 46,22 L 70,22 L 70,46 L 46,46 Z" 
          fill="hsl(var(--sidebar-background))" 
          stroke="hsl(var(--sidebar-foreground))" 
          strokeWidth="1.5"
          strokeLinejoin="round"
      />
      <text
          x="58"
          y="34"
          fontFamily="Tajawal, sans-serif"
          fontSize="10"
          fontWeight="bold"
          fill="hsl(var(--accent))"
          textAnchor="middle"
          dominantBaseline="middle"
      >
          A.i
      </text>

      <text
          x="60"
          y="56"
          fontFamily="Tajawal, sans-serif"
          fontSize="16"
          fontWeight="bold"
          fill="hsl(var(--sidebar-foreground))"
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
