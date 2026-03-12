"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Mock Data ---
type Product = { id: number; name: string; price: number; img: string };
type CartItem = Product & { quantity: number; cartId: number };
type Popup = { id: number; top: string; left: string; content: string; btnPos: { x: number, y: number } };

// UX VIOLATION: Performance & Match between system/real world. 
// Forcing tiny thumbnails to load raw 4000x4000 unoptimized images decimates network performance and scaling.
const PRODUCTS: Product[] = [
  { id: 1, name: "Artisanal Water", price: 12.99, img: 'https://picsum.photos/4000/4000?random=1' },
  { id: 2, name: "Deconstructed Bread", price: 8.50, img: 'https://picsum.photos/4000/4000?random=2' },
  { id: 3, name: "Invisible Apple", price: 5.20, img: 'https://picsum.photos/4000/4000?random=3' },
  { id: 4, name: "Quantum Avocado", price: 25.00, img: 'https://picsum.photos/4000/4000?random=4' },
  { id: 5, name: "Anxious Coffee", price: 14.00, img: 'https://picsum.photos/4000/4000?random=5' },
  { id: 6, name: "Paradoxical Cheese", price: 13.50, img: 'https://picsum.photos/4000/4000?random=6' },
];

const AUTOCORRECT_MAP: Record<string, string> = {
  "bread": "Breadcrumbs for pigeons",
  "water": "Dehydrated water powder",
  "apple": "Apple-shaped potato",
  "milk": "Oat-flavored almond juice",
  "coffee": "Hot bean water",
  "cheese": "Solidified cow juice",
};

const ETAS = [
  "Delivery in 8 mins",
  "Arriving next Tuesday",
  "Driver lost in multiversal rift",
  "Your package has transcended time",
  "Driver is currently fighting a bear",
];

const POPUP_MESSAGES = [
  "HOT LOCAL SINGLES IN YOUR AREA WANT TO BUY BREAD!",
  "YOUR COMPUTER HAS A VIRUS. CLICK TO DOWNLOAD MORE VIRUSES.",
  "CONGRATULATIONS! YOU ARE THE 999,999th VISITOR! CLAIM YOUR IPAD!",
  "WARNING: DO NOT LOOK BEHIND YOU.",
  "IS YOUR REFRIGERATOR RUNNING? THEN YOU'D BETTER CATCH IT!"
];

// --- Utilities ---
const generateEquation = () => {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  const c = Math.floor(Math.random() * 50) + 10;
  return {
    equation: `Solve for x: ${a}x + ${b} = ${c}`,
    answer: ((c - b) / a).toFixed(2),
  };
};

