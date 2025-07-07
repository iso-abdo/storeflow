'use client'

import { useState } from "react";
import { AlertCircle, Boxes, Pencil, PlusCircle, Trash2, Undo2, Warehouse } from "lucide-react";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";


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

const initialProducts = [
    { id: "PROD001", name: "فأرة لاسلكية", stock: 120 },
    { id: "PROD002", name: "لوحة مفاتيح ميكانيكية", stock: 80 },
    { id: "PROD003", name: "شاشة 4K", stock: 30 },
    { id: "PROD004", name: "حامل لابتوب", stock: 200 },
    { id: "PROD005", name: "موزع USB-C", stock: 150 },
];

const initialWarehouses = [
    { id: "WH01", name: "المستودع الرئيسي" },
    { id: "WH02", name: "مستودع جدة" },
    { id: "WH03", name: "مستودع الدمام" },
];

export function DashboardPage() {
    const [products] = useState(initialProducts);
    const [warehouses, setWarehouses] = useState(initialWarehouses);
    const [isProductsDialogOpen, setProductsDialogOpen] = useState(false);
    const [isWarehousesDialogOpen, setWarehousesDialogOpen] = useState(false);
    
    const [newWarehouseName, setNewWarehouseName] = useState('');
    const [editingWarehouse, setEditingWarehouse] = useState<{id: string; name: string} | null>(null);

    const handleAddWarehouse = () => {
        if (newWarehouseName.trim() === '') return;
        const newWarehouse = {
            id: `WH${Date.now()}`,
            name: newWarehouseName.trim(),
        };
        setWarehouses([...warehouses, newWarehouse]);
        setNewWarehouseName('');
    };

    const handleUpdateWarehouse = () => {
        if (!editingWarehouse || editingWarehouse.name.trim() === '') return;
        setWarehouses(
            warehouses.map((w) =>
                w.id === editingWarehouse.id ? { ...w, name: editingWarehouse.name.trim() } : w
            )
        );
        setEditingWarehouse(null);
    };

    const handleDeleteWarehouse = (warehouseId: string) => {
        setWarehouses(warehouses.filter((w) => w.id !== warehouseId));
    };


  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tighter">لوحة التحكم</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Dialog open={isProductsDialogOpen} onOpenChange={setProductsDialogOpen}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
                <Boxes className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-xs text-muted-foreground">عرض كل المنتجات</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>قائمة المنتجات</DialogTitle>
                <DialogDescription>عرض جميع المنتجات المتاحة في المخزون.</DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>الرمز</TableHead>
                            <TableHead>اسم المنتج</TableHead>
                            <TableHead className="text-right">المخزون الحالي</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-mono">{product.id}</TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell className="text-right">{product.stock}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setProductsDialogOpen(false)}>إغلاق</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isWarehousesDialogOpen} onOpenChange={setWarehousesDialogOpen}>
            <DialogTrigger asChild>
                <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">المستودعات</CardTitle>
                        <Warehouse className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{warehouses.length}</div>
                        <p className="text-xs text-muted-foreground">إدارة المستودعات</p>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>إدارة المستودعات</DialogTitle>
                    <DialogDescription>إضافة وتعديل وحذف المستودعات.</DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2 py-4">
                    <Input value={newWarehouseName} onChange={(e) => setNewWarehouseName(e.target.value)} placeholder="اسم المستودع الجديد" />
                    <Button onClick={handleAddWarehouse} disabled={!newWarehouseName.trim()}>
                        <PlusCircle className="ml-2 h-4 w-4" />إضافة
                    </Button>
                </div>
                <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
                    {warehouses.map(warehouse => (
                        <div key={warehouse.id} className="flex items-center justify-between gap-2 rounded-md border p-2">
                            {editingWarehouse?.id === warehouse.id ? (
                                <>
                                    <Input 
                                        value={editingWarehouse.name} 
                                        onChange={(e) => setEditingWarehouse({ ...editingWarehouse, name: e.target.value })} 
                                        className="h-8"
                                    />
                                    <div className="flex gap-1">
                                        <Button size="sm" onClick={handleUpdateWarehouse}>حفظ</Button>
                                        <Button size="sm" variant="ghost" onClick={() => setEditingWarehouse(null)}>إلغاء</Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className="font-medium">{warehouse.name}</span>
                                    <div className="flex gap-1">
                                        <Button size="icon" variant="ghost" onClick={() => setEditingWarehouse({ id: warehouse.id, name: warehouse.name })}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteWarehouse(warehouse.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => { setWarehousesDialogOpen(false); setEditingWarehouse(null); }}>إغلاق</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

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
