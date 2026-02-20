import { addProduct } from "@/app/actions/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Package, Tag, DollarSign, Image as ImageIcon } from "lucide-react"
import Link from "next/link"

export default function NewProductPage() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-white/50">
                    <Link href="/dashboard/products">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 uppercase">New Product</h1>
                    <p className="text-slate-500 font-medium mt-1 tracking-tight">Add a new item to your catalog.</p>
                </div>
            </div>

            <Card className="border-none bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-slate-200/50 p-4 md:p-8 border border-white/40">
                <CardHeader className="px-2 pb-8">
                    <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Product Details</CardTitle>
                    <CardDescription className="text-slate-500 font-medium">Enter the information for the new product.</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                    <form action={addProduct} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="name" className="text-xs font-black uppercase tracking-wider text-slate-500">Product Name</Label>
                                <div className="relative">
                                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input id="name" name="name" placeholder="E.g. Wireless Headphones" required className="pl-12 h-14 bg-slate-50/50 border-slate-200/60 rounded-2xl text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-900 focus-visible:border-transparent transition-all" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="category" className="text-xs font-black uppercase tracking-wider text-slate-500">Category</Label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input id="category" name="category" placeholder="E.g. Electronics" required className="pl-12 h-14 bg-slate-50/50 border-slate-200/60 rounded-2xl text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-900 focus-visible:border-transparent transition-all" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="price" className="text-xs font-black uppercase tracking-wider text-slate-500">Price (USD)</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input id="price" name="price" type="number" step="0.01" placeholder="0.00" required className="pl-12 h-14 bg-slate-50/50 border-slate-200/60 rounded-2xl text-slate-900 placeholder:text-slate-400 focus-visible:ring-slate-900 focus-visible:border-transparent transition-all" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="image" className="text-xs font-black uppercase tracking-wider text-slate-500">Product Image</Label>
                            <div className="relative">
                                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <Input id="image" name="image" type="file" accept="image/*" required className="pl-12 pt-3 h-14 bg-slate-50/50 border-slate-200/60 rounded-2xl text-slate-900 file:mr-4 file:py-1 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 focus-visible:ring-slate-900 focus-visible:border-transparent transition-all" />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                            <Button variant="ghost" asChild className="rounded-2xl h-14 px-8 font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                                <Link href="/dashboard/products">Cancel</Link>
                            </Button>
                            <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800 rounded-2xl h-14 px-8 font-bold shadow-2xl shadow-slate-900/20">
                                Save Product
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
