import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, ArrowUpFromLine, Replace } from "lucide-react";

export function InventoryPage() {
  return (
    <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <h1 className="font-headline text-3xl font-bold tracking-tighter">المخزون</h1>
            <div className="flex gap-2">
                <Button variant="outline">
                    <ArrowDownToLine className="ml-2 h-4 w-4" />
                    إدخال مخزون
                </Button>
                <Button variant="outline">
                    <ArrowUpFromLine className="ml-2 h-4 w-4" />
                    إخراج مخزون
                </Button>
                <Button variant="outline">
                    <Replace className="ml-2 h-4 w-4" />
                    تحويل مخزون
                </Button>
            </div>
        </div>
        <Card>
            <CardHeader>
            <CardTitle>حركة المخزون</CardTitle>
            <CardDescription>هنا سيتم تسجيل وإدارة حركة المخزون.</CardDescription>
            </CardHeader>
            <CardContent>
            <p>محتوى صفحة المخزون سيأتي هنا...</p>
            </CardContent>
        </Card>
    </div>
  );
}
