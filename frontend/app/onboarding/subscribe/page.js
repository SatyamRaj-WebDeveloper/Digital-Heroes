'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../../utils/api';
import { Heart, ShieldCheck, Sparkles } from 'lucide-react';

export default function SubscribeOnboarding() {
  const [charities, setCharities] = useState([]);
  const [selectedCharity, setSelectedCharity] = useState('');
  const [planType, setPlanType] = useState('monthly');
  const [charityPercentage, setCharityPercentage] = useState(10); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const response = await apiClient('/charities');
        setCharities(response.data);
        if (response.data.length > 0) setSelectedCharity(response.data[0]._id);
      } catch (err) {
        console.error('Failed to fetch charities directory:', err.message);
      }
    };
    fetchCharities();
  }, []);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCharity) {
      setError('Please select an impact charity partner to proceed.');
      return;
    }
    setLoading(true);
    setError('');
  
    try {
      const response = await apiClient('/auth/subscription', {
        method: 'PUT',
        body: { planType, charityId: selectedCharity, charityPercentage },
      });
      
      if (response.url) {
        window.location.href = response.url; 
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-xl mx-auto w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Activate Membership</h2>
          <p className="text-sm text-slate-400 mt-2">Configure your gameplay engine allocation tiers.</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-xl text-center mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleCheckoutSubmit} className="space-y-6">
          {/* Step 1: Tier Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">Select Program Plan</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`p-4 rounded-xl border text-left transition ${planType === 'monthly' ? 'border-amber-500 bg-amber-500/5 text-white' : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'}`}
                onClick={() => setPlanType('monthly')}
              >
                <div className="font-bold text-sm">Monthly License</div>
                <div className="text-xl font-black text-white mt-1">$50<span className="text-xs font-normal text-slate-400">/mo</span></div>
              </button>
              <button
                type="button"
                className={`p-4 rounded-xl border text-left transition ${planType === 'yearly' ? 'border-amber-500 bg-amber-500/5 text-white' : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'}`}
                onClick={() => setPlanType('yearly')}
              >
                <div className="font-bold text-sm">Yearly License (Discounted)</div>
                <div className="text-xl font-black text-white mt-1">$450<span className="text-xs font-normal text-slate-400">/yr</span></div>
              </button>
            </div>
          </div>

          {/* Step 2: Charity Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">Designate Charity Recipient</label>
            <select
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-amber-500 transition"
              value={selectedCharity}
              onChange={(e) => setSelectedCharity(e.target.value)}
            >
              {charities.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Step 3: Contribution Rate Control */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-amber-500" /> Voluntary Match Percentage
              </label>
              <span className="text-sm font-black text-amber-500">{charityPercentage}%</span>
            </div>
            <input
              type="range"
              min="10" 
              max="50"
              step="1"
              className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              value={charityPercentage}
              onChange={(e) => setCharityPercentage(Number(e.target.value))}
            />
            <p className="text-[10px] text-slate-500 mt-2">10% is mandatory baseline allocation. Move slider to ramp up your social impact contribution matrix.</p>
          </div>

          {/* Submit Trigger */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-950 font-bold p-4 rounded-xl transition text-sm flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {loading ? 'Processing Protocol Entry...' : 'Authorize Vault Connection'}
          </button>
        </form>
      </div>
    </div>
  );
}