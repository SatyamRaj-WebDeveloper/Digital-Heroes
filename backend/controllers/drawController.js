import Draw from '../models/Draw.js';
import User from '../models/User.js';
import GolfScore from '../models/GolfScore.js';
import { dispatchDrawResultsEmail, dispatchWinnerAlertEmail } from '../config/mailer.js';

const PRIZE_ALLOCATION = { TIER_5: 0.40, TIER_4: 0.35, TIER_3: 0.25 };
const BASE_SUBSCRIPTION_REVENUE_PER_CAPITA = 50.00; 
const POOL_PROPORTIONAL_CONTRIBUTION_RATE = 0.40; 

export const executeDrawSimulation = async (req, res) => {
  const { drawMonth, rolloverJackpot = 0 } = req.body;

  try {
    const subscriberCount = await User.countDocuments({ 'subscription.status': 'active' });
    const dynamicRevenueGenerated = subscriberCount * BASE_SUBSCRIPTION_REVENUE_PER_CAPITA * POOL_PROPORTIONAL_CONTRIBUTION_RATE;
    const finalCalculatedPrizePool = dynamicRevenueGenerated + parseFloat(rolloverJackpot);

    const generatedWinningNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 45) + 1);

    const simulationResult = {
      drawMonth,
      winningNumbersProposed: generatedWinningNumbers,
      estimatedActiveSubscribersCount: subscriberCount,
      projectedTotalPrizePool: finalCalculatedPrizePool,
      tierBreakdowns: {
        tier5Jackpot: (finalCalculatedPrizePool * PRIZE_ALLOCATION.TIER_5).toFixed(2),
        tier4Pool: (finalCalculatedPrizePool * PRIZE_ALLOCATION.TIER_4).toFixed(2),
        tier3Pool: (finalCalculatedPrizePool * PRIZE_ALLOCATION.TIER_3).toFixed(2),
      },
      statusMessage: "Simulation mode calculations aggregated successfully. Awaiting publisher manual override push."
    };

    res.status(200).json({ success: true, simulation: simulationResult });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// FIX: Added .populate() statement sequence to hydration pipeline query
