'use client';
import { useState, useEffect } from 'react';
import { apiClient } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { Trophy, Calendar, PlusCircle, LogOut, Loader2, DollarSign, Heart, ShieldCheck, ExternalLink } from 'lucide-react';

export default function UserDashboard() {
  const { user, logout, syncUserProfileState } = useAuth();
  const [scores, setScores] = useState([]);
  const [metrics, setMetrics] = useState({ activeDraws: 1, potentialPayout: '$0.00' });
  const [scoreForm, setScoreForm] = useState({ score: '', scoreDate: '' });
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const [winningHistory, setWinningHistory] = useState([]);
  const [mockUrlInput, setMockUrlInput] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  // OPTIMIZATION: Added isSilentUpdate flag to fetch records seamlessly in the background
  const fetchDashboardData = async (isSilentUpdate = false) => {
    const activeToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!activeToken) return;
  
    try {
      if (!isSilentUpdate) setLoading(true);
  
      const urlParams = new URLSearchParams(window.location.search);
      const stripeSessionId = urlParams.get('session_id');
  
      if (stripeSessionId) {
        console.log("Stripe token detected. Sending activation request to backend...");
        const safeCharityId = user?.subscription?.charityId || "6a2a5286cdf0bb9701bcd50c"; 
      
        try {
          const activationResponse = await apiClient('/auth/subscription', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: { 
              planType: 'monthly', 
              charityId: safeCharityId, 
              charityPercentage: user?.subscription?.charityPercentage || 10,
              session_id: stripeSessionId 
            },
          });
          
          console.log("Backend activation handshake successful:", activationResponse);
      
          if (syncUserProfileState) {
            await syncUserProfileState();
          }
        } catch (activationError) {
          console.error("CRITICAL SUBSCRIPTION ACTIVATION FAILED:", activationError.message);
        }
      
        window.history.replaceState({}, document.title, "/dashboard");
      }
  
      const scoreRes = await apiClient('/scores');
      setScores(scoreRes.data);
  
      const drawRes = await apiClient('/draws/current').catch(() => null);
      if (drawRes && drawRes.data) {
        setMetrics({ activeDraws: 1, potentialPayout: `$${drawRes.data.prizePoolTotal || '0.00'}` });
        
        // FIX: Dynamically scan the winners matrix to find the matching logged-in user profile record context
        const currentUserId = user?.id || user?._id;
        const matchingWinnerTicket = drawRes.data.winners?.find(w => {
          const ticketUid = w.userId?._id || w.userId;
          return ticketUid?.toString() === currentUserId?.toString();
        });

        if (matchingWinnerTicket) {
          setWinningHistory([
            {
              id: matchingWinnerTicket._id,        // The precise subdocument ticket row _id token
              drawId: drawRes.data._id,            // Parent draw relational identity link 
              drawMonth: drawRes.data.drawMonth || '2026-06', 
              matchTier: matchingWinnerTicket.matchTier || 3, 
              prizeAllocated: parseFloat(matchingWinnerTicket.prizeAllocated) || 0.00,
              verificationStatus: matchingWinnerTicket.verificationStatus || 'Pending'
            }
          ]);
        } else {
          // Gracefully default to clean empty tracking arrays if no matching context is present
          setWinningHistory([]);
        }
      } else {
        setWinningHistory([]);
      }
    } catch (err) {
      console.error('Error hydrating dashboard elements:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      console.log("Awaiting profile session state serialization...");
      return; 
    }
    console.log("Profile context synchronized. Compiling active draw vectors...");
    fetchDashboardData();
  }, [user]);

  const handleAddScoreSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const numericScore = parseInt(scoreForm.score);
    if (numericScore < 1 || numericScore > 45) {
      setFormError('Stableford score constraint error: Value must sit strictly between 1 and 45.');
      return;
    }

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const stripeSessionId = urlParams.get('session_id');

      await apiClient('/scores', {
        method: 'POST',
        body: {
          score: numericScore,
          scoreDate: scoreForm.scoreDate,
          session_id: stripeSessionId 
        },
      });

      setFormSuccess('Score synchronized. Rolling FIFO calculation executed successfully.');
      setScoreForm({ score: '', scoreDate: '' });
      
      window.history.replaceState({}, document.title, "/dashboard");
      // FIX: Call fetch with 'true' for a clean background update without spinner interruptions
      fetchDashboardData(true); 
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleMockProofUpload = async (e) => {
    e.preventDefault();
    if (!mockUrlInput.trim()) return;

    const targetTicket = winningHistory[0];
    if (!targetTicket || !targetTicket.drawId) {
      setUploadSuccess('Submission error: No valid active matching winner record found to attach this proof to.');
      return;
    }

    setUploadSuccess('');

    try {
      // FIX: Maps the distinct parent Draw ID along with the subdocument ticket item ID explicitly
      await apiClient('/draws/submit-proof', {
        method: 'POST',
        body: {
          drawId: targetTicket.drawId,
          winnerId: targetTicket.id, 
          proofImageUrl: mockUrlInput.trim()
        }
      });

      setUploadSuccess('Verification screenshot payload successfully saved to database matrix!');
      setMockUrlInput('');
      
      fetchDashboardData(true); // Silent dashboard refetch update
    } catch (err) {
      console.error("Outbound proof payload shipment failure:", err.message);
      setUploadSuccess(`Submission failure: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Upper Navigation Canopy Layout */}
      <nav className="border-b border-slate-900 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="font-black tracking-tight text-white text-base sm:text-lg">
            DIGITAL<span className="text-amber-500">HEROES.</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/charities" className="hidden sm:flex text-xs text-slate-400 hover:text-amber-500 transition items-center gap-1">
              <Heart className="w-3.5 h-3.5" /> Explore Charities
            </Link>

            <span className="text-[11px] sm:text-xs text-slate-400 bg-slate-800 px-2.5 sm:px-3 py-1.5 rounded-full font-medium capitalize max-w-[140px] sm:max-w-none truncate">
              Profile: {user?.name || 'Satyam Raj'} ({user?.subscription?.status || 'inactive'})
            </span>

            <button onClick={logout} className="p-1.5 sm:p-2 text-slate-400 hover:text-white transition">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">

          {/* Top Banner Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 shrink-0">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wider uppercase">Active Pool Cycles</div>
                <div className="text-xl sm:text-2xl font-black text-white mt-0.5">{metrics.activeDraws} Month Entry</div>
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 shrink-0">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wider uppercase">Global Estimated Jackpot</div>
                <div className="text-xl sm:text-2xl font-black text-white mt-0.5">{metrics.potentialPayout}</div>
              </div>
            </div>
          </div>

          {/* Rolling Score Ledger Listing */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 overflow-hidden">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4">Retained Rolling Performance Array (Last 5 Logs)</h3>
            {scores.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">No synchronized tracking data discovered. Utilize dashboard entry channel.</p>
            ) : (
              <div className="divide-y divide-slate-800">
                {scores.map((s) => (
                  <div key={s._id} className="py-3.5 flex justify-between items-center first:pt-0 last:pb-0 gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-300 truncate">{s.scoreDate}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-black text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg shrink-0 whitespace-nowrap">
                      {s.score} PTS (Stableford)
                    </span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[10px] text-slate-500 mt-4 italic">Note: Only the latest 5 telemetry events are retained. Older data is automatically purged.</p>
          </div>

          {/* Winnings Overview & Verification Proof Module */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 overflow-hidden">
            <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">Winnings Overview & Payout Tracking</h3>
            <p className="text-xs text-slate-400 mb-4">Upload validation screenshots to authorize pending payouts.</p>

            {winningHistory.length === 0 ? (
              <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500">
                No active matching winnings located for your user context in this cycle.
              </div>
            ) : (
              <>
                <div className="divide-y divide-slate-800">
                  {winningHistory.map((win) => (
                    <div key={win.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 first:pt-0 last:pb-4">
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white truncate">{win.drawMonth} Cadence Pool Draw</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Match Tier achieved: <span className="text-amber-500 font-semibold">{win.matchTier}-Number Match</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                        <span className="text-xs sm:text-sm font-black text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                          ${win.prizeAllocated.toFixed(2)}
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider whitespace-nowrap">
                          {win.verificationStatus} Proof
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleMockProofUpload} className="mt-2 p-3 sm:p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3 text-amber-500" /> Submit Compliance Verification Screenshot
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      required
                      placeholder="Paste verified screenshot proof document URL..."
                      value={mockUrlInput}
                      onChange={(e) => setMockUrlInput(e.target.value)}
                      className="w-full flex-1 bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500 transition min-w-0"
                    />
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-950 px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 shrink-0 whitespace-nowrap"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Upload Proof
                    </button>
                  </div>
                  {uploadSuccess && (
                    <p className="text-[11px] text-emerald-400 font-medium mt-2 text-center">{uploadSuccess}</p>
                  )}
                </form>
              </>
            )}
          </div>

        </div>

        {/* Right Column Grid Area */}
        <div className="order-1 lg:order-2">
          <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl lg:sticky lg:top-28">
            <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-500" /> Synchronize Metrics
            </h3>
            <p className="text-xs text-slate-400 mb-5">Append latest round parameter vectors cleanly.</p>

            {formError && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-xl mb-4 text-center font-medium">{formError}</div>}
            {formSuccess && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-xl mb-4 text-center font-medium">{formSuccess}</div>}

            <form onSubmit={handleAddScoreSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Stableford Points Value (1-45)</label>
                <input
                  type="number"
                  required
                  placeholder="36"
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition"
                  value={scoreForm.score}
                  onChange={(e) => setScoreForm({ ...scoreForm, score: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Calendar Event Date</label>
                <input
                  type="date"
                  required
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500 transition"
                  value={scoreForm.scoreDate}
                  onChange={(e) => setScoreForm({ ...scoreForm, scoreDate: e.target.value })}
                />
              </div>
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold p-3.5 rounded-xl transition text-sm mt-2 font-semibold">
                Commit Entry Block
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}