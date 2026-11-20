// Activity matching for "Find Your Next Moment".
// Plain JavaScript scoring, no AI service:
//   mood      the activity's main mood scores highest, other listed moods a bit less
//   interests each shared interest adds points; sharing none of your picks costs a little
//   energy    same energy level as you picked scores higher; one step away costs a little, the opposite (low vs lots) costs a lot
//   time      only activities that fit your time; closer to your time scores higher
//   fresh     activities suggested in recent rounds or just completed are nudged down
// Then a variety pass keeps one result set from repeating a category or a look.
import { ACTIVITIES } from '../data/activities.js';

function seeded(seed) {
  let a = Math.abs(Math.floor(seed)) % 233280 || 1;
  return () => {
    a = (a * 9301 + 49297) % 233280;
    return a / 233280;
  };
}

export function rank(picks, opts = {}) {
  const mood = picks.mood;
  const time = picks.time || 30;
  const interests = picks.interests || [];
  const energy = picks.energy || null;
  const LEVEL = { low: 0, medium: 1, high: 2 };
  const exclude = opts.exclude || [];
  const done = opts.done || {};
  const recent = opts.recent || [];
  const r = seeded(opts.seed || 1);
  return ACTIVITIES.filter((a) => a.mins <= time && !exclude.includes(a.id))
    .map((a) => {
      let score = 0;
      const moodIndex = mood ? a.moods.indexOf(mood) : -1;
      if (moodIndex === 0) score += 7;
      else if (moodIndex > 0) score += 5;
      const hits = a.interests.filter((i) => interests.includes(i));
      if (interests.length) score += hits.length ? 3.5 * Math.min(hits.length, 3) : -2;
      score += 3 * (1 - (time - a.mins) / time); // 3 points for an exact time fit
      const energyGap = energy && a.energy ? Math.abs(LEVEL[energy] - LEVEL[a.energy]) : null;
      // Energy is how you feel right now, so it counts as much as a shared interest or two.
      if (energyGap === 0) score += 4;
      else if (energyGap === 1) score -= 1.5;
      else if (energyGap === 2) score -= 6;
      const recentIndex = recent.indexOf(a.id);
      if (recentIndex >= 0) score -= 2.5 * (1 - recentIndex / 16);
      if (done[a.id]) score -= 1.5;
      score += r() * 0.8; // tiny shuffle so ties change between rounds
      return { a, score, hits, moodMatch: moodIndex >= 0, energyMatch: energyGap === 0 };
    })
    .sort((x, y) => y.score - x.score);
}

// Labels come from the real score: how close each result is to the best one.
function label(item, top) {
  if (item === top) return 'Top match';
  return item.score >= top.score * 0.82 ? 'Great match' : 'Good match';
}

export function recommend(picks, opts = {}) {
  const count = opts.count || 4;
  const pool = rank(picks, opts);
  const out = [];
  const perCat = {};
  const perLook = {};
  while (out.length < count && pool.length) {
    let best = 0;
    let bestScore = -Infinity;
    for (let i = 0; i < pool.length; i++) {
      const it = pool[i];
      // variety: avoid repeating a category or the same kind of cover image
      const s = it.score - (perCat[it.a.category] || 0) * 3.5 - (perLook[it.a.art[0]] ? 3 : 0);
      if (s > bestScore) {
        bestScore = s;
        best = i;
      }
    }
    const item = pool.splice(best, 1)[0];
    out.push(item);
    perCat[item.a.category] = (perCat[item.a.category] || 0) + 1;
    perLook[item.a.art[0]] = (perLook[item.a.art[0]] || 0) + 1;
  }
  // out[0] is always the highest raw score; the rest stay in variety order
  return out.map((item) => ({ ...item, label: label(item, out[0]) }));
}
