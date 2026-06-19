'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Trophy, Heart, ShieldCheck, Activity, Target, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-500 relative">
      
      {/* Subtle background mesh grid to add depth and eliminate blank spaces */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Premium Minimal Navbar */}
      <header className="relative max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center border-b border-slate-900/40 backdrop-blur-sm z-10">
        <div className="text-lg font-black tracking-tight text-white flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 text-xs font-black">D</div>
          DIGITAL<span className="text-amber-500">HEROES.</span>
        </div>
        <div className="space-x-4 sm:space-x-6 flex items-center">
          <Link href="/login" className="text-xs font-semibold text-slate-400 hover:text-white transition">Sign In</Link>
          <Link href="/register" className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/10">
            Join Platform
          </Link>
        </div>
      </header>

      {/* Hero Section Container */}
      <main className="relative max-w-6xl mx-auto px-6 text-center pt-24 pb-16 flex-1 flex flex-col justify-center items-center z-10">
        
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest text-amber-500 uppercase bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 mb-8 backdrop-blur-md">
            <Zap className="w-3 h-3 text-amber-500 animate-pulse" /> A New Paradigm of Analytics Execution
          </span>
        </motion.div>

        {/* Big Bold Typography with high contrast styling */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] max-w-4xl mx-auto">
            Performance tracking <br />
            <span className="bg-gradient-to-r from-slate-100 via-slate-300 to-slate-500 bg-clip-text text-transparent">
              fueled by direct impact.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto mt-6 mb-10 leading-relaxed font-medium">
            Synchronize your telemetry metrics seamlessly inside a secure architecture pool, while automating real-time micro-allocations to verified global charity foundations.
          </p>
        </motion.div>

        {/* Clean Call to Action Button */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-xs"
        >
          <Link href="/register" className="group bg-white hover:bg-slate-100 text-slate-950 px-8 py-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-xl shadow-white/5 tracking-wider uppercase">
            Get Started Anonymously <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* UPGRADE: Premium Enterprise Feature Bento Grid Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full text-left border-t border-slate-900/80 pt-16">
          
          {/* Card 1 */}
          <div className="group relative p-6 bg-slate-900/30 border border-slate-900 rounded-2xl hover:border-slate-800 transition duration-300 backdrop-blur-md overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition duration-300">
              <Trophy className="w-24 h-24 text-amber-500" />
            </div>
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 w-fit mb-4">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5 tracking-wide uppercase">Rolling FIFO Core</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Evaluates latest parameter arrays inside a modern data pipeline layer, safely tracking baseline metrics.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative p-6 bg-slate-900/30 border border-slate-900 rounded-2xl hover:border-slate-800 transition duration-300 backdrop-blur-md overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition duration-300">
              <Heart className="w-24 h-24 text-amber-500" />
            </div>
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 w-fit mb-4">
              <Heart className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5 tracking-wide uppercase">Automated Splits</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Direct smart routing that guarantees a minimum 10% floor yield settles immediately with accredited NGOs.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative p-6 bg-slate-900/30 border border-slate-900 rounded-2xl hover:border-slate-800 transition duration-300 backdrop-blur-md overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition duration-300">
              <ShieldCheck className="w-24 h-24 text-amber-500" />
            </div>
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 w-fit mb-4">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5 tracking-wide uppercase">Compliance Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Transparent, end-to-end telemetry auditing ensuring all processed payout sequences are verified and valid.
            </p>
          </div>

        </div>
      </main>

      {/* Footer Branding Layer */}
      <footer className="relative border-t border-slate-900/60 py-6 text-center text-[10px] text-slate-500 font-bold tracking-widest uppercase z-10 bg-slate-950/80 backdrop-blur-md">
        &copy; 2026 Digital Heroes Infrastructure Platform. All architectural records secured.
      </footer>
    </div>
  );
}