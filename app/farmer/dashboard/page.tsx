'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sprout, 
  Mic, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Tag, 
  Volume2, 
  Camera, 
  Play, 
  MapPin, 
  TrendingDown,
  Lock,
  ArrowRight,
  UserCheck,
  Store
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useStore';
import { VERNACULAR_PRESETS, parseSpeechToProduceListing, VoicePreset } from '@/lib/services/vernacular-voice';
import { INITIAL_USERS } from '@/lib/db/mock-data';
import confetti from 'canvas-confetti';

export default function FarmerDashboardPage() {
  const { produces, addProduce, currentUser, setCurrentUser } = useAppStore();

  const isFarmer = currentUser.role === 'FARMER';

  // Voice Listing State
  const [selectedVoicePreset, setSelectedVoicePreset] = useState<VoicePreset>(VERNACULAR_PRESETS[0]);
  const [isSimulatingAudio, setIsSimulatingAudio] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState(0);
  const [audioTranscript, setAudioTranscript] = useState('');
  const [customVoiceInput, setCustomVoiceInput] = useState('');

  // Produce Form State
  const [formData, setFormData] = useState({
    cropName: 'Nashik Red Onions (Garwa)',
    category: 'VEGETABLES' as any,
    variety: 'Garwa / Gavran Red',
    quantityKg: 1500,
    minOrderQuantityKg: 5,
    basePricePerKg: 36.1,
    locationName: 'Manchar, Pune, Maharashtra',
    state: 'Maharashtra',
    district: 'Pune',
    shelfLifeDays: 60,
    imageQualityScore: 96.0,
    qualityGrade: 'Grade A Select',
    organicCertified: false,
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&h=450&fit=crop',
  });

  // Photo AI Grading State
  const [isScanningPhoto, setIsScanningPhoto] = useState(false);
  const [aiScanResult, setAiScanResult] = useState<{
    freshnessScore: number;
    grade: string;
    defects: string;
    shelfLifeEstimateDays: number;
  } | null>({
    freshnessScore: 97,
    grade: 'Grade A Export Standard',
    defects: 'Zero bruising, optimal skin moisture <12%',
    shelfLifeEstimateDays: 60,
  });

  const [formSuccessMessage, setFormSuccessMessage] = useState(false);

  // Farmer's own listings
  const myProduces = produces.filter((p) => p.farmerId === currentUser.id || p.farmerName.includes('Balasaheb'));

  const handlePlayVoiceSimulation = (preset: VoicePreset) => {
    setSelectedVoicePreset(preset);
    setIsSimulatingAudio(true);
    setVoiceProgress(0);
    setAudioTranscript('');

    const interval = setInterval(() => {
      setVoiceProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulatingAudio(false);
          setAudioTranscript(preset.audioPrompt);
          
          const parsed = preset.expectedResult;
          setFormData((prevForm) => ({
            ...prevForm,
            cropName: parsed.cropName,
            category: parsed.category,
            variety: parsed.variety,
            quantityKg: parsed.quantityKg,
            basePricePerKg: parsed.basePricePerKg,
            locationName: parsed.locationName,
            shelfLifeDays: parsed.shelfLifeDays,
          }));

          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleCustomVoiceSubmit = () => {
    if (!customVoiceInput.trim()) return;
    const parsed = parseSpeechToProduceListing(customVoiceInput);
    setAudioTranscript(customVoiceInput);
    setFormData((prevForm) => ({
      ...prevForm,
      cropName: parsed.cropName,
      category: parsed.category,
      variety: parsed.variety,
      quantityKg: parsed.quantityKg,
      basePricePerKg: parsed.basePricePerKg,
      locationName: parsed.locationName,
      shelfLifeDays: parsed.shelfLifeDays,
    }));
    setCustomVoiceInput('');
  };

  const handleScanPhoto = () => {
    setIsScanningPhoto(true);
    setTimeout(() => {
      setIsScanningPhoto(false);
      const score = Math.floor(93 + Math.random() * 6);
      setAiScanResult({
        freshnessScore: score,
        grade: score >= 95 ? 'Grade A Export Standard' : 'Grade A Farm Fresh',
        defects: 'Zero mold, uniform coloration, high moisture retention',
        shelfLifeEstimateDays: formData.shelfLifeDays || 30,
      });
      setFormData((prev) => ({ ...prev, imageQualityScore: score }));
    }, 1200);
  };

  const handlePublishListing = (e: React.FormEvent) => {
    e.preventDefault();
    addProduce({
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      farmerFpo: 'Shivneri Farmer Producer Co.',
      cropName: formData.cropName,
      variety: formData.variety,
      category: formData.category,
      quantityKg: Number(formData.quantityKg),
      minOrderQuantityKg: Number(formData.minOrderQuantityKg),
      basePricePerKg: Number(formData.basePricePerKg),
      bigBasketPricePerKg: Math.round(Number(formData.basePricePerKg) * 1.05 * 10) / 10,
      instamartPricePerKg: Math.round(Number(formData.basePricePerKg) * 1.10 * 10) / 10,
      harvestDate: new Date().toISOString().split('T')[0],
      shelfLifeDays: Number(formData.shelfLifeDays),
      locationLat: 19.0067,
      locationLng: 73.9392,
      locationName: formData.locationName,
      state: formData.state,
      district: formData.district,
      imageQualityScore: formData.imageQualityScore,
      qualityGrade: formData.qualityGrade,
      organicCertified: formData.organicCertified,
      imageUrl: formData.imageUrl,
      status: 'AVAILABLE',
    });

    setFormSuccessMessage(true);
    setTimeout(() => setFormSuccessMessage(false), 4000);

    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
    } catch (err) {}
  };

  // If NOT logged in as a Farmer, show specific restricted message and button to switch to Farmer account
  if (!isFarmer) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-2xl shadow-inner">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full uppercase">
              Farmer-Exclusive Listing Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Produce Listing is Reserved for Farmers
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              You are currently logged in as <strong>{currentUser.name} (Consumer / Buyer)</strong>. Produce listing, voice input, and harvest management tools are strictly available for registered farmers and FPOs.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setCurrentUser(INITIAL_USERS[1])}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <UserCheck className="w-4 h-4" />
              Switch to Balasaheb Patil (Farmer Login)
            </button>

            <Link
              href="/marketplace"
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Store className="w-4 h-4" />
              Go to Consumer Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Farmer Logged In: Full Listing View
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner: Farmer Profile */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow-md">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-400/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-400/40">
                Farmer Listing Hub Active • Shivneri FPO
              </span>
              <span className="text-xs text-emerald-200">Kisan ID: #PUNE-9821</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display mt-0.5">{currentUser.name}</h1>
            <p className="text-xs text-emerald-200">
              Farm: 12.5 Acres in Junnar & Manchar, Pune • Crops: Onions, Tomatoes, Wheat, Grapes
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15 text-left">
            <p className="text-[10px] uppercase font-bold text-emerald-300">Active Listings</p>
            <p className="text-xl font-extrabold text-white font-display">{myProduces.length} Batches</p>
            <p className="text-[10px] text-emerald-200">Ready for pickup</p>
          </div>
          <div className="bg-emerald-500/20 backdrop-blur-md px-4 py-3 rounded-2xl border border-emerald-400/30 text-left">
            <p className="text-[10px] uppercase font-bold text-amber-300">Quality Rating</p>
            <p className="text-xl font-extrabold text-amber-300 font-display">97.8%</p>
            <p className="text-[10px] text-emerald-200">Grade A Certified</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Fast Listing with Voice + AI Inspection Form */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Vernacular Voice Input Simulation */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <Mic className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 font-display">Farmer Voice-to-Listing</h2>
                  <p className="text-xs text-slate-500">Speak or select sample vernacular audio in Marathi / Hindi</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                Farmer Tool
              </span>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-700">Select Audio Prompt Simulation:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {VERNACULAR_PRESETS.slice(0, 2).map((preset) => {
                  const isSelected = selectedVoicePreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handlePlayVoiceSimulation(preset)}
                      className={`p-2.5 rounded-xl text-left border text-xs transition-all flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-emerald-700 block">{preset.language}</span>
                        <p className="text-xs font-medium text-slate-800 line-clamp-1">{preset.label}</p>
                      </div>
                      <Play className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-1" />
                    </button>
                  );
                })}
              </div>
            </div>

            {isSimulatingAudio && (
              <div className="p-3 bg-slate-900 text-white rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Volume2 className="w-4 h-4 animate-bounce" />
                    Listening to Farmer Audio ({selectedVoicePreset.language})...
                  </span>
                  <span className="font-mono text-xs">{voiceProgress}%</span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full transition-all duration-300"
                    style={{ width: `${voiceProgress}%` }}
                  />
                </div>
              </div>
            )}

            {audioTranscript && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-emerald-800 uppercase">
                  <span>Detected Audio Transcript</span>
                  <span className="text-emerald-700">96% NLP Confidence</span>
                </div>
                <p className="text-xs text-slate-800 font-medium italic">"{audioTranscript}"</p>
                <p className="text-[10px] text-emerald-700 font-bold pt-1">
                  ✨ Listing fields automatically extracted and populated below!
                </p>
              </div>
            )}

            {/* Custom Input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Or type natural prompt (e.g. '1500 kg Nashik Onions ready at 36 rs/kg')..."
                value={customVoiceInput}
                onChange={(e) => setCustomVoiceInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCustomVoiceSubmit()}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleCustomVoiceSubmit}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Parse
              </button>
            </div>
          </div>

          {/* Listing Form */}
          <form onSubmit={handlePublishListing} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 font-display">Farmer Produce Listing Form</h2>
              <span className="text-xs text-slate-500">Pune Regional Catalog</span>
            </div>

            {formSuccessMessage && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Produce listed directly to KhetConnect marketplace!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Crop Name</label>
                <input
                  type="text"
                  value={formData.cropName}
                  onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Variety</label>
                <input
                  type="text"
                  value={formData.variety}
                  onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Available Quantity (kg)</label>
                <input
                  type="number"
                  value={formData.quantityKg}
                  onChange={(e) => setFormData({ ...formData, quantityKg: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Direct Price (₹ / kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.basePricePerKg}
                  onChange={(e) => setFormData({ ...formData, basePricePerKg: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-emerald-50 border border-emerald-300 rounded-xl font-mono font-extrabold text-emerald-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Farm Location</label>
                <input
                  type="text"
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* AI Crop Quality Inspection Scanner */}
            <div className="border border-slate-200 bg-slate-50/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-800 text-xs">AI Freshness & Grade Scanner</span>
                </div>
                <button
                  type="button"
                  onClick={handleScanPhoto}
                  disabled={isScanningPhoto}
                  className="px-3 py-1 bg-white border border-slate-300 hover:border-emerald-500 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isScanningPhoto ? 'Scanning...' : 'Scan Harvest Photo'}
                </button>
              </div>

              {aiScanResult && (
                <div className="bg-white p-3 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-1.5 bg-emerald-50 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">Freshness Score</span>
                    <strong className="text-emerald-700 font-extrabold text-sm">{aiScanResult.freshnessScore}%</strong>
                  </div>
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">Quality Grade</span>
                    <strong className="text-blue-700 font-bold text-xs">{aiScanResult.grade.split(' ')[0]} {aiScanResult.grade.split(' ')[1]}</strong>
                  </div>
                  <div className="p-1.5 bg-amber-50 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">Defects</span>
                    <strong className="text-amber-800 font-bold text-xs">&lt; 1% (Pass)</strong>
                  </div>
                  <div className="p-1.5 bg-purple-50 rounded-lg">
                    <span className="text-[10px] text-slate-500 block">Shelf Life</span>
                    <strong className="text-purple-800 font-bold text-xs">{aiScanResult.shelfLifeEstimateDays} Days</strong>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              Publish Produce Batch to Marketplace
            </button>
          </form>

        </div>

        {/* Right Col: Active Listings */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-display">My Active Farm Listings</h3>
              <span className="text-xs text-slate-500 font-mono">{myProduces.length} active</span>
            </div>

            <div className="space-y-3">
              {myProduces.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.imageUrl}
                      alt={prod.cropName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <p className="font-bold text-xs text-slate-900">{prod.cropName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {prod.quantityKg.toLocaleString()}kg • ₹{prod.basePricePerKg}/kg
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      {prod.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">Freshness {prod.freshnessScore}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
