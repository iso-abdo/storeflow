'use client';

import { useState } from 'react';
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
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DatePicker } from './ui/date-picker';
import { Button } from './ui/button';

// Mock data
const inventoryMovementsData = [
    { product: 'فأرة لاسلكية', warehouse: 'المستودع الرئيسي', quantity: 75, date: '2023-06-01' },
    { product: 'لوحة مفاتيح ميكانيكية', warehouse: 'المستودع الرئيسي', quantity: 40, date: '2023-06-05' },
    { product: 'شاشة 4K', warehouse: 'مستودع جدة', quantity: -5, date: '2023-06-10' },
    { product: 'حامل لابتوب', warehouse: 'المستودع الرئيسي', quantity: 150, date: '2023-06-12' },
    { product: 'موزع USB-C', warehouse: 'مستودع الدمام', quantity: -18, date: '2023-06-15' },
    { product: 'فأرة لاسلكية', warehouse: 'مستودع جدة', quantity: -10, date: '2023-06-20' },
];

const warehouses = [
    { id: "all", name: "كل المستودعات" },
    { id: "WH01", name: "المستودع الرئيسي" },
    { id: "WH02", name: "مستودع جدة" },
    { id: "WH03", name: "مستودع الدمام" },
];

const returnsData = [
    { reason: 'damaged', count: 12 },
    { reason: 'wrong_item', count: 7 },
    { reason: 'other_reason', count: 5 },
    { reason: 'other', count: 9 },
];

const returnsConfig = {
  count: {
    label: "العدد",
  },
  damaged: {
    label: "تالف",
    color: "hsl(var(--chart-5))",
  },
  wrong_item: {
    label: "منتج خاطئ",
    color: "hsl(var(--chart-4))",
  },
  other_reason: {
    label: "غير مطابق للوصف",
    color: "hsl(var(--chart-3))",
  },
  other: {
    label: "أسباب أخرى",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const salesAndPurchasesData = [
    { month: "يناير", sales: 4000, purchases: 2500 },
    { month: "فبراير", sales: 3000, purchases: 3200 },
    { month: "مارس", sales: 5000, purchases: 2800 },
    { month: "أبريل", sales: 4500, purchases: 4100 },
    { month: "مايو", sales: 6000, purchases: 3500 },
    { month: "يونيو", sales: 5500, purchases: 4500 },
];

const salesAndPurchasesConfig = {
  sales: { label: 'المبيعات (ر.س)', color: 'hsl(var(--chart-2))' },
  purchases: { label: 'المشتريات (ر.س)', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig


export function ReportsPage() {
    const [productFilter, setProductFilter] = useState('');
    const [warehouseFilter, setWarehouseFilter] = useState('كل المستودعات');
    const [dateFilter, setDateFilter] = useState<Date | undefined>();

    const filteredInventory = inventoryMovementsData.filter(item => {
        const productMatch = item.product.toLowerCase().includes(productFilter.toLowerCase());
        const warehouseMatch = warehouseFilter === 'كل المستودعات' || item.warehouse === warehouseFilter;
        const dateMatch = !dateFilter || new Date(item.date).toDateString() === dateFilter.toDateString();
        return productMatch && warehouseMatch && dateMatch;
    });

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
                        <Input 
                            placeholder="فلترة باسم المنتج..."
                            value={productFilter}
                            onChange={(e) => setProductFilter(e.target.value)}
                            className="max-w-sm"
                        />
                        <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="اختر مستودعاً" />
                            </SelectTrigger>
                            <SelectContent>
                                {warehouses.map(w => <SelectItem key={w.id} value={w.name}>{w.name}</SelectItem>)}
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
                                <TableHead>المستودع</TableHead>
                                <TableHead>النوع</TableHead>
                                <TableHead>التاريخ</TableHead>
                                <TableHead className="text-right">الكمية</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInventory.map((item, index) => (
                                <TableRow key={`${item.product}-${index}`}>
                                    <TableCell className="font-medium">{item.product}</TableCell>
                                    <TableCell>{item.warehouse}</TableCell>
                                    <TableCell>
                                        {item.quantity > 0 ? (
                                            <Badge variant="default">إدخال</Badge>
                                        ) : (
                                            <Badge variant="destructive">إخراج</Badge>
                                        )}
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
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie data={returnsData} dataKey="count" nameKey="reason" innerRadius={60} strokeWidth={5}>
                            </Pie>
                            <ChartLegend
                                content={<ChartLegendContent nameKey="reason" />}
                                className="-translate-y-[2rem] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                            />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>إحصاءات المبيعات</CardTitle>
                    <CardDescription>نظرة على أداء المبيعات خلال آخر 6 أشهر.</CardDescription>
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
                    <CardDescription>نظرة على أداء المشتريات خلال آخر 6 أشهر.</CardDescription>
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
