import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-obsidian relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-400/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="flex flex-col items-center gap-6 z-10 w-full px-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-amber-400/20">
                        <span className="text-black font-bold text-xl">I</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">InsightOps</h1>
                </div>

                <RegisterForm />
            </div>
        </div>
    );
}
