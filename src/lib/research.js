// Research mode: storage, CSV export and plain descriptive summaries.
//
// Design: every participant tries BOTH feeds, one after the other ("within-subjects").
//   Mode A: a conventional feed that keeps loading posts.
//   Mode B: the ScrollWise feed, which stops after a set number of posts or the participant's chosen time.
// Half the participants do A then B, the other half B then A (counterbalancing), so that
// getting tired or bored in the second feed doesn't unfairly favour either mode.
//
// Records stay in this browser only (localStorage key below), separate from normal ScrollWise data,
// until the team exports them. A record holds a participant code (P001…), timings, counts and the
// optional answers. No names, ages, schools, devices or locations are recorded.

export const RESEARCH_KEY = 'scrollwise:research:v2';
const OLD_KEY = 'scrollwise:research:v1';
export const RESEARCH_VERSION = 'scrollwise-research-2';

export const MODES = {
  A: { id: 'A', name: 'Mode A', label: 'Conventional continuously loading feed', short: 'Continuous feed', plain: 'the feed that kept loading new posts' },
  B: { id: 'B', name: 'Mode B', label: 'ScrollWise feed with limited posts and a stopping point', short: 'ScrollWise feed', plain: 'the feed that stopped after a set number of posts' },
};

export const END_REASONS = {
  'stopped-voluntarily': 'Stopped by choice while browsing',
  'stopped-at-stopping-point': 'Stopped by choice at the stopping point',
  'max-time': 'Reached the maximum test time',
};

// Asked after each feed. Wording is neutral on purpose: no question suggests a "right" answer.
export const QUESTIONS = [
  { id: 'awareness', text: 'While browsing, how aware were you of how much time was passing?', low: 'Not aware', high: 'Very aware' },
  { id: 'control', text: 'How much control did you feel over when you stopped?', low: 'No control', high: 'Full control' },
  { id: 'ease', text: 'How easy or difficult was it to stop browsing?', low: 'Very difficult', high: 'Very easy' },
  { id: 'overall', text: 'Overall, how was this browsing experience?', low: 'Very negative', high: 'Very positive' },
];
// Asked once, after both feeds.
export const FINAL_QUESTION = { id: 'useAgain', text: `How likely would you be to use ${MODES.B.plain} again?`, low: 'Very unlikely', high: 'Very likely' };

export const ORDERS = { AB: ['A', 'B'], BA: ['B', 'A'] };

/* ---------- storage ---------- */
function migrate(oldRuns) {
  // Version 1 recorded single runs without an order. Kept, so nothing is lost.
  const reason = { 'participant-stopped': 'stopped-voluntarily' };
  return oldRuns.map((r, i) => ({
    id: `v1-${i}-${r.startedAt}`,
    participant: r.participant,
    order: '',
    position: 1,
    mode: r.mode,
    startedAt: r.startedAt,
    maxMinutes: r.maxMinutes,
    intendedMinutes: null,
    postLimit: r.mode === 'B' ? r.postLimit : null,
    durationMs: r.durationMs,
    postsViewed: r.postsViewed,
    uniquePosts: r.uniquePosts,
    reachedStop: r.mode === 'B' ? r.endReason === 'stopped-at-stopping-point' || r.continues > 0 : null,
    continues: r.mode === 'B' ? r.continues || 0 : null,
    endReason: reason[r.endReason] || r.endReason,
    answers: { control: (r.answers && r.answers.control) || null },
    final: { comment: (r.answers && r.answers.comment) || '' },
    version: 'scrollwise-research-1',
  }));
}

export function loadRuns() {
  try {
    const raw = window.localStorage.getItem(RESEARCH_KEY);
    const data = raw ? JSON.parse(raw) : null;
    if (data && Array.isArray(data.runs)) return data.runs;
    const old = window.localStorage.getItem(OLD_KEY);
    const oldData = old ? JSON.parse(old) : null;
    if (oldData && Array.isArray(oldData.runs) && oldData.runs.length) {
      const runs = migrate(oldData.runs);
      if (saveRuns(runs)) window.localStorage.removeItem(OLD_KEY);
      return runs;
    }
    return [];
  } catch (e) {
    return [];
  }
}

export function saveRuns(runs) {
  try {
    window.localStorage.setItem(RESEARCH_KEY, JSON.stringify({ v: 2, runs }));
    return true;
  } catch (e) {
    return false;
  }
}

// Adds a record once. Saving the same record twice (a double tap, a slow phone) changes nothing.
export function addRun(runs, record) {
  return runs.some((r) => r.id === record.id) ? runs : [...runs, record];
}

