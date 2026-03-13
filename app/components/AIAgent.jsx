"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, ShoppingCart, Search, Heart, DollarSign, Leaf, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ============================================================================
// INTELLIGENT NLP ENGINE — handles recipes, general queries, dietary, budget
// ============================================================================

const RECIPE_DB = {
  chocolate_cake:   { keywords: ["chocolate","cake","cocoa","brownie","baking"], ingredients: ["cocoa","egg","butter","flour","sugar","milk"], description: "Rich chocolate cake — sourcing premium cocoa, farm-fresh eggs, and European butter." },
  breakfast:        { keywords: ["breakfast","morning","brunch","avocado toast"], ingredients: ["egg","bread","avocado","butter","coffee","juice"], description: "Hearty breakfast spread — eggs, artisanal bread, ripe avocados, and fresh-roast coffee." },
  salad:            { keywords: ["salad","greens","healthy","diet","light meal"], ingredients: ["spinach","tomato","pepper","avocado","olive","lemon"], description: "Crisp, nutrient-packed salad — baby spinach, vine tomatoes, and cold-pressed olive oil." },
  pasta:            { keywords: ["pasta","spaghetti","italian","noodle","sauce","carbonara","penne"], ingredients: ["pasta","olive","tomato","cheese","garlic","basil"], description: "Classic Italian pasta — al dente noodles, San Marzano tomatoes, aged Parmesan." },
  smoothie:         { keywords: ["smoothie","blend","shake","drink","juice"], ingredients: ["mango","strawberry","yogurt","honey","banana"], description: "Energizing fruit smoothie — tropical mangoes, Greek yogurt, and raw honey." },
  sandwich:         { keywords: ["sandwich","sub","wrap","lunch","blt"], ingredients: ["bread","chicken","tomato","lettuce","cheese","mayo"], description: "Gourmet sandwich — fresh-baked bread, grilled chicken, and crisp veggies." },
  stir_fry:         { keywords: ["stir fry","stir-fry","wok","asian","chinese","thai"], ingredients: ["chicken","pepper","broccoli","soy","ginger","rice","garlic"], description: "Quick Asian stir-fry — tender chicken, rainbow veggies, and aromatic ginger-garlic." },
  pizza:            { keywords: ["pizza","margherita","pepperoni","dough"], ingredients: ["flour","tomato","cheese","olive","basil","yeast"], description: "Homemade pizza — stone-milled flour, fresh mozzarella, and Italian basil." },
  curry:            { keywords: ["curry","indian","tikka","masala","dal","biryani"], ingredients: ["chicken","onion","tomato","ginger","garlic","rice","yogurt","spice"], description: "Aromatic Indian curry — tender chicken, whole spices, and basmati rice." },
  tacos:            { keywords: ["taco","mexican","burrito","quesadilla","fajita"], ingredients: ["beef","tortilla","tomato","onion","pepper","cheese","lime","cilantro"], description: "Street-style tacos — seasoned ground beef, fresh salsa, and warm tortillas." },
  soup:             { keywords: ["soup","broth","stew","chowder","bisque"], ingredients: ["chicken","onion","carrot","celery","garlic","potato"], description: "Comforting homemade soup — slow-simmered chicken broth with root vegetables." },
  bbq:              { keywords: ["bbq","barbecue","grill","grilling","steak"], ingredients: ["beef","chicken","corn","potato","onion","pepper","olive"], description: "Backyard BBQ feast — premium cuts, sweet corn, and grilled vegetables." },
  baking:           { keywords: ["bake","cookie","muffin","bread","pastry","scone"], ingredients: ["flour","sugar","butter","egg","milk","vanilla","baking"], description: "Baking essentials — unbleached flour, cane sugar, and pure vanilla extract." },
  sushi:            { keywords: ["sushi","japanese","roll","sashimi","poke"], ingredients: ["salmon","rice","avocado","soy","nori","ginger"], description: "Fresh sushi platter — sashimi-grade salmon, sushi rice, and ripe avocado." },
  dessert:          { keywords: ["dessert","sweet","treat","ice cream","pudding"], ingredients: ["chocolate","cream","sugar","vanilla","strawberry","egg"], description: "Decadent desserts — Belgian chocolate, heavy cream, and Madagascar vanilla." },
};

