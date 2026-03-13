"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Package,
  ChevronLeft, LogOut, Edit2, Check, X,
  Clock, Map as MapIcon, CreditCard, Bell, ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const dark = theme === 'dark';

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '+91 98765 43210',
        address: user.address || 'UVCE,KR Circle, Bangalore, Karnataka'
      });
    } else {
      router.push('/login');
    }
  }, [user, router]);

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  if (!user) return null;

  const bg = dark ? 'bg-black' : 'bg-neutral-50';
  const text = dark ? 'text-white' : 'text-neutral-900';
  const cardBg = dark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200';
  const mutedText = dark ? 'text-neutral-500' : 'text-neutral-400';

  const orders = [
    { id: '#ORD-7721', date: 'Yesterday, 8:45 PM', total: '$14.20', status: 'Delivered', items: '2 items' },
    { id: '#ORD-6612', date: 'Mar 10, 2:15 PM', total: '$42.50', status: 'Delivered', items: '5 items' },
  ];

  return (
    <div className={`min-h-screen ${bg} ${text} transition-colors pb-20`}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-neutral-800 sticky top-0 bg-inherit z-10">
        <button onClick={() => router.back()} className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-sm font-black uppercase tracking-widest">My Profile</h1>
        <button onClick={() => { logout(); router.push('/'); }} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors">
          <LogOut size={20} />
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Profile Card */}
        <div className={`p-6 rounded-3xl border-2 ${cardBg} relative overflow-hidden shadow-2xl`}>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-xl">
              {user.avatar || 'T'}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-neutral-800 border-2 border-red-600 rounded-lg px-3 py-1 text-2xl font-black text-white outline-none w-full"
                  />
                ) : (
                  <h2 className="text-3xl font-black tracking-tight">{user.name}</h2>
                )}
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className={`p-2 rounded-xl transition-all ${isEditing ? 'bg-green-600 text-white' : 'bg-red-600 text-white'} ml-4 shrink-0 shadow-lg`}
                >
                  {isEditing ? <Check size={20} /> : <Edit2 size={20} />}
                </button>
              </div>
              <p className={mutedText}>Member since {user.joinedDate || 'March 2026'}</p>
            </div>
          </div>
        </div>

        {/* User Info List */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-red-500 px-2">Account Details</h3>
          <div className={`rounded-3xl border-2 ${cardBg} divide-y divide-neutral-800 overflow-hidden shadow-xl`}>
            <div className="p-4 flex items-center gap-4">
              <Mail className="text-neutral-500 shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-[10px] uppercase font-black tracking-widest text-neutral-500 leading-none mb-1">Email</p>
                <p className="font-bold">{user.email}</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4">
              <Phone className="text-neutral-500 shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-[10px] uppercase font-black tracking-widest text-neutral-500 leading-none mb-1">Phone</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 font-bold text-white w-full outline-none"
                  />
                ) : (
                  <p className="font-bold">{formData.phone}</p>
                )}
              </div>
            </div>
            <div className="p-4 flex items-center gap-4">
              <MapPin className="text-neutral-500 shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-[10px] uppercase font-black tracking-widest text-neutral-500 leading-none mb-1">Delivery Address</p>
                {isEditing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 font-bold text-white w-full outline-none h-20 resize-none"
                  />
                ) : (
                  <p className="font-bold leading-snug">{formData.address}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/cart" className={`p-4 rounded-3xl border-2 ${cardBg} flex items-center gap-3 hover:border-red-500 transition-all group shadow-lg`}>
            <div className="w-10 h-10 rounded-2xl bg-red-600/10 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <Clock size={20} />
            </div>
            <div>
              <p className="font-black text-xs uppercase">Reorder</p>
              <p className="text-[10px] text-neutral-500">Quick checkout</p>
            </div>
          </Link>
          <div className={`p-4 rounded-3xl border-2 ${cardBg} flex items-center gap-3 hover:border-red-500 transition-all group cursor-pointer shadow-lg`}>
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <CreditCard size={20} />
            </div>
            <div>
              <p className="font-black text-xs uppercase">Payments</p>
              <p className="text-[10px] text-neutral-500">2 cards saved</p>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-red-500 px-2">Order History</h3>
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className={`p-4 rounded-3xl border-2 ${cardBg} group hover:border-red-500 transition-all flex items-center justify-between shadow-lg`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                    <Package size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black text-sm uppercase">{order.id}</p>
                      <span className="bg-green-600/10 text-green-500 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">{order.status}</span>
                    </div>
                    <p className="text-xs font-bold text-neutral-500">{order.date} • {order.items}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <p className="font-black text-lg">{order.total}</p>
                  <ChevronRight size={18} className="text-neutral-700 group-hover:text-red-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
