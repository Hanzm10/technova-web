import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const SettingsToggle = ({ id, label, defaultChecked = false }: { id: string, label: string, defaultChecked?: boolean }) => (
    <div className="group flex items-center justify-between p-6 bg-white/40 hover:bg-white/60 backdrop-blur-md rounded-3xl border border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50">
        <Label htmlFor={id} className="font-bold text-slate-900 cursor-pointer text-base tracking-tight group-hover:translate-x-1 transition-transform">
            {label}
        </Label>
        <Switch
            id={id}
            defaultChecked={defaultChecked}
            className="data-[state=checked]:bg-slate-900 data-[state=unchecked]:bg-slate-200"
        />
    </div>
)

export default function SettingsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-16 lg:items-start">
                {/* Left Column: Title & Info */}
                <div className="lg:w-1/3 lg:sticky lg:top-24">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-slate-900 leading-none">
                        DASHBOARD <br />
                        <span className="text-slate-400 font-normal italic font-serif italic">Settings</span>
                    </h1>
                    <p className="text-slate-500 mt-6 text-lg leading-relaxed max-w-sm">
                        Manage your dashboard preferences and store configuration to align with your business goals.
                    </p>

                    <div className="mt-12 hidden lg:block">
                        <Button asChild className="bg-slate-900 text-white hover:bg-slate-800 rounded-2xl px-8 h-14 font-bold shadow-2xl shadow-slate-900/20 group">
                            <Link href="/">
                                <ArrowLeft className="mr-3 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                                RETURN TO STORE
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Right Column: Cards */}
                <div className="flex-1 space-y-10">
                    <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/70 backdrop-blur-2xl rounded-[3rem] overflow-hidden p-8 border border-white/40">
                        <CardHeader className="px-0 pt-0 pb-8">
                            <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Notifications</CardTitle>
                            <CardDescription className="text-slate-500 font-medium text-base">Stay updated with your store's performance.</CardDescription>
                        </CardHeader>
                        <CardContent className="px-0 space-y-4">
                            <SettingsToggle id="order-alerts" label="Order Email Alerts" defaultChecked />
                            <SettingsToggle id="daily-summary" label="Daily Sales Summary" />
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/70 backdrop-blur-2xl rounded-[3rem] overflow-hidden p-8 border border-white/40">
                        <CardHeader className="px-0 pt-0 pb-8">
                            <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Store Status</CardTitle>
                            <CardDescription className="text-slate-500 font-medium text-base">Control your store's visibility.</CardDescription>
                        </CardHeader>
                        <CardContent className="px-0">
                            <SettingsToggle id="maintenance" label="Maintenance Mode" />
                        </CardContent>
                    </Card>

                    <div className="lg:hidden flex justify-center pt-8">
                        <Button asChild className="bg-slate-900 text-white hover:bg-slate-800 rounded-2xl px-10 h-16 font-bold shadow-2xl shadow-slate-900/20 w-full sm:w-auto text-lg">
                            <Link href="/">
                                <ArrowLeft className="mr-3 h-5 w-5" />
                                RETURN TO STORE
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
