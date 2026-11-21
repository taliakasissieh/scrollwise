// Anonymous, privacy-friendly visit counts with GoatCounter (https://www.goatcounter.com).
//
// What is sent: one count per page load (the page, where the visitor came from, browser, system,
// screen size and country, which GoatCounter works out without storing the IP address), plus a few
// anonymous events, such as "reached a stopping point". Nothing about posts, comments, saved data,
// research mode or the visitor themselves is sent. GoatCounter sets no cookies and stores nothing on
// the device.
//
// Not sent at all when:
//   - no GoatCounter code is set (see "analytics" in package.json, written into docs/index.html);
//   - the visitor turned counting off in Settings, or the browser sends Do Not Track / Global Privacy Control;
//   - the page is opened from a file or on localhost (GoatCounter itself ignores those);
//   - the app is in Demo Mode or research mode.
// If the GoatCounter script can't load (offline, blocked), everything else works exactly the same.

const OFF_KEY = 'scrollwise:no-count'; // '1' = switched off on this device, '0' = switched on
// true: counting is on unless a visitor switches it off (no cookies or personal data, so no banner is needed).
// false: counting stays off until a visitor switches it on in Settings (choose this if your school prefers opt-in).
const ON_BY_DEFAULT = true;
const SCRIPT = 'https://gc.zgo.at/count.js';

// Every event ScrollWise can send. GoatCounter counts each one at most once per visitor per session,
// so the numbers mean "visitors who did this", not "how many times it happened".
export const EVENTS = {
  'view-feed': 'Opened the feed',
  'view-moments': 'Opened Find Your Next Moment',
  'view-dashboard': 'Opened the dashboard',
  'view-about': 'Opened the About page',
  'stopping-point-reached': 'Reached a stopping point',
  'choice-done': 'Chose “I’m done for now”',
  'choice-moment': 'Chose “Find Your Next Moment”',
  'choice-continue': 'Chose “Continue intentionally”',
  'moment-suggestions-shown': 'Saw offline activity suggestions',
  'activity-started': 'Started an offline activity',
  'activity-completed': 'Completed an offline activity',
  'demo-started': 'Started Demo Mode',
};

let state = 'idle'; // idle → loading → ready | failed | off
const queue = [];

function code() {
  try {
    const m = document.querySelector('meta[name="scrollwise-analytics"]');
    const v = m ? m.getAttribute('content') || '' : '';
    const c = v.startsWith('goatcounter:') ? v.slice(12).trim() : '';
    return /^[a-z0-9-]{2,50}$/.test(c) ? c : '';
  } catch (e) {
    return '';
  }
}

export const analyticsConfigured = () => !!code();

// The browser asks websites not to track (Do Not Track or Global Privacy Control).
export function browserSaysNo() {
  try {
    return navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  } catch (e) {
    return false;
  }
}

export function countingOff() {
  try {
    const v = window.localStorage.getItem(OFF_KEY);
    return v === '1' || window.localStorage.getItem('skipgc') === 't' || (!ON_BY_DEFAULT && v !== '0');
  } catch (e) {
    return false;
  }
}

export function setCountingOff(off) {
  try {
    window.localStorage.setItem(OFF_KEY, off ? '1' : '0');
  } catch (e) {
    /* storage blocked: nothing to remember */
  }
  if (off) state = 'off';
}

export const countingActive = () => analyticsConfigured() && !browserSaysNo() && !countingOff() && state !== 'off';

// Campaign links (e.g. ?utm_campaign=poster-qr) are read once, then removed from the address bar,
// so a link someone copies and shares later isn't counted as another poster visit.
function cleanAddress() {
  try {
    const u = new URL(window.location.href);
    let changed = false;
    for (const k of [...u.searchParams.keys()]) {
      if (/^(utm_[a-z]+|ref|src|source|campaign)$/i.test(k)) {
        u.searchParams.delete(k);
        changed = true;
      }
    }
    if (changed) window.history.replaceState(window.history.state, '', u.pathname + u.search + u.hash);
  } catch (e) {
    /* leave the address as it is */
  }
}

function send(item) {
  try {
    if (window.goatcounter && typeof window.goatcounter.count === 'function') window.goatcounter.count(item);
  } catch (e) {
    /* never let counting break the app */
  }
}

// Called once when the app starts. `countPage` is false when the first screen is research mode.
export function startAnalytics({ countPage = true } = {}) {
  if (state !== 'idle') return;
  if (!countingActive()) {
    state = 'off';
    cleanAddress();
    return;
  }
  state = 'loading';
  try {
    window.goatcounter = { no_onload: true, no_events: true };
    const s = document.createElement('script');
    s.async = true;
    s.src = SCRIPT;
    s.setAttribute('data-goatcounter', `https://${code()}.goatcounter.com/count`);
    s.onload = () => {
      state = 'ready';
      if (countPage) send({ path: '/', title: 'ScrollWise' });
      cleanAddress();
      while (queue.length) send(queue.shift());
    };
    s.onerror = () => {
      state = 'failed';
      queue.length = 0;
      cleanAddress();
    };
    document.head.appendChild(s);
  } catch (e) {
    state = 'failed';
    cleanAddress();
  }
}

// Sends one anonymous event by name (see EVENTS). Does nothing when counting is off.
export function track(name) {
  if (!EVENTS[name] || state === 'off' || state === 'failed' || state === 'idle') return;
  if (!countingActive()) return;
  const item = { path: name, title: EVENTS[name], event: true };
  if (state === 'ready') send(item);
  else if (queue.length < 20) queue.push(item);
}

// Maps app actions to events. Only called for real use: never in Demo Mode or research mode.
export function trackAction(action, s) {
  if (!action || !s) return;
  switch (action.type) {
    case 'END_SESSION':
      if (!s.session.ended) track('stopping-point-reached');
      break;
    case 'DECIDE':
      if (action.decision === 'done') track('choice-done');
      if (action.decision === 'moment') track('choice-moment');
      break;
    case 'NEW_SESSION':
      if (s.session.ended) track('choice-continue');
      break;
    case 'SHOWN':
      track('moment-suggestions-shown');
      break;
    case 'START_ACT':
      track('activity-started');
      break;
    case 'COMPLETE_ACT':
      track('activity-completed');
      break;
    default:
  }
}

const VIEW_EVENTS = { feed: 'view-feed', discover: 'view-moments', you: 'view-dashboard', about: 'view-about' };
export function trackView(routeName) {
  if (VIEW_EVENTS[routeName]) track(VIEW_EVENTS[routeName]);
}
