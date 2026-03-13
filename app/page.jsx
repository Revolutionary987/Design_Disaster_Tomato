"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid, Apple, Leaf, Milk, Cookie, Coffee,
  Fish, Archive, Sandwich, Search, MapPin, Zap,
  ShoppingCart, ChevronDown, Sun, Moon, LogIn, LogOut,
  Tag, Clock, Star, X, ChevronRight, Flame
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';

const AIAgent = dynamic(() => import('./components/AIAgent'), { ssr: false });
const DeliveryTracker = dynamic(() => import('./components/DeliveryTracker'), { ssr: false });

// ============================================================================
// CATEGORIES — Lucide icons only
// ============================================================================
const CATEGORIES = [
  { id: "all",       label: "All",          Icon: LayoutGrid },
  { id: "fruits",    label: "Fruits",       Icon: Apple      },
  { id: "veggies",   label: "Vegetables",   Icon: Leaf       },
  { id: "dairy",     label: "Dairy & Eggs", Icon: Milk       },
  { id: "bakery",    label: "Bakery",       Icon: Cookie     },
  { id: "beverages", label: "Beverages",    Icon: Coffee     },
  { id: "snacks",    label: "Snacks",       Icon: Sandwich   },
  { id: "meat",      label: "Meat & Fish",  Icon: Fish       },
  { id: "pantry",    label: "Pantry",       Icon: Archive    },
];

