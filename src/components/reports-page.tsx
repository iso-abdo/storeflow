'use client';

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts";
import type { ChartConfig } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DatePicker } from './ui/date-picker';
import { Button } from './ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { salesAndPurchasesData } from '@/lib/data';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from './ui/skeleton';

interface Product {
    id: string;
    name: string;
}
interface Warehouse {
    id: string;
    name: string;
}
interface Movement {
    id: string;
    product: string;
    type: string;
    quantity: number;
    warehouse: string;
    date: string;
}
interface Return {
    id: string;
    reason: string;
}

const returnsConfig = {
  count: { label: "العدد" },
  'تالف': { label: "تالف", color: "hsl(var(--chart-5))" },
  'منتج خاطئ': { label: "منتج خاطئ", color: "hsl(var(--chart-4))" },
  'أخرى': { label: "أسباب أخرى", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

const salesAndPurchasesConfig = {
  sales: { label: 'المبيعات (ر.س)', color: 'hsl(var(--chart-2))' },
  purchases: { label: 'المشتريات (ر.س)', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig


export function ReportsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [movements, setMovements] = useState<Movement[]>([]);
    const [returns, setReturns] = useState<Return[]>([]);
    const [loading, setLoading] = useState(true);

    const [productFilter, setProductFilter] = useState('');
    const [openProductFilter, setOpenProductFilter] = useState(false);
    const [warehouseFilter, setWarehouseFilter] = useState('كل المستودعات');
    const [dateFilter, setDateFilter] = useState<Date | undefined>();

    useEffect(() => {
        const unsubProducts = onSnapshot(query(collection(db, "products")), (snap) => setProducts(snap.docs.map(d => ({...d.data(), id: d.id} as Product))));
        const unsubWarehouses = onSnapshot(query(collection(db, "warehouses")), (snap) => setWarehouses(snap.docs.map(d => ({...d.data(), id: d.id} as Warehouse))));
        const unsubMovements = onSnapshot(query(collection(db, "movements"), orderBy('date', 'desc')), (snap) => {
            setMovements(snap.docs.map(d => ({...d.data(), id: d.id} as Movement)));
            if (loading) setLoading(false);
        });
        const unsubReturns = onSnapshot(query(collection(db, "returns")), (snap) => setReturns(snap.docs.map(d => ({...d.data(), id: d.id} as Return))));

        return () => {
            unsubProducts();
            unsubWarehouses();
            unsubMovements();
            unsubReturns();
        }
    }, [loading]);

    const productsForFilter = products.map(p => ({
        value: p.name.toLowerCase(),
        label: p.name
    }));

    const warehousesForFilter = [
        { id: "all", name: "كل المستودعات" },
        ...warehouses
    ];

    const filteredMovements = movements.filter(item => {
        const productMatch = !productFilter || item.product.toLowerCase() === productFilter;
        const warehouseMatch = warehouseFilter === 'كل المستودعات' || item.warehouse === warehouseFilter;
        const dateMatch = !dateFilter || item.date === dateFilter.toISOString().split('T')[0];
        return productMatch && warehouseMatch && dateMatch;
    });

    const returnsChartData = returns.reduce((acc, current) => {
        const reason = current.reason;
        const existing = acc.find(item => item.reason === reason);
        if (existing) {
            existing.count += 1;
        } else {
            acc.push({ reason, count: 1 });
        }
        return acc;
    }, [] as {reason: string, count: number}[]);

    const clearFilters = () => {
        setProductFilter('');
        setWarehouseFilter('كل المستودعات');
        setDateFilter(undefined);
    };

  return (
    <div className="flex flex-col gap-6">
        <h1 className="font-headline text-3xl font-bold tracking-tighter">التقارير</h1>
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>تقرير حركة المخزون</CardTitle>
                    <CardDescription>عرض شامل لحركات المنتجات مع فلاتر للبحث.</CardDescription>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Popover open={openProductFilter} onOpenChange={setOpenProductFilter}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" aria-expanded={openProductFilter} className="w-[200px] justify-between" >
                                    {productFilter ? productsForFilter.find((p) => p.value === productFilter)?.label : "اختر منتجاً..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput placeholder="ابحث عن منتج..." />
                                    <CommandList>
                                        <CommandEmpty>لم يتم العثور على منتج.</CommandEmpty>
                                        <CommandGroup>
                                            {productsForFilter.map((p) => (
                                                <CommandItem key={p.value} value={p.value} onSelect={(currentValue) => { setProductFilter(currentValue === productFilter ? "" : currentValue); setOpenProductFilter(false); }}>
                                                    <Check className={cn("mr-2 h-4 w-4", productFilter === p.value ? "opacity-100" : "opacity-0")} />
                                                    {p.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="اختر مستودعاً" />
                            </SelectTrigger>
                            <SelectContent>
                                {warehousesForFilter.map(w => <SelectItem key={w.id} value={w.name}>{w.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <DatePicker date={dateFilter} setDate={setDateFilter} />
                        <Button variant="ghost" onClick={clearFilters}>مسح الفلاتر</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>المنتج</TableHead>
                                <TableHead>المستودع/الوجهة</TableHead>
                                <TableHead>النوع</TableHead>
                                <TableHead>التاريخ</TableHead>
                                <TableHead className="text-right">الكمية</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({length: 5}).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={5}><Skeleton className="h-4 w-full" /></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredMovements.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.product}</TableCell>
                                    <TableCell>{item.warehouse}</TableCell>
                                    <TableCell>
                                        <Badge variant={item.type === 'إدخال' ? 'default' : item.type === 'إخراج' ? 'destructive' : 'secondary'}>{item.type}</Badge>
                                    </TableCell>
                                    <TableCell>{new Date(item.date).toLocaleDateString('ar-EG')}</TableCell>
                                    <TableCell className="text-right font-mono">{item.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>تحليل حركة المرتجعات</CardTitle>
                    <CardDescription>إحصائيات حول أسباب المرتجعات.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center pb-0">
                    <ChartContainer config={returnsConfig} className="mx-auto aspect-square h-[250px]">
                        <PieChart>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Pie data={returnsChartData} dataKey="count" nameKey="reason" innerRadius={60} strokeWidth={5}></Pie>
                            <ChartLegend content={<ChartLegendContent nameKey="reason" />} className="-translate-y-[2rem] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center" />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>إحصاءات المبيعات</CardTitle>
                    <CardDescription>نظرة على أداء المبيعات خلال آخر 6 أشهر (بيانات تجريبية).</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={salesAndPurchasesConfig} className="h-[250px] w-full">
                        <LineChart accessibilityLayer data={salesAndPurchasesData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={80} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Line type="monotone" dataKey="sales" stroke="var(--color-sales)" strokeWidth={2} dot={true} />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>إحصاءات المشتريات</CardTitle>
                    <CardDescription>نظرة على أداء المشتريات خلال آخر 6 أشهر (بيانات تجريبية).</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={salesAndPurchasesConfig} className="h-[250px] w-full">
                        <BarChart accessibilityLayer data={salesAndPurchasesData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={80} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Bar dataKey="purchases" fill="var(--color-purchases)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