export const newRecordId = () => `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/* ---------- participants ---------- */
export const normCode = (id) => String(id || '').trim().toUpperCase();
// Codes may only use letters, numbers and dashes, so a name or an email can't be typed by mistake.
export const validParticipantId = (id) => /^[A-Za-z0-9-]{1,12}$/.test(String(id || '').trim());

export function participants(runs) {
  const map = new Map();
  for (const r of runs) {
    const k = normCode(r.participant);
    if (!map.has(k)) map.set(k, { code: k, order: r.order, modes: new Set(), first: r.startedAt });
    const p = map.get(k);
    p.modes.add(r.mode);
    if (!p.order && r.order) p.order = r.order;
  }
  return [...map.values()];
}

// Which modes this code has already done on this device.
export function doneModes(runs, code) {
  const k = normCode(code);
  return new Set(runs.filter((r) => normCode(r.participant) === k).map((r) => r.mode));
}

// Suggests the next unused code: P001, P002 …
export function nextParticipantId(runs) {
  const used = new Set(runs.map((r) => normCode(r.participant)));
  for (let n = 1; n < 10000; n++) {
    const id = `P${String(n).padStart(3, '0')}`;
    if (!used.has(id)) return id;
  }
  return `P${Date.now() % 100000}`;
}

// Counterbalancing: participants alternate A→B and B→A in the order they start on this device.
export function autoOrder(runs) {
  return participants(runs).length % 2 === 0 ? 'AB' : 'BA';
}

// A simple seeded shuffle, so each participant gets their own post order, used for both feeds.
export function seededOrder(list, seedText) {
  let seed = 7;
  for (const ch of seedText) seed = (seed * 31 + ch.charCodeAt(0)) % 2147483647;
  const rnd = () => {
    seed = (seed * 48271) % 2147483647;
    return seed / 2147483647;
  };
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/* ---------- CSV ---------- */
const yesNo = (v) => (v === true ? 'yes' : v === false ? 'no' : '');
const ans = (r, k) => (r.answers && r.answers[k] != null && r.answers[k] !== '' ? r.answers[k] : '');

// Every column, with a short description (used in the research guide's data dictionary).
export const COLUMNS = [
  ['participant_id', 'Anonymous code, e.g. P001', (r) => r.participant],
  ['order', 'AB = Mode A first, BA = Mode B first', (r) => r.order],
  ['position', '1 = first feed this participant tried, 2 = second', (r) => r.position],
  ['mode', 'A = continuous feed, B = ScrollWise feed', (r) => r.mode],
  ['condition', 'Mode described in words', (r) => (MODES[r.mode] ? MODES[r.mode].label : r.mode)],
  ['started_at', 'Date and time the feed started (UTC)', (r) => new Date(r.startedAt).toISOString()],
  ['max_minutes', 'Maximum test time, the same for both modes', (r) => r.maxMinutes],
  ['intended_minutes', 'Mode B: browsing time the participant chose', (r) => (r.mode === 'B' ? r.intendedMinutes ?? '' : '')],
  ['post_limit', 'Mode B: posts before the stopping point', (r) => (r.mode === 'B' ? r.postLimit ?? '' : '')],
  ['duration_seconds', 'Actual browsing time (only while the feed was on screen)', (r) => Math.round(r.durationMs / 1000)],
  ['posts_viewed', 'Posts at least half on screen', (r) => r.postsViewed],
  ['unique_posts_viewed', 'Different posts viewed (Mode A can repeat posts)', (r) => r.uniquePosts],
  ['stopped_voluntarily', 'yes = the participant chose to stop', (r) => yesNo(r.endReason !== 'max-time')],
  ['max_time_reached', 'yes = the test ended at the maximum time', (r) => yesNo(r.endReason === 'max-time')],
  ['reached_stopping_point', 'Mode B: yes = the stopping point appeared', (r) => (r.mode === 'B' ? yesNo(!!r.reachedStop) : '')],
  ['chose_to_continue', 'Mode B: yes = continued at least once', (r) => (r.mode === 'B' ? yesNo((r.continues || 0) > 0) : '')],
  ['continue_decisions', 'Mode B: how many times they continued', (r) => (r.mode === 'B' ? r.continues || 0 : '')],
  ['end_reason', 'How the feed ended', (r) => r.endReason],
  ['q_time_estimate_minutes', 'Participant’s guess of minutes spent (optional)', (r) => ans(r, 'estimate')],
  ['q_time_awareness_1to5', '1 = not aware … 5 = very aware', (r) => ans(r, 'awareness')],
  ['q_control_1to5', '1 = no control … 5 = full control', (r) => ans(r, 'control')],
  ['q_ease_of_stopping_1to5', '1 = very difficult … 5 = very easy', (r) => ans(r, 'ease')],
  ['q_overall_1to5', '1 = very negative … 5 = very positive', (r) => ans(r, 'overall')],
  ['q_use_again_1to5', 'Asked once after both feeds (on the participant’s last row)', (r) => (r.final && r.final.useAgain) || ''],
  ['comment', 'Optional comment (asked once, after both feeds)', (r) => (r.final && r.final.comment) || ''],
  ['record_id', 'Unique ID of this row', (r) => r.id],
  ['app_version', 'Research mode version', (r) => r.version || RESEARCH_VERSION],
];

function cell(value) {
  let v = value === null || value === undefined ? '' : String(value);
  // Stops spreadsheet apps from treating a typed comment as a formula.
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`;
  return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export const CSV_HEADER = COLUMNS.map(([name]) => name).join(',');

