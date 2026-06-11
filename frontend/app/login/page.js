
'use client';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      
    } catch (err) {
      setError(err.message || 'Invalid credentials or connection fault.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-950">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-white text-center mb-2">Welcome Back</h2>
        <p className="text-xs text-slate-400 text-center mb-6">Sign in to access your dashboard and impact metrics[cite: 1].</p>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="name@domain.com"
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold p-3.5 rounded-xl transition mt-2 text-sm"
          >
            {loading ? 'Verifying Credentials...' : 'Sign In To Platform'}
          </button>
        </form>

        <p className="text-xs text-slate-500 text-center mt-6">
          New to the platform? <Link href="/register" className="text-amber-500 hover:underline">Create an Account</Link>[cite: 1]
        </p>
      </div>
    </div>
  );
}