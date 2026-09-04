'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Phone, CheckCheck, ShieldCheck, Bell, Sparkles } from 'lucide-react';

interface AlertMessage {
  id: string;
  recipient: 'Farmer' | 'Consumer' | 'Driver';
  recipientName: string;
  channel: 'SMS' | 'WhatsApp';
  language: 'Hindi' | 'English';
  title: string;
  body: string;
  time: string;
  badgeColor: string;
}

export function NotificationSimulator() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'Farmer' | 'Consumer' | 'Driver'>('ALL');

  const notifications: AlertMessage[] = [
    {
      id: '1',
      recipient: 'Farmer',
      recipientName: 'Ramesh Kumar (रामेश)',
      channel: 'SMS',
      language: 'Hindi',
      title: 'नया ऑर्डर प्राप्त हुआ (Order Received)',
      body: 'किसानसेतु: बधाई! आपकी 500kg टमाटर की फसल का ₹11,000 का ऑर्डर प्राप्त हुआ है। खरीदार का भुगतान एस्क्रो में सुरक्षित है। पिकअप टीम जल्द पहुंचेगी।',
      time: 'Just now',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: '2',
      recipient: 'Driver',
      recipientName: 'Harish Logistics (हरिश)',
      channel: 'WhatsApp',
      language: 'Hindi',
      title: 'पूल पिकअप रूट असाइन (Pickup Route Assigned)',
      body: 'लॉजिस्टिक्स अलर्ट: धारूहेड़ा (रेवाड़ी) से 500kg टमाटर पिकअप करें। गंतव्य: सेक्टर 56, गुरुग्राम। नेविगेशन लिंक: https://kisansetu.in/route/rt_4122',
      time: '2 mins ago',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: '3',
      recipient: 'Consumer',
      recipientName: 'Priya Sharma (प्रिया)',
      channel: 'SMS',
      language: 'English',
      title: 'Out for Delivery (डिलीवरी हेतु रवाना)',
      body: 'KisanSetu: Your fresh harvest Tomato order is out for delivery with driver Harish. Please share 4-digit Delivery OTP: 5824 upon receiving fresh produce.',
      time: '5 mins ago',
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      id: '4',
      recipient: 'Farmer',
      recipientName: 'Ramesh Kumar (रामेश)',
      channel: 'WhatsApp',
      language: 'Hindi',
      title: 'एस्क्रो से भुगतान क्रेडिट (Payment Released)',
      body: 'भुगतान पुष्टि: ग्राहक ओटीपी सत्यापित! ₹11,000 की राशि आपके बैंक/UPI खाते (9876543210@upi) में बिना किसी आढ़तिया कमीशन के तुरंत ट्रांसफर कर दी गई है।',
      time: '10 mins ago',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    }
  ];

  const filtered = activeFilter === 'ALL'
    ? notifications
    : notifications.filter(n => n.recipient === activeFilter);

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xl border border-slate-700 transition hover:scale-105"
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-1 -right-1 animate-ping"></span>
          </div>
          <span>SMS & WhatsApp Alerts</span>
          <span className="bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold">
            {notifications.length}
          </span>
        </button>
      </div>

      {/* Slide-Over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm transition">
          <div className="w-full max-w-md bg-slate-950 text-white h-full shadow-2xl flex flex-col border-l border-slate-800 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-brand-600 text-white">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    Vernacular Alerts Simulator
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Bilingual SMS & WhatsApp Notifications for Rural Stakeholders
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Pills */}
            <div className="p-3 border-b border-slate-800/80 bg-slate-900/50 flex items-center gap-1.5 overflow-x-auto text-xs">
              {(['ALL', 'Farmer', 'Consumer', 'Driver'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    activeFilter === tab
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {tab === 'ALL' ? 'All Alerts' : tab}
                </button>
              ))}
            </div>

            {/* Notification Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filtered.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${msg.badgeColor}`}>
                        {msg.recipient} • {msg.channel}
                      </span>
                      <span className="text-[10px] text-slate-400">{msg.language}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">{msg.time}</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{msg.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-sans">
                      {msg.body}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/50">
                    <span className="truncate">To: {msg.recipientName}</span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCheck className="w-3.5 h-3.5" /> Delivered
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 text-center">
              <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Integrated with Twilio / MSG91 & WhatsApp Business API
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NotificationSimulator;
