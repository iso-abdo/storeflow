import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function ReturnsPage() {
  return (
    <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <h1 className="font-headline text-3xl font-bold tracking-tighter">المرتجعات</h1>
            <Button>
                <PlusCircle className="ml-2 h-4 w-4" />
                إنشاء طلب إرجاع
            </Button>
        </div>
        <Card>
            <CardHeader>
            <CardTitle>إدارة المرتجعات</CardTitle>
            <CardDescription>هنا سيتم عرض وإدارة المرتجعات من العملاء أو للموردين.</CardDescription>
            </CardHeader>
            <CardContent>
            <p>محتوى صفحة المرتجعات سيأتي هنا...</p>
            </CardContent>
        </Card>
    </div>
  );
}
