'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

interface RevenueChartProps {
    data: { date: string; amount: number }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
    return (
        <div className="h-[300px] md:h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="date"
                        stroke="#94a3b8"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                        dy={10}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
                        dx={-5}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '16px',
                            border: 'none',
                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                            backdropFilter: 'blur(8px)',
                            padding: '12px'
                        }}
                        labelFormatter={(value) => new Date(value).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    />
                    <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#0f172a"
                        strokeWidth={4}
                        dot={{ r: 4, fill: '#0f172a', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8, fill: '#3b82f6', strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
