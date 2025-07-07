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
  { month: "January", in: 186, out: 80 },
  { month: "February", in: 305, out: 200 },
  { month: "March", in: 237, out: 120 },
  { month: "April", in: 73, out: 190 },
  { month: "May", in: 209, out: 130 },
  { month: "June", in: 214, out: 140 },
]

const chartConfig = {
  in: { label: 'Stock In', color: 'hsl(var(--chart-2))' },
  out: { label: 'Stock Out', color: 'hsl(var(--destructive))' },
}

const recentActivities = [
    { id: 't1', product: 'Wireless Mouse', type: 'Sale', quantity: 10, date: '2023-06-23', status: 'Completed' },
    { id: 't2', product: 'Mechanical Keyboard', type: 'Stock In', quantity: 25, date: '2023-06-22', status: 'Received' },
    { id: 't3', product: 'USB-C Hub', type: 'Return', quantity: 2, date: '2023-06-21', status: 'Pending' },
    { id: 't4', product: '4K Monitor', type: 'Transfer', quantity: 5, date: '2023-06-20', status: 'Shipped' },
    { id: 't5', product: 'Laptop Stand', type: 'Sale', quantity: 15, date: '2023-06-19', status: 'Completed' },
]

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tighter">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,254</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warehouses</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Active locations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Returns</CardTitle>
            <Undo2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+5 since yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">32</div>
            <p className="text-xs text-muted-foreground">Items need restocking</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Stock Movements</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
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
            <CardTitle className="font-headline">Recent Activity</CardTitle>
            <CardDescription>A log of recent inventory transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Status</TableHead>
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
                          activity.status === 'Completed' || activity.status === 'Received' ? 'default' 
                          : activity.status === 'Pending' ? 'secondary' 
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
