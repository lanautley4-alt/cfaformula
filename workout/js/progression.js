/* ============================================================
   Workout Tracker — Progressive Overload Engine
   ------------------------------------------------------------
   Double progression with simple guardrails, per exercise:
   - Hit target reps on EVERY completed set → next suggestion
     goes up by the exercise's increment.
   - Miss target by more than 2 reps on any set → hold weight.
   - Miss two sessions in a row → suggest a ~10% deload.
   - Bodyweight / timed movements progress by reps or seconds.
   ============================================================ */

// History entry shape: { date, sets: [{weight, reps, done}], targetReps }
// Returns: { weight, reps, note } — the suggestion for the next session.

function suggestNext(exercise, history, programItem) {
  const targetReps = programItem.reps;
  const baseWeight = programItem.weight || 0;

  const sessions = (history || [])
    .filter(h => h.sets.some(s => s.done))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (!sessions.length) {
    return { weight: baseWeight, reps: targetReps, note: '' };
  }

  const last = sessions[sessions.length - 1];
  const prev = sessions[sessions.length - 2];

  const doneSets = last.sets.filter(s => s.done);
  const lastWeight = Math.max(...doneSets.map(s => Number(s.weight) || 0), 0);
  const lastTarget = last.targetReps || targetReps;

  const hitAll  = doneSets.length >= last.sets.length &&
                  doneSets.every(s => (Number(s.reps) || 0) >= lastTarget);
  const badMiss = doneSets.some(s => (Number(s.reps) || 0) < lastTarget - 2) ||
                  doneSets.length < last.sets.length;

  // Bodyweight / timed: progress reps or seconds instead of load
  if (exercise.load !== 'weight') {
    const lastBest = Math.max(...doneSets.map(s => Number(s.reps) || 0), 0);
    const unit = exercise.repUnit || 'rep';
    if (hitAll) {
      const bump = unit === 'sec' ? 5 : (unit === 'm' || unit === 'cal' || unit === 'yd' ? 0 : 1);
      return { weight: lastWeight, reps: lastBest + bump, note: bump ? `+${bump} ${unit}` : '' };
    }
    return { weight: lastWeight, reps: Math.max(lastBest, targetReps), note: '' };
  }

  const inc = exercise.inc || 5;

  if (hitAll) {
    const next = Math.max(0, roundToHalf(lastWeight + inc));
    return { weight: next, reps: targetReps, note: `+${Math.abs(inc)} lbs — you earned it` };
  }

  if (badMiss && prev) {
    const prevDone   = prev.sets.filter(s => s.done);
    const prevTarget = prev.targetReps || targetReps;
    const prevMissed = prevDone.some(s => (Number(s.reps) || 0) < prevTarget - 2) ||
                       prevDone.length < prev.sets.length;
    if (prevMissed) {
      const deload = Math.max(0, roundToFive(lastWeight * 0.9));
      return { weight: deload, reps: targetReps, note: 'deload ~10% — build back up' };
    }
  }

  return { weight: lastWeight, reps: targetReps, note: badMiss ? 'same weight — get all the reps' : '' };
}

function roundToHalf(n) { return Math.round(n * 2) / 2; }
function roundToFive(n) { return Math.round(n / 5) * 5; }
