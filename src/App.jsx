import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { freshState, loadState, reducer } from './store.js';
import { usePageVisible, usePersist, useReducedMotion } from './lib/hooks.js';
import { recommend } from './lib/recommend.js';
import { addPhoto, clearPhotos, loadPhotos, removePhoto } from './lib/photos.js';
import { ACT_BY_ID } from './data/activities.js';
import { POST_BY_ID } from './data/posts.js';
import { Brand, Sheet, Toast } from './components/ui.jsx';
import { Icon } from './components/Icon.jsx';
import { CommentsSheet, Feed, FeedAside, PostCard, ProfileSheet, SessionMeter, TimerChip, TimerSheet } from './views/Feed.jsx';
import { ContinueSheet, Pause } from './views/Pause.jsx';
import { Discover } from './views/Discover.jsx';
import { ActivityView, Celebration } from './views/Activity.jsx';
import { Dashboard } from './views/Dashboard.jsx';
import { Saved } from './views/Saved.jsx';
import { Settings } from './views/Settings.jsx';
import { Landing } from './views/Landing.jsx';
import { DemoCoach, demoStep } from './views/DemoCoach.jsx';
import { About, Privacy } from './views/About.jsx';
import { Research } from './views/Research.jsx';
import { cx } from './lib/util.js';

const NAV = [
  { id: 'feed', label: 'Home', icon: 'home', on: 'homeFill' },
  { id: 'discover', label: 'Moments', icon: 'sunrise', on: 'sunrise' },
  { id: 'saved', label: 'Saved', icon: 'bookmark', on: 'bookmarkFill' },
  { id: 'you', label: 'You', icon: 'user', on: 'userFill' },
];
const BACK_LABEL = { feed: 'feed', discover: 'your matches', saved: 'Saved', you: 'your dashboard', settings: 'Settings', about: 'About' };

