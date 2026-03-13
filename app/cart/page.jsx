"use client";
import { useRouter } from "next/navigation";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowLeft,
  Tag, Zap, Sun, Moon, ShieldCheck
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CartPage() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const dark = theme === "dark";

  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("dc_cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("dc_cart", JSON.stringify(cart));
  }, [cart]);

  const increment = (id) => setCart(p => p.map(c => c.id === id ? { ...c, quantity: c.quantity + 1 } : c));
  const decrement = (id) => setCart(p => p.flatMap(c => c.id === id ? c.quantity > 1 ? [{ ...c, quantity: c.quantity - 1 }] : [] : [c]));
  const remove = (cartId) => setCart(p => p.filter(c => c.cartId !== cartId));

  const subtotal = cart.reduce((a, c) => a + c.price * c.quantity, 0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const delivery = subtotal > 25 ? 0 : 2.99;
  const taxes = (subtotal - discount) * 0.08;
  const total = subtotal - discount + delivery + taxes;

  const bg    = dark ? "bg-black"     : "bg-neutral-100";
  const card  = dark ? "bg-neutral-950 border-neutral-800" : "bg-white border-neutral-200";
  const text  = dark ? "text-white"   : "text-neutral-900";
  const muted = dark ? "text-neutral-500" : "text-neutral-400";

  return (
    <div className={`min-h-screen ${bg} ${text} font-sans`}>
      <header className="sticky top-0 z-50 bg-black text-white border-b-4 border-red-600 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 hover:text-red-400 transition-colors">
            <ArrowLeft size={20} />
            <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center font-black text-sm">D</div>
            <span className="font-black text-sm uppercase hidden sm:block">Dark Commerce</span>
          </Link>
          <div className="flex-1 flex items-center justify-center">
            <h1 className="font-black uppercase tracking-tighter text-lg flex items-center gap-2">
              <ShoppingCart size={20} className="text-red-500" /> Your Cart
            </h1>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-full bg-neutral-900 border border-neutral-700 hover:border-red-500 transition-colors">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {cart.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 gap-4">
            <ShoppingCart size={72} className={muted} strokeWidth={1} />
            <h2 className="text-2xl font-black uppercase">Your cart is empty</h2>
            <p className={`text-sm ${muted}`}>Add items from the store to get started</p>
            <Link href="/" className="mt-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase px-8 py-3 rounded-xl transition-all">
              Browse Products
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <p className={`text-xs font-black uppercase tracking-widest mb-4 ${muted}`}>{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
              <AnimatePresence>
                {cart.map(item => (
                  <motion.div key={item.cartId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, height: 0 }}
                    className={`flex gap-4 items-center p-4 rounded-2xl border-2 ${card}`}>
                    <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
                      <Image src={item.img} alt={item.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-base uppercase leading-tight">{item.name}</h3>
                      <p className={`text-xs mt-0.5 ${muted}`}>{item.unit}</p>
                      <p className="font-black text-red-600 text-lg mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => remove(item.cartId)} className={`p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors ${muted}`} aria-label="Remove">
                        <Trash2 size={16} />
                      </button>
                      <div className="flex items-center bg-red-600 rounded-xl overflow-hidden">
                        <button onClick={() => decrement(item.id)} className="px-3 py-2 text-white hover:bg-red-700 transition-colors font-black"><Minus size={14} /></button>
                        <span className="px-3 py-2 text-white font-black text-sm bg-red-700 min-w-[36px] text-center">{item.quantity}</span>
                        <button onClick={() => increment(item.id)} className="px-3 py-2 text-white hover:bg-red-700 transition-colors font-black"><Plus size={14} /></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              <div className={`rounded-2xl border-2 overflow-hidden ${card}`}>
                <div className={`p-5 border-b ${dark ? "border-neutral-800" : "border-neutral-100"} flex items-center gap-2`}>
                  <Tag size={16} className="text-red-500" />
                  <h3 className="font-black uppercase text-sm tracking-wider">Coupon Code</h3>
                </div>
                <div className="p-5 flex gap-2">
                  <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Try DARK20"
                    className={`flex-1 px-3 py-2 rounded-xl border text-sm outline-none transition-colors ${
                      dark ? "bg-neutral-900 border-neutral-700 text-white placeholder-neutral-600 focus:border-red-500" : "bg-neutral-50 border-neutral-200 placeholder-neutral-400 focus:border-red-500"
                    }`} aria-label="Coupon code" />
                  <button onClick={() => { if (coupon.toUpperCase() === "DARK20") setCouponApplied(true); }}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-4 py-2 rounded-xl transition-colors">Apply</button>
                </div>
                {couponApplied && <p className="px-5 pb-3 text-green-500 text-xs font-bold flex items-center gap-1"><ShieldCheck size={12} />DARK20 applied — 10% off!</p>}
              </div>

              <div className={`rounded-2xl border-2 overflow-hidden ${card}`}>
                <div className={`p-5 border-b ${dark ? "border-neutral-800" : "border-neutral-100"}`}>
                  <h3 className="font-black uppercase text-sm tracking-wider">Order Summary</h3>
                </div>
                <div className="p-5 space-y-3 text-sm">
                  <div className={`flex justify-between ${muted}`}><span>Subtotal</span><span className={`font-bold ${text}`}>${subtotal.toFixed(2)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-green-500 font-bold"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
                  <div className={`flex justify-between ${muted}`}><span>Delivery</span><span className={delivery === 0 ? "text-green-500 font-bold" : `font-bold ${text}`}>{delivery === 0 ? "FREE" : `$${delivery.toFixed(2)}`}</span></div>
                  <div className={`flex justify-between ${muted}`}><span>Taxes (8%)</span><span className={`font-bold ${text}`}>${taxes.toFixed(2)}</span></div>
                  <div className={`flex justify-between pt-3 border-t ${dark ? "border-neutral-800" : "border-neutral-200"} text-lg`}>
                    <span className="font-black uppercase">Total</span>
                    <span className="font-black text-2xl">${total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="px-5 pb-5">
                  {user ? (
                    <button onClick={() => router.push("/")}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase text-base py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                      <Zap size={18} />Proceed to Pay
                    </button>
                  ) : (
                    <Link href="/login" className="w-full bg-black hover:bg-neutral-900 text-white border-2 border-neutral-700 font-black uppercase text-sm py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                      Sign In to Checkout
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
