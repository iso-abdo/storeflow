import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle } from "lucide-react";

export function ProductsPage() {
    // Mock data for products
    const products = [
        { id: "PROD001", name: "فأرة لاسلكية", category: "إلكترونيات", price: 75.00, stock: 120 },
        { id: "PROD002", name: "لوحة مفاتيح ميكانيكية", category: "إلكترونيات", price: 250.00, stock: 80 },
        { id: "PROD003", name: "شاشة 4K", category: "شاشات", price: 1500.00, stock: 30 },
        { id: "PROD004", name: "حامل لابتوب", category: "ملحقات", price: 120.00, stock: 200 },
        { id: "PROD005", name: "موزع USB-C", category: "ملحقات", price: 90.00, stock: 150 },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="font-headline text-3xl font-bold tracking-tighter">المنتجات</h1>
                <Button>
                    <PlusCircle className="ml-2 h-4 w-4" />
                    إضافة منتج جديد
                </Button>
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
                                <TableHead className="text-right">المخزون الحالي</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-mono">{product.id}</TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>{product.price.toFixed(2)} ر.س</TableCell>
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
