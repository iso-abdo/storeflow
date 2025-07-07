'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, ArrowUpFromLine, Replace } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { Badge } from './ui/badge';

// Mock data, same as products page for now
const products = [
    { id: "PROD001", name: "فأرة لاسلكية" },
    { id: "PROD002", name: "لوحة مفاتيح ميكانيكية" },
    { id: "PROD003", name: "شاشة 4K" },
    { id: "PROD004", name: "حامل لابتوب" },
    { id: "PROD005", name: "موزع USB-C" },
];

const warehouses = [
    { id: "WH01", name: "المستودع الرئيسي" },
    { id: "WH02", name: "مستودع جدة" },
    { id: "WH03", name: "مستودع الدمام" },
];

// Schema for simple stock in/out
const stockMovementSchema = z.object({
    productId: z.string().min(1, { message: "الرجاء اختيار منتج" }),
    warehouseId: z.string().min(1, { message: "الرجاء اختيار المستودع" }),
    quantity: z.coerce.number().int().min(1, { message: "الكمية يجب أن تكون 1 على الأقل" }),
});

// Schema for stock transfer
const stockTransferSchema = z.object({
    productId: z.string().min(1, { message: "الرجاء اختيار منتج" }),
    quantity: z.coerce.number().int().min(1, { message: "الكمية يجب أن تكون 1 على الأقل" }),
    fromWarehouseId: z.string().min(1, { message: "الرجاء اختيار المستودع المصدر" }),
    toWarehouseId: z.string().min(1, { message: "الرجاء اختيار المستودع الهدف" }),
}).refine(data => data.fromWarehouseId !== data.toWarehouseId, {
    message: "لا يمكن التحويل إلى نفس المستودع",
    path: ["toWarehouseId"],
});


const initialMovements = [
    { id: '07010001', product: 'فأرة لاسلكية', type: 'إخراج', quantity: 10, warehouse: 'المستودع الرئيسي', date: '2023-07-01' },
    { id: 'IN-1688199999999', product: 'لوحة مفاتيح ميكانيكية', type: 'إدخال', quantity: 50, warehouse: 'المستودع الرئيسي', date: '2023-07-01' },
    { id: 'TR-1688100000000', product: 'شاشة 4K', type: 'تحويل', quantity: 5, warehouse: 'من جدة إلى الدمام', date: '2023-06-30' },
    { id: 'IN-1687900000000', product: 'حامل لابتوب', type: 'إدخال', quantity: 100, warehouse: 'المستودع الرئيسي', date: '2023-06-29' },
];