/* ---------- address-bar sync, so the browser back button works ---------- */
const HASH = { welcome: 'welcome', feed: 'feed', discover: 'moments', you: 'you', saved: 'saved', settings: 'preferences', about: 'about', privacy: 'privacy', research: 'research' };
const toHash = (r) => (r.name === 'activity' ? `challenge-${r.id}` : HASH[r.name] || 'feed');
function readHash() {
  try {
    return (window.location.hash || '').replace(/^#/, '');
  } catch (e) {
    return '';
  }
}
function fromHash(h) {
  if (!h) return null;
  if (h.startsWith('challenge-')) {
    const id = h.slice('challenge-'.length);
    return ACT_BY_ID[id] ? { name: 'activity', id } : null;
  }
  const name = Object.keys(HASH).find((k) => HASH[k] === h);
  return name ? { name } : null;
}

const backTarget0 = (route) => (route.from && !['activity', 'welcome', 'research', route.name].includes(route.from) ? route.from : null);

function discFrom(state) {
  const p = state.picks;
  return { step: 0, mood: p ? p.mood : null, time: p ? p.time : null, energy: p ? p.energy || null : null, interests: p ? p.interests : state.settings.interests, seed: 1, results: [], shown: [] };
}

function PostSheet({ id, state, dispatch, onClose, openComments, onProfile }) {
  const post = POST_BY_ID[id];
  if (!post) return null;
  return (
    <Sheet title={`Post by ${post.user}`} onClose={onClose} className="sheet-post">
      <PostCard
        post={post}
        liked={!!state.likes[id]}
        saved={!!state.saves[id]}
        followed={!!state.follows[post.user]}
        mine={state.comments[id]}
        onLike={(pid) => dispatch({ type: 'LIKE', id: pid })}
        onLikeOn={(pid) => dispatch({ type: 'LIKE_ON', id: pid })}
        onSave={(pid) => dispatch({ type: 'SAVE_POST', id: pid })}
        onFollow={(user) => dispatch({ type: 'FOLLOW', user })}
        onComments={openComments}
        onProfile={onProfile}
        register={null}
      />
    </Sheet>
  );
}

function Rail({ activeNav, go, session, openTimer, onBrand, demoOn }) {
  return (
    <nav className="rail" aria-label="Main">
      <Brand size={34} onClick={onBrand} />
      <div className="rail-nav">
        {NAV.map((n) => (
          <button type="button" key={n.id} className={cx(n.id === 'discover' && 'rail-moments')} aria-current={activeNav === n.id ? 'page' : undefined} onClick={() => go(n.id)}>
            <Icon name={activeNav === n.id ? n.on : n.icon} />
            {n.label}
          </button>
        ))}
        <button type="button" aria-current={activeNav === 'settings' ? 'page' : undefined} onClick={() => go('settings')}>
          <Icon name="sliders" />
          Settings
        </button>
        <button type="button" className="rail-about" onClick={() => go('about')}>
          <Icon name="info" />
          About
        </button>
      </div>
      <div className="rail-session">
        {demoOn ? <span className="demo-pill">Demo Mode</span> : null}
        {session.ended ? (
          <>
            <p className="section-label">Session complete</p>
            <button type="button" className="btn btn-mint btn-sm btn-block" onClick={() => go('feed')}>
              See your next steps
            </button>
          </>
        ) : (
          <>
            <p className="section-label">This session</p>
            <TimerChip session={session} onClick={openTimer} />
            <SessionMeter session={session} />
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  const [real, dispatchReal] = useReducer(reducer, undefined, loadState);
  const [demo, dispatchDemo] = useReducer(reducer, undefined, () => freshState(true));
  const [demoOn, setDemoOn] = useState(false);
  const state = demoOn ? demo : real;
  const dispatch = demoOn ? dispatchDemo : dispatchReal;

  const [photosReal, setPhotosReal] = useState(() => loadPhotos(false));
  const [photosDemo, setPhotosDemo] = useState({});
  const photos = demoOn ? photosDemo : photosReal;
  const setPhotos = demoOn ? setPhotosDemo : setPhotosReal;

  const [route, setRoute] = useState(() => fromHash(readHash()) || { name: real.onboarded ? 'feed' : 'welcome' });
  const [feedTab, setFeedTab] = useState('explore');
  const [savedTab, setSavedTab] = useState('posts');
  const [disc, setDisc] = useState(() => discFrom(real));
  const [sheet, setSheet] = useState(null);
  const [toast, setToast] = useState(null);
  const [celebrate, setCelebrate] = useState(null);

  const visible = usePageVisible();
  const reduce = useReducedMotion(state.settings.motion);
  usePersist(real);

  const notify = useCallback((msg, icon, action) => setToast({ msg, icon, action, id: Date.now(), ms: action ? 5500 : 4200 }), []);
  const closeSheet = useCallback(() => setSheet(null), []);

  /* ---------- navigation ---------- */
  const scrolls = useRef({});
  const routeRef = useRef(route);
  routeRef.current = route;
  const go = useCallback((name, extra = {}) => {
    setSheet(null);
    setRoute((cur) => {
      scrolls.current[cur.name] = window.scrollY;
      return { name, ...extra, from: cur.name === name ? cur.from : cur.name };
    });
  }, []);
  const routeKey = route.name + (route.id || '');
  useLayoutEffect(() => {
    window.scrollTo(0, route.name === 'feed' ? scrolls.current.feed || 0 : 0);
    if (route.anchor) {
      const el = document.getElementById(route.anchor);
      if (el) el.scrollIntoView({ block: 'start' });
    }
  }, [routeKey, route.anchor]);
  useEffect(() => {
    const h = toHash(route);
    if (readHash() === h) return;
    try {
      if (!readHash()) window.location.replace(`#${h}`);
      else window.location.hash = h;
    } catch (e) {
      /* the address bar is optional; the app works without it */
    }
  }, [routeKey]);
  useEffect(() => {
    const onHash = () => {
      const r = fromHash(readHash());
      const cur = routeRef.current;
      if (!r || toHash(r) === toHash(cur)) return;
      setSheet(null);
      scrolls.current[cur.name] = window.scrollY;
      setRoute({ ...r, from: cur.name });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  /* ---------- browsing timer ---------- */
  const session = state.session;
  const running = route.name === 'feed' && !session.ended && visible;
  useEffect(() => {
    if (!running) return undefined;
    // Counts only time spent looking at the feed. Each tick adds at most 3 s, so if the phone sleeps or
    // the browser freezes the page without saying so, the gap isn't counted as browsing.
    const MAX_TICK = 3000;
    let last = performance.now();
    const iv = setInterval(() => {
      const now = performance.now();
      dispatch({ type: 'TIME', ms: Math.min(now - last, MAX_TICK) });
      last = now;
    }, 1000);
    return () => {
      clearInterval(iv);
      const d = performance.now() - last;
      if (d > 30) dispatch({ type: 'TIME', ms: Math.min(d, MAX_TICK) });
    };
  }, [running, dispatch, session.id]);

  // Back after a long break (or on a new day)? Start a fresh session instead of the old one.
  useEffect(() => {
    if (visible) dispatch({ type: 'FRESH_VISIT' });
  }, [visible, route.name, dispatch]);

  useEffect(() => {
    if (session.ended || !session.limitMs) return;
    const e = session.elapsedMs;
    const L = session.limitMs;
    if (e >= L) {
      dispatch({ type: 'END_SESSION', reason: 'time' });
      return;
    }
    if (!state.settings.reminders) return;
    if (L >= 4 * 60000 && !session.reminded.half && e >= L / 2) {
      dispatch({ type: 'REMIND', which: 'half' });
      const left = Math.max(1, Math.round((L - e) / 60000));
      notify(`Halfway there. About ${left} ${left === 1 ? 'minute' : 'minutes'} left in this session.`, 'clock');
    } else if (!session.reminded.last && L - e <= 60000) {
      dispatch({ type: 'REMIND', which: 'last' });
      notify('About a minute left. Enjoy the last few posts.', 'clock');
    }
  }, [session.elapsedMs, session.limitMs, session.ended, state.settings.reminders]);

  useEffect(() => {
    if (!session.ended) return;
    scrolls.current.feed = 0;
    if (route.name === 'feed') window.scrollTo(0, 0);
  }, [!!session.ended]);

  /* ---------- actions ---------- */
  const endSession = useCallback((reason) => dispatch({ type: 'END_SESSION', reason }), [dispatch]);
  const startDiscover = useCallback(
    (keepResults = false) => {
      setDisc((d) => ({ ...d, step: keepResults && d.results.length ? 3 : 0 }));
      go('discover');
    },
    [go],
  );
  const startWithMood = (mood) => {
    setDisc((d) => ({ ...d, mood, energy: null, step: 1 }));
    go('discover');
  };
  const openActivity = useCallback((id) => go('activity', { id }), [go]);
  const startActivity = useCallback(
    (id) => {
      dispatch({ type: 'START_ACT', id });
      go('activity', { id });
    },
    [dispatch, go],
  );
  const complete = (id) => {
    const mid = `${id}-${Date.now()}`;
    dispatch({ type: 'COMPLETE_ACT', id, mid });
    setCelebrate({ id, n: state.totals.completed + 1, mid });
  };
  const another = () => {
    const cur = route.id;
    const ids = disc.results.map((r) => r.id);
    const i = ids.indexOf(cur);
    let next = null;
    if (i >= 0 && ids.length > 1) next = ids[(i + 1) % ids.length];
    else if (i < 0 && ids.length) next = ids[0];
    if (!next) {
      const curA = ACT_BY_ID[cur];
      const picks = state.picks || { mood: curA ? curA.moods[0] : 'curious', time: 30, interests: state.settings.interests };
      const list = recommend(picks, { seed: Date.now() % 997, exclude: [cur], count: 5, recent: state.recent });
      next = list.length ? list[Math.floor(Math.random() * list.length)].a.id : cur;
    }
    go('activity', { id: next });
  };
  const startSession = (opt) => {
    dispatch({ type: 'NEW_SESSION', budget: opt.budget, minutes: opt.minutes, kind: opt.kind });
    setSheet(null);
    setFeedTab('explore');
    scrolls.current.feed = 0;
    window.scrollTo(0, 0);
  };
  const openComments = useCallback((id) => setSheet({ type: 'comments', id }), []);
  const openTimer = useCallback(() => setSheet({ type: 'timer' }), []);
  const openProfile = useCallback((user) => setSheet({ type: 'profile', user }), []);
  const onSaveToast = useCallback(
    () =>
      notify('Saved to your collection.', 'bookmarkFill', {
        label: 'View',
        run: () => {
          setSavedTab('posts');
          go('saved');
        },
      }),
    [go, notify],
  );
  const addMemoryPhoto = (mid, src) => {
    const next = addPhoto(demoOn, mid, src);
    if (!next) return false;
    setPhotos(next);
    return true;
  };
  const removeMemoryPhoto = (mid) => setPhotos(removePhoto(demoOn, mid));

  const startDemo = () => {
    dispatchDemo({ type: 'REPLACE', state: { ...freshState(true), onboarded: true } });
    setPhotosDemo(clearPhotos(true));
    setDemoOn(true);
    setDisc({ step: 0, mood: null, time: null, energy: null, interests: [], seed: 1, results: [], shown: [] });
    setCelebrate(null);
    setFeedTab('explore');
    scrolls.current = {};
    go('feed');
  };
  const exitDemo = () => {
    setDemoOn(false);
    setPhotosDemo(clearPhotos(true));
    setDisc(discFrom(real));
    setCelebrate(null);
    scrolls.current = {};
    go('settings');
    notify('Demo Mode is off. You’re back to your own data.', 'check');
  };

  const ideas = useMemo(() => {
    const p = state.picks;
    return recommend(
      { mood: p ? p.mood : 'curious', time: p ? p.time : 15, interests: p ? p.interests : state.settings.interests },
      { seed: session.id + 3, count: 3, done: state.done },
    );
  }, [session.id, state.picks, state.settings.interests, demoOn]);

  /* ---------- research mode: full screen, separate from everything else ---------- */
  if (route.name === 'research') {
    return <Research onExit={() => go(backTarget0(route) || 'settings')} />;
  }

  /* ---------- landing ---------- */
  if (route.name === 'welcome') {
    return (
      <Landing
        onAbout={() => go('about')}
        onPrivacy={() => go('privacy')}
        onStart={() => {
          dispatch({ type: 'ONBOARD' });
          go('feed');
        }}
        onMood={(m) => {
          dispatch({ type: 'ONBOARD' });
          startWithMood(m);
        }}
      />
    );
  }

  /* ---------- app shell ---------- */
  const activeNav = route.name === 'activity' ? 'discover' : ['about', 'privacy'].includes(route.name) ? 'settings' : route.name;
  const backTarget = backTarget0(route);

  let view;
  if (route.name === 'discover') {
    view = <Discover state={state} dispatch={dispatch} disc={disc} setDisc={setDisc} openActivity={openActivity} startActivity={startActivity} demoOn={demoOn} notify={notify} />;
  } else if (route.name === 'activity') {
    const target = backTarget || 'discover';
    view = <ActivityView id={route.id} state={state} dispatch={dispatch} onBack={() => go(target)} backLabel={BACK_LABEL[target] || 'previous page'} onComplete={complete} onAnother={another} />;
  } else if (route.name === 'you') {
    view = (
      <Dashboard
        state={state}
        dispatch={dispatch}
        photos={photos}
        removePhoto={removeMemoryPhoto}
        onDiscover={() => startDiscover(false)}
        openActivity={openActivity}
        openSettings={() => go('settings')}
        goSaved={() => {
          setSavedTab('activities');
          go('saved');
        }}
      />
    );
  } else if (route.name === 'saved') {
    view = <Saved state={state} photos={photos} dispatch={dispatch} tab={savedTab} setTab={setSavedTab} openPost={(id) => setSheet({ type: 'post', id })} openActivity={openActivity} onDiscover={() => startDiscover(false)} />;
  } else if (route.name === 'settings') {
    view = (
      <Settings
        state={state}
        dispatch={dispatch}
        demoOn={demoOn}
        onStartDemo={startDemo}
        onExitDemo={exitDemo}
        onBack={() => go(backTarget || 'you')}
        onOpen={(name) => go(name)}
        onResetSettings={() => {
          dispatch({ type: 'RESET_SETTINGS' });
          notify('Settings restored to their defaults.', 'check');
        }}
        onReset={() => {
          dispatch({ type: 'RESET' });
          setPhotos(clearPhotos(demoOn));
          setDisc(discFrom(freshState(demoOn)));
          notify(demoOn ? 'Demo data cleared.' : 'All data cleared. Fresh start.', 'check');
        }}
      />
    );
  } else if (route.name === 'about') {
    view = (
      <About
        onBack={() => go(route.from === 'welcome' ? 'welcome' : backTarget || 'settings')}
        onPrivacy={() => go('privacy')}
        onCredits={() => go('settings', { anchor: 's-credits' })}
        onStart={() => {
          dispatch({ type: 'ONBOARD' });
          go('feed');
        }}
      />
    );
  } else if (route.name === 'privacy') {
    view = <Privacy onBack={() => go(route.from === 'welcome' ? 'welcome' : backTarget || 'settings')} onReset={() => go('settings', { anchor: 's-data' })} />;
  } else if (session.ended) {
    view = (
      <Pause
        state={state}
        ideas={ideas}
        openActivity={(id) => {
          dispatch({ type: 'DECIDE', decision: 'moment' });
          openActivity(id);
        }}
        onDiscover={() => {
          dispatch({ type: 'DECIDE', decision: 'moment' });
          startDiscover(false);
        }}
        onMood={(m) => {
          dispatch({ type: 'DECIDE', decision: 'moment' });
          startWithMood(m);
        }}
        onDone={() => {
          dispatch({ type: 'DECIDE', decision: 'done' });
          go('you');
          notify('Session finished. Your browsing stats are below.', 'check');
        }}
        onContinue={() => setSheet({ type: 'continue' })}
      />
    );
  } else {
    view = (
      <div className="feed-wrap">
        <Feed state={state} dispatch={dispatch} tab={feedTab} setTab={setFeedTab} onEnd={endSession} openComments={openComments} onProfile={openProfile} onSaveToast={onSaveToast} />
        <FeedAside state={state} openTimer={openTimer} ideas={ideas} openActivity={openActivity} />
      </div>
    );
  }

  const step = demoOn ? demoStep({ state, route, disc, celebrate }) : 0;

  return (
    <div className={cx('app', demoOn && 'is-demo', route.name === 'feed' && !session.ended && 'on-feed')}>
      <Rail activeNav={activeNav} go={go} session={session} openTimer={openTimer} onBrand={() => go('welcome')} demoOn={demoOn} />
      <div className="shell">
        <header className="appbar">
          <Brand size={30} onClick={() => go('welcome')} />
          <div className="appbar-r">
            {demoOn ? <span className="demo-pill">Demo</span> : null}
            {route.name === 'feed' && !session.ended ? (
              <TimerChip session={session} onClick={openTimer} />
            ) : route.name !== 'settings' ? (
              <button type="button" className="icon-btn" onClick={() => go('settings')} aria-label="Settings">
                <Icon name="sliders" />
              </button>
            ) : null}
          </div>
        </header>
        <main id="main" className={cx('main', `route-${route.name}`)} key={demoOn ? 'demo' : 'real'}>
          <div className="view" key={routeKey}>
            {view}
          </div>
        </main>
      </div>
      <nav className="tabbar" aria-label="Main">
        {NAV.map((n) => (
          <button
            type="button"
            key={n.id}
            className={cx('tab', n.id === 'discover' && 'tab-moments')}
            aria-current={activeNav === n.id ? 'page' : undefined}
            onClick={() => (n.id === 'feed' && route.name === 'feed' ? window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }) : go(n.id))}
          >
            <span className="tab-ico">
              <Icon name={activeNav === n.id ? n.on : n.icon} size={23} />
            </span>
            <span className="tab-label">{n.label}</span>
          </button>
        ))}
      </nav>

      {sheet && sheet.type === 'comments' ? <CommentsSheet postId={sheet.id} state={state} dispatch={dispatch} onClose={closeSheet} onProfile={openProfile} /> : null}
      {sheet && sheet.type === 'timer' ? <TimerSheet state={state} dispatch={dispatch} onClose={closeSheet} /> : null}
      {sheet && sheet.type === 'continue' ? <ContinueSheet minutes={state.settings.minutes} timerOn={state.settings.timerOn} posts={state.settings.posts} seen={state.seen} onStart={startSession} onClose={closeSheet} /> : null}
      {sheet && sheet.type === 'post' ? <PostSheet id={sheet.id} state={state} dispatch={dispatch} onClose={closeSheet} openComments={openComments} onProfile={openProfile} /> : null}
      {sheet && sheet.type === 'profile' ? <ProfileSheet user={sheet.user} state={state} dispatch={dispatch} onClose={closeSheet} openPost={(id) => setSheet({ type: 'post', id })} /> : null}

      {celebrate ? (
        <Celebration
          data={celebrate}
          photo={photos[celebrate.mid] ? photos[celebrate.mid].src : null}
          reduce={reduce}
          onAddPhoto={addMemoryPhoto}
          onClose={() => setCelebrate(null)}
          onDiscover={() => {
            setCelebrate(null);
            startDiscover(true);
          }}
          onDashboard={() => {
            setCelebrate(null);
            go('you');
          }}
        />
      ) : null}

      {demoOn ? (
        <DemoCoach
          step={step}
          viewed={session.viewed.length}
          routeName={route.name}
          onExit={exitDemo}
          onRestart={startDemo}
          onDashboard={() => {
            setCelebrate(null);
            go('you');
          }}
        />
      ) : null}

      <Toast toast={toast} onDone={() => setToast(null)} />
    </div>
  );
}
