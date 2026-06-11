
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Trophy, Heart, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Premium Minimal Navbar */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center">
        <div className="text-xl font-bold tracking-tight text-white">
          DIGITAL<span className="text-amber-500">HEROES.</span>
        </div>
        <div className="space-x-6 flex items-center">
          <Link href="/login" className="text-sm text-slate-400 hover:text-white transition">Sign In</Link>
          <Link href="/register" className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg text-sm font-semibold transition">
            Join Platform
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 text-center py-20 flex-1 flex flex-col justify-center items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-bold tracking-widest text-amber-500 uppercase bg-amber-500/10 px-3 py-1 rounded-full">
            A New Paradigm of Play
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mt-6 mb-8 leading-tight">
            Performance tracking <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">
              fueled by direct impact.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Track your analytics, participate in high-tier monthly award pools, and fuel verified global charities automatically with every subscription[cite: 1].
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm"
        >
          <Link href="/register" className="group bg-white hover:bg-slate-100 text-slate-950 px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-xl shadow-white/5">
            Subscribe & Play <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Dynamic Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full text-left">
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <Trophy className="w-8 h-8 text-amber-500 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Refined Math Tracking</h3>
            <p className="text-sm text-slate-400">Strict rolling calculation profiles mapping your progress parameters securely.</p>
          </div>
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <Heart className="w-8 h-8 text-amber-500 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Charity First Allocation</h3>
            <p className="text-sm text-slate-400">Direct integration allocating a minimum 10% base yield directly to a charity of your choice.</p>
          </div>
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <ShieldCheck className="w-8 h-8 text-amber-500 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Verified Distribution</h3>
            <p className="text-sm text-slate-400">Automated transparent allocation matrices ensuring complete tracking visibility.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        &copy; 2026 Digital Heroes. Issued for Selection Process Evaluation.
      </footer>
    </div>
  );
}