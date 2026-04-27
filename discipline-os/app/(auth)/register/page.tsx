"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Loader2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function RegisterPage() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.post("/auth/register", { name, email, password });
            const { token, user } = response.data;
            setAuth(user, token);
            router.push("/");
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.error || "Failed to create account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#111214] p-4">
            <div className="w-full max-w-[400px] space-y-6">
                <div className="flex flex-col items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-[#C6A75E] rounded flex items-center justify-center">
                        <Zap className="w-7 h-7 text-[#111214]" strokeWidth={2.5} />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-black text-[#E8E6E1] tracking-tight">DisciplineOS</h1>
                        <p className="text-xs text-[#5C5A57] uppercase tracking-widest mt-1">Personal Discipline Engine</p>
                    </div>
                </div>

                <Card className="p-8">
                    <h2 className="text-xl font-bold text-[#E8E6E1] mb-6">Create your ID</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] uppercase tracking-wider text-[#5C5A57] font-bold">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[#1E2024] border border-[#2A2D33] rounded px-4 py-2.5 text-sm text-[#E8E6E1] focus:outline-none focus:border-[#C6A75E] transition-colors"
                                placeholder="Marcus Cole"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] uppercase tracking-wider text-[#5C5A57] font-bold">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#1E2024] border border-[#2A2D33] rounded px-4 py-2.5 text-sm text-[#E8E6E1] focus:outline-none focus:border-[#C6A75E] transition-colors"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] uppercase tracking-wider text-[#5C5A57] font-bold">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#1E2024] border border-[#2A2D33] rounded px-4 py-2.5 text-sm text-[#E8E6E1] focus:outline-none focus:border-[#C6A75E] transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs animate-shake">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full mt-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                                </span>
                            ) : (
                                "Get Started"
                            )}
                        </Button>
                    </form>
                </Card>

                <p className="text-center text-xs text-[#5C5A57]">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#C6A75E] hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
