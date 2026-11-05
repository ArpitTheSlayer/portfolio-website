"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Lock, ArrowRight, ShieldCheck, Home } from "lucide-react";
import Button from "@/components/Button";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Incorrect admin password");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-admin className="min-h-screen flex flex-col justify-center items-center p-4 relative selection:bg-brand-orange selection:text-brand-dark">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-gradient-to-tr from-brand-red/20 via-brand-orange/20 to-brand-cyan/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md p-8 rounded-3xl border border-brand-orange/25 bg-brand-cream/70 dark:bg-brand-dark-surface/90 backdrop-blur-xl shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="size-16 rounded-2xl p-2 bg-gradient-to-br from-brand-red/15 via-brand-orange/15 to-brand-cyan/15 border border-brand-orange/30 shadow-md mb-4 flex items-center justify-center">
            <Image src={logo} alt="AP Logo" width={48} height={48} className="object-contain brand-logo-filter" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-orange/30 bg-brand-orange/10 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="size-3.5" />
            <span>Admin Control Panel</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-sm opacity-70 mt-1">Enter your admin password to manage projects and queries.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">
              Admin Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-brand-orange/30 bg-brand-cream/50 dark:bg-brand-dark/70 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30 text-sm transition-all"
              />
              <Lock className="size-4 text-brand-orange absolute left-4 top-1/2 -translate-y-1/2 opacity-70" />
            </div>
          </div>

          <Button type="submit" disabled={loading} variant="primary" className="w-full py-3">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="size-4 rounded-full border-2 border-brand-cream border-t-transparent animate-spin" />
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Unlock Dashboard</span>
                <ArrowRight className="size-4" />
              </span>
            )}
          </Button>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3.5 rounded-xl border border-brand-red/40 bg-brand-red/15 text-brand-red text-sm font-medium text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="mt-8 pt-6 border-t border-brand-orange/15 text-center">
          <Link
            href="/"
            className="text-xs text-brand-orange hover:underline inline-flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity"
          >
            <Home className="size-3.5" />
            <span>Return to Portfolio Website</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