// Intent categories
const INTENTS = {
  RECIPE:    "recipe",
  SEARCH:    "search",
  BUDGET:    "budget",
  DIETARY:   "dietary",
  RECOMMEND: "recommend",
  GREETING:  "greeting",
  HELP:      "help",
  COMPARE:   "compare",
  UNKNOWN:   "unknown",
};

function classifyIntent(input) {
  const q = input.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|yo|sup|good\s*(morning|evening|afternoon)|what'?s up)/.test(q))
    return { intent: INTENTS.GREETING };

  // Help
  if (/^(help|what can you|how do|what do you|menu|options|features)/.test(q))
    return { intent: INTENTS.HELP };

  // Budget queries
  const budgetMatch = q.match(/(?:under|below|less than|within|max|budget)\s*\$?\s*(\d+)/);
  if (budgetMatch) return { intent: INTENTS.BUDGET, maxPrice: parseFloat(budgetMatch[1]) };
  if (/cheap|affordable|budget|inexpensive|value|deal/.test(q))
    return { intent: INTENTS.BUDGET, maxPrice: 5 };

  // Dietary queries
  if (/organic|natural|bio|pesticide.free/.test(q))
    return { intent: INTENTS.DIETARY, filter: "organic" };
  if (/vegan|plant.based|no\s*meat|no\s*dairy|dairy.free/.test(q))
    return { intent: INTENTS.DIETARY, filter: "vegan" };
  if (/high.rated|best|top.rated|popular|trending|highest/.test(q))
    return { intent: INTENTS.DIETARY, filter: "top_rated" };
  if (/gluten.free|celiac/.test(q))
    return { intent: INTENTS.DIETARY, filter: "gluten_free" };
  if (/protein|high.protein|muscle|gym|fitness/.test(q))
    return { intent: INTENTS.DIETARY, filter: "protein" };

  // Compare
  if (/compare|vs|versus|difference|better/.test(q))
    return { intent: INTENTS.COMPARE, query: q };

  // Recipe detection
  for (const [key, recipe] of Object.entries(RECIPE_DB)) {
    if (recipe.keywords.some(kw => q.includes(kw))) {
      return { intent: INTENTS.RECIPE, recipeKey: key, recipe };
    }
  }

  // Cooking/recipe intent patterns
  if (/(?:make|cook|bake|prepare|recipe|ingredients?\s*for|how to make|i want to|i need to|help me make|whip up|fix me)/.test(q))
    return { intent: INTENTS.RECIPE, recipeKey: null, query: q };

  // Recommend
  if (/recommend|suggest|what should|pick for me|surprise|random/.test(q))
    return { intent: INTENTS.RECOMMEND };

  // General product search (fallback for meaningful queries)
  if (q.length > 2)
    return { intent: INTENTS.SEARCH, query: q };

  return { intent: INTENTS.UNKNOWN };
}

function findMatchingProducts(keywords, products) {
  const matched = [];
  for (const keyword of keywords) {
    const kw = keyword.toLowerCase();
    const matches = products
      .filter(p => p.name.toLowerCase().includes(kw) || (p.category && p.category.toLowerCase().includes(kw)))
      .sort((a, b) => b.rating - a.rating || a.distance - b.distance);
    if (matches.length > 0 && !matched.find(m => m.id === matches[0].id)) {
      matched.push(matches[0]);
    }
  }
  return matched;
}

function searchProducts(query, products) {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter(w => w.length > 2);
  return products
    .filter(p => {
      const name = p.name.toLowerCase();
      const cat = (p.category || "").toLowerCase();
      return words.some(w => name.includes(w) || cat.includes(w));
    })
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);
}

