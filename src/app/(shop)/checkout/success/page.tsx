
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                <h1 className="text-3xl font-bold text-slate-900">Thank You!</h1>
                <p className="text-slate-500">
                    Your order has been successfully placed. We've sent a confirmation email to your inbox.
                </p>

                <div className="pt-6">
                    <Link href="/catalog">
                        <Button className="w-full h-14 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
