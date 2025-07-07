'use client';
import { Bell, Search, AlertCircle, Undo2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { SidebarTrigger } from './ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Image from 'next/image';

const notifications = [
    { type: 'low_stock', product: 'لوحة مفاتيح ميكانيكية' },
    { type: 'pending_return', product: 'شاشة 4K' },
    { type: 'low_stock', product: 'فأرة لاسلكية' },
];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm lg:h-[60px] lg:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ابحث في المنتجات..."
              className="w-full appearance-none bg-transparent pr-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
            )}
            <span className="sr-only">تبديل الإشعارات</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[320px]">
          <DropdownMenuLabel>الإشعارات</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <DropdownMenuItem key={index} className="gap-3">
                {notification.type === 'low_stock' ? (
                  <AlertCircle className="h-4 w-4 text-accent" />
                ) : (
                  <Undo2 className="h-4 w-4 text-primary" />
                )}
                <div className="flex flex-col">
                  <span className="font-medium">
                    {notification.type === 'low_stock' ? 'انخفاض المخزون' : 'مرتجع معلق'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {notification.product}
                  </span>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>لا توجد إشعارات جديدة</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <Image src="https://placehold.co/40x40.png" alt="@admin" width={40} height={40} data-ai-hint="person portrait" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>حسابي</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>الإعدادات</DropdownMenuItem>
          <DropdownMenuItem>الدعم</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>تسجيل الخروج</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