// ============================================================================
// AI AGENT COMPONENT
// ============================================================================
export default function AIAgent({ products, onAddBundle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "agent", text: "Hey! I'm your AI shopping assistant. I can help with:\n\n• **Recipes** — \"I want to make pasta\"\n• **Product search** — \"do you have avocados?\"\n• **Budget shopping** — \"what's under $5?\"\n• **Dietary needs** — \"show me organic items\"\n• **Recommendations** — \"suggest something for dinner\"\n\nWhat can I help you find today?" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addAgentMsg = (content) => setMessages(prev => [...prev, { role: "agent", ...content }]);
  const updateLastAgent = (content) => setMessages(prev => {
    const last = prev[prev.length - 1];
    if (last && last.role === "agent") return [...prev.slice(0, -1), { role: "agent", ...content }];
    return [...prev, { role: "agent", ...content }];
  });

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 600));
    const classified = classifyIntent(userMsg);

    switch (classified.intent) {
      case INTENTS.GREETING: {
        setIsTyping(false);
        addAgentMsg({ text: "Hey there! 👋 Ready to help you shop smarter. Tell me what you're looking for — a recipe, specific products, dietary preferences, or a budget. I've got you covered!" });
        break;
      }

      case INTENTS.HELP: {
        setIsTyping(false);
        addAgentMsg({ text: "Here's what I can do:\n\n🍳 **Recipe mode** — Tell me a dish and I'll find all ingredients\n🔍 **Search** — Ask for any product by name\n💰 **Budget** — \"What's under $10?\"\n🌿 **Dietary** — Organic, vegan, high-protein, gluten-free\n⭐ **Top picks** — \"Show me your best items\"\n🎲 **Surprise me** — Random recommendations\n\nJust type naturally — I understand most food queries!" });
        break;
      }

      case INTENTS.RECIPE: {
        const recipe = classified.recipe;
        if (recipe) {
          addAgentMsg({ text: `🔍 Analyzing: "${userMsg}"...` });
          await new Promise(r => setTimeout(r, 500));
          updateLastAgent({ text: `📋 ${recipe.description}` });
          await new Promise(r => setTimeout(r, 600));
          updateLastAgent({ text: "⭐ Filtering by: Rating ≥ 4.5★ · Distance ≤ 2km · Best availability..." });
          await new Promise(r => setTimeout(r, 500));

          const matched = findMatchingProducts(recipe.ingredients, products);
          if (matched.length > 0) {
            setIsTyping(false);
            addAgentMsg({
              bundle: {
                title: `${classified.recipeKey.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())} Bundle`,
                products: matched,
                reasoning: [
                  `Found ${matched.length} matching items from local inventory`,
                  "Selected by: Rating ≥ 4.5★ · Distance ≤ 2km",
                  `Total: $${matched.reduce((s, p) => s + p.price, 0).toFixed(2)}`,
                ],
              },
            });
          } else {
            setIsTyping(false);
            addAgentMsg({ text: "I found the recipe but couldn't match enough products in our current inventory. Try a different dish!" });
          }
        } else {
          // Generic cooking intent — try keyword extraction
          const words = userMsg.toLowerCase().split(/\s+/).filter(w => w.length > 3 && !["want","make","cook","help","need","some","with","from","that","this","have","just","like","good", "bake","prepare"].includes(w));
          const matched = searchProducts(words.join(" "), products);
          if (matched.length > 0) {
            setIsTyping(false);
            addAgentMsg({
              bundle: {
                title: "Suggested Ingredients",
                products: matched,
                reasoning: [`Found ${matched.length} items matching your request`, "Based on keyword analysis of your query"],
              },
            });
          } else {
            setIsTyping(false);
            addAgentMsg({ text: `I understand you want to cook something! Try being more specific, like:\n• "I want to make **pasta**"\n• "Ingredients for **tacos**"\n• "Help me bake **cookies**"\n\nI know 15+ recipes including pasta, curry, sushi, pizza, BBQ, stir-fry, and more!` });
          }
        }
        break;
      }

      case INTENTS.SEARCH: {
        const results = searchProducts(classified.query, products);
        await new Promise(r => setTimeout(r, 400));
        setIsTyping(false);
        if (results.length > 0) {
          addAgentMsg({
            bundle: {
              title: `Search Results`,
              products: results,
              reasoning: [`Found ${results.length} item${results.length > 1 ? "s" : ""} matching "${userMsg}"`, "Sorted by rating"],
            },
          });
        } else {
          addAgentMsg({ text: `Sorry, I couldn't find anything matching "${userMsg}" in our inventory. Try a different term or ask me for recommendations!` });
        }
        break;
      }

      case INTENTS.BUDGET: {
        const maxPrice = classified.maxPrice || 5;
        await new Promise(r => setTimeout(r, 400));
        const budgetItems = products.filter(p => p.price <= maxPrice).sort((a, b) => b.rating - a.rating).slice(0, 8);
        setIsTyping(false);
        if (budgetItems.length > 0) {
          addAgentMsg({
            bundle: {
              title: `Under $${maxPrice}`,
              products: budgetItems,
              reasoning: [`${budgetItems.length} items at $${maxPrice} or less`, "Sorted by rating — best value picks"],
            },
          });
        } else {
          addAgentMsg({ text: `No items found under $${maxPrice}. Try a higher budget or check our Flash Deals for the best savings!` });
        }
        break;
      }

      case INTENTS.DIETARY: {
        await new Promise(r => setTimeout(r, 400));
        let filtered = [];
        let filterLabel = "";

        switch (classified.filter) {
          case "organic":
            filtered = products.filter(p => p.isOrganic).sort((a, b) => b.rating - a.rating);
            filterLabel = "Organic";
            break;
          case "vegan":
            filtered = products.filter(p => ["fruits", "veggies", "pantry", "beverages", "snacks", "bakery"].includes(p.category)).sort((a, b) => b.rating - a.rating).slice(0, 8);
            filterLabel = "Plant-Based";
            break;
          case "top_rated":
            filtered = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);
            filterLabel = "Top Rated";
            break;
          case "gluten_free":
            filtered = products.filter(p => ["fruits", "veggies", "dairy", "meat", "beverages"].includes(p.category)).sort((a, b) => b.rating - a.rating).slice(0, 8);
            filterLabel = "Gluten-Free";
            break;
          case "protein":
            filtered = products.filter(p => ["meat", "dairy"].includes(p.category)).sort((a, b) => b.rating - a.rating).slice(0, 8);
            filterLabel = "High Protein";
            break;
          default:
            filtered = [...products].sort((a, b) => b.rating - a.rating).slice(0, 6);
            filterLabel = "Recommended";
        }

        setIsTyping(false);
        if (filtered.length > 0) {
          addAgentMsg({
            bundle: {
              title: `${filterLabel} Picks`,
              products: filtered.slice(0, 8),
              reasoning: [`${filtered.length} ${filterLabel.toLowerCase()} items available`, "Sorted by customer rating"],
            },
          });
        } else {
          addAgentMsg({ text: `No ${filterLabel.toLowerCase()} items found right now. Check back soon!` });
        }
        break;
      }

      case INTENTS.RECOMMEND: {
        await new Promise(r => setTimeout(r, 500));
        const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, 6);
        setIsTyping(false);
        addAgentMsg({
          bundle: {
            title: "Curated For You",
            products: shuffled,
            reasoning: ["Hand-picked selection from our catalog", "Mix of categories for variety"],
          },
        });
        break;
      }

      case INTENTS.COMPARE: {
        const words = classified.query.split(/\s+/).filter(w => w.length > 2 && !["compare","vs","versus","and","the","between","what","difference"].includes(w));
        const results = [];
        for (const w of words) {
          const found = products.find(p => p.name.toLowerCase().includes(w));
          if (found && !results.find(r => r.id === found.id)) results.push(found);
        }
        await new Promise(r => setTimeout(r, 400));
        setIsTyping(false);
        if (results.length >= 2) {
          const comparison = results.slice(0, 2).map(p => `**${p.name}** — $${p.price.toFixed(2)} · ★${p.rating} · ${p.distance}km away`).join("\n");
          addAgentMsg({ text: `Here's a quick comparison:\n\n${comparison}\n\n${results[0].rating > results[1].rating ? results[0].name : results[1].name} has a higher rating. ${results[0].price < results[1].price ? results[0].name : results[1].name} is the better deal.` });
        } else if (results.length === 1) {
          addAgentMsg({ text: `I found **${results[0].name}** ($${results[0].price.toFixed(2)}, ★${results[0].rating}). What would you like to compare it with?` });
        } else {
          addAgentMsg({ text: "I couldn't identify the products to compare. Try something like: \"compare salmon vs chicken\"" });
        }
        break;
      }

      default: {
        setIsTyping(false);
        addAgentMsg({ text: "I'm not sure what you mean. Try:\n• A recipe — \"make me pasta\"\n• A product — \"do you have eggs?\"\n• A budget — \"what's under $8?\"\n• Dietary — \"show organic products\"\n\nI'm here to help! 🛒" });
      }
    }
  };

  return (
    <>
      <motion.button onClick={() => setIsOpen(v => !v)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 left-4 z-[150] w-14 h-14 bg-gradient-to-br from-red-600 to-red-800 rounded-full shadow-[0_8px_30px_rgba(239,68,68,0.4)] flex items-center justify-center text-white border-2 border-red-500"
        aria-label="Open AI Shopping Agent">
        {isOpen ? <X size={24} /> : <Bot size={24} />}
        {!isOpen && <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-44 left-4 z-[150] w-[360px] max-h-[560px] flex flex-col bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 bg-black border-b border-neutral-800">
              <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">AI Shopping Agent</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-[10px] text-green-400 font-bold">Online · Knows 15+ recipes</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="ml-auto text-neutral-600 hover:text-white transition-colors"><X size={18} /></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.bundle ? (
                    <div className="w-full bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden">
                      <div className="p-3 border-b border-neutral-700 bg-neutral-800">
                        <p className="text-xs font-black text-white uppercase tracking-wider">{msg.bundle.title}</p>
                        {msg.bundle.reasoning.map((r, i) => <p key={i} className="text-[10px] text-neutral-400 mt-0.5">• {r}</p>)}
                      </div>
                      <div className="divide-y divide-neutral-800 max-h-[200px] overflow-y-auto">
                        {msg.bundle.products.map(p => (
                          <div key={p.id} className="flex items-center gap-2 p-2">
                            <div className="w-8 h-8 relative rounded overflow-hidden flex-shrink-0 bg-neutral-800">
                              <Image src={p.img} alt={p.name} fill className="object-cover" sizes="32px" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-white truncate">{p.name}</p>
                              <p className="text-[10px] text-neutral-500">★ {p.rating} · {p.distance}km · {p.unit}</p>
                            </div>
                            <span className="text-xs font-black text-red-400">${p.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="p-3">
                        <button onClick={() => { onAddBundle(msg.bundle.products); setIsOpen(false); }}
                          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-2.5 rounded-lg transition-colors">
                          <ShoppingCart size={14} />Add All to Cart (${msg.bundle.products.reduce((s, p) => s + p.price, 0).toFixed(2)})
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs font-medium leading-relaxed whitespace-pre-line ${
                      msg.role === "user" ? "bg-red-600 text-white rounded-br-sm" : "bg-neutral-800 text-neutral-200 rounded-bl-sm"
                    }`}>{msg.text}</div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-neutral-800 rounded-2xl rounded-bl-sm px-4 py-2.5 flex gap-1">
                    {[0, 1, 2].map(i => <motion.span key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} className="w-1.5 h-1.5 bg-neutral-400 rounded-full block" />)}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick actions */}
            <div className="px-3 py-2 border-t border-neutral-800 flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {["🍕 Pizza", "🥗 Salad", "💰 Under $5", "🌿 Organic", "⭐ Top rated", "🎲 Surprise me"].map(label => (
                <button key={label} onClick={() => { setInput(label.slice(2).trim()); }}
                  className="text-[10px] font-bold text-neutral-400 bg-neutral-900 border border-neutral-700 hover:border-red-500 hover:text-white px-2.5 py-1.5 rounded-full whitespace-nowrap transition-colors">
                  {label}
                </button>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="p-3 border-t border-neutral-800 flex gap-2">
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything about groceries..."
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
