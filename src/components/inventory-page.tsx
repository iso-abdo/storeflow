'use client';

import { useState, useEffect } from 'react';
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
import { collection, onSnapshot, query, orderBy, runTransaction, doc, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';


interface Product {
    id: string;
    name: string;
    stock: number;
}
interface Warehouse {
    id: string;
    name: string;
}
interface Movement {
    id: string;
    product: string;
    type: 'إدخال' | 'إخراج' | 'تحويل' | 'مرتجع';
    quantity: number;
    warehouse: string;
    date: string;
}

const stockMovementSchema = z.object({
    productId: z.string().min(1, { message: "الرجاء اختيار منتج" }),
    warehouseId: z.string().min(1, { message: "الرجاء اختيار المستودع" }),
    quantity: z.coerce.number().int().min(1, { message: "الكمية يجب أن تكون 1 على الأقل" }),
});

const stockTransferSchema = z.object({
    productId: z.string().min(1, { message: "الرجاء اختيار منتج" }),
    quantity: z.coerce.number().int().min(1, { message: "الكمية يجب أن تكون 1 على الأقل" }),
    fromWarehouseId: z.string().min(1, { message: "الرجاء اختيار المستودع المصدر" }),
    toWarehouseId: z.string().min(1, { message: "الرجاء اختيار المستودع الهدف" }),
}).refine(data => data.fromWarehouseId !== data.toWarehouseId, {
    message: "لا يمكن التحويل إلى نفس المستودع",
    path: ["toWarehouseId"],
});


export function InventoryPage() {
    const [movements, setMovements] = useState<Movement[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState(true);

    const [isStockInOpen, setStockInOpen] = useState(false);
    const [isStockOutOpen, setStockOutOpen] = useState(false);
    const [isTransferOpen, setTransferOpen] = useState(false);
    
    const { toast } = useToast();

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

    useEffect(() => {
        const qMovements = query(collection(db, "movements"), orderBy("createdAt", "desc"));
        const qProducts = query(collection(db, "products"), orderBy("name"));
        const qWarehouses = query(collection(db, "warehouses"), orderBy("name"));

        const unsubMovements = onSnapshot(qMovements, (snap) => {
            setMovements(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movement)));
            if (loading) setLoading(false);
        });
        const unsubProducts = onSnapshot(qProducts, (snap) => {
            setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
        });
        const unsubWarehouses = onSnapshot(qWarehouses, (snap) => {
            setWarehouses(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Warehouse)));
        });

        return () => {
            unsubMovements();
            unsubProducts();
            unsubWarehouses();
        }
    }, [loading]);


    async function handleMovement(type: 'إدخال' | 'إخراج', values: z.infer<typeof stockMovementSchema>) {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            toast({ variant: 'destructive', title: 'خطأ', description: 'يجب أن تكون مسجلاً للدخول لتنفيذ هذه العملية.' });
            return;
        }

        const product = products.find(p => p.id === values.productId);
        const warehouse = warehouses.find(w => w.id === values.warehouseId);
        if (!product || !warehouse) return;

        try {
            await runTransaction(db, async (transaction) => {
                const productRef = doc(db, "products", product.id);
                const productDoc = await transaction.get(productRef);
                if (!productDoc.exists()) throw "المنتج غير موجود!";
                
                const currentStock = productDoc.data().stock;
                const newStock = type === 'إدخال' ? currentStock + values.quantity : currentStock - values.quantity;

                if (newStock < 0) throw "لا يوجد مخزون كافي لهذه العملية!";

                transaction.update(productRef, { stock: newStock });

                const movementData = {
                    product: product.name,
                    type: type,
                    quantity: values.quantity,
                    warehouse: warehouse.name,
                    date: new Date().toISOString().split('T')[0],
                    createdAt: serverTimestamp(),
                };
                transaction.set(doc(collection(db, "movements")), movementData);
            });
            toast({ title: `تمت عملية ${type} بنجاح!` });
            if (type === 'إدخال') { setStockInOpen(false); formIn.reset(); }
            else { setStockOutOpen(false); formOut.reset(); }

        } catch (e) {
            console.error("Transaction failed: ", e);
            toast({ variant: 'destructive', title: 'فشلت العملية', description: String(e) });
        }
    }

    async function handleTransfer(values: z.infer<typeof stockTransferSchema>) {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            toast({ variant: 'destructive', title: 'خطأ', description: 'يجب أن تكون مسجلاً للدخول لتنفيذ هذه العملية.' });
            return;
        }
        
        const product = products.find(p => p.id === values.productId);
        const fromWarehouse = warehouses.find(w => w.id === values.fromWarehouseId);
        const toWarehouse = warehouses.find(w => w.id === values.toWarehouseId);
        if (!product || !fromWarehouse || !toWarehouse) return;
        
        try {
            await runTransaction(db, async (transaction) => {
                const productRef = doc(db, "products", product.id);
                const productDoc = await transaction.get(productRef);
                if (!productDoc.exists()) throw "المنتج غير موجود!";
                
                const currentStock = productDoc.data().stock;
                if (currentStock < values.quantity) throw "لا يوجد مخزون كافي للتحويل!";
                
                const movementData = {
                    product: product.name,
                    type: 'تحويل',
                    quantity: values.quantity,
                    warehouse: `من ${fromWarehouse.name} إلى ${toWarehouse.name}`,
                    date: new Date().toISOString().split('T')[0],
                    createdAt: serverTimestamp(),
                };
                transaction.set(doc(collection(db, "movements")), movementData);
            });
            toast({ title: "تمت عملية التحويل بنجاح!" });
            setTransferOpen(false);
            formTransfer.reset();
        } catch (e) {
            console.error("Transaction failed: ", e);
            toast({ variant: 'destructive', title: 'فشلت العملية', description: String(e) });
        }
    }

  return (
    <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <h1 className="font-headline text-3xl font-bold tracking-tighter">المخزون</h1>
            <div className="flex gap-2">
                <Dialog open={isStockInOpen} onOpenChange={setStockInOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <ArrowDownToLine className="ml-2 h-4 w-4" />
                            إدخال مخزون
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>إدخال مخزون جديد</DialogTitle>
                            <DialogDescription>اختر المنتج والمستودع والكمية المدخلة.</DialogDescription>
                        </DialogHeader>
                        <Form {...formIn}>
                            <form onSubmit={formIn.handleSubmit((v) => handleMovement('إدخال', v))}>
                                <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
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
                                </div>
                                <DialogFooter className="pt-4">
                                    <Button type="submit">حفظ</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

                <Dialog open={isStockOutOpen} onOpenChange={setStockOutOpen}>
                    <DialogTrigger asChild>
                         <Button variant="outline">
                            <ArrowUpFromLine className="ml-2 h-4 w-4" />
                            إخراج مخزون
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>إخراج مخزون</DialogTitle>
                            <DialogDescription>اختر المنتج والمستودع والكمية المخرجة.</DialogDescription>
                        </DialogHeader>
                        <Form {...formOut}>
                            <form onSubmit={formOut.handleSubmit((v) => handleMovement('إخراج', v))}>
                                <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
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
                                </div>
                                <DialogFooter className="pt-4">
                                    <Button type="submit">إخراج</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

                <Dialog open={isTransferOpen} onOpenChange={setTransferOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <Replace className="ml-2 h-4 w-4" />
                            تحويل مخزون
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>تحويل مخزون</DialogTitle>
                            <DialogDescription>نقل المنتجات بين المستودعات.</DialogDescription>
                        </DialogHeader>
                        <Form {...formTransfer}>
                            <form onSubmit={formTransfer.handleSubmit(handleTransfer)}>
                               <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
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
                               </div>
                                <DialogFooter className="pt-4">
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
                            <TableHead>المنتج</TableHead>
                            <TableHead>النوع</TableHead>
                            <TableHead>المستودع/الوجهة</TableHead>
                            <TableHead className="text-right">الكمية</TableHead>
                            <TableHead className="text-right">التاريخ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({length: 5}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-4 w-[50px] ml-auto" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-4 w-[100px] ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : movements.map((mov) => (
                            <TableRow key={mov.id}>
                                <TableCell className="font-medium">{mov.product}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        mov.type === 'إدخال' || mov.type === 'مرتجع' ? 'default' 
                                        : mov.type === 'إخراج' ? 'destructive' 
                                        : 'secondary'
                                    }>
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
