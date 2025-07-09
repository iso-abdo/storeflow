'use client'

import { useState, useEffect } from "react";
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
import { chartData, recentActivities } from "@/lib/data";
import { collection, query, onSnapshot, where, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";


const chartConfig = {
  in: { label: 'مخزون وارد', color: 'hsl(var(--chart-2))' },
  out: { label: 'مخزون صادر', color: 'hsl(var(--destructive))' },
}

interface Product {
    id: string;
    name: string;
    stock: number;
    min_stock: number;
}
interface Warehouse {
    id: string;
    name: string;
}
interface Return {
    id: string;
    product: string;
    invoiceId: string;
    reason: string;
    quantity: number;
}


export function DashboardPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [pendingReturns, setPendingReturns] = useState<Return[]>([]);
    const [loading, setLoading] = useState(true);

    const [isProductsDialogOpen, setProductsDialogOpen] = useState(false);
    const [isWarehousesDialogOpen, setWarehousesDialogOpen] = useState(false);
    const [isReturnsDialogOpen, setReturnsDialogOpen] = useState(false);
    const [isLowStockDialogOpen, setLowStockDialogOpen] = useState(false);
    
    const [newWarehouseName, setNewWarehouseName] = useState('');
    const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const qProducts = query(collection(db, "products"));
        const qWarehouses = query(collection(db, "warehouses"));
        const qReturns = query(collection(db, "returns"), where("status", "==", "قيد الانتظار"));

        const unsubProducts = onSnapshot(qProducts, (snapshot) => {
            setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
            checkLoading();
        });
        const unsubWarehouses = onSnapshot(qWarehouses, (snapshot) => {
            setWarehouses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Warehouse)));
            checkLoading();
        });
        const unsubReturns = onSnapshot(qReturns, (snapshot) => {
            setPendingReturns(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Return)));
            checkLoading();
        });

        const checkLoading = () => {
            if (loading) setLoading(false);
        }

        return () => {
            unsubProducts();
            unsubWarehouses();
            unsubReturns();
        }
    }, [loading]);

    const lowStockProducts = products.filter(p => p.stock <= p.min_stock);

    const handleAddWarehouse = async () => {
        if (newWarehouseName.trim() === '') return;
        try {
            await addDoc(collection(db, "warehouses"), {
                name: newWarehouseName.trim(),
                createdAt: serverTimestamp()
            });
            setNewWarehouseName('');
            toast({ title: "تمت إضافة المستودع بنجاح!" });
        } catch (error) {
            toast({ variant: 'destructive', title: "خطأ في إضافة المستودع" });
        }
    };

    const handleUpdateWarehouse = async () => {
        if (!editingWarehouse || editingWarehouse.name.trim() === '') return;
        try {
            const warehouseRef = doc(db, "warehouses", editingWarehouse.id);
            await updateDoc(warehouseRef, { name: editingWarehouse.name.trim() });
            setEditingWarehouse(null);
            toast({ title: "تم تحديث المستودع بنجاح!" });
        } catch (error) {
            toast({ variant: 'destructive', title: "خطأ في تحديث المستودع" });
        }
    };

    const handleDeleteWarehouse = async (warehouseId: string) => {
       try {
            await deleteDoc(doc(db, "warehouses", warehouseId));
            toast({ title: "تم حذف المستودع بنجاح." });
       } catch (error) {
            toast({ variant: 'destructive', title: "خطأ في حذف المستودع" });
       }
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
                {loading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{products.length}</div>}
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
                                <TableCell className="font-mono">{product.id.substring(0, 6)}</TableCell>
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
                        {loading ? <Skeleton className="h-8 w-10" /> : <div className="text-2xl font-bold">{warehouses.length}</div>}
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

        <Dialog open={isReturnsDialogOpen} onOpenChange={setReturnsDialogOpen}>
            <DialogTrigger asChild>
                <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">مرتجعات معلقة</CardTitle>
                    <Undo2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {loading ? <Skeleton className="h-8 w-10" /> : <div className="text-2xl font-bold">{pendingReturns.length}</div>}
                    <p className="text-xs text-muted-foreground">عرض المرتجعات المعلقة</p>
                  </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>المرتجعات المعلقة</DialogTitle>
                    <DialogDescription>قائمة بجميع طلبات الإرجاع التي تنتظر الموافقة.</DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>المنتج</TableHead>
                                <TableHead>رقم الفاتورة</TableHead>
                                <TableHead>السبب</TableHead>
                                <TableHead className="text-right">الكمية</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingReturns.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.product}</TableCell>
                                    <TableCell>{item.invoiceId}</TableCell>
                                    <TableCell>{item.reason}</TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setReturnsDialogOpen(false)}>إغلاق</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
        <Dialog open={isLowStockDialogOpen} onOpenChange={setLowStockDialogOpen}>
            <DialogTrigger asChild>
                <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">تنبيهات انخفاض المخزون</CardTitle>
                    <AlertCircle className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    {loading ? <Skeleton className="h-8 w-10" /> : <div className="text-2xl font-bold text-accent">{lowStockProducts.length}</div>}
                    <p className="text-xs text-muted-foreground">عناصر تحتاج لإعادة التخزين</p>
                  </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>تنبيهات انخفاض المخزون</DialogTitle>
                    <DialogDescription>قائمة بالمنتجات التي وصل مخزونها إلى الحد الأدنى أو أقل.</DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>المنتج</TableHead>
                                <TableHead className="text-center">المخزون الحالي</TableHead>
                                <TableHead className="text-center">أدنى مخزون</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lowStockProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell className="text-center text-accent font-bold">{product.stock}</TableCell>
                                    <TableCell className="text-center">{product.min_stock}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setLowStockDialogOpen(false)}>إغلاق</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">حركة المخزون</CardTitle>
            <CardDescription>آخر 6 أشهر (بيانات تجريبية)</CardDescription>
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
            <CardDescription>سجل بحركات المخزون الأخيرة (بيانات تجريبية).</CardDescription>
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
