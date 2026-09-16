'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sprout, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  Building2, 
  Lock,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useStore';
import { INITIAL_USERS } from '@/lib/db/mock-data';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser, currentUser } = useAppStore();

  const [phoneInput, setPhoneInput] = useState('+91 98330 67890');
  const [otpInput, setOtpInput] = useState('1234');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleQuickLogin = (user: typeof INITIAL_USERS[0]) => {
    setCurrentUser(user);
    setLoginSuccess(true);
    setTimeout(() => {
      if (user.role === 'FARMER') {
        router.push('/farmer/dashboard');
      } else {
        router.push('/marketplace');
      }
    }, 800);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginSuccess(true);
    setTimeout(() => {
      router.push('/marketplace');
    }, 800);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md">
              <Sprout className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900 font-display tracking-tight">
              Khet<span className="text-emerald-600">Connect</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900 font-display">Sign In to Your Account</h2>
          <p className="text-xs text-slate-500">Fresh farm harvest direct from Pune growers</p>
        </div>

        {loginSuccess ? (
          <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2 animate-fade-in">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-emerald-950 font-display">Login Successful!</h3>
            <p className="text-xs text-emerald-800">Redirecting to platform...</p>
          </div>
        ) : (
          <>
            {/* Quick 1-Click Profile Test Options */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Quick 1-Click Access
              </p>
              
              <div className="space-y-2">
                {/* Option 1: Priya Sharma (Consumer) */}
                <button
                  onClick={() => handleQuickLogin(INITIAL_USERS[0])}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all hover:shadow-md ${
                    currentUser.id === INITIAL_USERS[0].id
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      🛒
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">Priya Sharma</p>
                      <p className="text-[11px] text-slate-500">Retail Consumer • Pune (Hadapsar)</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">
                    Consumer
                  </span>
                </button>

                {/* Option 2: Balasaheb Patil (Farmer) */}
                <button
                  onClick={() => handleQuickLogin(INITIAL_USERS[1])}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all hover:shadow-md ${
                    currentUser.id === INITIAL_USERS[1].id
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                      🌾
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">Balasaheb Patil</p>
                      <p className="text-[11px] text-slate-500">Farmer / FPO • Junnar, Pune</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                    Farmer Hub
                  </span>
                </button>

                {/* Option 3: Vikram (B2B Bulk Buyer) */}
                <button
                  onClick={() => handleQuickLogin(INITIAL_USERS[2])}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all hover:shadow-md ${
                    currentUser.id === INITIAL_USERS[2].id
                      ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-400/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                      🏢
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">Vikram Singhania (Taj Bistro)</p>
                      <p className="text-[11px] text-slate-500">B2B Bulk Procurement • Hinjewadi</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-purple-600 text-white font-bold px-2 py-0.5 rounded-full">
                    B2B Buyer
                  </span>
                </button>
              </div>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-2 text-slate-400 font-bold">Or Mobile OTP Login</span>
              </div>
            </div>

            {/* Mobile OTP Form */}
            {!isOtpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="+91 98330 67890"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow transition-all"
                >
                  Send OTP Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enter 4-Digit OTP</label>
                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="1234"
                    maxLength={4}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-sm font-mono font-bold tracking-widest focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                  <p className="text-[10px] text-emerald-700 mt-1 font-medium">OTP sent to {phoneInput} (Demo code: 1234)</p>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow transition-all"
                >
                  Verify & Sign In
                </button>
              </form>
            )}
          </>
        )}

      </div>
    </div>
  );
}
