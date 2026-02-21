import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClerkSupabaseClient as createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { PlusCircle, Pencil, Trash2, Image as ImageIcon } from 'lucide-react'
import { DashboardMobileCard, DashboardMobileCardItem } from "@/components/dashboard/DashboardMobileCard"
import { DeleteProductButton } from "./components/DeleteProductButton"
import { DeleteProductMobileButton } from "./components/DeleteProductMobileButton"
import { EditProductModal } from "./components/EditProductModal"
import Image from 'next/image'

export default async function ProductsPage() {
    const supabase = await createClient()
    const { data: products } = await supabase.from('products').select(`
        *,
        order_items ( id )
    `)
    const displayProducts = products || []

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase">Inventory</h1>
                    <p className="text-slate-500 font-medium mt-1 tracking-tight">Manage your storefront catalog.</p>
                </div>
                <Button asChild className="bg-slate-900 text-white hover:bg-slate-800 rounded-2xl h-14 px-8 font-bold shadow-2xl shadow-slate-900/20 w-full sm:w-auto">
                    <Link href="/dashboard/products/new">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        ADD PRODUCT
                    </Link>
                </Button>
            </div>

            <Card className="border-none bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-slate-200/50 p-4 md:p-8 border border-white/40">
                <CardHeader className="px-2 pb-8">
                    <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Product Catalog</CardTitle>
                    <CardDescription className="text-slate-500 font-medium">Browse and manage active products.</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                    {/* Desktop View */}
                    <div className="hidden md:block overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-slate-100/50">
                                    <TableHead className="font-bold text-slate-900 uppercase tracking-tighter">Product Name</TableHead>
                                    <TableHead className="font-bold text-slate-900 uppercase tracking-tighter">Category</TableHead>
                                    <TableHead className="text-right font-bold text-slate-900 uppercase tracking-tighter">List Price</TableHead>
                                    <TableHead className="text-right font-bold text-slate-900 uppercase tracking-tighter">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayProducts.map((product: any) => (
                                    <TableRow key={product.id} className="hover:bg-slate-50/50 border-slate-50/50 transition-colors">
                                        <TableCell className="font-bold text-slate-900 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                {product.image ? (
                                                    <div className="h-10 w-10 relative rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-sm border border-slate-200/50">
                                                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="h-10 w-10 relative rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center border border-slate-200/50">
                                                        <ImageIcon className="h-4 w-4 text-slate-400" />
                                                    </div>
                                                )}
                                                <span>{product.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="rounded-full bg-slate-100 text-slate-600 border-none px-3 font-bold text-[10px] uppercase tracking-wider">
                                                {product.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-black text-slate-900">
                                            ${product.price.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <EditProductModal product={product} />
                                                <DeleteProductButton id={product.id} hasTransactions={(product.order_items?.length || 0) > 0} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {displayProducts.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-slate-400 font-medium italic">
                                            No products found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-4 px-2">
                        {displayProducts.map((product: any) => (
                            <DashboardMobileCard
                                key={product.id}
                                title={product.name}
                                subtitle={product.category}
                                status={
                                    <span className="font-black text-slate-900 text-lg">
                                        ${product.price.toFixed(2)}
                                    </span>
                                }
                                actions={
                                    <>
                                        <EditProductModal product={product} />
                                        <DeleteProductMobileButton id={product.id} hasTransactions={(product.order_items?.length || 0) > 0} />
                                    </>
                                }
                            >
                                <DashboardMobileCardItem label="Category" value={product.category} />
                                <DashboardMobileCardItem label="Price" value={`$${product.price.toFixed(2)}`} />
                                <DashboardMobileCardItem label="Product ID" value={product.id.slice(0, 12)} />
                                <DashboardMobileCardItem label="Stock Status" value="In Stock" />
                            </DashboardMobileCard>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
