// App state: one plain object, changed only through reducer actions,
// saved to localStorage (real data only; Demo Mode keeps its own copy in memory).
import { CREATORS, DEFAULT_FOLLOWS, POSTS, POST_BY_ID } from './data/posts.js';
import { dayKey } from './lib/util.js';

export const STORAGE_KEY = 'scrollwise:v1';
export const SESSION_POSTS = 8; // default posts per session (users can pick 5, 8 or 12)
export const POST_CHOICES = [5, 8, 12];
export const DEMO_POSTS = 3;

// A session never asks for more posts than the feed has.
export const capBudget = (n) => Math.max(1, Math.min(n, POSTS.length || 1));

// Feed order for a new session: posts you haven't seen yet first (in feed order),
// then ones you've seen before, the longest-ago first. `fresh` = how many are new.
export function sessionOrder(seen = {}) {
  const fresh = POSTS.filter((p) => !seen[p.id]).map((p) => p.id);
  const old = POSTS.filter((p) => seen[p.id])
    .sort((a, b) => seen[a.id] - seen[b.id])
    .map((p) => p.id);
  return { order: [...fresh, ...old], fresh: fresh.length };
}

// How many posts in the feed haven't been seen yet.
export const unseenCount = (seen = {}) => POSTS.filter((p) => !seen[p.id]).length;

// A session's size: never more than the posts that are still new, so posts aren't recycled while
// new ones remain. Only when everything has been seen does a session show earlier posts again.
export const sessionSize = (budget, seen = {}) => {
  const fresh = unseenCount(seen);
  return Math.max(1, Math.min(budget, fresh > 0 ? fresh : POSTS.length || 1));
};

export function newSession(id, budget, minutes, timerOn, kind = 'full', seen = {}) {
  const { order, fresh } = sessionOrder(seen);
  return {
    id,
    budget: sessionSize(budget, seen),
    order,
    fresh,
    kind,
    limitMs: timerOn ? minutes * 60000 : 0,
    elapsedMs: 0,
    viewed: [],
    startedAt: Date.now(),
    activeAt: Date.now(),
    ended: null,
    reminded: { half: false, last: false },
  };
}

// A session is "stale" once nobody has used it for 3 hours, or when the day has changed.
export const FRESH_AFTER_MS = 3 * 60 * 60 * 1000;
export function isStale(session, now = Date.now()) {
  if (!session) return false;
  const touched = session.ended || session.viewed.length || session.elapsedMs > 0;
  if (!touched) return false;
  const last = session.ended ? session.ended.at : session.activeAt || session.startedAt;
  return now - last > FRESH_AFTER_MS || dayKey(new Date(last)) !== dayKey(new Date(now));
}

export function defaultSettings(demo = false) {
  return {
    minutes: 10,
    timerOn: true,
    reminders: true,
    posts: SESSION_POSTS,
    motion: 'system',
    interests: demo ? [] : ['photography', 'art', 'nature'],
    // personal goals shown on the dashboard
    goals: { dailyMinutes: 20, weeklyMoments: 3, stopShare: 70 },
  };
}

const EMPTY_DAY = { browseMs: 0, posts: 0, started: 0, completed: 0, sessions: 0, continues: 0 };

export function freshState(demo = false) {
  const settings = defaultSettings(demo);
  return {
    v: 1,
    demo,
    onboarded: false,
    settings,
    likes: {},
    saves: {},
    seen: {}, // every post ever viewed, used for creator profiles
    recent: [], // activities recently suggested, so new rounds feel fresh
    follows: Object.fromEntries(DEFAULT_FOLLOWS.map((u) => [u, 1])),
    comments: {},
    savedActs: {},
    done: {},
    active: null,
    session: newSession(1, demo ? DEMO_POSTS : settings.posts, settings.minutes, settings.timerOn),
    // sessions = feeds that reached their stopping point; continues = times "Continue intentionally" was chosen
    totals: { browseMs: 0, posts: 0, started: 0, completed: 0, sessions: 0, sessionMs: 0, continues: 0, finished: 0 },
    dismissed: {}, // one-time notes the user has closed
    daily: {},
    history: [],
    picks: null,
  };
}

// Keeps a saved session valid when the feed's posts have changed since it was stored.
function fixSession(ss, seen) {
  const viewed = (ss.viewed || []).filter((id) => POST_BY_ID[id]);
  const known = Array.isArray(ss.order) && ss.order.every((id) => POST_BY_ID[id]) && ss.order.length === POSTS.length;
  if (known && viewed.length === (ss.viewed || []).length) return { ...ss, budget: capBudget(ss.budget) };
  const others = Object.fromEntries(Object.entries(seen).filter(([id]) => !viewed.includes(id)));
  const rest = sessionOrder(others);
  const order = [...viewed, ...rest.order.filter((id) => !viewed.includes(id))];
  return { ...ss, viewed, order, fresh: Math.min(order.length, viewed.length + rest.fresh), budget: Math.max(viewed.length, capBudget(ss.budget)) };
}

