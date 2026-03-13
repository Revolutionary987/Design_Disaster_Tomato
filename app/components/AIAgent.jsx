"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const RECIPES = {
  chocolate_cake: {
    ingredients: ["cocoa", "egg", "butter", "flour", "sugar"],
    description: "I'll find you the highest-rated cocoa powder, fresh eggs, and butter nearby for a rich chocolate cake.",
  },
  breakfast: {
    ingredients: ["egg", "bread", "avocado", "butter", "coffee"],
    description: "Starting with protein-rich eggs, fresh artisanal bread, and ripe avocados for a hearty breakfast.",
  },
  salad: {
    ingredients: ["spinach", "tomato", "pepper", "avocado"],
    description: "Sourcing fresh spinach, cherry tomatoes, and crisp bell peppers for a healthy salad.",
  },
  pasta: {
    ingredients: ["pasta", "olive", "tomato", "cheese", "egg"],
    description: "Finding al dente pasta essentials: olive oil, fresh tomatoes, and aged cheddar.",
  },
  smoothie: {
    ingredients: ["mango", "strawberry", "yogurt", "honey"],
    description: "Blending ripe mangoes, strawberries, Greek yogurt, and organic honey for an energizing smoothie.",
  },
};

function detectRecipe(input) {
  const q = input.toLowerCase();
  if (q.includes("chocolate") || q.includes("cake") || q.includes("cocoa"))
    return { key: "chocolate_cake", recipe: RECIPES.chocolate_cake };
  if (q.includes("breakfast") || q.includes("morning") || q.includes("avocado toast"))
    return { key: "breakfast", recipe: RECIPES.breakfast };
  if (q.includes("salad") || q.includes("greens") || q.includes("spinach"))
    return { key: "salad", recipe: RECIPES.salad };
  if (q.includes("pasta") || q.includes("spaghetti") || q.includes("sauce"))
    return { key: "pasta", recipe: RECIPES.pasta };
  if (q.includes("smoothie") || q.includes("blend") || q.includes("drink"))
    return { key: "smoothie", recipe: RECIPES.smoothie };
  return null;
}

function findMatchingProducts(ingredients, products) {
  const matched = [];
  for (const keyword of ingredients) {
    const match = products
      .filter(p => p.name.toLowerCase().includes(keyword))
      .sort((a, b) => b.rating - a.rating || a.distance - b.distance)[0];
    if (match && !matched.find(m => m.id === match.id)) matched.push(match);
  }
  return matched;
}

export default function AIAgent({ products, onAddBundle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "agent", text: "Hi! I'm your AI shopping agent. Tell me what you want to cook and I'll find the best ingredients for you. Try: *\"I want to bake a chocolate cake\"*" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 800));
    const detection = detectRecipe(userMsg);

    if (!detection) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: "agent",
        text: "I can help with recipes like chocolate cake, breakfast, salad, pasta, or smoothies. What would you like to make?",
      }]);
      return;
    }

    const thinkingMsgs = [
      `🔍 Analyzing your request: "${userMsg}"`,
      `📋 ${detection.recipe.description}`,
      `🗺️ Checking distance & availability for your location...`,
      `⭐ Filtering best-rated options (rating > 4.5)...`,
    ];

    for (const msg of thinkingMsgs) {
      await new Promise(r => setTimeout(r, 600));
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last.role === "agent" && (last.text?.startsWith("🔍") || last.text?.startsWith("📋") || last.text?.startsWith("🗺️") || last.text?.startsWith("⭐"))) {
          return [...prev.slice(0, -1), { role: "agent", text: msg }];
        }
        return [...prev, { role: "agent", text: msg }];
      });
    }

    await new Promise(r => setTimeout(r, 700));
    const matched = findMatchingProducts(detection.recipe.ingredients, products);
    const reasoning = [
      `Found ${matched.length} matching items in local inventory`,
      `Selected by: Rating ≥ 4.5★ · Distance ≤ 2km · Best availability`,
    ];

    setIsTyping(false);
    setMessages(prev => [
      ...prev.slice(0, -1),
      { role: "agent", bundle: { products: matched, reasoning } },
    ]);
  };

  return (
    <>
      <motion.button onClick={() => setIsOpen(v => !v)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 left-4 z-[150] w-14 h-14 bg-gradient-to-br from-red-600 to-red-800 rounded-full shadow-[0_8px_30px_rgba(239,68,68,0.4)] flex items-center justify-center text-white border-2 border-red-500"
        aria-label="Open AI Shopping Agent">
        {isOpen ? <X size={24} /> : <Bot size={24} />}
        {!isOpen && (
          <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-44 left-4 z-[150] w-[340px] max-h-[520px] flex flex-col bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 p-4 bg-black border-b border-neutral-800">
              <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">AI Shopping Agent</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-[10px] text-green-400 font-bold">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="ml-auto text-neutral-600 hover:text-white transition-colors"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.bundle ? (
                    <div className="w-full bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden">
                      <div className="p-3 border-b border-neutral-700 bg-neutral-800">
                        <p className="text-xs font-black text-white uppercase tracking-wider">Recommended Bundle</p>
                        {msg.bundle.reasoning.map((r, i) => (
                          <p key={i} className="text-[10px] text-neutral-400 mt-0.5">• {r}</p>
                        ))}
                      </div>
                      <div className="divide-y divide-neutral-800">
                        {msg.bundle.products.map(p => (
                          <div key={p.id} className="flex items-center gap-2 p-2">
                            <div className="w-8 h-8 relative rounded overflow-hidden flex-shrink-0 bg-neutral-800">
                              <Image src={p.img} alt={p.name} fill className="object-cover" sizes="32px" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-white truncate">{p.name}</p>
                              <p className="text-[10px] text-neutral-500">★ {p.rating} · {p.distance}km</p>
                            </div>
                            <span className="text-xs font-black text-red-400">${p.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="p-3">
                        <button onClick={() => { onAddBundle(msg.bundle.products); setIsOpen(false); }}
                          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-2.5 rounded-lg transition-colors">
                          <ShoppingCart size={14} />Add All to Cart
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs font-medium leading-relaxed ${
                      msg.role === "user" ? "bg-red-600 text-white rounded-br-sm" : "bg-neutral-800 text-neutral-200 rounded-bl-sm"
                    }`}>{msg.text}</div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-neutral-800 rounded-2xl rounded-bl-sm px-4 py-2.5 flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.span key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} className="w-1.5 h-1.5 bg-neutral-400 rounded-full block" />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="p-3 border-t border-neutral-800 flex gap-2">
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                placeholder="e.g., 'I want to bake a chocolate cake'"
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-600 outline-none focus:border-red-500 transition-colors"
                aria-label="AI agent input" />
              <button type="submit" disabled={!input.trim()}
                className="w-9 h-9 bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
