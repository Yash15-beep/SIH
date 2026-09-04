'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Order } from '@/types';
import { Package, CheckCircle2, Truck, Clock, MapPin, ArrowRight } from 'lucide-react';

export default function OrdersPage() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchOrders();
  }, [currentUser]);

  const userOrders = orders.filter(o => !currentUser || o.buyer_id === currentUser.id || o.farmer_id === currentUser.id || currentUser.role === 'admin');

  const steps: Order['delivery_status'][] = ['placed', 'confirmed', 'routed', 'out_for_delivery', 'delivered'];

  const getStepIndex = (status: Order['delivery_status']) => {
    return steps.indexOf(status);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Order Tracking & Logistics</h1>
        <p className="text-xs text-slate-500">Live multi-stop direct farm order statuses</p>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
          Loading orders...
        </div>
      ) : userOrders.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <Package className="w-12 h-12 text-slate-400 mx-auto" />
          <div className="font-bold text-slate-700">No orders found</div>
          <Link href="/marketplace" className="inline-block px-4 py-2 bg-brand-700 text-white rounded-xl text-xs font-bold">
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order) => {
            const currentStepIdx = getStepIndex(order.delivery_status);

            return (
              <div key={order.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{order.id}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                        {order.payment_status}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-lg mt-1">
                      {order.quantity_kg} kg {order.crop_name}
                    </h3>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-400">Total Direct Amount</div>
                    <div className="text-xl font-black text-brand-700">₹{order.total_price}</div>
                  </div>
                </div>

                {/* Stepper */}
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
                            {isComplete ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                          </div>
                          <span className={`text-[11px] font-semibold capitalize ${isCurrent ? 'text-brand-900 font-bold' : isComplete ? 'text-slate-800' : 'text-slate-400'}`}>
                            {st.replace(/_/g, ' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl text-xs text-slate-600 border border-slate-200/60">
                  <div className="space-y-1">
                    <span className="text-slate-400 block font-medium">Farm Pickup Node:</span>
                    <strong className="text-slate-800 block">{order.farmer_name}</strong>
                    <span>{order.farmer_village}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block font-medium">Buyer Delivery Address:</span>
                    <strong className="text-slate-800 block">{order.buyer_name}</strong>
                    <span>{order.delivery_address}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