// Drops creators who are no longer in the feed; starts from the default follows if none are left.
function knownFollows(saved, fallback) {
  if (!saved) return fallback;
  const kept = Object.fromEntries(Object.entries(saved).filter(([u]) => CREATORS[u]));
  return Object.keys(kept).length || !Object.keys(saved).length ? kept : fallback;
}

export function loadState() {
  const base = freshState(false);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw);
    if (!saved || saved.v !== 1) return base;
    const loaded = {
      ...base,
      ...saved,
      demo: false,
      settings: { ...base.settings, ...saved.settings, goals: { ...base.settings.goals, ...(saved.settings && saved.settings.goals) } },
      dismissed: saved.dismissed || {},
      seen: saved.seen || {},
      follows: knownFollows(saved.follows, base.follows),
      recent: saved.recent || [],
      totals: { ...base.totals, ...saved.totals },
      session: fixSession({ ...base.session, ...saved.session, reminded: { ...base.session.reminded, ...(saved.session && saved.session.reminded) } }, saved.seen || {}),
    };
    return reducer(loaded, { type: 'FRESH_VISIT' });
  } catch (e) {
    return base;
  }
}

export function saveState(state) {
  if (state.demo) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    /* storage can be unavailable (private mode); the app keeps working in memory */
  }
}

function bump(daily, field, n = 1) {
  const k = dayKey();
  const d = { ...EMPTY_DAY, ...daily[k] };
  return { ...daily, [k]: { ...d, [field]: (d[field] || 0) + n } };
}

const log = (history, entry) => [entry, ...history].slice(0, 150);

function toggle(map, key) {
  const next = { ...map };
  if (next[key]) delete next[key];
  else next[key] = Date.now();
  return next;
}

