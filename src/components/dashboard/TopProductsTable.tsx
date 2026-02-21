'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface TopProductsTableProps {
    products: {
        name: string
        category: string
        revenue: number
        units: number
    }[]
}

export function TopProductsTable({ products }: TopProductsTableProps) {
    return (
        <Card className="border-none bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-slate-200/50 p-6 border border-white/40">
            <CardHeader className="px-2 pb-6">
                <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Top Products</CardTitle>
                <CardDescription className="text-slate-500 font-medium">Best performing products by total revenue.</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-slate-100/50">
                                <TableHead className="font-bold text-slate-900 uppercase tracking-tighter">Product</TableHead>
                                <TableHead className="font-bold text-slate-900 uppercase tracking-tighter">Category</TableHead>
                                <TableHead className="text-right font-bold text-slate-900 uppercase tracking-tighter">Sales</TableHead>
                                <TableHead className="text-right font-bold text-slate-900 uppercase tracking-tighter">Revenue</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product, index) => (
                                <TableRow key={index} className="hover:bg-slate-50/50 border-slate-50/50 transition-colors">
                                    <TableCell className="font-bold text-slate-900 py-4 truncate max-w-[150px]">{product.name}</TableCell>
                                    <TableCell className="font-medium text-slate-500 uppercase text-xs tracking-widest">{product.category}</TableCell>
                                    <TableCell className="text-right font-bold text-slate-900">{product.units}</TableCell>
                                    <TableCell className="text-right font-black text-slate-900">
                                        ${product.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {products.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-slate-400 font-medium italic">
                                        No sales data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