export function InventoryPage() {
    const [movements, setMovements] = useState(initialMovements);
    const [isStockInOpen, setStockInOpen] = useState(false);
    const [isStockOutOpen, setStockOutOpen] = useState(false);
    const [isTransferOpen, setTransferOpen] = useState(false);
    
    const [lastIdDate, setLastIdDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [dailyCounter, setDailyCounter] = useState(1);

    const formIn = useForm<z.infer<typeof stockMovementSchema>>({
        resolver: zodResolver(stockMovementSchema),
        defaultValues: { productId: "", warehouseId: "", quantity: 1 },
    });
    const formOut = useForm<z.infer<typeof stockMovementSchema>>({
        resolver: zodResolver(stockMovementSchema),
        defaultValues: { productId: "", warehouseId: "", quantity: 1 },
    });
    const formTransfer = useForm<z.infer<typeof stockTransferSchema>>({
        resolver: zodResolver(stockTransferSchema),
        defaultValues: { productId: "", quantity: 1, fromWarehouseId: "", toWarehouseId: "" },
    });

    const generateInvoiceId = () => {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        
        let counter = dailyCounter;
        if (todayStr !== lastIdDate) {
            counter = 1;
            setLastIdDate(todayStr);
        }

        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const sequence = counter.toString().padStart(4, '0');
        
        setDailyCounter(counter + 1);

        return `${month}${day}${sequence}`;
    };

    function handleStockIn(values: z.infer<typeof stockMovementSchema>) {
        const product = products.find(p => p.id === values.productId);
        const warehouse = warehouses.find(w => w.id === values.warehouseId);
        if (!product || !warehouse) return;

        const newMovement = {
            id: `IN-${Date.now()}`,
            product: product.name,
            type: 'إدخال',
            quantity: values.quantity,
            warehouse: warehouse.name,
            date: new Date().toISOString().split('T')[0],
        };

        setMovements(prevMovements => [newMovement, ...prevMovements]);
        setStockInOpen(false);
        formIn.reset();
    }
    function handleStockOut(values: z.infer<typeof stockMovementSchema>) {
        const product = products.find(p => p.id === values.productId);
        const warehouse = warehouses.find(w => w.id === values.warehouseId);
        if (!product || !warehouse) return;

        const newMovement = {
            id: generateInvoiceId(),
            product: product.name,
            type: 'إخراج',
            quantity: values.quantity,
            warehouse: warehouse.name,
            date: new Date().toISOString().split('T')[0],
        };

        setMovements(prevMovements => [newMovement, ...prevMovements]);
        setStockOutOpen(false);
        formOut.reset();
    }
    function handleTransfer(values: z.infer<typeof stockTransferSchema>) {
        const product = products.find(p => p.id === values.productId);
        const fromWarehouse = warehouses.find(w => w.id === values.fromWarehouseId);
        const toWarehouse = warehouses.find(w => w.id === values.toWarehouseId);

        if (!product || !fromWarehouse || !toWarehouse) return;
        
        const newMovement = {
            id: `TR-${Date.now()}`,
            product: product.name,
            type: 'تحويل',
            quantity: values.quantity,
            warehouse: `من ${fromWarehouse.name} إلى ${toWarehouse.name}`,
            date: new Date().toISOString().split('T')[0],
        };

        setMovements(prevMovements => [newMovement, ...prevMovements]);
        setTransferOpen(false);
        formTransfer.reset();
    }

  return (
    <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <h1 className="font-headline text-3xl font-bold tracking-tighter">المخزون</h1>
            <div className="flex gap-2">
                {/* Stock In Dialog */}
                <Dialog open={isStockInOpen} onOpenChange={setStockInOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <ArrowDownToLine className="ml-2 h-4 w-4" />
                            إدخال مخزون
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>إدخال مخزون جديد</DialogTitle>
                            <DialogDescription>اختر المنتج والمستودع والكمية المدخلة.</DialogDescription>
                        </DialogHeader>
                        <Form {...formIn}>
                            <form onSubmit={formIn.handleSubmit(handleStockIn)} className="space-y-4">
                                <FormField
                                    control={formIn.control}
                                    name="productId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>المنتج</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="اختر منتجاً" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={formIn.control}
                                    name="warehouseId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>المستودع</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="اختر مستودعاً" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={formIn.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الكمية</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit">حفظ</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

                {/* Stock Out Dialog */}
                <Dialog open={isStockOutOpen} onOpenChange={setStockOutOpen}>
                    <DialogTrigger asChild>
                         <Button variant="outline">
                            <ArrowUpFromLine className="ml-2 h-4 w-4" />
                            إخراج مخزون
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>إخراج مخزون</DialogTitle>
                            <DialogDescription>اختر المنتج والمستودع والكمية المخرجة.</DialogDescription>
                        </DialogHeader>
                        <Form {...formOut}>
                            <form onSubmit={formOut.handleSubmit(handleStockOut)} className="space-y-4">
                                <FormField
                                    control={formOut.control}
                                    name="productId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>المنتج</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="اختر منتجاً" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={formOut.control}
                                    name="warehouseId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>المستودع</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="اختر مستودعاً" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={formOut.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الكمية</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit">إخراج</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

                {/* Transfer Dialog */}
                <Dialog open={isTransferOpen} onOpenChange={setTransferOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <Replace className="ml-2 h-4 w-4" />
                            تحويل مخزون
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>تحويل مخزون</DialogTitle>
                            <DialogDescription>نقل المنتجات بين المستودعات.</DialogDescription>
                        </DialogHeader>
                        <Form {...formTransfer}>
                            <form onSubmit={formTransfer.handleSubmit(handleTransfer)} className="space-y-4">
                               <FormField
                                    control={formTransfer.control}
                                    name="productId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>المنتج</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="اختر منتجاً" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={formTransfer.control}
                                    name="fromWarehouseId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>من مستودع</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="اختر المستودع المصدر" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={formTransfer.control}
                                    name="toWarehouseId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>إلى مستودع</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="اختر المستودع الهدف" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={formTransfer.control}
                                    name="quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>الكمية</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit">تحويل</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
        <Card>
            <CardHeader>
            <CardTitle>سجل حركة المخزون</CardTitle>
            <CardDescription>سجل بآخر حركات المخزون المسجلة.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>رقم الفاتورة/المرجع</TableHead>
                            <TableHead>المنتج</TableHead>
                            <TableHead>النوع</TableHead>
                            <TableHead>المستودع/الوجهة</TableHead>
                            <TableHead className="text-right">الكمية</TableHead>
                            <TableHead className="text-right">التاريخ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {movements.map((mov) => (
                            <TableRow key={mov.id}>
                                <TableCell className="font-mono">{mov.id}</TableCell>
                                <TableCell className="font-medium">{mov.product}</TableCell>
                                <TableCell>
                                    <Badge variant={mov.type === 'إدخال' ? 'default' : mov.type === 'إخراج' ? 'destructive' : 'secondary'}>
                                        {mov.type}
                                    </Badge>
                                </TableCell>
                                <TableCell>{mov.warehouse}</TableCell>
                                <TableCell className="text-right">{mov.quantity}</TableCell>
                                <TableCell className="text-right">{mov.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
