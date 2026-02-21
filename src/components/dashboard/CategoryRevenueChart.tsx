'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface CategoryRevenueChartProps {
    data: { name: string; value: number }[]
}

const COLORS = ['#0f172a', '#2563eb', '#6366f1', '#8b5cf6', '#ec4899']

export function CategoryRevenueChart({ data }: CategoryRevenueChartProps) {
    return (
        <Card className="border-none bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl shadow-slate-200/50 p-6 border border-white/40 h-full">
            <CardHeader className="px-2 pb-6">
                <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Revenue by Category</CardTitle>
                <CardDescription className="text-slate-500 font-medium">Distribution of sales across categories.</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <div className="h-[280px] md:h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="45%"
                                innerRadius={55}
                                outerRadius={80}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        className="hover:opacity-80 transition-opacity cursor-pointer shadow-xl"
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number | undefined) => value !== undefined ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : ''}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                    backdropFilter: 'blur(8px)',
                                    padding: '12px'
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                iconType="circle"
                                layout="horizontal"
                                wrapperStyle={{
                                    paddingTop: '20px',
                                    fontSize: '10px',
                                    fontWeight: '800',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
