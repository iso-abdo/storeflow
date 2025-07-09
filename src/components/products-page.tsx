'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Camera, AlertCircle, Check, ChevronsUpDown } from "lucide-react";
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
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { collection, addDoc, query, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';


const productSchema = z.object({
    name: z.string().min(1, { message: "اسم المنتج مطلوب" }),
    barcode: z.string().optional(),
    category: z.string().optional(),
    price: z.coerce.number().min(0.01, { message: "السعر مطلوب ويجب أن يكون رقماً موجباً" }),
    min_stock: z.coerce.number().int().min(0).optional(),
    stock: z.coerce.number().int().min(0).optional(),
    imageUrl: z.string().optional(),
});

interface Product {
    id: string;
    name: string;
    barcode?: string;
    category?: string;
    price: number;
    min_stock: number;
    stock: number;
    imageUrl: string;
}


export function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
    const [isCameraDialogOpen, setIsCameraDialogOpen] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [openProductFilter, setOpenProductFilter] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            barcode: "",
            category: "",
            price: 0,
            min_stock: 0,
            stock: 0,
            imageUrl: "",
        },
    });
    
    useEffect(() => {
        const q = query(collection(db, "products"), orderBy("name"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const productsData: Product[] = [];
            querySnapshot.forEach((doc) => {
                productsData.push({ id: doc.id, ...doc.data() } as Product);
            });
            setProducts(productsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!isAddProductDialogOpen) {
            setCapturedImage(null);
            form.reset();
        }
    }, [isAddProductDialogOpen, form]);


    useEffect(() => {
        if (isCameraDialogOpen) {
            const getCameraPermission = async () => {
              try {
                const stream = await navigator.mediaDevices.getUserMedia({video: true});
                setHasCameraPermission(true);
        
                if (videoRef.current) {
                  videoRef.current.srcObject = stream;
                }
              } catch (error) {
                console.error('Error accessing camera:', error);
                setHasCameraPermission(false);
                toast({
                  variant: 'destructive',
                  title: 'تم رفض الوصول إلى الكاميرا',
                  description: 'يرجى تمكين أذونات الكاميرا في إعدادات متصفحك.',
                });
              }
            };
            getCameraPermission();
        } else {
             if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
      }, [isCameraDialogOpen, toast]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUri = canvas.toDataURL('image/png');
            setCapturedImage(dataUri);
            form.setValue('imageUrl', dataUri);
            setIsCameraDialogOpen(false);
        }
    };

    async function onSubmit(values: z.infer<typeof productSchema>) {
        try {
            await addDoc(collection(db, "products"), {
                name: values.name,
                barcode: values.barcode || '',
                category: values.category || '',
                price: values.price,
                min_stock: values.min_stock || 0,
                stock: values.stock || 0,
                imageUrl: capturedImage || "https://placehold.co/400x400.png",
                createdAt: serverTimestamp(),
            });
            toast({ title: "تمت إضافة المنتج بنجاح!" });
            setIsAddProductDialogOpen(false);
        } catch (error) {
            console.error("Error adding document: ", error);
            toast({
                variant: 'destructive',
                title: 'خطأ في إضافة المنتج',
                description: 'حدث خطأ ما، يرجى المحاولة مرة أخرى.',
            });
        }
    }

    const productsForFilter = products.map(p => ({
        value: p.name.toLowerCase(),
        label: p.name
    }));

    const filteredProducts = searchQuery
        ? products.filter(p => p.name.toLowerCase() === searchQuery)
        : products;

    return (
        <>
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h1 className="font-headline text-3xl font-bold tracking-tighter">المنتجات</h1>
                    <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="ml-2 h-4 w-4" />
                                إضافة منتج جديد
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[480px]">
                            <DialogHeader>
                                <DialogTitle>إضافة منتج جديد</DialogTitle>
                                <DialogDescription>
                                    أدخل تفاصيل المنتج الجديد هنا. انقر على "حفظ المنتج" عند الانتهاء.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                                    <FormItem className="grid grid-cols-4 items-start gap-4 pt-4">
                                        <FormLabel className="text-right pt-2">صورة المنتج</FormLabel>
                                        <div className="col-span-3 flex items-center gap-4">
                                            <div className="w-24 h-24 rounded-md bg-muted flex items-center justify-center border">
                                                <Image 
                                                    src={capturedImage || "https://placehold.co/400x400.png"} 
                                                    alt="Product" 
                                                    width={96} 
                                                    height={96} 
                                                    className="rounded-md object-cover aspect-square"
                                                    data-ai-hint="product image"
                                                />
                                            </div>
                                            <Button type="button" variant="outline" onClick={() => setIsCameraDialogOpen(true)}>
                                                <Camera className="ml-2 h-4 w-4" />
                                                التقاط صورة
                                            </Button>
                                        </div>
                                    </FormItem>
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
                                        <Button type="submit">حفظ المنتج</Button>
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
                        <div className="pt-4 flex items-center gap-2">
                            <Popover open={openProductFilter} onOpenChange={setOpenProductFilter}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" aria-expanded={openProductFilter} className="w-[250px] justify-between" >
                                        {searchQuery ? productsForFilter.find((p) => p.value === searchQuery)?.label : "ابحث عن منتج..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[250px] p-0">
                                    <Command>
                                        <CommandInput placeholder="ابحث عن منتج..." />
                                        <CommandList>
                                            <CommandEmpty>لم يتم العثور على منتج.</CommandEmpty>
                                            <CommandGroup>
                                                {productsForFilter.map((p) => (
                                                    <CommandItem key={p.value} value={p.value} onSelect={(currentValue) => { setSearchQuery(currentValue === searchQuery ? "" : currentValue); setOpenProductFilter(false); }}>
                                                        <Check className={cn("mr-2 h-4 w-4", searchQuery === p.value ? "opacity-100" : "opacity-0")} />
                                                        {p.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {searchQuery && <Button variant="ghost" onClick={() => setSearchQuery('')}>مسح الفلتر</Button>}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[64px]">الصورة</TableHead>
                                    <TableHead>اسم المنتج</TableHead>
                                    <TableHead>الرمز</TableHead>
                                    <TableHead>الفئة</TableHead>
                                    <TableHead>السعر</TableHead>
                                    <TableHead>أدنى مخزون</TableHead>
                                    <TableHead className="text-right">المخزون الحالي</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-10 w-10 rounded-md" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[80px] mx-auto" /></TableCell>
                                            <TableCell className="text-right"><Skeleton className="h-4 w-[80px] ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                width={40}
                                                height={40}
                                                className="rounded-md object-cover aspect-square"
                                                data-ai-hint="product image"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <Link href={`/products/${product.id}`} className="hover:underline">
                                                {product.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="font-mono">{product.id.substring(0,6)}</TableCell>
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

            {/* Camera Dialog */}
            <Dialog open={isCameraDialogOpen} onOpenChange={setIsCameraDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>التقاط صورة للمنتج</DialogTitle>
                        <DialogDescription>
                            وجّه الكاميرا إلى المنتج ثم انقر على "التقاط".
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 py-4">
                        <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                        <canvas ref={canvasRef} className="hidden" />
                        {hasCameraPermission === false && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>الكاميرا غير متاحة</AlertTitle>
                                <AlertDescription>
                                    يرجى السماح بالوصول إلى الكاميرا في متصفحك.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCameraDialogOpen(false)}>إلغاء</Button>
                        <Button onClick={handleCapture} disabled={hasCameraPermission !== true}>التقاط</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
