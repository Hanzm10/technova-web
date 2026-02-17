import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
    title: string
    value: string | number
    description: string
    icon: LucideIcon
    trend?: 'up' | 'down' | 'neutral'
}

export function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {
    return (
        <Card className="border-none bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white/40 overflow-hidden group hover:scale-[1.02] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/30">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{title}</CardTitle>
                <div className="p-2 bg-white rounded-xl shadow-sm">
                    <Icon className="h-4 w-4 text-slate-900" />
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="text-3xl font-black tracking-tighter text-slate-900">{value}</div>
                <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-bold uppercase tracking-wider ${trend === 'up' ? 'text-green-600' :
                            trend === 'down' ? 'text-red-600' :
                                'text-slate-400'
                        }`}>
                        {trend === 'up' && '↑'} {trend === 'down' && '↓'} {description}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}
