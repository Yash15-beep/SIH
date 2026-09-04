'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';
import { Sprout, Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Share2, Info } from 'lucide-react';
import seedData from '@/data/agmarknet_seed_data.json';

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

  const [aiPriceData, setAiPriceData] = useState<{
    suggested_price: number;
    mandi_modal: number;
    margin_benefit: string;
  }>({
    suggested_price: 22,
    mandi_modal: 24,
    margin_benefit: 'Farmer nets higher payout by selling direct.'
  });

  useEffect(() => {
    // Fetch AI suggested price whenever crop changes
    const fetchAiPrice = async () => {
      try {
        const res = await fetch(`/api/ai/suggest-price?crop_name=${encodeURIComponent(selectedCrop)}&region=Rewari`);
        if (res.ok) {
          const json = await res.json();
          setAiPriceData(json.data);
          setCustomPrice(json.data.suggested_price);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchAiPrice();
  }, [selectedCrop]);

  const handlePublish = async () => {
    setLoading(true);
    try {
      const selectedObj = seedData.crops.find(c => c.name === selectedCrop);
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmer_id: currentUser?.id || 'usr_farmer_ramesh',
          crop_name: selectedCrop,
          quantity_kg: quantityKg,
          price_per_kg: useSuggested ? aiPriceData.suggested_price : customPrice,
          harvest_date: harvestDate,
          image_url: selectedObj?.image
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

  const selectedCropObj = seedData.crops.find(c => c.name === selectedCrop) || seedData.crops[0];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        {[
          { num: 1, label: language === 'hi' ? '1. फसल चुनें' : '1. Crop' },
          { num: 2, label: language === 'hi' ? '2. मात्रा व तारीख' : '2. Quantity' },
          { num: 3, label: language === 'hi' ? '3. एआई मूल्य' : '3. AI Price' },
          { num: 4, label: language === 'hi' ? '4. प्रकाशित' : '4. Publish' }
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= s.num ? 'bg-brand-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
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

            <button
              onClick={() => setStep(2)}
              className="w-full py-4 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-900/10"
            >
              Next: Enter Quantity <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Quantity & Harvest Date */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {language === 'hi' ? 'मात्रा व कटाई की तारीख' : 'Harvest Quantity & Date'}
              </h2>
              <p className="text-xs text-slate-500">
                Listing {selectedCropObj.name} ({selectedCropObj.hindi_name})
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
                Based on real-time Agmarknet mandi data for Rewari & NCR cluster.
              </p>
            </div>

            {/* AI Highlight Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-brand-800 text-white p-6 rounded-3xl shadow-lg space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-100">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  AGMARKNET BENCHMARK ANALYSIS
                </span>
                <span>Today's Rate</span>
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
                    <div className="font-bold text-slate-900 text-sm">Set My Own Price (अपना भाव तय करें)</div>
                    <div className="text-xs text-slate-500">Custom pricing according to your produce grade</div>
                  </div>
                </div>

                {!useSuggested && (
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                    <span className="text-xs font-bold text-slate-700">₹</span>
                    <input
                      type="number"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(Number(e.target.value))}
                      className="w-32 p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-brand-600"
                    />
                    <span className="text-xs text-slate-500">/kg</span>
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
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg transition"
              >
                {loading ? 'Publishing...' : 'Publish Produce to Marketplace (प्रकाशित करें)'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success & Share Screen */}
        {step === 4 && (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900">
                {language === 'hi' ? 'आपकी फसल सफलतापूर्वक लिस्ट हो गई है!' : 'Your Produce is Live on KisanSetu!'}
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Your <strong>{quantityKg} kg {selectedCrop}</strong> is now visible to thousands of consumers and bulk buyers across Delhi NCR.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span>Commodity:</span>
                <strong>{selectedCrop}</strong>
              </div>
              <div className="flex justify-between">
                <span>Listing Price:</span>
                <strong className="text-brand-700">₹{useSuggested ? aiPriceData.suggested_price : customPrice}/kg</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Expected Payout:</span>
                <strong className="text-slate-900">₹{quantityKg * (useSuggested ? aiPriceData.suggested_price : customPrice)}</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(`${window.location.origin}/marketplace/${publishedId}`);
                    alert('WhatsApp shareable link copied to clipboard!');
                  }
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <Share2 className="w-4 h-4" /> Share on WhatsApp (व्हाट्सएप शेयर)
              </button>

              <button
                onClick={() => router.push('/farmer/dashboard')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
