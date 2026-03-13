"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid, Apple, Leaf, Milk, Cookie, Coffee,
  Fish, Archive, Sandwich, Search, MapPin, Zap,
  ShoppingCart, ChevronDown, Sun, Moon, LogIn, LogOut,
  Tag, Clock, Star, X, ChevronRight, Flame, User,
  CreditCard, Package, Home
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';

const AIAgent = dynamic(() => import('./components/AIAgent'), { ssr: false });
const DeliveryTracker = dynamic(() => import('./components/DeliveryTracker'), { ssr: false });

// Animation Variants
const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 12 } 
  }
};

// ============================================================================
// CATEGORIES — Lucide icons only
// ============================================================================
const CATEGORIES = [
  { id: "all",        label: "All",               Icon: LayoutGrid },
  { id: "fruits",     label: "Fruits & Veggies",  Icon: Leaf       },
  { id: "dairy",      label: "Dairy & Breakfast", Icon: Milk       },
  { id: "munchies",   label: "Munchies",          Icon: Flame      },
  { id: "drinks",     label: "Cold Drinks",       Icon: Coffee     },
  { id: "instant",    label: "Instant Food",      Icon: Zap        },
  { id: "bakery",     label: "Bakery",            Icon: Cookie     },
  { id: "meat",       label: "Meat & Fish",       Icon: Fish       },
  { id: "pantry",     label: "Pantry",            Icon: Archive    },
  { id: "cleaning",   label: "Cleaning",          Icon: Tag        },
  { id: "personal",   label: "Personal Care",     Icon: User       },
  { id: "pet",        label: "Pet Care",          Icon: Star       },
];