// ============================================================================
// PRODUCTS
// ============================================================================
const PRODUCTS = [
  // FRUITS
  { id: 1,  name: "Organic Gala Apples",     price: 4.20,  img:'https://images.unsplash.com/photo-1574226516833-e6351f97c0c5?w=400&h=400&fit=crop&q=80', rating:4.7, distance:1.5, isOrganic:true, category:"fruits",    unit:"1 kg" },
  { id: 2,  name: "Haas Avocado",            price: 2.50,  img:'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop&q=80', rating:4.6, distance:0.5, category:"fruits",    unit:"2 pcs" },
  { id: 3,  name: "Alphonso Mangoes",        price: 7.99,  img:'https://images.unsplash.com/photo-1553279640-f709c2d91c12?w=400&h=400&fit=crop&q=80', rating:4.8, distance:1.0, category:"fruits",    unit:"6 pack" },
  { id: 4,  name: "Fresh Strawberries",      price: 5.50,  img:'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop&q=80', rating:4.9, distance:0.6, category:"fruits",    unit:"250 g" },
  { id: 5,  name: "Seedless Red Grapes",     price: 3.99,  img:'https://images.unsplash.com/photo-1537640538966-cced7f3c6c2c?w=400&h=400&fit=crop&q=80', rating:4.5, distance:1.3, category:"fruits",    unit:"500 g" },
  { id: 6,  name: "Navel Oranges",           price: 4.49,  img:'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop&q=80', rating:4.6, distance:0.8, category:"fruits",    unit:"4 pcs" },
  { id: 7,  name: "Ripe Bananas",            price: 1.99,  img:'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=400&h=400&fit=crop&q=80', rating:4.5, distance:0.4, category:"fruits",    unit:"6 pcs" },
  { id: 8,  name: "Organic Blueberries",     price: 6.99,  img:'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=400&fit=crop&q=80', rating:4.8, distance:1.0, isOrganic:true, category:"fruits",    unit:"200 g" },
  { id: 9,  name: "Watermelon",              price: 5.99,  img:'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=400&h=400&fit=crop&q=80', rating:4.7, distance:1.2, category:"fruits",    unit:"1 pc (2 kg)" },
  { id: 10, name: "Golden Kiwis",            price: 4.80,  img:'https://images.unsplash.com/photo-1618897996318-5a901fa0cf8b?w=400&h=400&fit=crop&q=80', rating:4.6, distance:0.9, category:"fruits",    unit:"4 pcs" },
  // VEGETABLES
  { id: 11, name: "Cherry Tomatoes",         price: 2.99,  img:'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=400&fit=crop&q=80', rating:4.6, distance:0.8, category:"veggies",   unit:"200 g" },
  { id: 12, name: "Organic Baby Spinach",    price: 3.50,  img:'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop&q=80', rating:4.8, distance:0.5, isOrganic:true, category:"veggies",   unit:"150 g" },
  { id: 13, name: "Broccoli Crown",          price: 2.20,  img:'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=400&fit=crop&q=80', rating:4.5, distance:1.2, category:"veggies",   unit:"1 pc" },
  { id: 14, name: "Mixed Bell Peppers",      price: 3.80,  img:'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop&q=80', rating:4.7, distance:0.9, category:"veggies",   unit:"3 pcs" },
  { id: 15, name: "Baby Carrots",            price: 1.99,  img:'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop&q=80', rating:4.5, distance:0.7, category:"veggies",   unit:"300 g" },
  { id: 16, name: "Purple Garlic Cloves",    price: 2.49,  img:'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=400&h=400&fit=crop&q=80', rating:4.7, distance:0.5, category:"veggies",   unit:"4 bulbs" },
  { id: 17, name: "Fresh Ginger Root",       price: 1.80,  img:'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=400&fit=crop&q=80', rating:4.6, distance:0.6, isOrganic:true, category:"veggies",   unit:"200 g" },
  { id: 18, name: "Red Onions",              price: 1.50,  img:'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&h=400&fit=crop&q=80', rating:4.4, distance:0.4, category:"veggies",   unit:"3 pcs" },
  { id: 19, name: "Zucchini",               price: 2.60,  img:'https://images.unsplash.com/photo-1596460107916-430662021049?w=400&h=400&fit=crop&q=80', rating:4.5, distance:1.1, category:"veggies",   unit:"2 pcs" },
  // DAIRY & EGGS
  { id: 20, name: "Aged Cheddar Cheese",     price: 9.50,  img:'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400&h=400&fit=crop&q=80', rating:4.5, distance:1.8, category:"dairy",     unit:"200 g" },
  { id: 21, name: "Free-range Large Eggs",   price: 5.99,  img:'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&q=80', rating:4.8, distance:0.9, category:"dairy",     unit:"12 pcs" },
  { id: 22, name: "Organic Brown Eggs",      price: 7.50,  img:'https://images.unsplash.com/photo-1491524062933-cb0289261700?w=400&h=400&fit=crop&q=80', rating:4.9, distance:0.4, isOrganic:true, category:"dairy",     unit:"6 pcs" },
  { id: 23, name: "Greek Yogurt",            price: 4.20,  img:'https://images.unsplash.com/photo-1571212515-4b1fc88a26fe?w=400&h=400&fit=crop&q=80', rating:4.7, distance:1.1, category:"dairy",     unit:"400 g" },
  { id: 24, name: "Unsalted Butter",         price: 3.99,  img:'https://images.unsplash.com/photo-1589985270826-7f4edd5c8899?w=400&h=400&fit=crop&q=80', rating:4.6, distance:0.7, category:"dairy",     unit:"250 g" },
  { id: 25, name: "Fresh Whole Milk",        price: 2.80,  img:'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop&q=80', rating:4.5, distance:0.5, category:"dairy",     unit:"1 L" },
  { id: 26, name: "Cream Cheese",            price: 4.50,  img:'https://images.unsplash.com/photo-1612158957428-7eb8f8a7bbc7?w=400&h=400&fit=crop&q=80', rating:4.7, distance:0.8, category:"dairy",     unit:"200 g" },
  // BAKERY
  { id: 27, name: "Artisanal Sourdough",     price: 6.50,  img:'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=400&fit=crop&q=80', rating:4.9, distance:1.2, category:"bakery",    unit:"1 loaf" },
  { id: 28, name: "Whole Grain Baguette",    price: 3.99,  img:'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&q=80', rating:4.7, distance:0.8, category:"bakery",    unit:"1 pc" },
  { id: 29, name: "Butter Croissants",       price: 7.00,  img:'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop&q=80', rating:4.9, distance:0.6, category:"bakery",    unit:"4 pcs" },
  { id: 30, name: "Sesame Bagels",           price: 5.20,  img:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&q=80', rating:4.8, distance:1.0, category:"bakery",    unit:"4 pcs" },
  { id: 31, name: "Cinnamon Rolls",          price: 8.50,  img:'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=400&h=400&fit=crop&q=80', rating:4.9, distance:0.7, category:"bakery",    unit:"6 pcs" },
  { id: 32, name: "Multigrain Tortillas",    price: 3.10,  img:'https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?w=400&h=400&fit=crop&q=80', rating:4.5, distance:0.9, category:"bakery",    unit:"8 pcs" },
  // BEVERAGES
  { id: 33, name: "Premium Spring Water",    price: 2.99,  img:'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop&q=80', rating:4.8, distance:0.8, category:"beverages", unit:"1 L" },
  { id: 34, name: "Dark Roast Coffee",       price: 18.00, img:'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=400&h=400&fit=crop&q=80', rating:4.9, distance:2.0, category:"beverages", unit:"500 g" },
  { id: 35, name: "Cold Brew Concentrate",   price: 14.50, img:'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop&q=80', rating:4.8, distance:1.3, category:"beverages", unit:"500 ml" },
  { id: 36, name: "Matcha Powder",           price: 16.00, img:'https://images.unsplash.com/photo-1544787099-ab5e9a6b6702?w=400&h=400&fit=crop&q=80', rating:4.7, distance:1.0, isOrganic:true, category:"beverages", unit:"100 g" },
  { id: 37, name: "Fresh Orange Juice",      price: 6.99,  img:'https://images.unsplash.com/photo-1534353436398-f89a1dede4f6?w=400&h=400&fit=crop&q=80', rating:4.6, distance:0.4, category:"beverages", unit:"1 L" },
  { id: 38, name: "Kombucha Ginger",         price: 5.50,  img:'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400&h=400&fit=crop&q=80', rating:4.6, distance:1.2, category:"beverages", unit:"350 ml" },
  { id: 39, name: "Coconut Water",           price: 4.20,  img:'https://images.unsplash.com/photo-1550586079-c0c30da8ef66?w=400&h=400&fit=crop&q=80', rating:4.5, distance:0.7, category:"beverages", unit:"500 ml" },
  // SNACKS
  { id: 40, name: "Roasted Mixed Nuts",      price: 8.50,  img:'https://images.unsplash.com/photo-1573042879-49a7b41697b2?w=400&h=400&fit=crop&q=80', rating:4.7, distance:1.1, category:"snacks",    unit:"200 g" },
  { id: 41, name: "Dark Chocolate 80%",      price: 5.99,  img:'https://images.unsplash.com/photo-1481391319972-72b9d2035154?w=400&h=400&fit=crop&q=80', rating:4.8, distance:0.9, category:"snacks",    unit:"100 g", isFlashDeal:true, originalPrice:8.99 },
  { id: 42, name: "Kettle-cooked Chips",     price: 4.50,  img:'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop&q=80', rating:4.5, distance:0.6, category:"snacks",    unit:"150 g" },
  { id: 43, name: "Protein Granola Bar",     price: 3.20,  img:'https://images.unsplash.com/photo-1622484212850-eb9c535d854d?w=400&h=400&fit=crop&q=80', rating:4.6, distance:0.8, category:"snacks",    unit:"60 g pack" },
  { id: 44, name: "Organic Trail Mix",       price: 7.80,  img:'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=400&h=400&fit=crop&q=80', rating:4.7, distance:1.0, isOrganic:true, category:"snacks",    unit:"200 g" },
  { id: 45, name: "Hummus & Pita",           price: 5.99,  img:'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&h=400&fit=crop&q=80', rating:4.8, distance:0.7, category:"snacks",    unit:"1 pack" },
  // MEAT & FISH
  { id: 46, name: "Grass-fed Ground Beef",   price: 12.99, img:'https://images.unsplash.com/photo-1603048297703-06f81b4e67c8?w=400&h=400&fit=crop&q=80', rating:4.7, distance:1.5, category:"meat",      unit:"500 g" },
  { id: 47, name: "Chicken Breast",          price: 8.50,  img:'https://images.unsplash.com/photo-1604503468958-0c12c3ac41eb?w=400&h=400&fit=crop&q=80', rating:4.8, distance:0.8, category:"meat",      unit:"500 g", isFlashDeal:true, originalPrice:11.99 },
  { id: 48, name: "Atlantic Salmon Fillet",  price: 14.00, img:'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=400&fit=crop&q=80', rating:4.9, distance:1.2, category:"meat",      unit:"300 g" },
  { id: 49, name: "Tiger Prawns",            price: 11.50, img:'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=400&fit=crop&q=80', rating:4.6, distance:1.0, category:"meat",      unit:"400 g" },
  { id: 50, name: "Lamb Shoulder Chops",     price: 16.50, img:'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=400&fit=crop&q=80', rating:4.7, distance:1.4, category:"meat",      unit:"400 g" },
  { id: 51, name: "Tuna Steak",              price: 13.00, img:'https://images.unsplash.com/photo-1465990138262-b9c6e7bfc014?w=400&h=400&fit=crop&q=80', rating:4.8, distance:1.1, category:"meat",      unit:"200 g", isFlashDeal:true, originalPrice:18.00 },
  // PANTRY
  { id: 52, name: "Dutch Cocoa Powder",      price: 12.00, img:'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop&q=80', rating:4.7, distance:1.1, category:"pantry",    unit:"250 g" },
  { id: 53, name: "Extra Virgin Olive Oil",  price: 13.50, img:'https://images.unsplash.com/photo-1474979150399-4d3d9a7ec44d?w=400&h=400&fit=crop&q=80', rating:4.8, distance:0.7, category:"pantry",    unit:"500 ml", isFlashDeal:true, originalPrice:17.99 },
  { id: 54, name: "Basmati Rice",            price: 4.99,  img:'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400&h=400&fit=crop&q=80', rating:4.6, distance:1.3, category:"pantry",    unit:"1 kg" },
  { id: 55, name: "Raw Organic Honey",       price: 9.99,  img:'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=400&fit=crop&q=80', rating:4.9, distance:0.5, isOrganic:true, category:"pantry",    unit:"320 g" },
  { id: 56, name: "Whole Wheat Flour",       price: 3.49,  img:'https://images.unsplash.com/photo-1574919630-2879f8db00eb?w=400&h=400&fit=crop&q=80', rating:4.5, distance:0.9, category:"pantry",    unit:"1 kg" },
  { id: 57, name: "Cane Sugar",              price: 2.49,  img:'https://images.unsplash.com/photo-1581591524425-273d4ef00baa?w=400&h=400&fit=crop&q=80', rating:4.4, distance:1.0, category:"pantry",    unit:"500 g" },
  { id: 58, name: "Rolled Oats",             price: 3.80,  img:'https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?w=400&h=400&fit=crop&q=80', rating:4.7, distance:0.8, isOrganic:true, category:"pantry",    unit:"500 g" },
  { id: 59, name: "Peanut Butter",           price: 6.50,  img:'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=400&fit=crop&q=80', rating:4.8, distance:0.6, category:"pantry",    unit:"400 g" },
  { id: 60, name: "Soy Sauce",               price: 3.99,  img:'https://images.unsplash.com/photo-1622542796254-5b9c46ab0d2f?w=400&h=400&fit=crop&q=80', rating:4.5, distance:1.0, category:"pantry",    unit:"250 ml" },
];

const ALL_WORDS = Array.from(new Set(
  PRODUCTS.flatMap(p => p.name.toLowerCase().split(/\s+/)).filter(w => w.length > 2)
));

const HERO_SLIDES = [
  { id: 1, title: "FLAT 20% OFF",   subtitle: "On your first order — use code DARK20",         bg: "from-red-700 via-red-900 to-black",    label: "DARK20" },
  { id: 2, title: "FLASH SALE",     subtitle: "6 PM – 8 PM | Up to 40% off on select items",  bg: "from-yellow-600 via-red-800 to-black",  label: "HOT" },
  { id: 3, title: "FREE DELIVERY",  subtitle: "On orders above $25 — limited time",           bg: "from-blue-800 via-neutral-900 to-black", label: "FREE" },
  { id: 4, title: "ORGANIC WEEK",   subtitle: "Freshest organic produce in 10 minutes",       bg: "from-green-700 via-neutral-900 to-black", label: "BIO" },
];

const SEARCH_HISTORY_KEY = "dc_search_history";
const MAX_HISTORY = 10;

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function ZeptoBlinkit() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const dark = theme === "dark";

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [countdown, setCountdown] = useState({ h: 1, m: 45, s: 30 });
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [wordPrediction, setWordPrediction] = useState("");
  const [geoAddress, setGeoAddress] = useState("Fetching location...");
  const [geoCoords, setGeoCoords] = useState({ lat: 12.9141, lng: 77.6446 });
  const catScrollRef = useRef(null);

  // --- Dark mode colors ---
  const bg       = dark ? "bg-black"                              : "bg-neutral-100";
  const text     = dark ? "text-white"                            : "text-neutral-900";
  const muted    = dark ? "text-neutral-500"                      : "text-neutral-400";
  const cardBg   = dark ? "bg-neutral-900 border-neutral-700"     : "bg-white border-neutral-200";
  const cardText = dark ? "text-white"                            : "text-neutral-900";

  // ---- Load search history ----
  useEffect(() => { setSearchHistory(JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || "[]")); }, []);

  // ---- Word prediction ----
  useEffect(() => {
    if (!searchQuery.trim()) { setWordPrediction(""); return; }
    const last = searchQuery.toLowerCase().split(/\s+/).pop();
    if (!last) { setWordPrediction(""); return; }
    const match = ALL_WORDS.find(w => w.startsWith(last) && w !== last);
    setWordPrediction(match ? match.slice(last.length) : "");
  }, [searchQuery]);

  // ---- Sync cart to localStorage ----
  useEffect(() => { localStorage.setItem("dc_cart", JSON.stringify(cart)); }, [cart]);

  // ---- Geolocation ----
  useEffect(() => {
    if (!navigator.geolocation) { setGeoAddress("HSR Layout, Bangalore"); return; }
    navigator.geolocation.getCurrentPosition(
      pos => { setGeoCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGeoAddress("HSR Layout, Bangalore, KA"); },
      () => setGeoAddress("HSR Layout, Bangalore (approx)"),
      { timeout: 5000 }
    );
  }, []);

  // ---- Hero auto-slide ----
  useEffect(() => { const t = setInterval(() => setCurrentSlide(p => (p + 1) % HERO_SLIDES.length), 4000); return () => clearInterval(t); }, []);

  // ---- Flash countdown ----
  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(p => {
        let { h, m, s } = p;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) return { h: 0, m: 0, s: 0 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // ---- Category scroll ----
  useEffect(() => {
    const el = catScrollRef.current; if (!el) return;
    let dir = 1;
    const t = setInterval(() => { el.scrollLeft += dir * 0.7; if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) dir = -1; if (el.scrollLeft <= 0) dir = 1; }, 20);
    return () => clearInterval(t);
  }, []);

  // ---- Cart helpers ----
  const getProductQty = useCallback((id) => cart.filter(c => c.id === id).reduce((s, c) => s + c.quantity, 0), [cart]);
  const addToCart = useCallback((product) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === product.id);
      if (ex) return prev.map(c => c.id === product.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { ...product, quantity: 1, cartId: Math.random().toString(36).substring(7) }];
    });
  }, []);
  const addBundleToCart = useCallback((items) => { items.forEach(item => addToCart(item)); setIsCartOpen(true); }, [addToCart]);
  const decrementCart = useCallback((id) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === id);
      if (ex && ex.quantity > 1) return prev.map(c => c.id === id ? { ...c, quantity: c.quantity - 1 } : c);
      return prev.filter(c => c.id !== id);
    });
  }, []);

  const subtotal = useMemo(() => cart.reduce((a, c) => a + c.price * c.quantity, 0), [cart]);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const deliveryFee = subtotal > 25 ? 0 : 2.99;
  const taxes = (subtotal - discount) * 0.08;
  const total = subtotal - discount + deliveryFee + taxes;
  const totalQty = useMemo(() => cart.reduce((a, c) => a + c.quantity, 0), [cart]);

  const handleSearch = (query) => {
    if (!query.trim()) return;
    const next = [query, ...searchHistory.filter(h => h !== query)].slice(0, MAX_HISTORY);
    setSearchHistory(next);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
  };
  const clearHistory = () => { setSearchHistory([]); localStorage.removeItem(SEARCH_HISTORY_KEY); };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6);
  }, [searchQuery]);
  const filteredProducts = useMemo(() => selectedCategory === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === selectedCategory), [selectedCategory]);
  const flashDeals = useMemo(() => PRODUCTS.filter(p => p.isFlashDeal), []);
  const shelves = useMemo(() => CATEGORIES.filter(c => c.id !== "all").map(cat => ({ ...cat, products: PRODUCTS.filter(p => p.category === cat.id) })).filter(s => s.products.length > 0), []);
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className={`min-h-screen ${bg} ${text} font-sans selection:bg-red-600 selection:text-white transition-colors`}>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-black text-white shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="shrink-0 flex items-center gap-2 mr-1 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center font-black text-lg">D</div>
            <div className="hidden sm:block leading-none">
              <p className="text-sm font-black uppercase tracking-tighter">Dark</p>
              <p className="text-sm font-black uppercase tracking-tighter text-red-500">Commerce</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 bg-neutral-900 border border-neutral-700 rounded-full px-3 py-2 cursor-pointer hover:border-red-500 transition-colors min-w-[200px]">
            <Zap size={12} className="text-green-400 shrink-0" />
            <span className="text-green-400 font-black text-xs">10 min</span>
            <span className="text-neutral-500 text-xs">|</span>
            <MapPin size={12} className="text-neutral-400 shrink-0" />
            <span className="text-xs font-bold text-neutral-200 truncate max-w-[110px]">{geoAddress}</span>
            <ChevronDown size={12} className="text-neutral-600 ml-auto shrink-0" />
          </div>

          <div className="flex-1 relative">
            <div className="relative flex items-center">
              <Search size={16} className="absolute left-3 text-neutral-500 pointer-events-none" />
              <input type="text" placeholder="Search groceries, recipes..."
                className="w-full bg-neutral-900 border-2 border-neutral-700 rounded-xl px-4 py-2.5 pl-10 pr-10 text-sm font-medium outline-none focus:border-red-500 focus:ring-2 focus:ring-red-900/30 transition-all placeholder-neutral-600 text-white"
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)} onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onKeyDown={e => { if (e.key === "Tab" && wordPrediction) { e.preventDefault(); setSearchQuery(searchQuery + wordPrediction); } if (e.key === "Enter") handleSearch(searchQuery); }}
                aria-label="Search products" />
              {wordPrediction && <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-600 pointer-events-none select-none" style={{ paddingLeft: `${searchQuery.length * 7.4}px` }}>{wordPrediction}</span>}
              {searchQuery && <button onClick={() => { setSearchQuery(""); setWordPrediction(""); }} className="absolute right-3 text-neutral-500 hover:text-white transition-colors"><X size={14} /></button>}
            </div>
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border-2 border-neutral-700 rounded-xl shadow-2xl overflow-hidden z-50">
                  {searchResults.length > 0 && searchResults.map(item => (
                    <button key={item.id} className="w-full flex items-center gap-3 p-3 hover:bg-neutral-800 transition-colors text-left border-b border-neutral-800 last:border-0"
                      onMouseDown={() => { handleSearch(item.name); setSearchQuery(""); addToCart(item); }}>
                      <div className="w-10 h-10 relative bg-neutral-800 rounded overflow-hidden flex-shrink-0"><Image src={item.img} alt={item.name} fill className="object-cover" sizes="40px" /></div>
                      <div className="flex-1"><p className="text-sm font-bold text-white">{item.name}</p><p className="text-xs text-neutral-500">{item.unit} · {item.rating} stars</p></div>
                      <span className="text-red-400 font-black text-sm">${item.price.toFixed(2)}</span>
                    </button>
                  ))}
                  {!searchQuery.trim() && searchHistory.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800">
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Recent Searches</span>
                        <button onClick={clearHistory} className="text-[10px] text-red-500 font-bold hover:text-red-400">Clear All</button>
                      </div>
                      {searchHistory.map((h, i) => (
                        <button key={i} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-800 transition-colors text-left border-b border-neutral-800 last:border-0"
                          onMouseDown={() => setSearchQuery(h)}>
                          <Clock size={14} className="text-neutral-500" /><span className="text-sm text-neutral-300">{h}</span><ChevronRight size={12} className="ml-auto text-neutral-600" />
                        </button>
                      ))}
                    </div>
                  )}
                  {wordPrediction && searchQuery && (
                    <div className="px-3 py-2 border-t border-neutral-800 flex items-center gap-2">
                      <span className="text-[10px] text-neutral-600 font-bold uppercase">Tab</span>
                      <span className="text-xs text-neutral-500">to complete: <span className="text-neutral-300 font-bold">{searchQuery + wordPrediction}</span></span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-red-500 text-white transition-all" aria-label="Toggle theme">
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {user ? (
            <div className="flex items-center gap-1.5">
              <Link href="/profile" className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-bold uppercase px-3 py-2.5 rounded-xl transition-all">
                <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-[10px] font-black">{user.avatar}</div>
                <span className="hidden sm:block">{user.name.split(" ")[0]}</span>
              </Link>
              <button onClick={logout} className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-red-500 text-neutral-400 hover:text-white transition-all" aria-label="Logout"><LogOut size={16} /></button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-bold uppercase px-3 py-2.5 rounded-xl transition-all">
              <LogIn size={16} /><span className="hidden sm:block">Sign In</span>
            </Link>
          )}

          <button onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider py-2.5 px-4 rounded-xl active:scale-95 transition-all" aria-label="Cart">
            <ShoppingCart size={18} /><span className="hidden sm:inline text-sm">Cart</span>
            {totalQty > 0 && <motion.span key={totalQty} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 bg-white text-red-600 w-5 h-5 rounded-full text-xs font-black flex items-center justify-center border-2 border-red-600">{totalQty}</motion.span>}
          </button>
        </div>
      </header>

      {/* CATEGORY TABS */}
      <div className="bg-black/95 border-b border-neutral-800 overflow-hidden">
        <div ref={catScrollRef} className="max-w-7xl mx-auto flex gap-2 px-4 py-2.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => {
            const active = selectedCategory === cat.id;
            return (
              <motion.button key={cat.id} whileHover={{ scale: 1.06, y: -1 }} whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold uppercase tracking-wider text-xs whitespace-nowrap border transition-all ${
                  active ? "bg-red-600 border-red-600 text-white shadow-[0_0_16px_rgba(239,68,68,0.35)]" : "bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-white"
                }`} aria-pressed={active}>
                <cat.Icon size={13} />{cat.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* HERO CAROUSEL */}
      <section className="relative overflow-hidden" aria-label="Promotions">
        <AnimatePresence mode="wait">
          <motion.div key={currentSlide} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.4 }}
            className={`bg-gradient-to-r ${HERO_SLIDES[currentSlide].bg} px-8 py-12 md:py-16`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full mb-3"><Tag size={12} className="text-yellow-400" /><span className="text-xs font-bold text-white uppercase tracking-widest">{HERO_SLIDES[currentSlide].label}</span></div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-2">{HERO_SLIDES[currentSlide].title}</h2>
                <p className="text-white/70 text-base md:text-lg font-medium">{HERO_SLIDES[currentSlide].subtitle}</p>
              </div>
              <div className="hidden md:flex items-center bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-6 py-4 gap-3">
                <Clock size={28} className="text-green-400" /><div><p className="text-2xl font-black text-white">10 min</p><p className="text-xs text-white/60">Delivery</p></div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, i) => <button key={i} onClick={() => setCurrentSlide(i)} className={`rounded-full transition-all ${i === currentSlide ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/30"}`} aria-label={`Slide ${i + 1}`} />)}
        </div>
        <button onClick={() => setCurrentSlide(p => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center text-xl">‹</button>
        <button onClick={() => setCurrentSlide(p => (p + 1) % HERO_SLIDES.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center text-xl">›</button>
      </section>

      {/* FLASH DEALS */}
      <section className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className={`text-2xl font-black uppercase tracking-tighter flex items-center gap-2 ${text}`}><Flame size={20} className="text-red-500" /> Flash Deals</h2>
          <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse tabular-nums">{pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none' }}>
          {flashDeals.map(p => <div key={p.id} className="min-w-[200px] max-w-[200px] flex-shrink-0"><ProductCard product={p} qty={getProductQty(p.id)} onAdd={addToCart} onDecrement={decrementCart} cardBg={cardBg} cardText={cardText} dark={dark} /></div>)}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {selectedCategory === "all" ? (
            <motion.div key="shelves" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {shelves.map(shelf => (
                <section key={shelf.id} className="mb-12">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-2xl font-black uppercase tracking-tighter flex items-center gap-2 ${text}`}><shelf.Icon size={20} className="text-red-500" /> {shelf.label}</h2>
                    <button onClick={() => setSelectedCategory(shelf.id)} className="text-red-600 font-bold text-sm hover:underline uppercase flex items-center gap-1">See All <ChevronRight size={14} /></button>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none' }}>
                    {shelf.products.map(p => <div key={p.id} className="min-w-[200px] max-w-[200px] flex-shrink-0"><ProductCard product={p} qty={getProductQty(p.id)} onAdd={addToCart} onDecrement={decrementCart} cardBg={cardBg} cardText={cardText} dark={dark} /></div>)}
                  </div>
                </section>
              ))}
            </motion.div>
          ) : (
            <motion.div key={selectedCategory} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-6">
                {(() => { const cat = CATEGORIES.find(c => c.id === selectedCategory); return cat ? <h2 className={`text-3xl font-black uppercase tracking-tighter flex items-center gap-3 ${text}`}><cat.Icon size={26} className="text-red-500" />{cat.label}</h2> : null; })()}
                <button onClick={() => setSelectedCategory("all")} className={`${muted} font-bold text-sm hover:text-red-600 uppercase flex items-center gap-1`}><ChevronRight size={14} className="rotate-180" /> All</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map((p, i) => <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}><ProductCard product={p} qty={getProductQty(p.id)} onAdd={addToCart} onDecrement={decrementCart} cardBg={cardBg} cardText={cardText} dark={dark} /></motion.div>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FLOATING CART BAR */}
      <AnimatePresence>
        {totalQty > 0 && !isCartOpen && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-4 left-4 right-4 z-[90] max-w-md mx-auto">
            <button onClick={() => setIsCartOpen(true)} className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-between px-6 py-4 rounded-2xl shadow-[0_8px_30px_rgba(239,68,68,0.4)] active:scale-[0.98] transition-all">
              <div className="flex items-center gap-3"><span className="bg-white text-red-600 font-black text-sm w-7 h-7 rounded-full flex items-center justify-center">{totalQty}</span><span className="font-black uppercase tracking-wider text-sm">View Cart</span></div>
              <span className="font-black text-lg">${total.toFixed(2)}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[110] flex flex-col shadow-2xl border-l-4 border-black" role="dialog" aria-modal="true">
              <div className="p-5 border-b-4 border-black flex justify-between items-center bg-black text-white">
                <div>
                  <h2 className="text-2xl font-black uppercase flex items-center gap-2"><ShoppingCart size={20} /> Your Cart</h2>
                  <p className="text-xs text-green-400 font-bold flex items-center gap-1 mt-0.5"><Zap size={10} /> Delivery in 10 min · {geoAddress}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/cart" onClick={() => setIsCartOpen(false)} className="text-xs text-neutral-400 hover:text-white font-bold uppercase border border-neutral-700 px-3 py-1.5 rounded-lg transition-colors">Full Page</Link>
                  <button onClick={() => setIsCartOpen(false)} className="hover:text-red-400 transition-colors"><X size={22} /></button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-neutral-300 gap-3"><ShoppingCart size={56} strokeWidth={1.2} /><p className="font-black uppercase text-lg text-neutral-400">Cart is empty</p></div>
                ) : cart.map(item => (
                  <div key={item.cartId} className="flex gap-3 items-center bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                    <div className="w-14 h-14 relative bg-neutral-100 rounded overflow-hidden flex-shrink-0"><Image src={item.img} alt={item.name} fill className="object-cover" sizes="56px" /></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm uppercase truncate text-neutral-900">{item.name}</h4>
                      <p className="text-xs text-neutral-400">{item.unit}</p>
                      <p className="font-black text-red-600 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center bg-red-600 rounded-lg overflow-hidden">
                      <button onClick={() => decrementCart(item.id)} className="px-2.5 py-2 text-white font-black hover:bg-red-700">−</button>
                      <span className="px-2.5 py-2 text-white font-black text-xs bg-red-700 min-w-[28px] text-center">{item.quantity}</span>
                      <button onClick={() => addToCart(item)} className="px-2.5 py-2 text-white font-black hover:bg-red-700">+</button>
                    </div>
                  </div>
                ))}
              </div>
              {cart.length > 0 && (
                <div className="border-t-4 border-black bg-neutral-900 text-white p-5">
                  <div className="flex gap-2 mb-3">
                    <input type="text" placeholder="Coupon (try DARK20)" value={couponCode} onChange={e => setCouponCode(e.target.value)}
                      className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500 placeholder-neutral-600 text-white" />
                    <button onClick={() => { if (couponCode.toUpperCase() === "DARK20") setCouponApplied(true); }} className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-4 rounded-lg">Apply</button>
                  </div>
                  {couponApplied && <p className="text-green-400 text-xs font-bold mb-3">DARK20 applied — 10% off!</p>}
                  <div className="space-y-1.5 text-sm mb-4">
                    <div className="flex justify-between"><span className="text-neutral-400">Subtotal</span><span className="font-bold">${subtotal.toFixed(2)}</span></div>
                    {discount > 0 && <div className="flex justify-between text-green-400"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
                    <div className="flex justify-between"><span className="text-neutral-400">Delivery</span><span>{deliveryFee === 0 ? <span className="text-green-400 font-bold">FREE</span> : `$${deliveryFee.toFixed(2)}`}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-400">Taxes</span><span className="font-bold">${taxes.toFixed(2)}</span></div>
                  </div>
                  <div className="flex justify-between items-center mb-4 pt-3 border-t border-neutral-700"><span className="font-black uppercase text-lg">Total</span><span className="text-3xl font-black">${total.toFixed(2)}</span></div>
                  <button onClick={() => { setIsCartOpen(false); setIsCheckingOut(true); }} className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xl py-4 rounded-xl active:scale-[0.98] transition-all">Proceed to Pay</button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AIAgent products={PRODUCTS} onAddBundle={addBundleToCart} />

      <AnimatePresence>
        {isCheckingOut && (
          <DeliveryTracker total={total} userLat={geoCoords.lat} userLng={geoCoords.lng} address={geoAddress}
            onClose={() => { setIsCheckingOut(false); setCart([]); setCouponApplied(false); }} />
        )}
      </AnimatePresence>

      <footer className="bg-black text-neutral-600 py-8 px-6 text-center border-t-4 border-neutral-900 mt-12">
        <div className="flex items-center justify-center gap-2 mb-1"><Star size={12} className="text-red-600 fill-red-600" /><p className="font-bold uppercase tracking-widest text-xs text-neutral-500">Dark Commerce — AI-Powered 10-min Delivery</p><Star size={12} className="text-red-600 fill-red-600" /></div>
        <p className="text-[10px] text-neutral-700">Agentic AI · Geolocation · Real-time Delivery Tracking</p>
      </footer>
    </div>
  );
}

// ============================================================================
// PRODUCT CARD — dark mode fixed: explicit text colors
// ============================================================================
function ProductCard({ product, qty, onAdd, onDecrement, cardBg, cardText, dark }) {
  return (
    <div className={`${cardBg} border-2 rounded-xl p-3 group hover:shadow-xl hover:border-neutral-500 transition-all flex flex-col h-full`}>
      <div className="w-full aspect-square relative bg-neutral-100 rounded-lg mb-3 overflow-hidden">
        <Image src={product.img} alt={product.name} fill sizes="220px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isOrganic && <span className="flex items-center gap-0.5 bg-green-600 text-white px-1.5 py-0.5 text-[9px] font-black uppercase rounded"><Leaf size={7} />Organic</span>}
          {product.isFlashDeal && <span className="flex items-center gap-0.5 bg-red-600 text-white px-1.5 py-0.5 text-[9px] font-black uppercase rounded animate-pulse"><Flame size={7} />Deal</span>}
        </div>
        <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap">
          <span className="flex items-center gap-0.5 bg-yellow-400 text-black px-1.5 py-0.5 text-[9px] font-black rounded"><Star size={7} className="fill-black" />{product.rating}</span>
          <span className="flex items-center gap-0.5 bg-blue-600 text-white px-1.5 py-0.5 text-[9px] font-black rounded"><Zap size={7} />10 min</span>
        </div>
      </div>
      <div className="flex-1 mb-2">
        <h3 className={`font-bold text-sm leading-tight line-clamp-2 min-h-[2.5rem] ${cardText}`}>{product.name}</h3>
        <p className="text-[11px] text-neutral-400 mt-0.5">{product.unit}</p>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div>
          <span className={`font-black text-base ${cardText}`}>${product.price.toFixed(2)}</span>
          {product.originalPrice && <span className="text-xs text-neutral-400 line-through ml-1.5">${product.originalPrice.toFixed(2)}</span>}
        </div>
        {qty === 0 ? (
          <button onClick={() => onAdd(product)} className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-4 py-2 rounded-lg active:scale-95 transition-all">ADD</button>
        ) : (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center bg-red-600 rounded-lg overflow-hidden">
            <button onClick={() => onDecrement(product.id)} className="px-2 py-1.5 text-white font-black hover:bg-red-700 text-sm">−</button>
            <span className="px-2.5 py-1.5 text-white font-black text-xs bg-red-700 min-w-[28px] text-center">{qty}</span>
            <button onClick={() => onAdd(product)} className="px-2 py-1.5 text-white font-black hover:bg-red-700 text-sm">+</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
