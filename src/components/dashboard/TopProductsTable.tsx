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
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
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
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile List View */}
                <div className="md:hidden space-y-4 px-2">
                    {products.map((product, index) => (
                        <div key={index} className="group p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex flex-col gap-1">
                                    <h4 className="font-black text-slate-900 uppercase tracking-tighter text-sm leading-tight group-hover:text-blue-600 transition-colors">{product.name}</h4>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{product.category}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block font-black text-slate-900 text-base leading-none tracking-tight">
                                        ${product.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1 block px-2 py-0.5 bg-white rounded-full border border-slate-100">
                                        {product.units} units
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="h-32 flex items-center justify-center text-slate-400 font-medium italic">
                        No sales data available.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