const BRANDS = [
  { id: 1, name: "Organic Valley", img: "https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?w=200&q=80" },
  { id: 2, name: "Dairy Best",     img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&q=80" },
  { id: 3, name: "Snack Rite",    img: "https://images.unsplash.com/photo-1599490659223-eb33e95088c1?w=200&q=80" },
  { id: 4, name: "Brew Master",    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&q=80" },
  { id: 5, name: "Fresh Farms",    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80" },
  { id: 6, name: "Nature's Own",   img: "https://images.unsplash.com/photo-1518843875459-f738682238a6?w=200&q=80" },
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
  // MUNCHIES (Snacks/Chips)
  { id: 61, name: "Nacho Cheese Chips",      price: 1.99,  img:'https://images.unsplash.com/photo-1599490659213-e2b9527bb087?w=400&h=400&fit=crop&q=80', rating:4.7, distance:0.5, category:"munchies",  unit:"150 g" },
  { id: 62, name: "Classic Salted Wafers",   price: 1.50,  img:'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop&q=80', rating:4.6, distance:0.8, category:"munchies",  unit:"100 g" },
  { id: 63, name: "Popcorn Butter",          price: 2.10,  img:'https://images.unsplash.com/photo-1578912995058-94116260a16b?w=400&h=400&fit=crop&q=80', rating:4.8, distance:0.9, category:"munchies",  unit:"80 g" },
  { id: 64, name: "Gummy Bears",             price: 3.49,  img:'https://images.unsplash.com/photo-1582050048266-3d70f0dfcc0c?w=400&h=400&fit=crop&q=80', rating:4.5, distance:1.2, category:"munchies",  unit:"200 g" },
  { id: 65, name: "Spicy Peri Peri Mix",     price: 4.99,  img:'https://images.unsplash.com/photo-1600271886342-99933580a109?w=400&h=400&fit=crop&q=80', rating:4.9, distance:0.6, category:"munchies",  unit:"150 g", isFlashDeal:true, originalPrice:6.99 },
  // DRINKS (Cold Drinks)
  { id: 66, name: "Coke Classic Can",        price: 1.20,  img:'https://images.unsplash.com/photo-1629203851022-3cd263ebf897?w=400&h=400&fit=crop&q=80', rating:4.7, distance:0.3, category:"drinks",    unit:"330 ml" },
  { id: 67, name: "Lemon Soda",              price: 1.10,  img:'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=400&fit=crop&q=80', rating:4.5, distance:0.5, category:"drinks",    unit:"330 ml" },
  { id: 68, name: "Energy Drink",            price: 2.50,  img:'https://images.unsplash.com/photo-1622544111325-10141680d906?w=400&h=400&fit=crop&q=80', rating:4.4, distance:1.0, category:"drinks",    unit:"250 ml" },
  { id: 69, name: "Iced Peach Tea",          price: 2.99,  img:'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop&q=80', rating:4.8, distance:0.9, category:"drinks",    unit:"500 ml" },
  // INSTANT FOOD
  { id: 70, name: "Masala Instant Noodles",  price: 0.99,  img:'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop&q=80', rating:4.8, distance:0.4, category:"instant",   unit:"70 g" },
  { id: 71, name: "Frozen Pepperoni Pizza",  price: 8.50,  img:'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop&q=80', rating:4.7, distance:1.5, category:"instant",   unit:"400 g" },
  { id: 72, name: "Ready-to-Eat Pasta",      price: 4.99,  img:'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=400&fit=crop&q=80', rating:4.5, distance:1.3, category:"instant",   unit:"300 g" },
  { id: 73, name: "Instant Veg Soup",        price: 1.25,  img:'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop&q=80', rating:4.6, distance:0.7, category:"instant",   unit:"pack of 2" },
  // CLEANING
  { id: 74, name: "Dishwash Gel Lemon",      price: 4.50,  img:'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&h=400&fit=crop&q=80', rating:4.8, distance:0.9, category:"cleaning",  unit:"500 ml" },
  { id: 75, name: "Floor Cleaner",           price: 3.99,  img:'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?w=400&h=400&fit=crop&q=80', rating:4.7, distance:1.0, category:"cleaning",  unit:"1 L" },
  { id: 76, name: "Fabric Detergent",        price: 9.99,  img:'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&h=400&fit=crop&q=80', rating:4.9, distance:1.4, category:"cleaning",  unit:"2 kg" },
  { id: 77, name: "Multi-Surface Spray",     price: 3.50,  img:'https://images.unsplash.com/photo-1585421514738-ee184bb21f00?w=400&h=400&fit=crop&q=80', rating:4.6, distance:0.8, category:"cleaning",  unit:"500 ml" },
  // PERSONAL CARE
  { id: 78, name: "Moisturizing Soap",       price: 2.99,  img:'https://images.unsplash.com/photo-1605234505051-7892ea01da66?w=400&h=400&fit=crop&q=80', rating:4.7, distance:0.5, category:"personal",  unit:"3 pcs" },
  { id: 79, name: "Anti-Dandruff Shampoo",   price: 7.50,  img:'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&h=400&fit=crop&q=80', rating:4.8, distance:1.2, category:"personal",  unit:"400 ml" },
  { id: 80, name: "Bamboo Toothbrush",       price: 1.50,  img:'https://images.unsplash.com/photo-1620914170884-85514f7b6009?w=400&h=400&fit=crop&q=80', rating:4.9, distance:0.7, category:"personal",  unit:"1 pc" },
  { id: 81, name: "Mint Mouthwash",          price: 4.80,  img:'https://images.unsplash.com/photo-1559591937-e68fb3335fd5?w=400&h=400&fit=crop&q=80', rating:4.6, distance:1.1, category:"personal",  unit:"500 ml" },
  // PET CARE
  { id: 82, name: "Dry Cat Food",            price: 14.99, img:'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop&q=80', rating:4.9, distance:2.1, category:"pet",       unit:"1.5 kg" },
  { id: 83, name: "Dog Chew Treats",         price: 5.50,  img:'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop&q=80', rating:4.7, distance:1.8, category:"pet",       unit:"100 g" },
  { id: 84, name: "Pet Shampoo Aloe",        price: 8.99,  img:'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop&q=80', rating:4.8, distance:1.5, category:"pet",       unit:"500 ml" },
  { id: 85, name: "Bouncy Ball Toy",         price: 2.20,  img:'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=400&h=400&fit=crop&q=80', rating:4.6, distance:0.9, category:"pet",       unit:"1 pc" },
  // MORE PERSONAL CARE
  { id: 86, name: "Gentle Facewash",         price: 6.99,  img:'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop&q=80', rating:4.7, distance:1.2, category:"personal",  unit:"150 ml" },
  { id: 87, name: "SPF 50 Sunscreen",        price: 12.50, img:'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=400&fit=crop&q=80', rating:4.8, distance:1.5, category:"personal",  unit:"50 ml" },
  { id: 88, name: "Body Lotion Cocoa",       price: 8.99,  img:'https://images.unsplash.com/photo-1552046122-03184de85e08?w=400&h=400&fit=crop&q=80', rating:4.6, distance:1.0, category:"personal",  unit:"400 ml" },
  { id: 89, name: "Men's Shaving Gel",       price: 5.20,  img:'https://images.unsplash.com/photo-1590611936763-ebdc93dec231?w=400&h=400&fit=crop&q=80', rating:4.5, distance:0.8, category:"personal",  unit:"200 ml" },
  // MORE MUNCHIES
  { id: 90, name: "Chocolate Chip Cookies",  price: 3.99,  img:'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop&q=80', rating:4.9, distance:0.5, category:"munchies",  unit:"200 g" },
  { id: 91, name: "Beef Jerky Original",     price: 7.50,  img:'https://images.unsplash.com/photo-1585121401392-71f850080360?w=400&h=400&fit=crop&q=80', rating:4.7, distance:1.3, category:"munchies",  unit:"50 g" },
  { id: 92, name: "Sea Salt Almonds",        price: 9.99,  img:'https://images.unsplash.com/photo-1508061253335-961fa0930773?w=400&h=400&fit=crop&q=80', rating:4.8, distance:0.9, category:"munchies",  unit:"150 g" },
  { id: 93, name: "Roasted Makhana",         price: 2.99,  img:'https://images.unsplash.com/photo-1589118949245-7d38baf380d6?w=400&h=400&fit=crop&q=80', rating:4.6, distance:0.6, category:"munchies",  unit:"50 g" },
  // HEALTHY & ORGANIC
  { id: 94, name: "Whey Protein Vanilla",    price: 35.00, img:'https://images.unsplash.com/photo-1593095191026-634cc1d82136?w=400&h=400&fit=crop&q=80', rating:4.9, distance:2.0, category:"personal",  unit:"1 kg" },
  { id: 95, name: "Multivitamin Gummies",    price: 18.99, img:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&q=80', rating:4.8, distance:1.5, category:"personal",  unit:"60 pcs" },
  { id: 96, name: "Organic Chia Seeds",      price: 6.50,  img:'https://images.unsplash.com/photo-1585409600261-0ac7a615d5f0?w=400&h=400&fit=crop&q=80', rating:4.7, distance:1.0, isOrganic:true, category:"pantry", unit:"250 g" },
  { id: 97, name: "Cold Pressed Apple Sync", price: 4.80,  img:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop&q=80', rating:4.8, distance:0.5, category:"drinks",    unit:"250 ml" },
  // PANTRY STAPLES
  { id: 98, name: "Spaghetti Pasta",         price: 2.49,  img:'https://images.unsplash.com/photo-1551462147-37885abb3e4a?w=400&h=400&fit=crop&q=80', rating:4.7, distance:0.9, category:"pantry",    unit:"500 g" },
  { id: 99, name: "Tomato Basil Sauce",      price: 5.20,  img:'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&h=400&fit=crop&q=80', rating:4.8, distance:0.7, category:"pantry",    unit:"400 g" },
  { id: 100, name: "Himalayan Pink Salt",    price: 3.50,  img:'https://images.unsplash.com/photo-1626509653293-6056ae3c316d?w=400&h=400&fit=crop&q=80', rating:4.9, distance:1.1, category:"pantry",    unit:"500 g" },
  { id: 101, name: "Roasted Garlic Oil",     price: 14.99, img:'https://images.unsplash.com/photo-1474979150399-4d3d9a7ec44d?w=400&h=400&fit=crop&q=80', rating:4.8, distance:0.8, isFlashDeal:true, originalPrice:19.99, category:"pantry", unit:"250 ml" },
];

const ALL_WORDS = Array.from(new Set(
  PRODUCTS.flatMap(p => p.name.toLowerCase().split(/\s+/)).filter(w => w.length > 2)
));

const HERO_BANNERS = [
  { id: 1, title: "FLAT 20% OFF",   subtitle: "On your first order — use code DARK20",         bg: "from-red-700 via-red-900 to-black",    label: "DARK20", img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80' },
  { id: 2, title: "FLASH SALE",     subtitle: "6 PM – 8 PM | Up to 40% off on select items",  bg: "from-yellow-600 via-red-800 to-black",  label: "HOT", img: 'https://images.unsplash.com/photo-1506617564039-2f3b650ad755?w=800&q=80' },
  { id: 3, title: "FREE DELIVERY",  subtitle: "On orders above $25 — limited time",           bg: "from-blue-800 via-neutral-900 to-black", label: "FREE", img: 'https://images.unsplash.com/photo-1543168256-418811576931?w=800&q=80' },
  { id: 4, title: "ORGANIC WEEK",   subtitle: "Freshest organic produce in 10 minutes",       bg: "from-green-700 via-neutral-900 to-black", label: "BIO", img: 'https://images.unsplash.com/photo-1406213753308-4122d2f78683?w=800&q=80' },
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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [countdown, setCountdown] = useState({ h: 1, m: 45, s: 30 });
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [wordPrediction, setWordPrediction] = useState("");
  const [geoAddress, setGeoAddress] = useState("Home · Sector 5, HSR Layout");
  const [addressType, setAddressType] = useState("home"); // home, office, other
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [geoCoords, setGeoCoords] = useState({ lat: 12.9141, lng: 77.6446 });
  const catScrollRef = useRef(null);

  const ADDRESSES = {
    home: "Home · Sector 5, HSR Layout, Bangalore",
    office: "Office · Prestige Tech Park, Marathahalli",
    other: "Other · Indiranagar 12th Main"
  };

  const handleAddressChange = (type) => {
    setAddressType(type);
    setGeoAddress(ADDRESSES[type]);
    setIsAddressOpen(false);
  };

  // --- Dark mode colors ---
  const bg       = dark ? "bg-black"                              : "bg-neutral-50";
  const text     = dark ? "text-white"                            : "text-neutral-900";
  const muted    = dark ? "text-neutral-500"                      : "text-neutral-600";
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

  // ---- Initial Loading Skeleton ----
  useEffect(() => { const t = setTimeout(() => setIsInitialLoading(false), 1200); return () => clearTimeout(t); }, []);

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
  useEffect(() => { const t = setInterval(() => setCurrentSlide(p => (p + 1) % HERO_BANNERS.length), 4000); return () => clearInterval(t); }, []);

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
  const totalSavings = useMemo(() => cart.reduce((a, c) => a + (c.originalPrice ? (c.originalPrice - c.price) * c.quantity : 0), 0), [cart]);
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
      <header className={`sticky top-0 z-50 ${dark ? 'bg-black text-white' : 'bg-white text-neutral-900'} shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b-4 border-red-600`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="shrink-0 flex items-center gap-2 mr-1 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center font-black text-white text-lg">D</div>
            <div className="hidden sm:block leading-none">
              <p className={`text-sm font-black uppercase tracking-tighter ${dark ? 'text-white' : 'text-neutral-900'}`}>Dark</p>
              <p className="text-sm font-black uppercase tracking-tighter text-red-500">Commerce</p>
            </div>
          </Link>

          <div className="relative">
            <button 
              onClick={() => setIsAddressOpen(!isAddressOpen)}
              className={`flex items-center gap-2 ${dark ? 'bg-neutral-900 border-neutral-700' : 'bg-neutral-100 border-neutral-200'} border rounded-full px-3 py-2 cursor-pointer hover:border-red-500 transition-colors min-w-[200px]`}
            >
              <Zap size={12} className="text-green-500 shrink-0" />
              <span className="text-green-500 font-black text-xs">10 min</span>
              <span className="text-neutral-500 text-xs">|</span>
              <MapPin size={12} className={`${dark ? 'text-neutral-400' : 'text-neutral-500'} shrink-0`} />
              <span className={`text-xs font-bold ${dark ? 'text-neutral-200' : 'text-neutral-700'} truncate max-w-[110px]`}>{geoAddress}</span>
              <ChevronDown size={12} className={`${dark ? 'text-neutral-600' : 'text-neutral-400'} ml-auto shrink-0 transition-transform ${isAddressOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isAddressOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 w-[280px] bg-neutral-900 border border-neutral-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] p-2 overflow-hidden backdrop-blur-xl bg-black/80"
                >
                  <p className="text-[10px] items-center font-black uppercase tracking-widest text-neutral-500 px-3 py-2 flex justify-between">
                    Select Address <MapPin size={10} />
                  </p>
                  {(Object.keys(ADDRESSES)).map((type) => (
                    <button 
                      key={type}
                      onClick={() => handleAddressChange(type)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${addressType === type ? 'bg-red-600 text-white' : 'hover:bg-neutral-800 text-neutral-400 hover:text-white'}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${addressType === type ? 'bg-white/20' : 'bg-neutral-800'}`}>
                        {type === 'home' ? <Home size={14} /> : type === 'office' ? <Archive size={14} /> : <MapPin size={14} />}
                      </div>
                      <div className="text-left overflow-hidden">
                        <p className="text-xs font-black uppercase tracking-wider">{type}</p>
                        <p className={`text-[10px] truncate ${addressType === type ? 'text-white/70' : 'text-neutral-500'}`}>{ADDRESSES[type].split('·')[1]}</p>
                      </div>
                      {addressType === type && <CheckCircle size={14} className="ml-auto" />}
                    </button>
                  ))}
                  <button className="w-full mt-2 p-2.5 text-[10px] font-black uppercase text-red-500 border border-dashed border-red-500/30 rounded-xl hover:bg-red-500/5 transition-all">
                    + Add New Address
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
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
            className={`bg-gradient-to-r ${HERO_BANNERS[currentSlide].bg} px-8 py-12 md:py-16`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full mb-3"><Tag size={12} className="text-yellow-400" /><span className="text-xs font-bold text-white uppercase tracking-widest">{HERO_BANNERS[currentSlide].label}</span></div>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-2">{HERO_BANNERS[currentSlide].title}</h2>
                <p className="text-white/70 text-base md:text-lg font-medium">{HERO_BANNERS[currentSlide].subtitle}</p>
              </div>
              <div className="hidden md:flex items-center bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-6 py-4 gap-3">
                <Clock size={28} className="text-green-400" /><div><p className="text-2xl font-black text-white">10 min</p><p className="text-xs text-white/60">Delivery</p></div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_BANNERS.map((_, i) => <button key={i} onClick={() => setCurrentSlide(i)} className={`rounded-full transition-all ${i === currentSlide ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/30"}`} aria-label={`Slide ${i + 1}`} />)}
        </div>
        <button onClick={() => setCurrentSlide(p => (p - 1 + HERO_BANNERS.length) % HERO_BANNERS.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center text-xl">‹</button>
        <button onClick={() => setCurrentSlide(p => (p + 1) % HERO_BANNERS.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center text-xl">›</button>
      </section>

      {/* FLASH DEALS */}
      <section className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className={`text-2xl font-black uppercase tracking-tighter flex items-center gap-2 ${text}`}><Flame size={20} className="text-red-500" /> Flash Deals</h2>
          <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse tabular-nums">{pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {flashDeals.map(p => <div key={p.id} className="min-w-[200px] max-w-[200px] flex-shrink-0"><ProductCard product={p} qty={getProductQty(p.id)} onAdd={addToCart} onDecrement={decrementCart} cardBg={cardBg} cardText={cardText} dark={dark} /></div>)}
        </div>
      </section>

      {/* FEATURED BRANDS */}
      <section className="max-w-7xl mx-auto px-4 mt-12 mb-4">
        <h2 className={`text-xl font-black uppercase tracking-tighter mb-4 ${text}`}>Featured Brands</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {BRANDS.map((brand) => (
            <motion.div 
              key={brand.id}
              whileHover={{ y: -5, scale: 1.05 }}
              className={`min-w-[120px] aspect-square rounded-[32px] ${cardBg} border-2 border-transparent hover:border-red-600/30 flex flex-col items-center justify-center p-4 transition-all cursor-pointer shadow-xl`}
            >
              <div className="w-16 h-16 relative mb-2 rounded-2xl overflow-hidden bg-white p-2">
                <Image src={brand.img} alt={brand.name} fill className="object-contain" sizes="64px" />
              </div>
              <p className="text-[10px] font-black uppercase text-center tracking-tighter opacity-70 leading-none">{brand.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <motion.main 
        variants={STAGGER_CONTAINER}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 py-8"
      >
        {/* Categories Horizontal */}
        <motion.div variants={FADE_UP} className="mb-10">
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-2 group snap-start`}
              >
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-300 border-2 ${
                  selectedCategory === cat.id 
                  ? 'bg-red-600 border-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-110' 
                  : (dark ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-500' : 'bg-white border-neutral-200 text-neutral-500 hover:border-red-500')
                }`}>
                  <cat.Icon size={24} className="group-hover:scale-110 transition-transform" />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${selectedCategory === cat.id ? 'text-red-600' : muted}`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Hero & Flash Combo */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* Hero Slider */}
          <motion.div variants={FADE_UP} className="lg:col-span-2 h-[320px] rounded-[40px] relative overflow-hidden group shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="absolute inset-0"
              >
                <Image src={HERO_BANNERS[currentSlide].img} alt="Hero" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent flex flex-col justify-center px-12">
                  <motion.span initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-red-500 font-black tracking-[0.3em] uppercase text-[10px] mb-4 bg-red-500/10 w-fit px-3 py-1 rounded-full border border-red-500/20">Exclusive Deal</motion.span>
                  <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-5xl font-black text-white leading-[0.9] mb-6 max-w-sm tracking-tighter drop-shadow-2xl">{HERO_BANNERS[currentSlide].title}</motion.h2>
                  <motion.button initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white text-black hover:bg-red-600 hover:text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs w-fit active:scale-95 transition-all shadow-2xl">Grab Now</motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Glassmorphic Nav */}
            <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between pointer-events-none">
              <button 
                onClick={(e) => { e.stopPropagation(); setCurrentSlide(prev => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length); }}
                className="w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white pointer-events-auto opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black hover:scale-110"
              >
                <ChevronRight size={24} className="rotate-180" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setCurrentSlide(prev => (prev + 1) % HERO_BANNERS.length); }}
                className="w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white pointer-events-auto opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black hover:scale-110"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Premium Progress Dots */}
            <div className="absolute bottom-8 left-12 flex gap-3">
              {HERO_BANNERS.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-700 relative overflow-hidden ${i === currentSlide ? 'w-10 bg-white' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                >
                  {i === currentSlide && (
                    <motion.div 
                      key={currentSlide}
                      initial={{ left: '-100%' }}
                      animate={{ left: '0%' }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="absolute inset-0 bg-red-600"
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Flash Deals Tab */}
          <motion.div variants={FADE_UP} className={`rounded-[40px] border-2 ${cardBg} p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-2xl bg-gradient-to-br from-neutral-900 to-black`}>
            <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center text-white mb-6 shadow-[0_0_30px_rgba(239,68,68,0.5)]">
              <Flame size={48} fill="white" />
            </motion.div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-red-500 mb-2">Flash Deals End In</h3>
            <div className="flex gap-4 mb-4">
              {[
                { v: countdown.h, l: 'HR' },
                { v: countdown.m, l: 'MIN' },
                { v: countdown.s, l: 'SEC' }
              ].map((t, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-4xl font-black tracking-tighter tabular-nums">{t.v.toString().padStart(2, '0')}</span>
                  <span className="text-[9px] font-black text-neutral-500">{t.l}</span>
                </div>
              ))}
            </div>
            <p className="text-xs font-bold text-neutral-400">Up to 60% OFF on Snacks</p>
          </motion.div>
        </div>

        {/* Dynamic Shelves / Grid */}
        <AnimatePresence mode="wait">
          {selectedCategory === "all" ? (
            <motion.div key="shelves" variants={STAGGER_CONTAINER} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="space-y-16">
              {shelves.map(shelf => (
                <section key={shelf.id}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-xl font-black uppercase tracking-tighter flex items-center gap-2 ${text}`}>
                      <shelf.Icon size={18} className="text-red-500" /> {shelf.label}
                    </h2>
                    <button onClick={() => setSelectedCategory(shelf.id)} className="text-red-600 font-bold text-xs hover:underline uppercase flex items-center gap-1">
                      See All <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-6 scroll-smooth hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
                    {isInitialLoading 
                      ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="min-w-[180px] flex-shrink-0"><SkeletonCard cardBg={cardBg} /></div>)
                      : shelf.products.map(p => (
                        <div key={p.id} className="min-w-[180px] max-w-[180px] flex-shrink-0">
                          <ProductCard product={p} qty={getProductQty(p.id)} onAdd={addToCart} onDecrement={decrementCart} cardBg={cardBg} cardText={cardText} dark={dark} />
                        </div>
                      ))
                    }
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
                {isInitialLoading 
                  ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} cardBg={cardBg} />)
                  : filteredProducts.map((p, i) => <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}><ProductCard product={p} qty={getProductQty(p.id)} onAdd={addToCart} onDecrement={decrementCart} cardBg={cardBg} cardText={cardText} dark={dark} /></motion.div>)
                }
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>

      {/* FLOATING CART BAR */}
      <AnimatePresence>
        {totalQty > 0 && !isCartOpen && (
          <motion.div 
            initial={{ y: 100 }} 
            animate={{ y: 0, scale: [1, 1.02, 1] }} 
            transition={{ 
              animate: { repeat: Infinity, duration: 2, ease: "easeInOut" },
              y: { type: "spring", stiffness: 200, damping: 20 }
            }}
            className="fixed bottom-4 left-4 right-4 z-[90] max-w-md mx-auto"
          >
            <button onClick={() => setIsCartOpen(true)} className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-between px-6 py-4 rounded-3xl shadow-[0_15px_40px_rgba(239,68,68,0.5)] active:scale-[0.98] transition-all border-t border-white/20">
              <div className="flex items-center gap-4">
                <div className="bg-white text-red-600 font-black text-sm w-8 h-8 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-12 transition-transform group-hover:rotate-0">
                  {totalQty}
                </div>
                <span className="font-black uppercase tracking-[0.2em] text-xs">View My Cart</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-[1px] bg-white/20" />
                <span className="font-black text-xl tracking-tighter">${total.toFixed(2)}</span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md" onClick={() => setIsCartOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`fixed inset-y-0 right-0 w-full max-w-md ${dark ? 'bg-black' : 'bg-white'} z-[110] flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] border-l border-neutral-800`} role="dialog" aria-modal="true">
              
              <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-inherit">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                    <ShoppingCart size={20} className="text-red-500" /> My Basket
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-[10px] text-green-500 font-black uppercase tracking-widest bg-green-500/10 px-1.5 py-0.5 rounded">
                      <Zap size={10} fill="currentColor" /> 10 mins
                    </span>
                    <p className="text-[10px] text-neutral-500 font-bold truncate max-w-[150px]">{geoAddress}</p>
                  </div>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:text-red-500 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="px-6 py-4 bg-neutral-900/50 border-b border-neutral-800">
                <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase tracking-widest">
                  <p className={subtotal >= 25 ? "text-green-500" : "text-neutral-400"}>
                    {subtotal >= 25 ? "🎉 Free Delivery Unlocked!" : `Shop $${(25 - subtotal).toFixed(2)} more for Free Delivery`}
                  </p>
                  <span className="text-red-500">${subtotal.toFixed(2)} / $25</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((subtotal / 25) * 100, 100)}%` }}
                    className={`h-full ${subtotal >= 25 ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]'}`}
                  />
                </div>
                {totalSavings > 0 && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex items-center justify-between bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-green-500 flex items-center justify-center text-white"><Tag size={12} fill="white" /></div>
                      <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Total Savings</p>
                    </div>
                    <span className="text-xs font-black text-green-500">${totalSavings.toFixed(2)}</span>
                  </motion.div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-32 h-32 rounded-[50px] bg-neutral-900 border-2 border-dashed border-neutral-800 flex items-center justify-center mb-6">
                      <ShoppingCart size={48} className="text-neutral-700" strokeWidth={1.5} />
                    </motion.div>
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Feeling Hungry?</h3>
                    <p className="text-sm text-neutral-500 font-bold mb-8">Your cart is currently empty. Add some amazing treats!</p>
                    <button onClick={() => setIsCartOpen(false)} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95">Browse Items</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <motion.div key={item.cartId} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} 
                        className={`flex gap-4 p-3 rounded-[24px] border-2 ${dark ? 'border-neutral-900 bg-neutral-950' : 'border-neutral-50 bg-neutral-50'} group`}>
                        <div className="w-20 h-20 relative rounded-2xl overflow-hidden shrink-0"><Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform" sizes="80px" /></div>
                        <div className="flex-1 min-w-0 py-1">
                          <h4 className={`font-black text-sm uppercase truncate ${dark ? 'text-white' : 'text-neutral-900'}`}>{item.name}</h4>
                          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-0.5">{item.unit}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-black text-red-500 text-base">${(item.price * item.quantity).toFixed(2)}</span>
                            <div className="flex items-center bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 scale-90 origin-right">
                              <button onClick={() => decrementCart(item.id)} className="px-2.5 py-1.5 text-white hover:text-red-500 transition-colors">−</button>
                              <span className="px-2 py-1.5 text-white font-black text-xs min-w-[32px] text-center">{item.quantity}</span>
                              <button onClick={() => addToCart(item)} className="px-2.5 py-1.5 text-white hover:text-red-500 transition-colors">+</button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className={`p-6 border-t ${dark ? 'border-neutral-800 bg-black' : 'border-neutral-100 bg-white'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <span className={`font-black uppercase tracking-[0.2em] text-xs ${dark ? 'text-neutral-500' : 'text-neutral-600'}`}>Bill Total</span>
                    <span className={`text-3xl font-black tracking-tighter ${text}`}>${total.toFixed(2)}</span>
                  </div>
                  <button onClick={() => { setIsCartOpen(false); setIsCheckingOut(true); }} 
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase py-5 rounded-[28px] text-lg tracking-widest shadow-[0_20px_40px_rgba(239,68,68,0.3)] hover:translate-y-[-2px] active:translate-y-[0px] transition-all flex items-center justify-center gap-3">
                    Place Order <ChevronRight size={24} />
                  </button>
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

      <TrustSection dark={dark} />

      <footer className="bg-black text-neutral-400 py-16 px-6 border-t-4 border-red-600 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-black text-white text-sm">D</div>
              <h3 className="text-xl font-black uppercase tracking-tighter text-white">Dark Commerce</h3>
            </div>
            <p className="text-[11px] font-bold leading-relaxed text-neutral-500 uppercase tracking-widest">
              The world's fastest AI-powered quick commerce platform. Delivering magic in 10 minutes.
            </p>
            <div className="flex gap-4 pt-2">
              {[Star, Zap, Flame, User].map((Icon, i) => (
                <div key={i} className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer border border-neutral-800">
                  <Icon size={14} className="text-white" />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-6">Categories</h4>
            <ul className="space-y-3 text-[10px] font-black uppercase tracking-widest">
              {CATEGORIES.slice(1, 6).map(cat => (
                <li key={cat.id} className="hover:text-red-500 cursor-pointer transition-colors">{cat.label}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-6">Support</h4>
            <ul className="space-y-3 text-[10px] font-black uppercase tracking-widest">
              <li className="hover:text-red-500 cursor-pointer transition-colors">Help Center</li>
              <li className="hover:text-red-500 cursor-pointer transition-colors">Returns & Refunds</li>
              <li className="hover:text-red-500 cursor-pointer transition-colors">Partner With Us</li>
              <li className="hover:text-red-500 cursor-pointer transition-colors">Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-6">Download Our App</h4>
            <div className="space-y-3">
              <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-2xl flex items-center gap-3 hover:border-red-600 transition-all cursor-pointer">
                <Apple size={24} className="text-white" />
                <div className="leading-none"><p className="text-[8px] font-black uppercase text-neutral-500">Download on the</p><p className="text-sm font-black text-white">App Store</p></div>
              </div>
              <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-2xl flex items-center gap-3 hover:border-red-600 transition-all cursor-pointer">
                <Zap size={24} className="text-white" />
                <div className="leading-none"><p className="text-[8px] font-black uppercase text-neutral-500">Get it on</p><p className="text-sm font-black text-white">Google Play</p></div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-neutral-900 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-700">
          <p>© 2026 Dark Commerce. All Rights Reserved.</p>
          <p>Designed with ❤️ by Agentic AI</p>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// PRODUCT CARD
// ============================================================================
function ProductCard({ product, qty, onAdd, onDecrement, cardBg, cardText, dark }) {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      className={`${cardBg} border-2 rounded-xl p-3 group relative hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-red-600/50 transition-all flex flex-col h-full`}
    >
      <div className="w-full aspect-square relative bg-neutral-100 rounded-lg mb-3 overflow-hidden">
        <Image src={product.img} alt={product.name} fill sizes="220px" className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.isOrganic && <span className="flex items-center gap-0.5 bg-green-600 text-white px-1.5 py-0.5 text-[9px] font-black uppercase rounded shadow-lg"><Leaf size={7} />Organic</span>}
          {product.isFlashDeal && <span className="flex items-center gap-0.5 bg-red-600 text-white px-1.5 py-0.5 text-[9px] font-black uppercase rounded animate-pulse shadow-lg"><Flame size={7} />Deal</span>}
          {product.originalPrice && (
            <span className="bg-yellow-400 text-black px-1.5 py-0.5 text-[9px] font-black uppercase rounded shadow-lg flex items-center gap-0.5">
              Save ${(product.originalPrice - product.price).toFixed(2)}
            </span>
          )}
        </div>
        <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap z-10">
          <span className="flex items-center gap-0.5 bg-neutral-900/80 backdrop-blur text-white px-1.5 py-0.5 text-[9px] font-black rounded shadow-md border border-white/10"><Star size={7} className="fill-yellow-400 text-yellow-400" />{product.rating}</span>
          <span className="flex items-center gap-0.5 bg-blue-600 text-white px-1.5 py-0.5 text-[9px] font-black rounded shadow-md"><Zap size={7} />10 min</span>
        </div>
        {/* Hover Gradient Shield */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
      <div className="flex-1 mb-2">
        <h3 className={`font-bold text-sm leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-red-500 transition-colors ${cardText}`}>{product.name}</h3>
        <p className="text-[11px] text-neutral-400 mt-0.5 font-bold tracking-tight">{product.unit}</p>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className={`font-black text-lg tracking-tighter ${cardText}`}>${product.price.toFixed(2)}</span>
          {product.originalPrice && <span className="text-[10px] text-neutral-500 line-through">- ${product.originalPrice.toFixed(2)}</span>}
        </div>
        {qty === 0 ? (
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAdd(product)} 
            className="bg-red-600 hover:bg-red-700 text-white font-black text-[10px] tracking-widest uppercase px-5 py-2.5 rounded-xl shadow-lg shadow-red-600/20 transition-all"
          >
            ADD
          </motion.button>
        ) : (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center bg-red-600 rounded-xl overflow-hidden shadow-lg">
            <button onClick={() => onDecrement(product.id)} className="px-2.5 py-2 text-white font-black hover:bg-red-700 transition-colors">−</button>
            <span className="px-3 py-2 text-white font-black text-xs bg-red-700/50 backdrop-blur-sm min-w-[32px] text-center">{qty}</span>
            <button onClick={() => onAdd(product)} className="px-2.5 py-2 text-white font-black hover:bg-red-700 transition-colors">+</button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// PREMIUM UI COMPONENTS: SKELETONS & TRUST
// ============================================================================
function SkeletonCard({ cardBg }) {
  return (
    <div className={`${cardBg} border-2 rounded-xl p-3 flex flex-col h-full animate-pulse`}>
      <div className="w-full aspect-square bg-neutral-800 rounded-lg mb-3" />
      <div className="h-4 bg-neutral-800 rounded w-3/4 mb-2" />
      <div className="h-3 bg-neutral-800 rounded w-1/2 mb-4" />
      <div className="mt-auto flex justify-between items-center">
        <div className="h-6 bg-neutral-800 rounded w-1/3" />
        <div className="h-8 bg-neutral-800 rounded w-1/2" />
      </div>
    </div>
  );
}

function TrustSection({ dark }) {
  const items = [
    { icon: Zap,      title: "10 Min Delivery", desc: "Superfast service" },
    { icon: Star,     title: "Best Prices",   desc: "Cheaper than local" },
    { icon: CreditCard, title: "Safe Payments",  desc: "100% Secure" },
    { icon: Package,   title: "Fresh Quality",  desc: "Handpicked daily" },
  ];
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 py-12 border-t ${dark ? 'border-neutral-800 text-neutral-400' : 'border-neutral-200 text-neutral-600'}`}>
      {items.map((item, i) => (
        <div key={i} className="flex flex-col items-center text-center group">
          <div className={`w-12 h-12 rounded-2xl ${dark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'} border flex items-center justify-center text-red-500 mb-3 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all shadow-xl`}>
            <item.icon size={24} />
          </div>
          <h4 className={`text-xs font-black uppercase tracking-widest ${dark ? 'text-white' : 'text-neutral-900'} mb-1`}>{item.title}</h4>
          <p className="text-[10px] font-bold">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}
