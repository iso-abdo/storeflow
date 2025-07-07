// Mock data for the application

export const products = [
    { id: "PROD001", name: "فأرة لاسلكية", barcode: "1234567890123", category: "إلكترونيات", price: 75.00, min_stock: 10, stock: 120, imageUrl: "https://placehold.co/400x400.png" },
    { id: "PROD002", name: "لوحة مفاتيح ميكانيكية", barcode: "2345678901234", category: "إلكترونيات", price: 250.00, min_stock: 15, stock: 80, imageUrl: "https://placehold.co/400x400.png" },
    { id: "PROD003", name: "شاشة 4K", barcode: "3456789012345", category: "شاشات", price: 1500.00, min_stock: 5, stock: 30, imageUrl: "https://placehold.co/400x400.png" },
    { id: "PROD004", name: "حامل لابتوب", barcode: "4567890123456", category: "ملحقات", price: 120.00, min_stock: 20, stock: 200, imageUrl: "https://placehold.co/400x400.png" },
    { id: "PROD005", name: "موزع USB-C", barcode: "5678901234567", category: "ملحقات", price: 90.00, min_stock: 25, stock: 150, imageUrl: "https://placehold.co/400x400.png" },
];

export const warehouses = [
    { id: "WH01", name: "المستودع الرئيسي" },
    { id: "WH02", name: "مستودع جدة" },
    { id: "WH03", name: "مستودع الدمام" },
];

export const movements = [
    { id: '07010001', product: 'فأرة لاسلكية', type: 'إخراج', quantity: 10, warehouse: 'المستودع الرئيسي', date: '2023-07-01' },
    { id: '07010002', product: 'لوحة مفاتيح ميكانيكية', type: 'إدخال', quantity: 50, warehouse: 'المستودع الرئيسي', date: '2023-07-01' },
    { id: '06300001', product: 'شاشة 4K', type: 'تحويل', quantity: 5, warehouse: 'من جدة إلى الدمام', date: '2023-06-30' },
    { id: '06290001', product: 'حامل لابتوب', type: 'إدخال', quantity: 100, warehouse: 'المستودع الرئيسي', date: '2023-06-29' },
];

export const returns = [
    { id: 'RET001', invoiceId: 'INV2023-101', product: 'شاشة 4K', quantity: 1, reason: 'تالف', status: 'قيد الانتظار', date: '2023-06-25' },
    { id: 'RET002', invoiceId: 'INV2023-102', product: 'فأرة لاسلكية', quantity: 2, reason: 'منتج خاطئ', status: 'تمت الموافقة', date: '2023-06-24' },
    { id: 'RET003', invoiceId: 'INV2023-103', product: 'موزع USB-C', quantity: 1, reason: 'أخرى', status: 'مرفوض', date: '2023-06-22' },
];

export const recentActivities = [
    { id: 't1', product: 'فأرة لاسلكية', type: 'بيع', quantity: 10, date: '2023-06-23', status: 'مكتمل' },
    { id: 't2', product: 'لوحة مفاتيح ميكانيكية', type: 'إدخال مخزون', quantity: 25, date: '2023-06-22', status: 'تم الاستلام' },
    { id: 't3', product: 'موزع USB-C', type: 'مرتجع', quantity: 2, date: '2023-06-21', status: 'قيد الانتظار' },
    { id: 't4', product: 'شاشة 4K', type: 'تحويل', quantity: 5, date: '2023-06-20', status: 'تم الشحن' },
    { id: 't5', product: 'حامل لابتوب', type: 'بيع', quantity: 15, date: '2023-06-19', status: 'مكتمل' },
]

export const inventoryMovementsData = [
    { product: 'فأرة لاسلكية', warehouse: 'المستودع الرئيسي', quantity: 75, date: '2023-06-01' },
    { product: 'لوحة مفاتيح ميكانيكية', warehouse: 'المستودع الرئيسي', quantity: 40, date: '2023-06-05' },
    { product: 'شاشة 4K', warehouse: 'مستودع جدة', quantity: -5, date: '2023-06-10' },
    { product: 'حامل لابتوب', warehouse: 'المستودع الرئيسي', quantity: 150, date: '2023-06-12' },
    { product: 'موزع USB-C', warehouse: 'مستودع الدمام', quantity: -18, date: '2023-06-15' },
    { product: 'فأرة لاسلكية', warehouse: 'مستودع جدة', quantity: -10, date: '2023-06-20' },
];

export const returnsData = [
    { reason: 'damaged', count: 12 },
    { reason: 'wrong_item', count: 7 },
    { reason: 'other_reason', count: 5 },
    { reason: 'other', count: 9 },
];

export const salesAndPurchasesData = [
    { month: "يناير", sales: 4000, purchases: 2500 },
    { month: "فبراير", sales: 3000, purchases: 3200 },
    { month: "مارس", sales: 5000, purchases: 2800 },
    { month: "أبريل", sales: 4500, purchases: 4100 },
    { month: "مايو", sales: 6000, purchases: 3500 },
    { month: "يونيو", sales: 5500, purchases: 4500 },
];

export const chartData = [
  { month: "يناير", in: 186, out: 80 },
  { month: "فبراير", in: 305, out: 200 },
  { month: "مارس", in: 237, out: 120 },
  { month: "أبريل", in: 73, out: 190 },
  { month: "مايو", in: 209, out: 130 },
  { month: "يونيو", in: 214, out: 140 },
]