export function toCSV(runs) {
  const sorted = [...runs].sort((a, b) => a.startedAt - b.startedAt);
  const rows = sorted.map((r) => COLUMNS.map(([, , get]) => cell(get(r))).join(','));
  return `${[CSV_HEADER, ...rows].join('\r\n')}\r\n`;
}

export function csvFileName(d = new Date()) {
  return `scrollwise-research-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}.csv`;
}

const BOM = '﻿'; // helps Excel read accents and emoji correctly

export function csvBlob(runs) {
  return new Blob([BOM + toCSV(runs)], { type: 'text/csv;charset=utf-8' });
}

// Normal download. Works in Chrome, Edge, Firefox and Safari (iPhone: saved to the Files app → Downloads).
export function downloadCSV(runs) {
  const url = URL.createObjectURL(csvBlob(runs));
  const a = document.createElement('a');
  a.href = url;
  a.download = csvFileName();
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// On phones and tablets: share the file to Files, Mail, AirDrop, Drive… where the browser supports it.
export function canShareCSV() {
  try {
    if (typeof File === 'undefined' || !navigator.canShare) return false;
    return navigator.canShare({ files: [new File(['x'], 'test.csv', { type: 'text/csv' })] });
  } catch (e) {
    return false;
  }
}

export async function shareCSV(runs) {
  const file = new File([BOM + toCSV(runs)], csvFileName(), { type: 'text/csv' });
  await navigator.share({ files: [file], title: 'ScrollWise research results' });
}

/* ---------- descriptive summary ---------- */
const mean = (xs) => (xs.length ? xs.reduce((n, x) => n + x, 0) / xs.length : null);
const median = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const share = (list, f) => (list.length ? list.filter(f).length / list.length : null);
const nums = (list, f) => list.map(f).filter((v) => v !== null && v !== undefined && v !== '' && !Number.isNaN(Number(v))).map(Number);

// Plain descriptive numbers, computed only from the records on this device.
export function summarize(runs) {
  const modes = ['A', 'B'].map((m) => {
    const list = runs.filter((r) => r.mode === m);
    const est = list.filter((r) => r.answers && r.answers.estimate !== '' && r.answers.estimate != null);
    return {
      mode: m,
      runs: list.length,
      minutes: mean(list.map((r) => r.durationMs / 60000)),
      medianMinutes: median(list.map((r) => r.durationMs / 60000)),
      posts: mean(list.map((r) => r.postsViewed)),
      voluntary: share(list, (r) => r.endReason !== 'max-time'),
      maxTime: share(list, (r) => r.endReason === 'max-time'),
      reachedStop: m === 'B' ? share(list, (r) => !!r.reachedStop) : null,
      continued: m === 'B' ? share(list, (r) => (r.continues || 0) > 0) : null,
      estimateError: mean(est.map((r) => Math.abs(Number(r.answers.estimate) - r.durationMs / 60000))),
      estimates: est.length,
      awareness: mean(nums(list, (r) => r.answers && r.answers.awareness)),
      control: mean(nums(list, (r) => r.answers && r.answers.control)),
      ease: mean(nums(list, (r) => r.answers && r.answers.ease)),
      overall: mean(nums(list, (r) => r.answers && r.answers.overall)),
    };
  });
  // Participants who tried both feeds: compare each person with themselves.
  const pairs = [];
  for (const p of participants(runs)) {
    const a = runs.find((r) => normCode(r.participant) === p.code && r.mode === 'A');
    const b = runs.find((r) => normCode(r.participant) === p.code && r.mode === 'B');
    if (a && b) pairs.push({ code: p.code, order: p.order, diffMin: (b.durationMs - a.durationMs) / 60000, diffPosts: b.postsViewed - a.postsViewed });
  }
  const byPos = [1, 2].map((pos) => mean(runs.filter((r) => r.position === pos && r.order).map((r) => r.durationMs / 60000)));
  return {
    modes,
    participants: participants(runs).length,
    pairs: pairs.length,
    diffMin: mean(pairs.map((p) => p.diffMin)),
    diffPosts: mean(pairs.map((p) => p.diffPosts)),
    bShorter: pairs.filter((p) => p.diffMin < 0).length,
    orders: { AB: pairs.filter((p) => p.order === 'AB').length, BA: pairs.filter((p) => p.order === 'BA').length },
    firstMin: byPos[0],
    secondMin: byPos[1],
    useAgain: mean(nums(runs, (r) => r.final && r.final.useAgain)),
  };
}
