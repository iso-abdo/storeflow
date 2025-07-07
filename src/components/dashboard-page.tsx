'use client'

import { AlertCircle, Boxes, Undo2, Warehouse } from "lucide-react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "./ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "يناير", in: 186, out: 80 },
  { month: "فبراير", in: 305, out: 200 },
  { month: "مارس", in: 237, out: 120 },
  { month: "أبريل", in: 73, out: 190 },
  { month: "مايو", in: 209, out: 130 },
  { month: "يونيو", in: 214, out: 140 },
]

const chartConfig = {
  in: { label: 'مخزون وارد', color: 'hsl(var(--chart-2))' },
  out: { label: 'مخزون صادر', color: 'hsl(var(--destructive))' },
}

const recentActivities = [
    { id: 't1', product: 'فأرة لاسلكية', type: 'بيع', quantity: 10, date: '2023-06-23', status: 'مكتمل' },
    { id: 't2', product: 'لوحة مفاتيح ميكانيكية', type: 'إدخال مخزون', quantity: 25, date: '2023-06-22', status: 'تم الاستلام' },
    { id: 't3', product: 'موزع USB-C', type: 'مرتجع', quantity: 2, date: '2023-06-21', status: 'قيد الانتظار' },
    { id: 't4', product: 'شاشة 4K', type: 'تحويل', quantity: 5, date: '2023-06-20', status: 'تم الشحن' },
    { id: 't5', product: 'حامل لابتوب', type: 'بيع', quantity: 15, date: '2023-06-19', status: 'مكتمل' },
]

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tighter">لوحة التحكم</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,254</div>
            <p className="text-xs text-muted-foreground">+20.1% عن الشهر الماضي</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المستودعات</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">مواقع نشطة</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مرتجعات معلقة</CardTitle>
            <Undo2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+5 منذ الأمس</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تنبيهات انخفاض المخزون</CardTitle>
            <AlertCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">32</div>
            <p className="text-xs text-muted-foreground">عناصر تحتاج لإعادة التخزين</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">حركة المخزون</CardTitle>
            <CardDescription>آخر 6 أشهر</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={chartData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="in" fill="var(--color-in)" radius={4} />
                <Bar dataKey="out" fill="var(--color-out)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">النشاط الأخير</CardTitle>
            <CardDescription>سجل بحركات المخزون الأخيرة.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead className="text-right">الكمية</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.product}</TableCell>
                    <TableCell>{activity.type}</TableCell>
                    <TableCell className="text-right">{activity.quantity}</TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={
                          activity.status === 'مكتمل' || activity.status === 'تم الاستلام' ? 'default' 
                          : activity.status === 'قيد الانتظار' ? 'secondary' 
                          : 'outline'
                        }
                      >
                        {activity.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
