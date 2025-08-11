const SuspectModel = require('../models/SuspectSchema');
const PatternAlert = require('../models/PatternAlert');

async function checkAndCreateAlerts(suspect) {
  // 1) Name-based
  console.log('Checking suspect for patterns:', suspect);
  if (!suspect.suspectedName) {
    console.warn('Suspect has no name to check for patterns');
    return;
  }
  if (suspect.suspectedName) {
    const name = suspect.suspectedName.trim().toLowerCase();
    const since = new Date(Date.now() - 7*24*60*60*1000);
    const matches = await SuspectModel.find({
      suspectedName: { $regex: new RegExp('^' + escapeRegex(name) + '$','i') },
      createdAt: { $gte: since }
    }).select('_id complainId').lean();

    if (matches.length >= 3) {
      const complaints = matches.map(m => m.complainId).filter(Boolean);
      await upsertPatternAlert('name', name, complaints);
    }
  }

  // 2) Card number (masked) based
  if (suspect.suspectedCardNumber) {
    const masked = suspect.suspectedCardNumber; // already masked at save
    const since = new Date(Date.now() - 30*24*60*60*1000);
    const matches = await SuspectModel.find({
      suspectedCardNumber: masked,
      createdAt: { $gte: since }
    }).select('_id complainId').lean();
    if (matches.length >= 3) {
      const complaints = matches.map(m => m.complainId).filter(Boolean);
      await upsertPatternAlert('cardNumber', masked, complaints);
    }
  }

  // 3) Images
  if (suspect.suspectedImages && suspect.suspectedImages.length) {
    const since = new Date(Date.now() - 30*24*60*60*1000);
    for (const imgHash of suspect.suspectedImages) {
      const matches = await SuspectModel.find({ suspectedImages: imgHash, createdAt: { $gte: since } }).select('_id complainId').lean();
      if (matches.length >= 3) {
        const complaints = matches.map(m => m.complainId).filter(Boolean);
        await upsertPatternAlert('imageHash', imgHash, complaints);
      }
    }
  }
}

async function upsertPatternAlert(type, key, complaints) {
  const now = new Date();
  const existing = await PatternAlert.findOne({ type, key });
  console.log('Checking existing alert:', type, key, existing);
  if (existing) {
    existing.count = Math.max(existing.count, complaints.length);
    existing.lastDetectedAt = now;
    existing.complaints = Array.from(new Set([...(existing.complaints||[]), ...complaints]));
    existing.riskScore = computeRisk(type, key, existing.count);
    await existing.save();
    return existing;
  } else {
    const alert = new PatternAlert({
      type,
      key,
      count: complaints.length,
      complaints,
      firstDetectedAt: now,
      lastDetectedAt: now,
      riskScore: computeRisk(type, key, complaints.length)
    });
    await alert.save();
    return alert;
  }
}

function computeRisk(type, key, count) {
  // simple heuristic - you can improve
  if (type === 'cardNumber') return 'High';
  if (count >= 10) return 'High';
  if (count >= 5) return 'Medium';
  return 'Low';
}

function escapeRegex(s){
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = { checkAndCreateAlerts };
