'use client';

import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "./ui/skeleton";

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

export function ProductDetailPage({ productId }: { productId: string }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) {
                setLoading(false);
                return;
            };
            try {
                const docRef = doc(db, "products", productId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);


    if (loading) {
        return (
            <div className="flex flex-col gap-6">
                 <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-9 w-[250px]" />
                </div>
                <Card>
                    <CardContent className="p-6 grid md:grid-cols-2 gap-8">
                        <Skeleton className="w-full h-[400px] rounded-lg" />
                        <div className="flex flex-col gap-4 justify-center">
                            <CardHeader className="p-0 space-y-4">
                                <Skeleton className="h-10 w-3/4" />
                                <Skeleton className="h-6 w-1/4" />
                            </CardHeader>
                            <Skeleton className="h-10 w-1/2" />
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm pt-4">
                                <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-6 w-24" /></div>
                                <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-6 w-24" /></div>
                                <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-8 w-16" /></div>
                                <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-8 w-16" /></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!product) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-6">
             <div className="flex items-center gap-4">
                <Link href="/products" passHref>
                    <Button variant="outline" size="icon" aria-label="الرجوع إلى المنتجات">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="font-headline text-3xl font-bold tracking-tighter">{product.name}</h1>
            </div>
            <Card>
                <CardContent className="p-6 grid md:grid-cols-2 gap-8">
                    <div className="flex items-center justify-center bg-muted rounded-lg p-4">
                        <Image 
                            src={product.imageUrl} 
                            alt={product.name} 
                            width={400} 
                            height={400} 
                            className="rounded-lg object-contain aspect-square"
                            data-ai-hint="product image"
                        />
                    </div>
                    <div className="flex flex-col gap-4 justify-center">
                        <CardHeader className="p-0">
                            <CardTitle className="text-4xl font-bold font-headline">{product.name}</CardTitle>
                            <CardDescription className="text-lg">{product.category}</CardDescription>
                        </CardHeader>
                        
                        <div className="text-4xl font-bold text-primary">{product.price.toFixed(2)} ج.م</div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm pt-4">
                            <div>
                                <p className="text-muted-foreground">الرمز (ID)</p>
                                <p className="font-mono text-base">{product.id.substring(0, 6)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">الباركود</p>
                                <p className="font-mono text-base">{product.barcode}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">المخزون الحالي</p>
                                <p className="font-semibold text-xl">{product.stock}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">أدنى مخزون</p>
                                <p className="font-semibold text-xl">{product.min_stock}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
