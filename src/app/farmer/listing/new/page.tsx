'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';
import {
  Sprout, Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Camera,
  Upload, Scan, ShieldCheck, Award, AlertCircle, Clock, Check
} from 'lucide-react';
import seedData from '@/data/agmarknet_seed_data.json';

interface ScanResult {
  crop: string;
  quality_grade: string;
  quality_grade_code: string;
  grade_description: string;
  freshness_score_pct: number;
  defect_blemish_pct: number;
  fresh_vs_stale_status: string;
  estimated_shelf_life_days: number;
  price_adjustment: string;
  accent_color: string;
}

export default function NewListingPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const { currentUser } = useAuth();

  const [step, setStep] = useState(1);
  const [selectedCrop, setSelectedCrop] = useState(seedData.crops[0].name);
  const [quantityKg, setQuantityKg] = useState<number>(500);
  const [harvestDate, setHarvestDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [customPrice, setCustomPrice] = useState<number>(22);
  const [useSuggested, setUseSuggested] = useState(true);
  const [loading, setLoading] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);

  // Photo Scan State
  const [photoUrl, setPhotoUrl] = useState<string>(seedData.crops[0].image);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>({
    crop: seedData.crops[0].name,
    quality_grade: 'Grade A',
    quality_grade_code: 'A',
    grade_description: 'Premium Export Quality (Export/Retail-Ready)',
    freshness_score_pct: 95.6,
    defect_blemish_pct: 1.4,
    fresh_vs_stale_status: 'Fresh',
    estimated_shelf_life_days: 8,
    price_adjustment: '+8% Premium',
    accent_color: '#10B981'
  });

  const [aiPriceData, setAiPriceData] = useState<{
    suggested_price: number;
    mandi_modal: number;
    margin_benefit: string;
  }>({
    suggested_price: 24,
    mandi_modal: 24,
    margin_benefit: 'Farmer nets higher payout by selling direct.'
  });

  // Whenever crop or scanResult changes, recalculate AI price
  useEffect(() => {
    const fetchAiPrice = async () => {
      try {
        const gradeParam = scanResult ? scanResult.quality_grade : 'Grade A';
        const res = await fetch(
          `/api/ai/suggest-price?crop_name=${encodeURIComponent(selectedCrop)}&grade=${encodeURIComponent(gradeParam)}&region=Rewari`
        );
        if (res.ok) {
          const json = await res.json();
          const pData = json.data;
          setAiPriceData({
            suggested_price: pData.recommended_fair_price || pData.suggested_price,
            mandi_modal: pData.mandi_benchmark || pData.mandi_modal,
            margin_benefit: pData.margin_benefit || 'Direct platform price eliminates middleman commission.'
          });
          setCustomPrice(pData.recommended_fair_price || pData.suggested_price);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchAiPrice();
  }, [selectedCrop, scanResult?.quality_grade]);

  // Handle Photo Upload & Run CV Freshness Scan
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Url = reader.result as string;
      setPhotoUrl(base64Url);
      await runProduceScan(base64Url);
    };
    reader.readAsDataURL(file);
  };

  const runProduceScan = async (imgData?: string) => {
    setScanning(true);
    try {
      const res = await fetch('/api/ai/scan-produce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: selectedCrop,
          image: imgData || photoUrl,
          harvest_date: harvestDate
        })
      });

      if (res.ok) {
        const json = await res.json();
        setScanResult(json.data);
      }
    } catch (e) {
      console.error('Scan error:', e);
    } finally {
      // Small intentional delay for scanning animation feel
      setTimeout(() => setScanning(false), 800);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmer_id: currentUser?.id || 'usr_farmer_ramesh',
          crop_name: selectedCrop,
          quantity_kg: quantityKg,
          price_per_kg: useSuggested ? aiPriceData.suggested_price : customPrice,
          harvest_date: harvestDate,
          quality_grade: scanResult?.quality_grade || 'Grade A',
          image_url: photoUrl
        })
      });

      if (res.ok) {
        const json = await res.json();
        setPublishedId(json.data.id);
        setStep(5); // Success step
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectedCropObj = seedData.crops.find((c) => c.name === selectedCrop) || seedData.crops[0];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        {[
          { num: 1, label: language === 'hi' ? '1. फसल चुनें' : '1. Crop' },
          { num: 2, label: language === 'hi' ? '2. फोटो व ग्रेड' : '2. Photo & Grade' },
          { num: 3, label: language === 'hi' ? '3. मात्रा व तारीख' : '3. Quantity' },
          { num: 4, label: language === 'hi' ? '4. एआई मूल्य' : '4. AI Price' },
          { num: 5, label: language === 'hi' ? '5. प्रकाशित' : '5. Publish' }
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= s.num ? 'bg-brand-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {step > s.num ? <Check className="w-4 h-4" /> : s.num}
            </div>
            <span
              className={`text-xs font-semibold hidden md:inline ${
                step >= s.num ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
        {/* Step 1: Select Crop */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {language === 'hi' ? 'फसल चुनें (Select Crop)' : 'Select Your Produce'}
              </h2>
              <p className="text-xs text-slate-500">
                Choose the commodity you are listing from your harvest.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {seedData.crops.map((crop) => {
                const isSelected = selectedCrop === crop.name;
                return (
                  <button
                    key={crop.name}
                    type="button"
                    onClick={() => {
                      setSelectedCrop(crop.name);
                      setPhotoUrl(crop.image);
                      runProduceScan(crop.image);
                    }}
                    className={`p-4 rounded-2xl border-2 text-left flex flex-col items-center text-center gap-3 transition ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/80 shadow-md ring-2 ring-brand-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <img src={crop.image} alt={crop.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{crop.name}</div>
                      <div className="text-xs text-slate-500">{crop.hindi_name}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setStep(2);
                if (!scanResult) runProduceScan();
              }}
              className="w-full py-4 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-900/10"
            >
              Next: Upload Photo & AI Freshness Scan <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Photo Upload & Computer Vision Freshness Scan */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold mb-1">
                  <Scan className="w-3.5 h-3.5 text-emerald-700" />
                  Kaggle Fresh & Stale Classification Engine
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {language === 'hi' ? 'फसल की फोटो व ताज़गी स्कैन' : 'Produce Photo & AI Freshness Scan'}
                </h2>
                <p className="text-xs text-slate-500">
                  Upload or snap a photo of your {selectedCropObj.name} to detect freshness and assign Grade A, B, or C.
                </p>
              </div>
            </div>

            {/* Photo & Scanner Viewport */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-300 bg-slate-950 aspect-square flex items-center justify-center shadow-inner">
                <img
                  src={photoUrl}
                  alt={selectedCrop}
                  className="w-full h-full object-cover"
                />

                {/* AI Laser Scan Sweep Animation */}
                {scanning && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] animate-bounce absolute top-0 bottom-0 m-auto"></div>
                    <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="bg-slate-900/90 text-white text-xs font-bold px-4 py-2 rounded-full border border-emerald-400 shadow-xl flex items-center gap-2 animate-pulse">
                        <Scan className="w-4 h-4 text-emerald-400 animate-spin" />
                        Scanning Blemishes & Freshness...
                      </div>
                    </div>
                  </div>
                )}

                {/* Grade Badge Overlay */}
                {!scanning && scanResult && (
                  <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white text-xs font-bold shadow-lg flex items-center gap-1.5">
                    <Award className="w-4 h-4" style={{ color: scanResult.accent_color }} />
                    <span style={{ color: scanResult.accent_color }}>{scanResult.quality_grade}</span>
                  </div>
                )}
              </div>

              {/* Upload & Trigger Controls */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center bg-slate-50/70 hover:bg-slate-50 transition">
                  <Upload className="w-8 h-8 text-brand-600 mx-auto mb-2" />
                  <label className="cursor-pointer">
                    <span className="text-xs font-bold text-brand-700 hover:text-brand-800 bg-white px-3 py-1.5 rounded-lg border border-brand-200 shadow-sm inline-block">
                      Choose Photo / Camera
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Supports JPG, PNG, WEBP from your phone camera or gallery.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => runProduceScan()}
                  disabled={scanning}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  <Scan className="w-4 h-4 text-emerald-400" />
                  {scanning ? 'Analyzing Produce...' : 'Re-Scan Freshness'}
                </button>
              </div>
            </div>

            {/* AI Freshness Scan Output Card */}
            {scanResult && !scanning && (
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="text-[11px] text-slate-400 font-semibold uppercase">Computer Vision Analysis</div>
                    <div className="text-lg font-black flex items-center gap-2">
                      <span style={{ color: scanResult.accent_color }}>{scanResult.quality_grade}</span>
                      <span className="text-xs font-normal text-slate-300">({scanResult.grade_description})</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                      {scanResult.price_adjustment}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Freshness</div>
                    <div className="text-lg font-black text-emerald-400 mt-0.5">{scanResult.freshness_score_pct}%</div>
                    <div className="text-[9px] text-slate-400">Class: {scanResult.fresh_vs_stale_status}</div>
                  </div>

                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Defects</div>
                    <div className="text-lg font-black text-amber-400 mt-0.5">{scanResult.defect_blemish_pct}%</div>
                    <div className="text-[9px] text-slate-400">Surface Spots</div>
                  </div>

                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Shelf Life</div>
                    <div className="text-lg font-black text-blue-400 mt-0.5">{scanResult.estimated_shelf_life_days} Days</div>
                    <div className="text-[9px] text-slate-400">Estimated Duration</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-4 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-full py-4 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-900/10"
              >
                Next: Enter Quantity <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Quantity & Harvest Date */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {language === 'hi' ? 'मात्रा व कटाई की तारीख' : 'Harvest Quantity & Date'}
              </h2>
              <p className="text-xs text-slate-500">
                Listing {selectedCropObj.name} ({selectedCropObj.hindi_name}) • {scanResult?.quality_grade}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Total Quantity (kg)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(Number(e.target.value))}
                    min={10}
                    step={10}
                    className="w-full p-4 rounded-xl border border-slate-300 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    {[100, 500, 1000].map((quick) => (
                      <button
                        key={quick}
                        type="button"
                        onClick={() => setQuantityKg(quick)}
                        className="px-3 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800"
                      >
                        +{quick}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Harvest Date (ताज़ा कटाई तारीख)
                </label>
                <input
                  type="date"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-4 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="w-full py-4 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-900/10"
              >
                Next: AI Price Recommendation <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: AI Suggested Fair Price Panel */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {language === 'hi' ? 'एआई निष्पक्ष मूल्य सुझाव' : 'AI Price Recommendation'}
              </h2>
              <p className="text-xs text-slate-500">
                Calculated dynamically using Agmarknet Mandi Rates + {scanResult?.quality_grade} Premium.
              </p>
            </div>

            {/* AI Highlight Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-brand-800 text-white p-6 rounded-3xl shadow-lg space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-100">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  AGMARKNET BENCHMARK + CV GRADING
                </span>
                <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-white">{scanResult?.quality_grade}</span>
              </div>

              <div className="flex items-end justify-between border-b border-emerald-400/40 pb-4">
                <div>
                  <div className="text-xs text-emerald-100 font-medium">Recommended Direct Price</div>
                  <div className="text-4xl font-extrabold text-white tracking-tight">
                    ₹{aiPriceData.suggested_price} <span className="text-sm font-normal text-emerald-200">/kg</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-emerald-200">Local Mandi Modal Rate:</div>
                  <div className="text-lg font-bold text-amber-300">₹{aiPriceData.mandi_modal} /kg</div>
                </div>
              </div>

              <div className="text-xs text-emerald-50 leading-relaxed bg-brand-900/40 p-3 rounded-xl border border-emerald-400/30">
                💡 <strong>Why this price:</strong> {aiPriceData.margin_benefit} Includes{' '}
                <strong className="text-amber-300">{scanResult?.price_adjustment}</strong> based on camera freshness scan.
              </div>
            </div>

            {/* Price Decision Toggle */}
            <div className="space-y-3 pt-2">
              <label
                onClick={() => setUseSuggested(true)}
                className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${
                  useSuggested ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={useSuggested}
                    onChange={() => setUseSuggested(true)}
                    className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Accept AI Suggested Price (अनुशंसित दर)</div>
                    <div className="text-xs text-slate-500">List at ₹{aiPriceData.suggested_price} /kg for fastest direct discovery</div>
                  </div>
                </div>
                <span className="font-extrabold text-brand-700 text-base">₹{aiPriceData.suggested_price}/kg</span>
              </label>

              <label
                onClick={() => setUseSuggested(false)}
                className={`p-4 rounded-2xl border-2 flex flex-col gap-3 cursor-pointer transition ${
                  !useSuggested ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={!useSuggested}
                    onChange={() => setUseSuggested(false)}
                    className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Set Custom Price (अपनी इच्छा का मूल्य)</div>
                    <div className="text-xs text-slate-500">Manually override the AI recommended fair price</div>
                  </div>
                </div>
                {!useSuggested && (
                  <div className="pl-7 pt-2 flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-700">₹</span>
                    <input
                      type="number"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(Number(e.target.value))}
                      step={0.5}
                      className="w-32 p-2 rounded-lg border border-slate-300 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-brand-600"
                    />
                    <span className="text-xs text-slate-500">per kg</span>
                  </div>
                )}
              </label>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="py-4 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-900/10 disabled:opacity-50"
              >
                {loading ? 'Publishing Listing...' : 'Publish to Marketplace 🚀'}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Success & Live Confirmation */}
        {step === 5 && (
          <div className="text-center py-8 space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">
                {language === 'hi' ? 'फसल सफलतापूर्वक प्रकाशित!' : 'Produce Listed Successfully!'}
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
                Your {selectedCrop} ({scanResult?.quality_grade}) is now live on the KisanSetu marketplace at{' '}
                <strong className="text-brand-700">₹{useSuggested ? aiPriceData.suggested_price : customPrice}/kg</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => router.push('/marketplace')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md"
              >
                View on Marketplace
              </button>
              <button
                onClick={() => router.push('/farmer/dashboard')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm"
              >
                Go to Farmer Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
