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
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from './ui/command';
import { useRouter } from 'next/navigation';


const notifications = [
    { type: 'low_stock', product: 'لوحة مفاتيح ميكانيكية' },
    { type: 'pending_return', product: 'شاشة 4K' },
    { type: 'low_stock', product: 'فأرة لاسلكية' },
];

// Mock data for search functionality
const products = [
    { id: "PROD001", name: "فأرة لاسلكية" },
    { id: "PROD002", name: "لوحة مفاتيح ميكانيكية" },
    { id: "PROD003", name: "شاشة 4K" },
    { id: "PROD004", name: "حامل لابتوب" },
    { id: "PROD005", name: "موزع USB-C" },
];


export function AppHeader() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const router = useRouter();

  const filteredProducts = search
    ? products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  React.useEffect(() => {
    if (search.length > 0 && filteredProducts.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [search, filteredProducts.length]);


  const handleSelect = (productId: string) => {
    setOpen(false);
    setSearch("");
    router.push('/products');
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm lg:h-[60px] lg:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="w-full flex-1">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="relative md:w-2/3 lg:w-1/3">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="relative w-full">
                  <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="ابحث في المنتجات..."
                    className="w-full appearance-none bg-transparent pr-8 shadow-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent 
                className="p-0"
                style={{ width: 'var(--radix-popover-trigger-width)' }}
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <Command shouldFilter={false}>
                  <CommandList>
                    <CommandEmpty>لا يوجد نتائج.</CommandEmpty>
                    <CommandGroup>
                      {filteredProducts.map((product) => (
                        <CommandItem
                          key={product.id}
                          value={product.name}
                          onSelect={() => handleSelect(product.id)}
                          className='cursor-pointer'
                        >
                          {product.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
