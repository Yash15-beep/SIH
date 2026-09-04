'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Order } from '@/types';
import {
  Package, CheckCircle2, Truck, Clock, MapPin, ArrowRight,
  ShieldCheck, KeyRound, Sparkles, Check, ChevronDown, FileText
} from 'lucide-react';

export default function OrdersPage() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // OTP Verification State
  const [activeOtpModal, setActiveOtpModal] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState('5824');
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<{ [orderId: string]: string }>({});
  const [expandedInvoice, setExpandedInvoice] = useState<{ [orderId: string]: boolean }>({});

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const json = await res.json();
        setOrders(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUser]);

  const userOrders = orders.filter(
    (o) =>
      !currentUser ||
      o.buyer_id === currentUser.id ||
      o.farmer_id === currentUser.id ||
      currentUser.role === 'admin'
  );

  const steps: Order['delivery_status'][] = [
    'placed',
    'confirmed',
    'routed',
    'out_for_delivery',
    'delivered'
  ];

  const getStepIndex = (status: Order['delivery_status']) => {
    return steps.indexOf(status);
  };

  const advanceOrderStatus = async (orderId: string, currentStatus: Order['delivery_status']) => {
    const nextIdx = Math.min(steps.length - 1, getStepIndex(currentStatus) + 1);
    const nextStatus = steps[nextIdx];

    if (nextStatus === 'delivered') {
      setActiveOtpModal(orderId);
      return;
    }

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delivery_status: nextStatus })
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerifyOtp = async (orderId: string) => {
    setOtpVerifying(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otpInput })
      });
      const json = await res.json();
      if (json.success) {
        setPayoutSuccessMsg((prev) => ({
          ...prev,
          [orderId]: json.message
        }));
        setActiveOtpModal(null);
        fetchOrders();
      } else {
        alert(json.error || 'Invalid OTP');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setOtpVerifying(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Direct Escrow Protection & Live Dispatch Tracking
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Order Tracking & Escrow Payouts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Funds held securely in KisanSetu Escrow until 4-digit Delivery OTP verification.
          </p>
        </div>

        <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl shadow-sm self-start sm:self-auto">
          <div className="text-[10px] uppercase font-bold text-slate-400">Demo Delivery OTP</div>
          <div className="text-xl font-black text-brand-700 tracking-widest font-mono">5824</div>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
          Loading orders and escrow state...
        </div>
      ) : userOrders.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <Package className="w-12 h-12 text-slate-400 mx-auto" />
          <div className="font-bold text-slate-700">No active orders found</div>
          <Link
            href="/marketplace"
            className="inline-block px-5 py-2.5 bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md hover:bg-brand-800"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order) => {
            const currentStepIdx = getStepIndex(order.delivery_status);
            const isDelivered = order.delivery_status === 'delivered';
            const farmerPayout = Math.round(order.total_price * 0.92);
            const logisticsFee = Math.round(order.total_price * 0.06);
            const platformFee = Math.round(order.total_price * 0.02);

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 hover:shadow-md transition"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{order.id}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isDelivered
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {isDelivered ? '✓ Escrow Disbursed' : '🔒 Funds in Escrow'}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-xl mt-1">
                      {order.quantity_kg} kg {order.crop_name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-slate-400 font-medium">Total Amount</div>
                      <div className="text-2xl font-black text-brand-700">₹{order.total_price.toLocaleString()}</div>
                    </div>

                    {!isDelivered && (
                      <button
                        onClick={() => advanceOrderStatus(order.id, order.delivery_status)}
                        className="px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                      >
                        Advance Stage <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Escrow Release Payout Banner */}
                {payoutSuccessMsg[order.id] && (
                  <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-900 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-pulse">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>{payoutSuccessMsg[order.id]}</span>
                  </div>
                )}

                {/* 5-Stage Stepper */}
                <div className="py-2">
                  <div className="grid grid-cols-5 gap-2 text-center relative">
                    {steps.map((st, idx) => {
                      const isComplete = currentStepIdx >= idx;
                      const isCurrent = currentStepIdx === idx;

                      return (
                        <div key={st} className="flex flex-col items-center space-y-2">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition ${
                              isCurrent
                                ? 'bg-brand-700 text-white ring-4 ring-brand-100 shadow-md'
                                : isComplete
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}
                          >
                            {isComplete ? <Check className="w-5 h-5" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[11px] font-semibold capitalize ${
                              isCurrent
                                ? 'text-brand-900 font-bold'
                                : isComplete
                                ? 'text-slate-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {st === 'placed'
                              ? '1. Escrow Placed'
                              : st === 'confirmed'
                              ? '2. Pooled'
                              : st === 'routed'
                              ? '3. Driver En Route'
                              : st === 'out_for_delivery'
                              ? '4. Out for Delivery'
                              : '5. Delivered & Paid'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Addresses & Dispatch Nodes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl text-xs text-slate-600 border border-slate-200/60">
                  <div className="space-y-1">
                    <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                      Farm Pickup Origin:
                    </span>
                    <strong className="text-slate-900 block text-sm">{order.farmer_name}</strong>
                    <span>{order.farmer_village}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                      Buyer Doorstep Delivery:
                    </span>
                    <strong className="text-slate-900 block text-sm">{order.buyer_name}</strong>
                    <span>{order.delivery_address}</span>
                  </div>
                </div>

                {/* DoCA Price Breakdown Invoice Toggle */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() =>
                      setExpandedInvoice((prev) => ({
                        ...prev,
                        [order.id]: !prev[order.id]
                      }))
                    }
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4 text-brand-600" />
                    <span>View DoCA Transparent Price Waterfall Breakdown</span>
                    <ChevronDown
                      className={`w-4 h-4 transition ${
                        expandedInvoice[order.id] ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expandedInvoice[order.id] && (
                    <div className="mt-3 p-4 bg-slate-900 text-white rounded-2xl text-xs space-y-2 border border-slate-800 animate-in fade-in duration-200">
                      <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                        Stage-by-Stage Value Realization
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-300">1. Direct Farmer Payout (92%):</span>
                        <strong className="text-emerald-400">₹{farmerPayout.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-300">2. Pooled Logistics & Cold Transit (6%):</span>
                        <span className="text-slate-300">₹{logisticsFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-300">3. Platform Technology & Escrow (2%):</span>
                        <span className="text-slate-300">₹{platformFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-1 font-bold">
                        <span className="text-white">Total Customer Invoice:</span>
                        <span className="text-white">₹{order.total_price.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delivery OTP Action for In-Transit Orders */}
                {order.delivery_status === 'out_for_delivery' && (
                  <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-amber-700 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-xs text-amber-950">
                          Driver Arrived at Doorstep
                        </div>
                        <div className="text-[11px] text-amber-800">
                          Input customer's 4-digit Delivery OTP (Demo: 5824) to complete delivery & release Escrow payout.
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveOtpModal(order.id)}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition whitespace-nowrap"
                    >
                      Enter Delivery OTP
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delivery OTP Verification Modal Dialog */}
      {activeOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mx-auto">
                <KeyRound className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Enter 4-Digit Delivery OTP</h3>
              <p className="text-xs text-slate-500">
                Ask the buyer for their verification code to confirm fresh produce receipt.
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                maxLength={4}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="5824"
                className="w-full text-center text-3xl font-black tracking-widest p-4 rounded-2xl border-2 border-slate-300 font-mono focus:border-brand-600 focus:outline-none"
              />
              <div className="text-[11px] text-center text-slate-400">
                Demo Code: <strong className="text-slate-700">5824</strong>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setActiveOtpModal(null)}
                className="w-1/2 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerifyOtp(activeOtpModal)}
                disabled={otpVerifying}
                className="w-1/2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
              >
                {otpVerifying ? 'Verifying...' : 'Verify & Disburse 💰'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
