"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Loader2, AlertCircle, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.post("/auth/login", { email, password });
            const { token, user } = response.data;
            setAuth(user, token);
            router.push("/");
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to log in. Please check your credentials."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0E1012] p-4">
            
            {/* Background subtle grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(198,167,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(198,167,94,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="relative w-full max-w-[420px] space-y-6">

                {/* Logo + Branding */}
                <div className="flex flex-col items-center gap-3 mb-2">
                    <div className="w-14 h-14 bg-[#C6A75E] rounded-lg flex items-center justify-center shadow-[0_0_30px_rgba(198,167,94,0.3)]">
                        <Zap className="w-8 h-8 text-[#0E1012]" strokeWidth={2.5} />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-black text-[#E8E6E1] tracking-tight">
                            DisciplineOS
                        </h1>
                        <p className="text-xs text-[#5C5A57] uppercase tracking-widest mt-1">
                            Personal Discipline Engine
                        </p>
                    </div>
                    <p className="text-sm text-[#7A7875] text-center mt-1">
                        Your system. Your standards. Your results.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-[#16181C] border border-[#2A2D33] rounded-xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
                    <h2 className="text-lg font-bold text-[#E8E6E1] mb-1">Welcome back</h2>
                    <p className="text-xs text-[#5C5A57] mb-6">Sign in to continue your discipline streak</p>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] uppercase tracking-wider text-[#5C5A57] font-bold">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3A3D43]" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#1E2024] border border-[#2A2D33] rounded-lg pl-10 pr-4 py-3 text-sm text-[#E8E6E1] placeholder-[#3A3D43] focus:outline-none focus:border-[#C6A75E] focus:bg-[#1E2024] transition-all"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] uppercase tracking-wider text-[#5C5A57] font-bold">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    className="text-[11px] text-[#C6A75E] hover:text-[#D4B86A] transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3A3D43]" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#1E2024] border border-[#2A2D33] rounded-lg pl-10 pr-10 py-3 text-sm text-[#E8E6E1] placeholder-[#3A3D43] focus:outline-none focus:border-[#C6A75E] transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3A3D43] hover:text-[#C6A75E] transition-colors"
                                >
                                    {showPassword
                                        ? <EyeOff className="w-4 h-4" />
                                        : <Eye className="w-4 h-4" />
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full mt-2 py-3"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Verifying identity...
                                </span>
                            ) : (
                                "Sign In →"
                            )}
                        </Button>
                    </form>
                </div>

                {/* Divider line */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[#2A2D33]" />
                    <span className="text-[10px] text-[#3A3D43] uppercase tracking-widest">New here?</span>
                    <div className="flex-1 h-px bg-[#2A2D33]" />
                </div>

                {/* Register link */}
                <div className="text-center">
                    <Link
                        href="/register"
                        className="inline-block w-full py-3 border border-[#2A2D33] rounded-lg text-sm text-[#7A7875] hover:border-[#C6A75E] hover:text-[#C6A75E] transition-all text-center"
                    >
                        Create your DisciplineOS ID
                    </Link>
                </div>

                {/* Footer */}
                <p className="text-center text-[10px] text-[#3A3D43]">
                    By signing in you agree to operate at your highest standard.
                </p>

            </div>
        </div>
    );
}