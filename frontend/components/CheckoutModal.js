
'use client';
import { useState } from 'react';
import { ShieldCheck, CreditCard, Loader2 } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, onPaymentSuccess, planType, cost }) {
  const [processing, setProcessing] = useState(false);
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '' });

  if (!isOpen) return null;

  const handleMockPaySubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    
    
    setTimeout(() => {
      setProcessing(false);
      onPaymentSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-2xl shadow-2xl relative">
        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-amber-500" /> Secure Sandbox Checkout
        </h3>
        <p className="text-xs text-slate-400 mb-6">Simulating Stripe Payment Gateway integration .</p>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6 flex justify-between items-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{planType} Subscription License </span>
          <span className="text-lg font-black text-white">${cost}</span>
        </div>

        <form onSubmit={handleMockPaySubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Card Number</label>
            <input 
              type="text" 
              required
              placeholder="4242 •••• •••• 4242" 
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition"
              onChange={(e) => setCardData({...cardData, number: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Expiration</label>
              <input 
                type="text" 
                required
                placeholder="MM / YY" 
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">CVC</label>
              <input 
                type="text" 
                required
                placeholder="•••" 
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold p-3 rounded-xl transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={processing}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold p-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Authorizing...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Pay ${cost}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}