"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { CheckCircle, Package, Truck, Home, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-600 text-sm rounded-xl">Loading map...</div>,
});

const STEPS = [
  { id: 0, label: "Order Accepted",    icon: CheckCircle, duration: 30  },
  { id: 1, label: "Packing Your Order", icon: Package,    duration: 90  },
  { id: 2, label: "Out for Delivery",   icon: Truck,      duration: 360 },
  { id: 3, label: "Arrived!",           icon: Home,       duration: 120 },
];

export default function DeliveryTracker({ total, userLat, userLng, address, onClose }) {
  const TOTAL_SECONDS = 600;
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [currentStep, setCurrentStep] = useState(0);
  const [deliveryProgress, setDeliveryProgress] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) { clearInterval(intervalRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    const elapsed = TOTAL_SECONDS - secondsLeft;
    const progress = Math.min(elapsed / TOTAL_SECONDS, 1);
    setDeliveryProgress(progress);
    if (elapsed >= 480) setCurrentStep(3);
    else if (elapsed >= 120) setCurrentStep(2);
    else if (elapsed >= 30)  setCurrentStep(1);
    else                     setCurrentStep(0);
  }, [secondsLeft]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter text-white">Live Delivery Tracking</h2>
          <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1"><span>📍</span> {address}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-black text-red-500 tabular-nums">{pad(mins)}:{pad(secs)}</div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Remaining</p>
          </div>
          {secondsLeft === 0 && (
            <button onClick={onClose} className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-colors" aria-label="Close tracker">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-around px-6 py-4 bg-neutral-950 border-b border-neutral-800">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === currentStep;
          const isDone = idx < currentStep;
          return (
            <div key={step.id} className="flex flex-col items-center gap-1.5 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDone ? "done" : isActive ? "active" : "idle"}
                  initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isDone    ? "bg-green-600 text-white"     :
                    isActive  ? "bg-red-600 text-white ring-4 ring-red-600/30 animate-pulse" :
                                "bg-neutral-800 text-neutral-600"
                  }`}>
                  <Icon size={18} />
                </motion.div>
              </AnimatePresence>
              <p className={`text-[10px] text-center font-bold uppercase tracking-wide leading-tight ${
                isDone ? "text-green-400" : isActive ? "text-white" : "text-neutral-600"
              }`}>{step.label}</p>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-neutral-800">
        <motion.div className="h-full bg-red-600"
          animate={{ width: `${(1 - secondsLeft / TOTAL_SECONDS) * 100}%` }}
          transition={{ duration: 1, ease: "linear" }} />
      </div>

      {/* Map */}
      <div className="flex-1 p-4">
        <div className="relative w-full h-full min-h-[300px] rounded-xl overflow-hidden border border-neutral-800">
          <MapComponent userLat={userLat} userLng={userLng} deliveryProgress={deliveryProgress} />
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full border border-neutral-700">
            🏍 Rider · {(deliveryProgress * 1.2).toFixed(1)} km traveled
          </div>
          {secondsLeft === 0 && (
            <div className="absolute inset-0 bg-green-600/20 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-black border-4 border-green-500 p-8 rounded-2xl text-center">
                <p className="text-5xl mb-3">🎉</p>
                <h3 className="text-2xl font-black text-white uppercase">Order Arrived!</h3>
                <p className="text-neutral-400 mt-1">Your order has been delivered</p>
                <button onClick={onClose} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase px-8 py-3 rounded-xl transition-colors">Done</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-widest">Order Total</p>
            <p className="text-2xl font-black text-white">${total.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-neutral-500 uppercase tracking-widest">Rider</p>
            <p className="text-sm font-bold text-white">Arjun M. · ⭐ 4.9</p>
            <p className="text-xs text-neutral-400">KA 03 J 4521</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
