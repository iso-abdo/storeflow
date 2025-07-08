'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle2, XCircle } from "lucide-react";
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
import { products, returns as initialReturns } from '@/lib/data';


const returnSchema = z.object({
    invoiceId: z.string().min(1, { message: "رقم الفاتورة الأصلية مطلوب" }),
    productId: z.string().min(1, { message: "الرجاء اختيار منتج" }),
    quantity: z.coerce.number().int().min(1, { message: "الكمية يجب أن تكون 1 على الأقل" }),
    reason: z.string().min(1, { message: "الرجاء اختيار سبب الإرجاع" }),
});


export function ReturnsPage() {
    const [returns, setReturns] = useState(initialReturns);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof returnSchema>>({
        resolver: zodResolver(returnSchema),
        defaultValues: { invoiceId: "", productId: "", quantity: 1, reason: "" },
    });

    function onSubmit(values: z.infer<typeof returnSchema>) {
        const product = products.find(p => p.id === values.productId);
        if (!product) return;

        const newReturn = {
            id: `RET${(returns.length + 1).toString().padStart(3, '0')}`,
            invoiceId: values.invoiceId,
            product: product.name,
            quantity: values.quantity,
            reason: values.reason,
            status: 'قيد الانتظار',
            date: new Date().toISOString().split('T')[0],
        };
        setReturns(prevReturns => [newReturn, ...prevReturns]);
        form.reset();
        setIsDialogOpen(false);
    }
    
    const handleStatusChange = (returnId: string, newStatus: 'تمت الموافقة' | 'مرفوض') => {
        setReturns(returns.map(r => 
            r.id === returnId ? { ...r, status: newStatus } : r
        ));
    };

  return (
    <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <h1 className="font-headline text-3xl font-bold tracking-tighter">المرتجعات</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="ml-2 h-4 w-4" />
                        إنشاء طلب إرجاع
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>إنشاء طلب إرجاع جديد</DialogTitle>
                        <DialogDescription>أدخل تفاصيل الإرجاع. سيتم مراجعة الطلب من قبل المدير.</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="invoiceId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>رقم الفاتورة الأصلية</FormLabel>
                                        <FormControl>
                                            <Input placeholder="مثال: INV2023-101" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="productId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>المنتج المرتجع</FormLabel>
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
                                control={form.control}
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
                            <FormField
                                control={form.control}
                                name="reason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>سبب الإرجاع</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="اختر سبب الإرجاع" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="تالف">تالف</SelectItem>
                                                <SelectItem value="منتج خاطئ">منتج خاطئ</SelectItem>
                                                <SelectItem value="أخرى">أخرى</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit">إرسال الطلب</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
        <Card>
            <CardHeader>
            <CardTitle>سجل المرتجعات</CardTitle>
            <CardDescription>عرض وإدارة المرتجعات من العملاء أو للموردين.</CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>رقم الطلب</TableHead>
                        <TableHead>الفاتورة</TableHead>
                        <TableHead>المنتج</TableHead>
                        <TableHead>الكمية</TableHead>
                        <TableHead>السبب</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>التاريخ</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {returns.map((ret) => (
                        <TableRow key={ret.id}>
                            <TableCell className="font-mono">{ret.id}</TableCell>
                            <TableCell>{ret.invoiceId}</TableCell>
                            <TableCell className="font-medium">{ret.product}</TableCell>
                            <TableCell>{ret.quantity}</TableCell>
                            <TableCell>{ret.reason}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    ret.status === 'تمت الموافقة' ? 'default'
                                    : ret.status === 'مرفوض' ? 'destructive'
                                    : 'secondary'
                                }>{ret.status}</Badge>
                            </TableCell>
                            <TableCell>{ret.date}</TableCell>
                            <TableCell className="text-right">
                                {ret.status === 'قيد الانتظار' ? (
                                    <div className="flex items-center justify-end gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => handleStatusChange(ret.id, 'تمت الموافقة')}
                                            aria-label="Approve return"
                                            className='hover:bg-primary/10'
                                        >
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => handleStatusChange(ret.id, 'مرفوض')}
                                            aria-label="Reject return"
                                            className='hover:bg-destructive/10'
                                        >
                                            <XCircle className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ) : (
                                   <span>—</span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
    </div>
  );
}
