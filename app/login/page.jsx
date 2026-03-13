"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Eye, EyeOff, LogIn, ShieldCheck, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dark = theme === "dark";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const ok = login(email, password);
    setIsLoading(false);
    if (ok) router.push("/");
    else setError("Invalid credentials. Try tharun@dark.com / dark123");
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors ${dark ? "bg-black" : "bg-neutral-100"}`}>
      <button onClick={toggleTheme} className={`fixed top-4 right-4 p-2.5 rounded-full border transition-colors ${dark ? "bg-neutral-900 border-neutral-700 text-white hover:border-red-500" : "bg-white border-neutral-300 text-neutral-900 hover:border-red-500"}`} aria-label="Toggle theme">
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border-4 border-black overflow-hidden shadow-[12px_12px_0_0_#ef4444]">
        <div className="bg-black p-8 text-center border-b-4 border-red-600">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Dark Commerce</h1>
          <p className="text-neutral-400 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className={`p-8 ${dark ? "bg-neutral-950" : "bg-white"}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${dark ? "text-neutral-400" : "text-neutral-600"}`}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tharun@dark.com" required
                className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium outline-none transition-all ${dark ? "bg-neutral-900 border-neutral-700 text-white placeholder-neutral-600 focus:border-red-500" : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-red-500"}`}
                aria-label="Email address" />
            </div>
            <div>
              <label className={`block text-xs font-black uppercase tracking-widest mb-2 ${dark ? "text-neutral-400" : "text-neutral-600"}`}>Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                  className={`w-full px-4 py-3 pr-12 rounded-xl border-2 text-sm font-medium outline-none transition-all ${dark ? "bg-neutral-900 border-neutral-700 text-white placeholder-neutral-600 focus:border-red-500" : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-red-500"}`}
                  aria-label="Password" />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${dark ? "text-neutral-500 hover:text-white" : "text-neutral-400 hover:text-neutral-900"}`}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-bold bg-red-950/30 border border-red-800 rounded-lg p-3">
                {error}
              </motion.p>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-neutral-700 text-white font-black uppercase text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2">
              {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><LogIn size={20} />Sign In</>}
            </button>
          </form>

          <p className={`text-center text-xs mt-4 ${dark ? "text-neutral-600" : "text-neutral-400"}`}>
            Demo: <span className={`font-bold ${dark ? "text-neutral-400" : "text-neutral-600"}`}>tharun@dark.com</span> / <span className={`font-bold ${dark ? "text-neutral-400" : "text-neutral-600"}`}>dark123</span>
          </p>

          <div className="mt-6 text-center">
            <Link href="/" className={`text-sm font-bold underline decoration-red-600 underline-offset-4 hover:text-red-600 transition-colors ${dark ? "text-neutral-400" : "text-neutral-500"}`}>
              Back to Shopping
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
