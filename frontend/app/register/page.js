
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../utils/api';
import Link from 'next/link';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiClient('/auth/register', {
        method: 'POST',
        body: formData,
      });
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/onboarding/subscribe'); 
      } else {
        setError('Server authentication format anomaly.');
      }
    } catch (err) {
      setError(err.message || 'Registration structural failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-950">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-white text-center mb-2">Create Account</h2>
        <p className="text-xs text-slate-400 text-center mb-6">Begin your performance and giving journey.</p>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Secure Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold p-3.5 rounded-xl transition mt-2 text-sm"
          >
            {loading ? 'Configuring Security Profile...' : 'Complete Phase 1 Registration'}
          </button>
        </form>

        <p className="text-xs text-slate-500 text-center mt-6">
          Already registered? <Link href="/login" className="text-amber-500 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}