export function reducer(s, a) {
  switch (a.type) {
    case 'ONBOARD':
      return s.onboarded ? s : { ...s, onboarded: true };

    case 'LIKE':
      return { ...s, likes: toggle(s.likes, a.id) };
    case 'LIKE_ON':
      return s.likes[a.id] ? s : { ...s, likes: { ...s.likes, [a.id]: Date.now() } };
    case 'SAVE_POST':
      return { ...s, saves: toggle(s.saves, a.id) };
    case 'FOLLOW':
      return { ...s, follows: toggle(s.follows, a.user) };
    case 'COMMENT': {
      const text = (a.text || '').trim().slice(0, 300);
      if (!text) return s;
      const list = [...(s.comments[a.id] || []), { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text, at: Date.now() }];
      return { ...s, comments: { ...s.comments, [a.id]: list } };
    }
    case 'DEL_COMMENT': {
      const list = (s.comments[a.id] || []).filter((c) => c.id !== a.cid);
      return { ...s, comments: { ...s.comments, [a.id]: list } };
    }

    case 'VIEW_POST': {
      const ss = s.session;
      if (ss.ended || ss.viewed.includes(a.id) || ss.viewed.length >= ss.budget) return s;
      return {
        ...s,
        seen: { ...s.seen, [a.id]: Date.now() },
        session: { ...ss, viewed: [...ss.viewed, a.id], activeAt: Date.now() },
        totals: { ...s.totals, posts: s.totals.posts + 1 },
        daily: bump(s.daily, 'posts'),
      };
    }
    case 'TIME': {
      const ms = Math.max(0, Math.min(a.ms, 5000));
      if (s.session.ended || !ms) return s;
      return {
        ...s,
        session: { ...s.session, elapsedMs: s.session.elapsedMs + ms, activeAt: Date.now() },
        totals: { ...s.totals, browseMs: s.totals.browseMs + ms },
        daily: bump(s.daily, 'browseMs', ms),
      };
    }
    case 'REMIND':
      return { ...s, session: { ...s.session, reminded: { ...s.session.reminded, [a.which]: true } } };
    case 'END_SESSION': {
      if (s.session.ended) return s;
      const ss = s.session;
      return {
        ...s,
        session: { ...ss, ended: { reason: a.reason, at: Date.now() }, decision: null },
        totals: { ...s.totals, sessions: (s.totals.sessions || 0) + 1, sessionMs: (s.totals.sessionMs || 0) + ss.elapsedMs },
        daily: bump(s.daily, 'sessions'),
        history: log(s.history, { type: 'session', at: Date.now(), ms: ss.elapsedMs, posts: ss.viewed.length, reason: a.reason }),
      };
    }
    // What the user chose at the stopping point: 'moment' (Find Your Next Moment) or 'done' (finish for now).
    case 'DECIDE': {
      const ss = s.session;
      if (!ss.ended || ss.decision) return s;
      const finished = a.decision === 'done' ? (s.totals.finished || 0) + 1 : s.totals.finished || 0;
      return { ...s, session: { ...ss, decision: a.decision }, totals: { ...s.totals, finished } };
    }
    case 'NEW_SESSION': {
      // Starting again after a stopping point is a conscious decision to continue.
      const continued = !!s.session.ended && s.session.decision !== 'continue';
      return {
        ...s,
        session: newSession(s.session.id + 1, a.budget, a.minutes, s.settings.timerOn, a.kind, s.seen),
        totals: continued ? { ...s.totals, continues: (s.totals.continues || 0) + 1 } : s.totals,
        daily: continued ? bump(s.daily, 'continues') : s.daily,
        history: continued ? log(s.history, { type: 'continue', at: Date.now(), posts: a.budget }) : s.history,
      };
    }
    // Coming back hours later (or on another day) is a new visit, so it gets a fresh session.
    // That isn't counted as "continuing": the stopping point already did its job.
    case 'FRESH_VISIT': {
      if (s.demo || !isStale(s.session)) return s;
      return { ...s, session: newSession(s.session.id + 1, s.settings.posts, s.settings.minutes, s.settings.timerOn, 'full', s.seen) };
    }
    case 'DISMISS':
      return { ...s, dismissed: { ...s.dismissed, [a.key]: Date.now() } };

    case 'SAVE_ACT':
      return { ...s, savedActs: toggle(s.savedActs, a.id) };
    case 'START_ACT': {
      if (s.active && s.active.id === a.id) return s;
      return {
        ...s,
        active: { id: a.id, at: Date.now(), endsAt: null, leftMs: null, step: 0, checks: a.checks || [] },
        totals: { ...s.totals, started: s.totals.started + 1 },
        daily: bump(s.daily, 'started'),
        history: log(s.history, { type: 'start', id: a.id, at: Date.now() }),
      };
    }
    case 'ACT_TIMER':
    case 'ACT_PATCH':
      if (!s.active || s.active.id !== a.id) return s;
      return { ...s, active: { ...s.active, ...a.patch } };
    case 'COMPLETE_ACT': {
      const wasStarted = s.active && s.active.id === a.id;
      let totals = { ...s.totals, completed: s.totals.completed + 1 };
      let daily = bump(s.daily, 'completed');
      let history = s.history;
      if (!wasStarted) {
        totals = { ...totals, started: totals.started + 1 };
        daily = bump(daily, 'started');
        history = log(history, { type: 'start', id: a.id, at: Date.now() - 1 });
      }
      history = log(history, { type: 'complete', id: a.id, at: Date.now(), mid: a.mid });
      const prev = s.done[a.id];
      return {
        ...s,
        totals,
        daily,
        history,
        active: wasStarted ? null : s.active,
        done: { ...s.done, [a.id]: { n: (prev ? prev.n : 0) + 1, last: Date.now() } },
      };
    }

    case 'SET': {
      const settings = { ...s.settings, [a.key]: a.value };
      let session = s.session;
      if (a.key === 'posts' && !session.ended && session.kind === 'full') {
        // resize the current session: never below what's already been viewed, never past the new posts left
        const left = unseenCount(s.seen);
        const want = left > 0 ? Math.min(a.value, session.viewed.length + left) : Math.min(a.value, POSTS.length || 1);
        session = { ...session, budget: Math.max(session.viewed.length, 1, want) };
      }
      if ((a.key === 'minutes' || a.key === 'timerOn') && !session.ended) {
        if (!settings.timerOn) session = { ...session, limitMs: 0 };
        else if (session.kind === 'full' || a.key === 'timerOn') {
          const want = (session.kind === 'full' ? settings.minutes : Math.max(1, Math.round(session.budget))) * 60000;
          session = { ...session, limitMs: Math.max(want, session.elapsedMs + 30000) };
        }
      }
      return { ...s, settings, session };
    }
    case 'PICKS':
      return { ...s, picks: a.picks };
    case 'SHOWN': {
      const recent = [...a.ids, ...s.recent.filter((id) => !a.ids.includes(id))].slice(0, 16);
      return { ...s, recent };
    }
    case 'GOAL':
      return { ...s, settings: { ...s.settings, goals: { ...s.settings.goals, [a.key]: a.value } } };
    case 'RESET_SETTINGS': {
      const settings = defaultSettings(s.demo);
      let session = s.session;
      if (!session.ended && session.kind === 'full') session = { ...session, limitMs: Math.max(settings.minutes * 60000, session.elapsedMs + 30000) };
      return { ...s, settings, session };
    }
    case 'RESET':
      return { ...freshState(s.demo), onboarded: true };
    case 'REPLACE':
      return a.state;
    default:
      return s;
  }
}
