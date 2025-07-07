'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
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
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input";

const productSchema = z.object({
    name: z.string().min(1, { message: "اسم المنتج مطلوب" }),
    barcode: z.string().min(1, { message: "الباركود مطلوب" }),
    category: z.string().min(1, { message: "الفئة مطلوبة" }),
    price: z.coerce.number().min(0, { message: "السعر يجب أن يكون رقمًا موجبًا" }),
    min_stock: z.coerce.number().int().min(0, { message: "الحد الأدنى للمخزون يجب أن يكون رقمًا صحيحًا موجبًا" }),
    stock: z.coerce.number().int().min(0, { message: "المخزون الحالي يجب أن يكون رقمًا صحيحًا موجبًا" }),
});

const initialProducts = [
    { id: "PROD001", name: "فأرة لاسلكية", barcode: "1234567890123", category: "إلكترونيات", price: 75.00, min_stock: 10, stock: 120 },
    { id: "PROD002", name: "لوحة مفاتيح ميكانيكية", barcode: "2345678901234", category: "إلكترونيات", price: 250.00, min_stock: 15, stock: 80 },
    { id: "PROD003", name: "شاشة 4K", barcode: "3456789012345", category: "شاشات", price: 1500.00, min_stock: 5, stock: 30 },
    { id: "PROD004", name: "حامل لابتوب", barcode: "4567890123456", category: "ملحقات", price: 120.00, min_stock: 20, stock: 200 },
    { id: "PROD005", name: "موزع USB-C", barcode: "5678901234567", category: "ملحقات", price: 90.00, min_stock: 25, stock: 150 },
];

export function ProductsPage() {
    const [products, setProducts] = useState(initialProducts);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            barcode: "",
            category: "",
            price: 0,
            min_stock: 0,
            stock: 0,
        },
    });

    function onSubmit(values: z.infer<typeof productSchema>) {
        const newProduct = {
            id: `PROD${(products.length + 1).toString().padStart(3, '0')}`,
            ...values,
        };
        setProducts([...products, newProduct]);
        form.reset();
        setIsDialogOpen(false);
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="font-headline text-3xl font-bold tracking-tighter">المنتجات</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="ml-2 h-4 w-4" />
                            إضافة منتج جديد
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>إضافة منتج جديد</DialogTitle>
                            <DialogDescription>
                                أدخل تفاصيل المنتج الجديد هنا. انقر على "حفظ" عند الانتهاء.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-4 items-center gap-4">
                                            <FormLabel className="text-right">اسم المنتج</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="col-span-3" />
                                            </FormControl>
                                            <FormMessage className="col-span-4 text-right" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="barcode"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-4 items-center gap-4">
                                            <FormLabel className="text-right">الباركود</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="col-span-3" />
                                            </FormControl>
                                            <FormMessage className="col-span-4 text-right" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-4 items-center gap-4">
                                            <FormLabel className="text-right">الفئة</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="col-span-3" />
                                            </FormControl>
                                            <FormMessage className="col-span-4 text-right" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-4 items-center gap-4">
                                            <FormLabel className="text-right">السعر</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} className="col-span-3" />
                                            </FormControl>
                                            <FormMessage className="col-span-4 text-right" />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="stock"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-4 items-center gap-4">
                                            <FormLabel className="text-right">المخزون</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} className="col-span-3" />
                                            </FormControl>
                                            <FormMessage className="col-span-4 text-right" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="min_stock"
                                    render={({ field }) => (
                                        <FormItem className="grid grid-cols-4 items-center gap-4">
                                            <FormLabel className="text-right">أدنى مخزون</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} className="col-span-3" />
                                            </FormControl>
                                            <FormMessage className="col-span-4 text-right" />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit">حفظ التغييرات</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>قائمة المنتجات</CardTitle>
                    <CardDescription>عرض وتعديل جميع المنتجات في المخزون.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>الرمز</TableHead>
                                <TableHead>اسم المنتج</TableHead>
                                <TableHead>الفئة</TableHead>
                                <TableHead>السعر</TableHead>
                                <TableHead>أدنى مخزون</TableHead>
                                <TableHead className="text-right">المخزون الحالي</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-mono">{product.id}</TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>{product.price.toFixed(2)} ج.م</TableCell>
                                    <TableCell className="text-center">{product.min_stock}</TableCell>
                                    <TableCell className="text-right">{product.stock}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}