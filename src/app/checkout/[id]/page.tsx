'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { useAuth } from '@/lib/auth-context';
import { Listing } from '@/types';
import { ShoppingBag, ShieldCheck, MapPin, Sparkles, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const { currentUser } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [quantity, setQuantity] = useState<number>(5);
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${params.id}`);
        if (res.ok) {
          const json = await res.json();
          setListing(json.data);
          // Set default address from currentUser if present
          if (currentUser?.village) {
            setDeliveryAddress(currentUser.village);
          } else {
            setDeliveryAddress('Flat 402, Oakwood Apts, Sector 56, Gurugram');
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchListing();
    }
  }, [params.id, currentUser]);

  const handlePay = async () => {
    if (!listing) return;
    setProcessing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listing.id,
          buyer_id: currentUser?.id || 'usr_consumer_priya',
          quantity_kg: quantity,
          delivery_address: deliveryAddress
        })
      });

      if (res.ok) {
        const json = await res.json();
        setCompletedOrderId(json.data.id);
        setOrderComplete(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-slate-500">Loading checkout...</div>;
  }

  if (!listing) {
    return <div className="p-16 text-center text-slate-500">Listing not found.</div>;
  }

  const subtotal = quantity * listing.price_per_kg;
  const directLogistics = 25; // minimal direct handling
  const total = subtotal + directLogistics;

  const estimatedMandiRetail = quantity * ((listing.mandi_benchmark_price || listing.price_per_kg) * 1.8);
  const savings = Math.max(0, Math.round(estimatedMandiRetail - total));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {!orderComplete ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Direct Farm Checkout (आर्डर करें)</h1>
              <p className="text-xs text-slate-500">Ordering direct from {listing.farmer_name} • Zero retail markup</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Product & Quantity */}
            <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src={listing.image_url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200'}
                  alt={listing.crop_name}
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{listing.crop_name}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {listing.farmer_village}
                  </div>
                  <div className="text-base font-black text-brand-700 mt-1">
                    ₹{listing.price_per_kg} <span className="text-xs text-slate-500 font-normal">/kg</span>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Quantity (kg)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(listing.quantity_kg, Math.max(1, Number(e.target.value))))}
                    min={1}
                    max={listing.quantity_kg}
                    className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 text-base focus:ring-2 focus:ring-brand-600"
                  />
                  <div className="flex gap-1.5">
                    {[5, 10, 25, 100].filter(q => q <= listing.quantity_kg).map(q => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setQuantity(q)}
                        className={`px-3 py-3 rounded-xl text-xs font-bold transition ${
                          quantity === q ? 'bg-brand-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        {q}kg
                      </button>
                    ))}
                  </div>
                </div>
                <span className="text-[11px] text-slate-400">Max available from this batch: {listing.quantity_kg} kg</span>
              </div>

              {/* Delivery Address */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Delivery Destination
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-brand-600"
                  placeholder="Enter full street address or commercial dock..."
                />
              </div>
            </div>

            {/* Right: Transparent Price Breakdown */}
            <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                  Transparent Cost Breakdown
                </h4>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Produce ({quantity}kg × ₹{listing.price_per_kg})</span>
                    <strong className="text-slate-900">₹{subtotal}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Direct Rural Logistics Pool</span>
                    <strong className="text-slate-900">₹{directLogistics}</strong>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Intermediary Middleman Markup</span>
                    <span>₹0 (Waived)</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">Total Payable</span>
                    <span className="text-2xl font-black text-brand-700">₹{total}</span>
                  </div>
                </div>

                {savings > 0 && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      You Save ₹{savings} vs Traditional Retail
                    </div>
                    <div className="text-[11px] text-emerald-800">
                      Standard retail would charge ~₹{Math.round(estimatedMandiRetail)} for this volume.
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Razorpay Test Mode Sandbox • Instant Settlement</span>
                </div>

                <button
                  onClick={handlePay}
                  disabled={processing}
                  className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm shadow-md transition"
                >
                  {processing ? 'Processing Test Payment...' : `Pay ₹${total} (Test Mode Payment)`}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Order Confirmed Screen */
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Order Confirmed & Farm Notified!
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your order for <strong>{quantity} kg {listing.crop_name}</strong> from <strong>{listing.farmer_name}</strong> has been secured via Razorpay Test Mode.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 max-w-md mx-auto space-y-2">
            <div className="flex justify-between">
              <span>Order ID:</span>
              <strong className="font-mono text-slate-900">{completedOrderId}</strong>
            </div>
            <div className="flex justify-between">
              <span>Delivery Status:</span>
              <span className="font-bold text-emerald-700">Confirmed (Ready for Smart Route Batching)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => router.push('/orders')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs"
            >
              Track Order Status
            </button>
            <button
              onClick={() => router.push('/marketplace')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
