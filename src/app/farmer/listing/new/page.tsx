'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';
import { Sprout, Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Check, Camera, Loader2, AlertCircle } from 'lucide-react';
import seedData from '@/data/agmarknet_seed_data.json';

export default function NewListingPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const { currentUser } = useAuth();

  const [step, setStep] = useState(1);
  const [selectedCrop, setSelectedCrop] = useState(seedData.crops[0].name);
  const [qualityGrade, setQualityGrade] = useState('Grade A');
  const [quantityKg, setQuantityKg] = useState<number>(500);
  const [harvestDate, setHarvestDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [customPrice, setCustomPrice] = useState<number>(22);
  const [useSuggested, setUseSuggested] = useState(true);
  const [loading, setLoading] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanResult, setScanResult] = useState<{ freshness: string; freshness_confidence: number; shelf_life: string; image_url: string } | null>(null);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const [aiPriceData, setAiPriceData] = useState<{
    suggested_price: number;
    mandi_modal: number;
    margin_benefit: string;
  }>({
    suggested_price: 24,
    mandi_modal: 24,
    margin_benefit: 'Farmer nets higher payout by selling direct.'
  });

  useEffect(() => {
    const fetchAiPrice = async () => {
      try {
        const res = await fetch(
          `/api/ai/suggest-price?crop_name=${encodeURIComponent(selectedCrop)}&grade=${encodeURIComponent(qualityGrade)}&region=Rewari`
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
  }, [selectedCrop, qualityGrade]);

  const handleScan = async (file?: File) => {
    if (!file) return;
    setScanLoading(true);
    setScanMessage(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/ai/scan-produce', { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok || result.status !== 'ok') {
        setScanMessage(result.detail || result.message || 'Unable to assess this photo.');
        return;
      }
      const matchingCrop = seedData.crops.find((crop) => crop.name.toLowerCase() === result.produce.toLowerCase());
      if (matchingCrop) setSelectedCrop(matchingCrop.name);
      setQualityGrade(result.quality_grade);
      setScanResult({
        freshness: result.freshness,
        freshness_confidence: result.freshness_confidence,
        shelf_life: result.shelf_life,
        image_url: URL.createObjectURL(file)
      });
    } catch {
      setScanMessage('Fresh Vision is unavailable. Start the AI service and try again.');
    } finally {
      setScanLoading(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      const selectedObj = seedData.crops.find((c) => c.name === selectedCrop);
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmer_id: currentUser?.id || 'usr_farmer_ramesh',
          crop_name: selectedCrop,
          quantity_kg: quantityKg,
          price_per_kg: useSuggested ? aiPriceData.suggested_price : customPrice,
          harvest_date: harvestDate,
          quality_grade: qualityGrade,
          // The in-memory demo store has no object storage; keep the existing
          // crop image rather than persisting a browser-only blob URL.
          image_url: selectedObj?.image,
          freshness: scanResult?.freshness,
          freshness_confidence: scanResult?.freshness_confidence,
          shelf_life: scanResult?.shelf_life
        })
      });

      if (res.ok) {
        const json = await res.json();
        setPublishedId(json.data.id);
        setStep(4); // Success step
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
      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        {[
          { num: 1, label: language === 'hi' ? '1. फसल चुनें' : '1. Crop' },
          { num: 2, label: language === 'hi' ? '2. मात्रा व ग्रेड' : '2. Quantity & Grade' },
          { num: 3, label: language === 'hi' ? '3. एआई मूल्य' : '3. AI Price' },
          { num: 4, label: language === 'hi' ? '4. प्रकाशित' : '4. Publish' }
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= s.num ? 'bg-brand-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {step > s.num ? <Check className="w-4 h-4" /> : s.num}
            </div>
            <span className={`text-xs font-semibold hidden sm:inline ${step >= s.num ? 'text-slate-900' : 'text-slate-400'}`}>
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
                    onClick={() => setSelectedCrop(crop.name)}
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

            <div className="rounded-2xl border border-dashed border-brand-300 bg-brand-50/50 p-4">
              <label className="flex cursor-pointer items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm"><Camera className="w-5 h-5" /></span>
                  <div><p className="text-sm font-bold text-slate-900">Fresh Vision quality scan</p><p className="text-xs text-slate-500">Upload a clear produce photo to set its quality grade.</p></div>
                </div>
                <span className="rounded-lg bg-brand-700 px-3 py-2 text-xs font-bold text-white">{scanLoading ? 'Scanning…' : 'Scan photo'}</span>
                <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" disabled={scanLoading} onChange={(event) => handleScan(event.target.files?.[0])} />
              </label>
              {scanLoading && <p className="mt-3 flex items-center gap-2 text-xs text-brand-800"><Loader2 className="h-4 w-4 animate-spin" /> Fresh Vision is checking freshness…</p>}
              {scanMessage && <p className="mt-3 flex items-center gap-2 text-xs text-rose-700"><AlertCircle className="h-4 w-4" /> {scanMessage}</p>}
              {scanResult && <div className="mt-3 flex items-center gap-3 rounded-xl bg-white p-3 text-xs"><img src={scanResult.image_url} alt="Scanned produce" className="h-12 w-12 rounded-lg object-cover" /><span><strong className="text-emerald-700">{scanResult.freshness}</strong> · {scanResult.freshness_confidence}% confidence<br />Estimated shelf life: {scanResult.shelf_life}. Quality grade updated automatically.</span></div>}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-4 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-900/10"
            >
              Next: Quantity & Quality Grade <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Quantity, Grade & Harvest Date */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {language === 'hi' ? 'मात्रा व गुणवत्ता ग्रेड' : 'Harvest Quantity & Quality Grade'}
              </h2>
              <p className="text-xs text-slate-500">
                Listing {selectedCropObj.name} ({selectedCropObj.hindi_name})
              </p>
            </div>

            <div className="space-y-4">
              {/* Quality Grade Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Quality Grade (गुणवत्ता श्रेणी)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'Grade A', label: 'Grade A', desc: 'Premium Export / Retail (+8%)', color: 'border-emerald-500 text-emerald-800 bg-emerald-50' },
                    { id: 'Grade B', label: 'Grade B', desc: 'Standard Kitchen Quality (Modal)', color: 'border-amber-500 text-amber-800 bg-amber-50' },
                    { id: 'Grade C', label: 'Grade C', desc: 'Processing / Puree (-10%)', color: 'border-rose-500 text-rose-800 bg-rose-50' }
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setQualityGrade(g.id)}
                      className={`p-3 rounded-2xl border-2 text-left transition ${
                        qualityGrade === g.id
                          ? `${g.color} ring-2 ring-brand-600/30 font-bold shadow-sm`
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <div className="font-bold text-sm">{g.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{g.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

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
                Next: AI Price Recommendation <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: AI Suggested Fair Price Panel */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {language === 'hi' ? 'एआई निष्पक्ष मूल्य सुझाव' : 'AI Price Recommendation'}
              </h2>
              <p className="text-xs text-slate-500">
                Based on real-time Agmarknet mandi data for Rewari & NCR cluster with {qualityGrade} adjustment.
              </p>
            </div>

            {/* AI Highlight Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-brand-800 text-white p-6 rounded-3xl shadow-lg space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-100">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  AGMARKNET BENCHMARK ANALYSIS
                </span>
                <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-white">{qualityGrade}</span>
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
                💡 <strong>Why this price:</strong> {aiPriceData.margin_benefit}
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
                onClick={() => setStep(2)}
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

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center py-8 space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">
                {language === 'hi' ? 'फसल सफलतापूर्वक प्रकाशित!' : 'Produce Listed Successfully!'}
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
                Your {selectedCrop} ({qualityGrade}) is now live on the KisanSetu marketplace at{' '}
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
