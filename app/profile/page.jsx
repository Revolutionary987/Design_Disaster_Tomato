"use client";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Phone, MapPin, Mail, LogOut, ShoppingBag,
  Star, ChevronRight, Sun, Moon, Shield, Edit2
} from "lucide-react";
import Link from "next/link";

const ORDER_HISTORY = [
  { id: "#DC-4821", date: "Today, 2:14 PM",      items: 5, total: 28.40, status: "Delivered" },
  { id: "#DC-4810", date: "Yesterday, 11:30 AM", items: 3, total: 14.99, status: "Delivered" },
  { id: "#DC-4795", date: "Mar 12, 6:45 PM",     items: 7, total: 52.20, status: "Delivered" },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const dark = theme === "dark";

  if (!user) { router.replace("/login"); return null; }

  const handleLogout = () => { logout(); router.push("/"); };
  const bg    = dark ? "bg-black"         : "bg-neutral-100";
  const card  = dark ? "bg-neutral-950 border-neutral-800" : "bg-white border-neutral-200";
  const text  = dark ? "text-white"       : "text-neutral-900";
  const muted = dark ? "text-neutral-500" : "text-neutral-400";
  const inp   = dark ? "bg-neutral-900 border-neutral-700 text-white" : "bg-neutral-50 border-neutral-200 text-neutral-900";

  return (
    <div className={`min-h-screen ${bg} ${text} font-sans`}>
      <header className="sticky top-0 z-50 bg-black text-white p-4 border-b-4 border-red-600">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-black">D</div>
            <span className="font-black text-sm uppercase hidden sm:block">Dark Commerce</span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-full bg-neutral-900 border border-neutral-700 hover:border-red-500 transition-colors" aria-label="Toggle theme">
              {dark ? <Sun size={16} className="text-white" /> : <Moon size={16} className="text-white" />}
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-2 bg-neutral-900 hover:bg-red-600 border border-neutral-700 text-white text-xs font-bold uppercase px-3 py-2 rounded-xl transition-all" aria-label="Logout">
              <LogOut size={14} />Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className={`border-4 border-black rounded-2xl overflow-hidden shadow-[8px_8px_0_0_#ef4444] ${dark ? "bg-neutral-950" : "bg-white"}`}>
          <div className="bg-gradient-to-r from-red-700 to-black p-8 flex items-center gap-6">
            <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black border-4 border-white/20">
              {user.avatar}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">Account</p>
              <h1 className="text-2xl font-black text-white">{user.name}</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <Shield size={12} className="text-green-400" />
                <span className="text-xs text-green-400 font-bold">Verified Member</span>
              </div>
            </div>
            <button className="ml-auto p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white" aria-label="Edit profile">
              <Edit2 size={16} />
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Mail,   label: "Email",   value: user.email   },
              { icon: Phone,  label: "Phone",   value: user.phone   },
              { icon: MapPin, label: "Address", value: user.address },
              { icon: Star,   label: "Rating",  value: "4.9 ★ (42 orders)" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className={`p-4 rounded-xl border ${inp}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon size={14} className="text-red-500" />
                  <p className={`text-[10px] font-black uppercase tracking-widest ${muted}`}>{label}</p>
                </div>
                <p className="font-bold text-sm">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`border-2 rounded-2xl overflow-hidden ${card}`}>
          <div className={`p-5 border-b ${dark ? "border-neutral-800" : "border-neutral-100"} flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-red-500" />
              <h2 className="font-black uppercase text-sm tracking-wider">Order History</h2>
            </div>
            <span className={`text-xs font-bold ${muted}`}>{ORDER_HISTORY.length} orders</span>
          </div>
          <div className={`divide-y ${dark ? "divide-neutral-800" : "divide-neutral-100"}`}>
            {ORDER_HISTORY.map(order => (
              <div key={order.id} className={`flex items-center gap-4 p-4 hover:${dark ? "bg-neutral-900" : "bg-neutral-50"} transition-colors cursor-pointer`}>
                <div className="w-10 h-10 bg-red-600/10 border border-red-600/20 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={18} className="text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm">{order.id}</p>
                  <p className={`text-xs ${muted}`}>{order.date} · {order.items} items</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm">${order.total.toFixed(2)}</p>
                  <span className="text-[10px] bg-green-600/20 text-green-500 font-bold px-2 py-0.5 rounded-full">{order.status}</span>
                </div>
                <ChevronRight size={16} className={muted} />
              </div>
            ))}
          </div>
        </motion.div>

        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-black uppercase py-4 rounded-2xl transition-all">
          <LogOut size={18} />Sign Out
        </button>
      </main>
    </div>
  );
}
