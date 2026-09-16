'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sprout, 
  ShoppingCart, 
  Truck, 
  BarChart3, 
  Store, 
  UserCircle2, 
  ShieldCheck, 
  ChevronDown,
  Sparkles,
  LogIn
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useStore';
import { INITIAL_USERS } from '@/lib/db/mock-data';

export default function Navbar() {
  const pathname = usePathname();
  const { 
    currentUser, 
    setCurrentUser,
    cart, 
    setIsCartOpen 
  } = useAppStore();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const totalCartKg = cart.reduce((sum, item) => sum + item.quantityKg, 0);

  const navLinks = [
    { name: 'Marketplace', href: '/marketplace', icon: Store },
    { name: 'Farmer Hub', href: '/farmer/dashboard', icon: Sprout },
    { name: 'Pune Logistics Map', href: '/logistics/dispatch', icon: Truck },
    { name: 'Onion 30-Day Forecast', href: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all shadow-sm">
      {/* Top Banner: Local Market Benchmark Notice */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center justify-center bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
              KHETCONNECT PUNE
            </span>
            <span>🌱 Farm-Fresh Harvest from Pune & Maharashtra Growers • <strong>Guaranteed 5% Lower than Local Retail Markets</strong></span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-emerald-200/90 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Pune Mandi Rates Sync
            </span>
            <span>Customer Helpline: 1800-KHET-CONNECT</span>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-slate-900 font-display tracking-tight">Khet<span className="text-emerald-600">Connect</span></span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.5 rounded border border-emerald-200">
                  Pune Hub
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium -mt-0.5 tracking-wide">Direct Farm Harvest & B2B Supply</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/60 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Hub: User Profile, Cart */}
          <div className="flex items-center gap-2.5">
            
            {/* User Profile Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 shadow-sm transition-all"
              >
                <span className="text-base">{currentUser.role === 'FARMER' ? '🌾' : currentUser.role === 'BUYER_BULK' ? '🏢' : '🛒'}</span>
                <span className="font-bold">{currentUser.name.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Current User Account</p>
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500">{currentUser.role === 'FARMER' ? 'Farmer / Producer' : 'Consumer • Pune'}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="px-3 pt-1 text-[10px] uppercase font-bold text-slate-400">Switch Account</p>
                    
                    {/* Priya (Consumer) */}
                    <button
                      onClick={() => {
                        setCurrentUser(INITIAL_USERS[0]);
                        setIsProfileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                        currentUser.id === INITIAL_USERS[0].id ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>🛒</span>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">Priya Sharma</p>
                          <p className="text-[10px] text-slate-500">Retail Consumer</p>
                        </div>
                      </div>
                      {currentUser.id === INITIAL_USERS[0].id && <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded">Active</span>}
                    </button>

                    {/* Balasaheb (Farmer) */}
                    <button
                      onClick={() => {
                        setCurrentUser(INITIAL_USERS[1]);
                        setIsProfileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                        currentUser.id === INITIAL_USERS[1].id ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>🌾</span>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">Balasaheb Patil</p>
                          <p className="text-[10px] text-slate-500">Farmer / FPO</p>
                        </div>
                      </div>
                      {currentUser.id === INITIAL_USERS[1].id && <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded">Active</span>}
                    </button>

                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <Link
                        href="/login"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-slate-700 hover:bg-slate-100 font-medium"
                      >
                        <LogIn className="w-3.5 h-3.5 text-slate-500" />
                        Full Login Page
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-transform active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalCartKg > 0 && (
                <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-1.5 py-0.2 rounded-full shadow-sm ml-0.5">
                  {totalCartKg}kg
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-200 backdrop-blur-md px-2 py-1.5 flex justify-around shadow-lg">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center py-1 px-3 rounded-lg text-[11px] font-semibold transition-colors ${
                isActive ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{link.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
