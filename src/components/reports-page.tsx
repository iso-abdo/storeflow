'use client';

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

// Mock data
const inventoryData = [
    { product: 'فأرة لاسلكية', warehouse: 'المستودع الرئيسي', quantity: 75, lowStock: false },
    { product: 'لوحة مفاتيح ميكانيكية', warehouse: 'المستودع الرئيسي', quantity: 40, lowStock: false },
    { product: 'شاشة 4K', warehouse: 'مستودع جدة', quantity: 5, lowStock: true },
    { product: 'حامل لابتوب', warehouse: 'المستودع الرئيسي', quantity: 150, lowStock: false },
    { product: 'موزع USB-C', warehouse: 'مستودع الدمام', quantity: 18, lowStock: true },
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
  return (
    <div className="flex flex-col gap-6">
        <h1 className="font-headline text-3xl font-bold tracking-tighter">التقارير</h1>
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>تقرير المخزون الحالي</CardTitle>
                    <CardDescription>عرض شامل لكميات المنتجات وحالة المخزون.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>المنتج</TableHead>
                                <TableHead>المستودع</TableHead>
                                <TableHead className="text-center">الحالة</TableHead>
                                <TableHead className="text-right">الكمية</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventoryData.map((item) => (
                                <TableRow key={item.product}>
                                    <TableCell className="font-medium">{item.product}</TableCell>
                                    <TableCell>{item.warehouse}</TableCell>
                                    <TableCell className="text-center">
                                        {item.lowStock ? (
                                            <Badge variant="destructive">منخفض</Badge>
                                        ) : (
                                            <Badge variant="secondary">متوفر</Badge>
                                        )}
                                    </TableCell>
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
