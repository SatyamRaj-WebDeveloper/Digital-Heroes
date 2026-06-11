
'use client';
import { useState, useEffect } from 'react';
import { apiClient } from '../../utils/api';
import { Search, Calendar, Heart, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CharityDirectory() {
  const [charities, setCharities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCharities = async (search = '') => {
    try {
      setLoading(true);
      const url = search ? `/charities?search=${search}` : '/charities';
      const res = await apiClient(url);
      setCharities(res.data);
    } catch (err) {
      console.error('Error reading charity records:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    fetchCharities(e.target.value); 
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Canopy Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <Link href="/dashboard" className="text-xs text-amber-500 hover:underline flex items-center gap-1.5 mb-2">
              <ArrowLeft className="w-3 h-3" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black text-white tracking-tight">Charity Partners Directory</h1>
            <p className="text-sm text-slate-400 mt-1">Explore certified non-profits supported by our gameplay pool allocations[cite: 13, 23, 78].</p>
          </div>

          {/* Search Box Form Object */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search partner profiles..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-slate-900 border border-slate-800 p-3 pl-10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 transition"
            />
          </div>
        </div>

        {/* Dynamic Profile Listing Grid Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>
        ) : charities.length === 0 ? (
          <div className="border border-dashed border-slate-800 p-12 rounded-2xl text-center text-slate-500 text-sm">
            No matching registered charities found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {charities.map((charity) => (
              <div key={charity._id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition">
                <div className="p-6">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="text-lg font-bold text-white leading-snug">{charity.name}</h3>
                    {charity.isFeatured && (
                      <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <Heart className="w-2.5 h-2.5 fill-current" /> Spotlight [cite: 81]
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">{charity.description}</p>
                </div>

                {/* Event Schedule Component Sub-Block */}
                {charity.upcomingEvents && charity.upcomingEvents.length > 0 && (
                  <div className="p-4 bg-slate-950 border-t border-slate-800 mx-6 mb-6 rounded-xl">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Scheduled Event [cite: 80]
                    </div>
                    {charity.upcomingEvents.map((evt, idx) => (
                      <div key={idx} className="text-xs font-semibold text-slate-200">
                        {evt.title} <span className="text-slate-500 font-normal">({new Date(evt.date).toLocaleDateString()})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}