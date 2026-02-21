import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <SignIn
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "rounded-[2rem] shadow-2xl border-none bg-white/70 backdrop-blur-xl",
                        headerTitle: "text-slate-900 font-bold tracking-tight",
                        socialButtonsBlockButton: "rounded-2xl border-slate-200 hover:bg-slate-50 transition-all",
                        formButtonPrimary: "bg-slate-900 hover:bg-slate-800 rounded-2xl transition-all h-11",
                        footerActionLink: "text-slate-900 font-semibold hover:text-slate-700"
                    }
                }}
            />
        </div>
    );
}