export const getCurrentDrawStats = async (req, res) => {
  try {
    const latestDraw = await Draw.findOne({ isPublished: true })
      .sort({ drawMonth: -1 })
      // Replaces winner raw ID string context with actual User Object attributes
      .populate({
        path: 'winners.userId',
        select: 'name email' // Limits exposure strictly to descriptive presentation fields
      });
    
    if (!latestDraw) {
      return res.status(200).json({ 
        success: true, 
        data: {
          prizePoolTotal: "0.00",
          drawMonth: "2026-06", 
          isPublished: false,
          winningNumbers: [],
          winners: []
        },
        message: 'No production draw historical instances located. Serving baseline template.'
      });
    }

    return res.status(200).json({ success: true, data: latestDraw });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const submitWinnerProof = async (req, res) => {
  const { drawId, winnerId, proofImageUrl } = req.body; 
  try {
    const draw = await Draw.findById(drawId);
    if (!draw) return res.status(404).json({ success: false, message: 'Draw cycle not found' });

    // FIX: Instead of draw.winners.id(), find the winner subdocument where userId matches the logged-in user
    const ticket = draw.winners.find(w => 
      w.userId.toString() === req.user.id || w._id.toString() === winnerId
    );

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Winner ticket item missing for this user context' });
    }

    // Update properties on the subdocument row
    ticket.proofImageUrl = proofImageUrl; 
    ticket.verificationStatus = 'Pending'; 
    
    // Save changes back to MongoDB
    await draw.save();

    res.status(200).json({ success: true, message: 'Proof submitted successfully for administrative evaluation.', data: draw });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reviewWinnerProof = async (req, res) => {
  const { drawId, winnerId, action } = req.body; 
  try {
    const draw = await Draw.findById(drawId);
    if (!draw) return res.status(404).json({ success: false, message: 'Draw not found' });

    const ticket = draw.winners.id(winnerId);
    if (!ticket) return res.status(404).json({ success: false, message: 'Winner entry not found' });

    // Update verification state based on administrative action
    ticket.verificationStatus = action; 
    
    // FIX: Keep payout status synchronized with compliance states
    if (action === 'Approved') {
      ticket.payoutStatus = 'Paid'; 
    } else if (action === 'Rejected') {
      ticket.payoutStatus = 'Pending'; // Resets status state if screenshot proof fails audit 
    }
    
    // Save state adjustments to collection
    await draw.save();

    // Trigger outbound system alert notifications upon valid administrative confirmation
    if (action === 'Approved') {
      try {
        // Extract raw string value safely whether userId contains object context or hex strings
        const targetUserId = ticket.userId._id || ticket.userId;
        const luckyUser = await User.findById(targetUserId);
        
        if (luckyUser) {
          await dispatchWinnerAlertEmail(
            luckyUser.email, 
            luckyUser.name, 
            ticket.prizeAllocated, 
            ticket.matchTier
          );
        }
      } catch (emailErr) {
        console.error("Non-blocking winner confirmation email failure:", emailErr.message);
      }
    }

    // FIX: Re-populate the draw structure data completely before routing response objects back to Client
    // This stops the admin UI screen fields from flipping back into unpopulated hex IDs!
    const reHydratedDraw = await Draw.findById(drawId).populate({
      path: 'winners.userId',
      select: 'name email'
    });

    res.status(200).json({ success: true, data: reHydratedDraw });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminMetricsSummary = async (req, res) => {
  try {
    const totalUsersCount = await User.countDocuments(); 
    const activeSubscribers = await User.countDocuments({ 'subscription.status': 'active' });
    
    const historicalDraws = await Draw.find({ isPublished: true });
    const aggregatedPrizePools = historicalDraws.reduce((sum, current) => sum + (current.prizePoolTotal || 0), 0); 

    const simulatedCharityAggregate = activeSubscribers * 50 * 0.15; 

    res.status(200).json({
      success: true,
      metrics: {
        totalRegisteredUsers: totalUsersCount, 
        activeSubscribersCount: activeSubscribers,
        totalPrizePoolDistributed: aggregatedPrizePools, 
        estimatedCharityContributions: simulatedCharityAggregate,
        totalDrawsExecuted: historicalDraws.length 
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const publishDrawResults = async (req, res) => {
  const { drawMonth, winningNumbers, prizePoolTotal } = req.body;

  try {
    const existingDraw = await Draw.findOne({ drawMonth, isPublished: true });
    if (existingDraw) {
      return res.status(400).json({ success: false, message: 'Draw results already published for this cycle period.' });
    }

    const activeSubscribers = await User.find({ 'subscription.status': 'active' });
    const tempWinnerRoster = [];
    const tierWinnerCounts = { 5: 0, 4: 0, 3: 0 };

    for (const subscriber of activeSubscribers) {
      const userScores = await GolfScore.find({ userId: subscriber._id })
        .sort({ scoreDate: -1 })
        .limit(5); 

      const scoreValues = userScores.map(s => s.score);
      const matchCount = scoreValues.filter(score => winningNumbers.includes(score)).length;

      if (matchCount >= 3) {
        tierWinnerCounts[matchCount]++;
        tempWinnerRoster.push({
          userId: subscriber._id,
          matchTier: matchCount,
          proofImageUrl: '',
          verificationStatus: 'Pending',
          payoutStatus: 'Pending'
        });
      }
    }

    const finalizedWinners = tempWinnerRoster.map(winner => {
      const tier = winner.matchTier;
      const totalTierPool = prizePoolTotal * PRIZE_ALLOCATION[`TIER_${tier}`];
      const participantCount = tierWinnerCounts[tier];
      winner.prizeAllocated = participantCount > 0 ? (totalTierPool / participantCount).toFixed(2) : 0;
      return winner;
    });

    const publishedDraw = await Draw.create({
      drawMonth,
      winningNumbers,
      prizePoolTotal,
      isPublished: true,
      winners: finalizedWinners
    });

    try {
      for (const subscriber of activeSubscribers) {
        await dispatchDrawResultsEmail(subscriber.email, drawMonth);
      }
    } catch (emailErr) {
      console.error("Non-blocking draw results notification blast failure:", emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: `Draw published successfully. Evaluated ${activeSubscribers.length} subscribers. Found ${finalizedWinners.length} winners.`,
      data: publishedDraw
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};