export default function DeepDarkCommerce() {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // 1. Fake 6-Second Loading Screen
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const [loadPct, setLoadPct] = useState(0);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [displaySearchTerm, setDisplaySearchTerm] = useState("");
  
  // Category Marquee
  const [marqueeSpeed, setMarqueeSpeed] = useState(25);
  
  // Filter Dropdown
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Captcha Modal
  const [captchaProduct, setCaptchaProduct] = useState<Product | null>(null);
  const [equation, setEquation] = useState({ equation: "", answer: "" });
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  // Checkout button pos
  const [checkoutPos, setCheckoutPos] = useState({ x: 0, y: 0 });

  // Popups State
  const [popups, setPopups] = useState<Popup[]>([]);

  // --- Effects ---

  // UX VIOLATION: Visibility of System Status / Efficiency.
  // Mandating a massive, blocking 6-second fake loading animation prevents the user from achieving their goal quickly.
  useEffect(() => {
    let tick = 0;
    const loadInterval = setInterval(() => {
      tick += 1;
      // Stuttering load to increase anxiety
      setLoadPct(prev => Math.min(prev + (Math.random() * 20), 99));
      
      if (tick > 12) { // approx 6 seconds given 500ms intervals
        clearInterval(loadInterval);
        setIsGlobalLoading(false);
      }
    }, 500);
    return () => clearInterval(loadInterval);
  }, []);

  // UX VIOLATION: Consistency and Standards & User Control. 
  useEffect(() => {
    const handleScroll = () => {
      if (Math.random() < 0.10) {
        window.scrollBy({ top: -200, behavior: 'instant' });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: false });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // UX VIOLATION: User Control & Freedom (Autocorrect) 
  useEffect(() => {
    const timer = setTimeout(() => {
      const lower = displaySearchTerm.toLowerCase();
      let matched = false;
      for (const key in AUTOCORRECT_MAP) {
        if (lower.includes(key)) {
          setSearchTerm(AUTOCORRECT_MAP[key]);
          matched = true;
          break;
        }
      }
      if (!matched) setSearchTerm(displaySearchTerm);
    }, 800);
    return () => clearTimeout(timer);
  }, [displaySearchTerm]);

  // UX VIOLATION: User Control / Intrusive Interstitials
  // Firing random, distracting popups constantly.
  useEffect(() => {
    if (isGlobalLoading) return;
    const adInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        setPopups(prev => [
          ...prev, 
          {
            id: Date.now(),
            top: `${Math.random() * 70 + 10}vh`,
            left: `${Math.random() * 70 + 10}vw`,
            content: POPUP_MESSAGES[Math.floor(Math.random() * POPUP_MESSAGES.length)],
            btnPos: { x: 0, y: 0 }
          }
        ]);
      }
    }, 8000);
    return () => clearInterval(adInterval);
  }, [isGlobalLoading]);

  // --- Handlers ---
  const handleProductAdd = (product: Product) => {
    setEquation(generateEquation());
    setCaptchaProduct(product);
    setCaptchaInput("");
    setCaptchaError("");
  };

  const submitCaptcha = () => {
    if (captchaInput === equation.answer || Math.abs(parseFloat(captchaInput) - parseFloat(equation.answer)) < 0.05) {
      const qty = (Math.random() * 3 + 0.1).toFixed(3);
      setCart(prev => [...prev, { ...captchaProduct!, quantity: parseFloat(qty), cartId: Math.random() }]);
      setCaptchaProduct(null);
    } else {
      setCaptchaError("Incorrect. The driver is getting further away.");
      setEquation(generateEquation());
    }
  };

  const handleCheckoutHover = () => {
    // 100% chance to jump away
    setCheckoutPos({
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 1) * 300
    });
  };

  const closePopup = (id: number, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    // UX VIOLATION: User Control. 20% chance the "Close" button actually spawns another popup.
    if (Math.random() < 0.2) {
      setPopups(prev => [
        ...prev, 
        {
          id: Date.now() + 1,
          top: `${Math.random() * 70 + 10}vh`,
          left: `${Math.random() * 70 + 10}vw`,
          content: "HA! YOU MISSED!",
          btnPos: { x: 0, y: 0 }
        }
      ]);
      return; // Doesn't even close the original
    }
    setPopups(prev => prev.filter(p => p.id !== id));
  };

  const handlePopupBtnHover = (index: number) => {
    // UX VIOLATION: Fitts's Law. Moving targets.
    setPopups(prev => {
      const next = [...prev];
      next[index].btnPos = {
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 40
      };
      return next;
    });
  };

  if (isGlobalLoading) {
    return (
      <div className="fixed inset-0 bg-white z-[99999] flex flex-col items-center justify-center p-8 cursor-wait">
        <h1 className="text-4xl font-black mb-8 animate-pulse text-black uppercase tracking-widest text-center">Optimizing Delivery Routes...</h1>
        <div className="w-full max-w-2xl h-16 bg-neutral-200 border-4 border-black relative overflow-hidden shadow-inner">
          <div 
            className="h-full bg-blue-600 transition-all duration-[400ms] ease-out flex items-center justify-end px-4"
            style={{ width: `${loadPct}%` }}
          >
            <span className="text-white font-mono font-bold text-xl drop-shadow-md">{Math.floor(loadPct)}%</span>
          </div>
        </div>
        <p className="mt-8 text-neutral-400 font-serif italic text-sm">(Please do not close your eyes or look away from the screen)</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 font-sans pb-[400px]">
      
      {/* 
        UX VIOLATION: Aesthetic and Minimalist Design / Visibility. 
      */}
      <div className="fixed top-0 left-0 w-full h-[25vh] bg-red-600 text-white z-[999] flex flex-col justify-center items-center shadow-2xl border-b-[16px] border-yellow-400">
        <h1 className="text-4xl md:text-6xl font-black uppercase animate-pulse text-center tracking-tighter">0.01% Discount!</h1>
        <p className="text-xl md:text-3xl mt-4 font-bold tracking-widest text-center">ACT FAST! OFFER EXPIRES IN -4 SECONDS!</p>
        <p className="text-[10px] md:text-xs mt-2 opacity-60 text-center px-4 uppercase">(Terms and conditions apply. Discount only valid on leap years during a total solar eclipse. Must be left-handed.)</p>
      </div>

      <div className="pt-[30vh] max-w-7xl mx-auto px-4 relative">
        
        {/* Popups Render Area */}
        {popups.map((popup, i) => (
          <div key={popup.id} className="fixed z-[9999] bg-yellow-300 border-[8px] border-red-600 p-8 shadow-[16px_16px_0_0_rgba(0,0,0,1)] max-w-sm" style={{ top: popup.top, left: popup.left }}>
            <h3 className="font-black text-xl text-red-700 uppercase leading-none mb-4 animate-bounce">{popup.content}</h3>
            
            {/* UX VIOLATION: Discoverability / Fitts's Law. Tiny, low-contrast, shifting close button */}
            <motion.div 
              className="absolute top-1 right-1" 
              animate={{ x: popup.btnPos.x, y: popup.btnPos.y }}
              onHoverStart={() => handlePopupBtnHover(i)}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <button 
                onClick={(e) => closePopup(popup.id, i, e)}
                className="w-3 h-3 text-[6px] bg-yellow-300 text-yellow-400 border border-yellow-400 hover:text-red-600 hover:border-red-600 font-mono flex items-center justify-center leading-none z-50 cursor-pointer"
              >
                X
              </button>
            </motion.div>
          </div>
        ))}

        {/* Categories Marquee */}
        <div className="mb-14">
          <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Shop by Category (Good luck)</h2>
          <div 
            className="w-full h-24 bg-neutral-200 overflow-hidden relative cursor-crosshair border-2 border-dashed border-neutral-300 shadow-inner"
            onMouseEnter={() => setMarqueeSpeed(2)}
            onMouseLeave={() => setMarqueeSpeed(25)}
          >
            <motion.div 
              className="flex items-center h-full gap-16 absolute left-0"
              animate={{ x: [0, -2000] }}
              transition={{ repeat: Infinity, duration: marqueeSpeed, ease: "linear" }}
            >
              {[...Array(60)].map((_, i) => (
                <div key={i} className="w-12 h-12 rounded-lg border border-neutral-300 flex items-center justify-center shrink-0 opacity-20 hover:opacity-100 bg-neutral-100 transition-opacity">
                   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-neutral-500">
                     <path d={['M2 12h20M12 2v20', 'M5 5l14 14M5 19L19 5', 'M12 2a10 10 0 100 20 10 10 0 100-20z', 'M3 3h18v18H3z'][i % 4]} />
                   </svg>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="mb-10 relative z-40 inline-block group">
          <button 
            onMouseEnter={() => setFilterOpen(true)}
            className="bg-neutral-800 text-white px-8 py-4 font-black uppercase tracking-widest text-sm shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[0_0_0_0_rgba(0,0,0,1)] transition-all"
          >
            Filter By Irrelevance
          </button>
          {filterOpen && (
            <div 
              onMouseLeave={() => setFilterOpen(false)}
              className="absolute top-full left-0 mt-2 w-72 bg-white border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-4 flex flex-col gap-3"
            >
              {['Price: High to NaN', 'Alphabetical (Z to 7)', 'Edibility: Questionable', 'Size: Hypercube'].map(f => (
                <label key={f} className="flex items-center gap-3 text-sm hover:bg-neutral-200 p-2 cursor-pointer border border-transparent hover:border-black font-mono font-bold">
                  <input type="checkbox" className="w-4 h-4 cursor-pointer accent-black" /> {f}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-24">
          {PRODUCTS.map(p => (
            <ProductCard key={p.id} product={p} onAdd={handleProductAdd} />
          ))}
        </div>

        {/* Cart & Checkout */}
        <div className="mt-20 border-t-[12px] border-black pt-16">
          <h2 className="text-5xl font-black mb-8 uppercase tracking-tighter">Your Cart (Maybe?)</h2>
          <div className="bg-white p-8 border-4 border-black mb-12 min-h-40 shadow-[12px_12px_0_0_rgba(0,0,0,1)] relative">
            {cart.length === 0 ? (
              <p className="text-neutral-400 italic font-serif text-lg text-center mt-10">Your cart is empty. Or is it? Yes. It is.</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {cart.map(item => (
                  <li key={item.cartId} className="flex justify-between items-center border-b-2 border-dashed border-neutral-300 pb-3">
                    <div className="flex items-center gap-4">
                      {/* Using the massive 4000px image in a tiny thumbnail box */}
                      <img src={item.img} alt="Product" className="w-10 h-10 object-cover border border-black" />
                      <span className="font-mono text-xl">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-sm text-neutral-500 font-bold tracking-widest">QTY: {item.quantity}</span>
                      <span className="font-black text-2xl">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            
            {/* The Evasive Checkout Button is now inside the Cart box itself */}
            <div className="mt-16 h-40 relative w-full flex items-center justify-center border-4 border-dashed border-red-500 bg-red-50 overflow-visible">
              <h2 className="absolute top-2 text-red-300 font-black uppercase text-xl tracking-[1em] z-0">DANGER ZONE</h2>
              <motion.div 
                className="absolute z-50 inline-block"
                animate={{ x: checkoutPos.x, y: checkoutPos.y }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {/* UX VIOLATION: User Control. The checkout button actively evades the mouse. */}
                <div className="relative inline-block cursor-pointer">
                  <button 
                    onMouseEnter={handleCheckoutHover}
                    className="bg-red-600 hover:bg-red-800 text-white font-black uppercase tracking-widest text-3xl py-6 px-12 border-8 border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] hover:shadow-[0_0_0_0_rgba(0,0,0,1)] transition-colors focus:outline-none"
                  >
                    Proceed
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="bg-neutral-50 p-10 border-4 border-neutral-300 h-[600px] overflow-y-scroll relative shadow-inner mb-24">
            <h3 className="font-black mb-6 uppercase text-neutral-800 text-2xl tracking-widest border-b-4 border-neutral-200 pb-2">Terms and Conditions of Checkout</h3>
            
            <p className="text-justify text-xs text-neutral-500 mb-8 font-serif leading-loose">
              By proceeding, you agree that Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              {[...Array(50)].map(() => "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ")}
            </p>
            
            <p className="text-justify text-xs text-neutral-500 relative font-serif leading-loose">
              {[...Array(30)].map(() => "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ")}
            </p>
          </div>
        </div>
      </div>

      {/* Captcha Modal */}
      <AnimatePresence>
        {captchaProduct && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
          >
            <div className="bg-yellow-400 p-10 max-w-lg w-full shadow-[20px_20px_0_0_rgba(255,0,0,1)] border-8 border-black transform -rotate-2">
              <h2 className="text-3xl font-black mb-4 uppercase text-black">Human Verification</h2>
              <p className="font-bold text-lg mb-2 text-black">Solve this equation to prove you are not a sentient AI:</p>
              <p className="mb-8 font-mono bg-white p-6 border-4 border-black text-2xl text-center shadow-inner tracking-widest">
                {equation.equation}
              </p>
              <div className="flex flex-col gap-4">
                {/* UX VIOLATION: Efficiency & Error Prevention. Forcing users to click +0.1 and -0.1 dozens of times to reach the correct answer. */}
                <div className="flex bg-white border-4 border-black p-6 gap-8 justify-center items-center">
                  <button 
                    onClick={() => setCaptchaInput((prev) => (parseFloat(prev || "0") - 0.1).toFixed(2))}
                    className="w-20 h-20 bg-red-600 text-white font-black text-4xl border-4 border-black hover:bg-red-800 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[0_0_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 active:scale-95 transition-all focus:outline-none"
                  >
                    -
                  </button>
                  <span className="font-mono font-black text-6xl text-black min-w-[160px] text-center border-b-4 border-black pb-2">
                    {parseFloat(captchaInput || "0").toFixed(1)}
                  </span>
                  <button 
                    onClick={() => setCaptchaInput((prev) => (parseFloat(prev || "0") + 0.1).toFixed(2))}
                    className="w-20 h-20 bg-green-600 text-white font-black text-4xl border-4 border-black hover:bg-green-800 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[0_0_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 active:scale-95 transition-all focus:outline-none"
                  >
                    +
                  </button>
                </div>
                {captchaError && <span className="text-sm text-red-600 font-black bg-white p-2 border-2 border-red-600 block">{captchaError}</span>}
                <div className="flex gap-4 mt-6">
                  <button onClick={() => setCaptchaProduct(null)} className="flex-1 bg-white text-black border-4 border-black p-4 font-black uppercase hover:bg-neutral-200">Abandon Cart</button>
                  {/* UX VIOLATION: Discoverability. Using plain text for the vital Add verification button */}
                  <div className="flex-1 relative flex items-center justify-center cursor-pointer">
                     <button onClick={submitCaptcha} className="text-neutral-500 font-serif text-sm bg-transparent !border-none lowercase focus:outline-none">verify & add</button>
                     {/* Another infuriating click blocker */}
                     <div className="absolute inset-x-2 inset-y-0 z-10"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 w-full bg-black border-t-8 border-blue-500 p-8 z-[100] shadow-[0_-10px_50px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          <label className="text-blue-400 font-black uppercase tracking-widest text-sm">Global Search (Why is this here?)</label>
          <input 
            type="text" 
            value={displaySearchTerm}
            onChange={(e) => setDisplaySearchTerm(e.target.value)}
            placeholder="Search for something simple like 'bread'..."
            className="w-full bg-neutral-900 text-blue-300 font-mono text-2xl p-6 border-4 border-neutral-700 outline-none focus:border-blue-500 transition-colors"
          />
          {searchTerm !== displaySearchTerm && searchTerm !== "" && (
            <p className="text-sm text-red-500 mt-2 font-bold animate-pulse font-mono tracking-widest">
              &gt; SYSTEM OVERRIDE: Autocorrected "{displaySearchTerm}" to "{searchTerm}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onAdd }: { product: Product, onAdd: (p: Product) => void }) {
  const [eta, setEta] = useState(ETAS[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEta(ETAS[Math.floor(Math.random() * ETAS.length)]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white border-4 border-black p-8 hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)] hover:-translate-y-2 hover:-translate-x-2 transition-all flex flex-col gap-6 group">
      
      {/* 
        UX VIOLATION: Performance mismatch. 
        Raw 4k image scaled down via CSS object-cover in a 192px box. 
      */}
      <div className="w-full h-48 bg-neutral-100 border-2 border-dashed border-neutral-300 group-hover:scale-105 transition-transform overflow-hidden relative">
        <img src={product.img} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
      </div>

      <div>
        <h3 className="font-black text-2xl uppercase tracking-tighter leading-tight">{product.name}</h3>
        <p className="text-3xl font-serif text-green-700 mt-2 font-bold">${product.price.toFixed(2)}</p>
      </div>
      <div className="bg-yellow-200 border-4 border-yellow-400 text-yellow-900 p-3 text-sm font-black font-mono">
        STATUS: {eta}
      </div>
      
      {/* UX VIOLATION: Consistency. A button that actually looks like a button but still uses terrifying colors */}
      <div className="mt-auto relative inline-block text-center cursor-crosshair">
        <button 
          onClick={() => onAdd(product)}
          className="bg-red-600 hover:bg-red-800 text-white font-black uppercase tracking-widest text-sm py-4 w-full border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[0_0_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

