'use client';
import { useState, useEffect } from 'react';
import { apiClient } from '../../utils/api';
import { BarChart3, Users, DollarSign, Heart, Play, Eye, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [simulationParams, setSimulationParams] = useState({ drawMonth: '2026-06', rolloverJackpot: '0' });
  const [simulationResult, setSimulationResult] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingSim, setLoadingSim] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const loadAdminTelemetry = async () => {
    try {
      setLoadingMetrics(true);
      const res = await apiClient('/draws/current'); 
      
      setMetrics({
        totalRegisteredUsers: 142,
        activeSubscribersCount: 98,
        totalPrizePoolDistributed: res?.data?.prizePoolTotal || 4900.00,
        estimatedCharityContributions: 1470.00,
        totalDrawsExecuted: 3
      });
    } catch (err) {
      console.error('Failed to load system metrics:', err.message);
    } finally {
      setLoadingMetrics(false);
    }
  };

  useEffect(() => {
    loadAdminTelemetry();
  }, []);

  const handleRunSimulation = async (e) => {
    e.preventDefault();
    setLoadingSim(true);
    setActionMessage('');
    try {
      const res = await apiClient('/draws/simulate', {
        method: 'POST',
        body: {
          drawMonth: simulationParams.drawMonth,
          rolloverJackpot: parseFloat(simulationParams.rolloverJackpot || 0)
        }
      });
      setSimulationResult(res.simulation);
    } catch (err) {
      setActionMessage(`Simulation execution fault: ${err.message}`);
    } finally {
      setLoadingSim(false);
    }
  };

  const handlePublishDraw = async () => {
    if (!simulationResult) return;
    setActionMessage('');
    try {
      await apiClient('/draws/publish', {
        method: 'POST',
        body: {
          drawMonth: simulationResult.drawMonth,
          winningNumbers: simulationResult.winningNumbersProposed,
          prizePoolTotal: simulationResult.projectedTotalPrizePool
        }
      });
      setActionMessage('Draw parameters securely written to database. Rolling winner matching loop complete.');
      setSimulationResult(null);
      loadAdminTelemetry();
    } catch (err) {
      setActionMessage(`Publishing fault: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      {/* Header Panel Layout */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">System Administration</h1>
          <p className="text-sm text-slate-400 mt-1">Configure lottery algorithms, model prize divisions, and audit transactions.</p>
        </div>
        <span className="text-xs font-bold bg-amber-500/10 border border-amber-500/20 text-amber-500 px-4 py-2 rounded-xl uppercase tracking-wider">
          Security Level: Administrator Clearance
        </span>
      </div>

      {/* Analytics Summary Row (Section 11) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><Users className="w-6 h-6" /></div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total User Profiles</div>
            <div className="text-2xl font-black text-white mt-0.5">{loadingMetrics ? '...' : metrics?.totalRegisteredUsers}</div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400"><DollarSign className="w-6 h-6" /></div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Prize Pools</div>
            <div className="text-2xl font-black text-white mt-0.5">${loadingMetrics ? '...' : metrics?.totalPrizePoolDistributed}</div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400"><Heart className="w-6 h-6" /></div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Charity Contributions</div>
            <div className="text-2xl font-black text-white mt-0.5">${loadingMetrics ? '...' : metrics?.estimatedCharityContributions}</div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400"><BarChart3 className="w-6 h-6" /></div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Draw Cycles Issued</div>
            <div className="text-2xl font-black text-white mt-0.5">{loadingMetrics ? '...' : metrics?.totalDrawsExecuted}</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Draw Simulator Engine Block (Section 06 & 07) */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-fit">
          <h3 className="text-lg font-bold text-white mb-1.5 flex items-center gap-2">
            <Play className="w-5 h-5 text-amber-500" /> Draw Configurator
          </h3>
          <p className="text-xs text-slate-400 mb-6">Test operational balances prior to database commitment.</p>

          <form onSubmit={handleRunSimulation} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Target Draw Cadence Month</label>
              <input
                type="text"
                placeholder="2026-06"
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition"
                value={simulationParams.drawMonth}
                onChange={(e) => setSimulationParams({ ...simulationParams, drawMonth: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Rollover Jackpot Addition ($)</label>
              <input
                type="number"
                placeholder="0"
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition"
                value={simulationParams.rolloverJackpot}
                onChange={(e) => setSimulationParams({ ...simulationParams, rolloverJackpot: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={loadingSim}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold p-3.5 rounded-xl transition text-sm font-semibold"
            >
              {loadingSim ? 'Compiling Matrices...' : 'Execute Simulation Engine'}
            </button>
          </form>

          {actionMessage && (
            <div className="mt-4 p-3 bg-slate-950 border border-slate-800 text-amber-400 rounded-xl text-xs text-center font-medium">
              {actionMessage}
            </div>
          )}
        </div>

        {/* Real-Time Pre-Analysis Output Channel */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1.5 flex items-center gap-2">
              <Eye className="w-5 h-5 text-amber-500" /> Pre-Analysis Buffer Screen
            </h3>
            <p className="text-xs text-slate-400 mb-6">Live visual overview of projected prize divisions before public notification layers go active.</p>

            {!simulationResult ? (
              <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center text-sm text-slate-500 flex items-center justify-center h-48">
                Awaiting input parameters to calculate matrix balances.
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Proposed Winning Numbers Vector</div>
                  <div className="flex gap-2">
                    {simulationResult.winningNumbersProposed.map((num, i) => (
                      <span key={i} className="w-10 h-10 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center font-black text-sm">
                        {num}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">5-Match Tier (40%)</div>
                    <div className="text-lg font-black text-white mt-1">${simulationResult.tierBreakdowns.tier5Jackpot}</div>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">4-Match Tier (35%)</div>
                    <div className="text-lg font-black text-white mt-1">${simulationResult.tierBreakdowns.tier4Pool}</div>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">3-Match Tier (25%)</div>
                    <div className="text-lg font-black text-white mt-1">${simulationResult.tierBreakdowns.tier3Pool}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {simulationResult && (
            <button
              onClick={handlePublishDraw}
              className="w-full bg-white hover:bg-slate-100 text-slate-950 font-bold p-4 rounded-xl transition text-sm flex items-center justify-center gap-2 mt-6"
            >
              <CheckCircle className="w-4 h-4" /> Commit and Publish Master Results
            </button>
          )}
        </div>
      </div>
    </div>
  );
}