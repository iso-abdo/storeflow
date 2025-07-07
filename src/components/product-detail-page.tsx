'use client';

import { products } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function ProductDetailPage({ productId }: { productId: string }) {
    const product = products.find(p => p.id === productId);

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
                                <p className="font-mono text-base">{product.id}</p>
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
