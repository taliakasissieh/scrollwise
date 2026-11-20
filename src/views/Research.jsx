// Research mode: a supervised comparison of two feeds, kept apart from the normal app.
//   Mode A: a conventional feed that keeps loading more posts as you scroll.
//   Mode B: the ScrollWise feed, which stops after a set number of posts or the chosen time.
// Each participant tries both, in a counterbalanced order (A→B or B→A). Both feeds use the same posts,
// the same post design and the same maximum test time. See RESEARCH-GUIDE.pdf for the full procedure.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { POSTS } from '../data/posts.js';
import { Brand, Toast } from '../components/ui.jsx';
import { Icon } from '../components/Icon.jsx';
import { PostCard } from './Feed.jsx';
import { cx, fmtClock } from '../lib/util.js';
import {
  END_REASONS,
  FINAL_QUESTION,
  MODES,
  ORDERS,
  QUESTIONS,
  RESEARCH_VERSION,
  addRun,
  autoOrder,
  canShareCSV,
  doneModes,
  downloadCSV,
  loadRuns,
  newRecordId,
  nextParticipantId,
  normCode,
  saveRuns,
  seededOrder,
  shareCSV,
  summarize,
  toCSV,
  validParticipantId,
} from '../lib/research.js';

const MAX_MINUTES = [3, 5, 10];
const POST_LIMITS = [5, 8, 12];
const INTENDED = [1, 2, 3, 5, 10];
const BATCH = 6; // Mode A loads this many more posts each time the reader nears the bottom

/* ---------------- the test feed ---------------- */
function TestFeed({ mode, participant, position, maxMinutes, postLimit, intendedMinutes, onEnd }) {
  // Same shuffled order for both feeds; the second feed starts halfway through it,
  // so a participant doesn't begin the second feed with the posts they just saw.
  const order = useMemo(() => {
    const o = seededOrder(POSTS, participant);
    const start = position === 2 ? Math.floor(o.length / 2) : 0;
    return [...o.slice(start), ...o.slice(0, start)];
  }, [participant, position]);
  const intendedMs = (intendedMinutes || maxMinutes) * 60000;
  const [count, setCount] = useState(mode === 'B' ? postLimit : 8);
  const [viewed, setViewed] = useState([]); // item keys, in the order they were viewed
  const [round, setRound] = useState({ posts: postLimit, ms: intendedMs }); // Mode B: current limits
  const [continues, setContinues] = useState(0);
  const [reachedStop, setReachedStop] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [local, setLocal] = useState({ likes: {}, saves: {}, follows: {} });
  const [toast, setToast] = useState(null);
  const ended = useRef(false);

  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const post = order[i % order.length];
        return { key: `${Math.floor(i / order.length)}-${post.id}`, post };
      }),
    [count, order],
  );
  const atStop = mode === 'B' && (viewed.length >= round.posts || elapsed >= round.ms);
  useEffect(() => {
    if (atStop) setReachedStop(true);
  }, [atStop]);

  const finish = useCallback(
    (reason) => {
      if (ended.current) return;
      ended.current = true;
      const unique = new Set(viewed.map((k) => k.split('-').slice(1).join('-')));
      onEnd({ durationMs: elapsed, postsViewed: viewed.length, uniquePosts: unique.size, continues, reachedStop: mode === 'B' ? reachedStop || atStop : null, endReason: reason });
    },
    [viewed, elapsed, continues, reachedStop, atStop, mode, onEnd],
  );

  // Browsing time: counts only while the feed is on screen, and not while the stopping point is showing.
  const pausedRef = useRef(false);
  pausedRef.current = atStop;
  useEffect(() => {
    let last = performance.now();
    const iv = setInterval(() => {
      const now = performance.now();
      const step = Math.min(now - last, 1000); // a frozen page doesn't count
      last = now; // (worked out before setElapsed: React may run the updater later)
      if (document.visibilityState === 'visible' && !pausedRef.current && !ended.current) setElapsed((e) => e + step);
    }, 250);
    return () => clearInterval(iv);
  }, []);
  useEffect(() => {
    if (elapsed >= maxMinutes * 60000) finish('max-time');
  }, [elapsed, maxMinutes, finish]);

  // A post counts as viewed once half of it has been on screen (the same rule as the main feed).
  const viewedRef = useRef(viewed);
  viewedRef.current = viewed;
  const stopRef = useRef(atStop);
  stopRef.current = atStop;
  const obs = useRef(null);
  useEffect(() => {
    obs.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const screen = e.rootBounds ? e.rootBounds.height : window.innerHeight;
          const need = Math.min(e.boundingClientRect.height, screen) * 0.5;
          const key = e.target.getAttribute('data-rkey');
          if (e.intersectionRect.height >= need - 1 && !viewedRef.current.includes(key) && !stopRef.current && !ended.current) {
            setViewed((v) => (v.includes(key) ? v : [...v, key]));
          }
        });
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    document.querySelectorAll('[data-rkey]').forEach((el) => obs.current.observe(el));
    return () => obs.current.disconnect();
  }, []);
  const register = useCallback((el) => {
    if (el && obs.current) obs.current.observe(el);
  }, []);

  // Mode A: keep loading more posts as the reader nears the bottom (no end, like most social apps).
  const sentinel = useRef(null);
  useEffect(() => {
    if (mode !== 'A' || !sentinel.current) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setCount((c) => c + BATCH);
      },
      { rootMargin: '900px 0px' },
    );
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [mode]);

  const continueRound = () => {
    setContinues((c) => c + 1);
    setRound({ posts: viewed.length + postLimit, ms: elapsed + intendedMs });
    setCount((c) => Math.max(c, viewed.length + postLimit));
  };

  const toggle = (kind, id) => setLocal((l) => ({ ...l, [kind]: { ...l[kind], [id]: l[kind][id] ? 0 : 1 } }));
  const off = () => setToast({ id: Date.now(), msg: 'Comments and profiles are turned off during this test.', icon: 'info' });
  const shown = mode === 'B' ? items.slice(0, round.posts) : items;
  const roundDone = mode === 'B' ? viewed.length - (round.posts - postLimit) : 0;
  const left = Math.max(0, Math.min(round.ms, maxMinutes * 60000) - elapsed);

  return (
    <div className={cx('rs-run', `rs-mode-${mode}`)}>
      <header className="rs-bar">
        <span className="rs-bar-title">{mode === 'B' ? <Brand size={26} /> : <b>Feed</b>}</span>
        <div className="rs-bar-r">
          {mode === 'B' ? (
            <>
              <span className="rs-meter" role="img" aria-label={`${Math.max(0, round.posts - viewed.length)} posts left before the stopping point`}>
                {Array.from({ length: postLimit }, (_, i) => (
                  <i key={i} className={cx(i < roundDone && 'on')} />
                ))}
              </span>
              <span className="rs-clock tnum" aria-label={`${fmtClock(left)} left`}>
                {fmtClock(left)}
              </span>
            </>
          ) : null}
          <button type="button" className="btn btn-outline btn-sm" onClick={() => finish('stopped-voluntarily')}>
            I’m done
          </button>
        </div>
      </header>
      <div className="feed-col rs-feed">
        <div className="posts">
          {shown.map((it) => (
            <div key={it.key} data-rkey={it.key} ref={register} className="post-slot">
              <PostCard
                post={it.post}
                liked={!!local.likes[it.post.id]}
                saved={!!local.saves[it.post.id]}
                followed={!!local.follows[it.post.user]}
                mine={null}
                onLike={(id) => toggle('likes', id)}
                onLikeOn={(id) => setLocal((l) => ({ ...l, likes: { ...l.likes, [id]: 1 } }))}
                onSave={(id) => toggle('saves', id)}
                onFollow={(u) => toggle('follows', u)}
                onComments={off}
                onProfile={off}
                register={null}
              />
            </div>
          ))}
        </div>
        {mode === 'A' ? <div ref={sentinel} className="rs-sentinel" aria-hidden="true" /> : null}
      </div>

      {atStop && !ended.current ? (
        <div className="rs-stop" role="dialog" aria-modal="true" aria-labelledby="rs-stop-title">
          <div className="rs-stop-panel">
            <p className="eyebrow on-night">Stopping point</p>
            <h2 id="rs-stop-title" className="pause-title">
              You’ve reached the end of your feed.
            </h2>
            <p className="pause-sub">You can stop here, or choose to continue for a little longer.</p>
            <div className="rs-stop-btns">
              <button type="button" className="btn btn-mint btn-xl" onClick={() => finish('stopped-at-stopping-point')}>
                <Icon name="check" />
                I’m done
              </button>
              <button type="button" className="btn btn-ghost-night" onClick={continueRound}>
                Continue intentionally: up to {postLimit} more posts
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <Toast toast={toast} onDone={() => setToast(null)} />
    </div>
  );
}

/* ---------------- participant questions ---------------- */
function Scale({ q, value, onPick }) {
  return (
    <fieldset className="rs-q">
      <legend>{q.text}</legend>
      <div className="rs-scale" role="radiogroup" aria-label={q.text}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button type="button" key={n} role="radio" aria-checked={value === n} aria-label={`${n}${n === 1 ? ` (${q.low})` : n === 5 ? ` (${q.high})` : ''}`} className={cx(value === n && 'is-on')} onClick={() => onPick(value === n ? undefined : n)}>
            {n}
          </button>
        ))}
      </div>
      <div className="rs-scale-ends" aria-hidden="true">
        <span>{q.low}</span>
        <span>{q.high}</span>
      </div>
    </fieldset>
  );
}

function FeedQuestions({ position, total, onSubmit }) {
  const [answers, setAnswers] = useState({});
  const [estimate, setEstimate] = useState('');
  const [busy, setBusy] = useState(false);
  const estOk = estimate === '' || (/^\d{1,2}(\.\d)?$/.test(estimate) && Number(estimate) <= 60);
  const submit = (data) => {
    if (busy) return;
    setBusy(true);
    onSubmit(data);
  };
  return (
    <div className="rs-page rs-narrow">
      <p className="eyebrow">{total > 1 ? `Feed ${position} of ${total}` : 'Quick questions'}</p>
      <h1 className="page-title">About the feed you just used</h1>
      <p className="rs-lead">There are no right or wrong answers. Skip anything you don’t want to answer.</p>
      <label className="rs-q rs-est">
        <span className="rs-q-l">Without checking, about how many minutes do you think you spent browsing?</span>
        <span className="rs-est-row">
          <input type="text" inputMode="decimal" className={cx('rs-input', !estOk && 'is-bad')} value={estimate} maxLength={4} onChange={(e) => setEstimate(e.target.value.replace(',', '.').replace(/[^\d.]/g, ''))} aria-invalid={!estOk} />
          <span>minutes</span>
        </span>
      </label>
      {QUESTIONS.map((q) => (
        <Scale key={q.id} q={q} value={answers[q.id]} onPick={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))} />
      ))}
      <div className="rs-actions">
        <button type="button" className="btn btn-primary btn-xl" disabled={!estOk || busy} onClick={() => submit({ ...answers, estimate: estimate === '' ? '' : Number(estimate) })}>
          Next
        </button>
        <button type="button" className="btn-text" disabled={busy} onClick={() => submit({})}>
          Skip these questions
        </button>
      </div>
    </div>
  );
}

function FinalQuestions({ onSubmit }) {
  const [useAgain, setUseAgain] = useState(undefined);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = (data) => {
    if (busy) return;
    setBusy(true);
    onSubmit(data);
  };
  return (
    <div className="rs-page rs-narrow">
      <p className="eyebrow">Last question</p>
      <h1 className="page-title">Thinking about both feeds</h1>
      <Scale q={FINAL_QUESTION} value={useAgain} onPick={setUseAgain} />
      <label className="rs-q rs-comment">
        <span className="rs-q-l">Anything else you’d like to say? (optional)</span>
        <textarea value={comment} maxLength={200} rows={3} onChange={(e) => setComment(e.target.value)} placeholder="Please don’t write names or personal details." />
        <span className="muted rs-count">{comment.length}/200</span>
      </label>
      <div className="rs-actions">
        <button type="button" className="btn btn-primary btn-xl" disabled={busy} onClick={() => submit({ useAgain, comment: comment.trim() })}>
          Finish
        </button>
        <button type="button" className="btn-text" disabled={busy} onClick={() => submit({})}>
          Skip and finish
        </button>
      </div>
    </div>
  );
}

/* ---------------- small helpers for the overview ---------------- */
const f1 = (v) => (v == null ? '–' : v.toFixed(1));
const pct = (v) => (v == null ? '–' : `${Math.round(v * 100)}%`);
const mmss = (min) => (min == null ? '–' : fmtClock(min * 60000)); // minutes → m:ss
const SHORT_END = { 'stopped-voluntarily': 'By choice', 'stopped-at-stopping-point': 'By choice, at the stopping point', 'max-time': 'Max time reached' };
function Bars({ label, a, b, fmt }) {
  const max = Math.max(a || 0, b || 0, 0.0001);
  return (
    <div className="rs-bars" role="img" aria-label={`${label}: Mode A ${a == null ? 'no data' : fmt(a)}, Mode B ${b == null ? 'no data' : fmt(b)}`}>
      <p className="rs-bars-l">{label}</p>
      {[
        ['A', a],
        ['B', b],
      ].map(([m, v]) => (
        <div key={m} className="rs-bar-row">
          <span className="rs-bar-m">{m}</span>
          <span className="rs-bar-track">
            <span className={cx('rs-bar-fill', `rs-fill-${m}`)} style={{ width: v ? `${Math.max(2, (v / max) * 100)}%` : 0 }} />
          </span>
          <span className="rs-bar-v tnum">{v == null ? '–' : fmt(v)}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------------- researcher screens ---------------- */
export function Research({ onExit }) {
  const [runs, setRuns] = useState(() => loadRuns());
  const runsRef = useRef(runs);
  runsRef.current = runs;
  const [phase, setPhase] = useState('home');
  const [cfg, setCfg] = useState(() => ({ participant: nextParticipantId(loadRuns()), orderPick: 'auto', maxMinutes: 5, postLimit: 8 }));
  const [checks, setChecks] = useState({ consent: false, noNames: false, supervised: false });
  const [flow, setFlow] = useState(null); // { code, order, modes: [...], step, intended }
  const [pending, setPending] = useState(null); // result of the feed that just ended
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);
  const [showCsv, setShowCsv] = useState(false);
  const [toast, setToast] = useState(null);
  const notify = (msg, icon = 'info') => setToast({ id: Date.now(), msg, icon });

  const code = normCode(cfg.participant);
  const idOk = validParticipantId(cfg.participant);
  const done = doneModes(runs, code);
  const previous = runs.find((r) => normCode(r.participant) === code);
  const complete = done.has('A') && done.has('B');
  const randomOrder = useMemo(() => (Math.random() < 0.5 ? 'AB' : 'BA'), [code]);
  const order = previous && previous.order ? previous.order : cfg.orderPick === 'auto' ? autoOrder(runs) : cfg.orderPick === 'random' ? randomOrder : cfg.orderPick;
  const toRun = ORDERS[order].filter((m) => !done.has(m));
  const ready = idOk && !complete && checks.consent && checks.noNames;
  const sharable = useMemo(() => canShareCSV(), []);

  const store = (next) => {
    setRuns(next);
    runsRef.current = next;
    if (!saveRuns(next)) notify('This browser blocked saving. Export the CSV before closing the page.');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase, flow && flow.step]);

  const begin = () => {
    setFlow({ code, order, modes: toRun, step: 0, firstPosition: 3 - toRun.length, intended: null });
    setPhase('brief');
  };
  const current = flow ? flow.modes[flow.step] : null;
  const position = flow ? flow.firstPosition + flow.step : 1;

  const saveFeed = (answers) => {
    const record = {
      ...pending,
      answers,
      final: {},
      version: RESEARCH_VERSION,
    };
    store(addRun(runsRef.current, record));
    if (flow.step + 1 < flow.modes.length) {
      setFlow((f) => ({ ...f, step: f.step + 1, intended: null }));
      setPending(null);
      setPhase('intro');
    } else setPhase('final');
  };

  const saveFinal = (final) => {
    // The last question belongs to the participant's last feed.
    const next = runsRef.current.map((r) => (r.id === pending.id ? { ...r, final } : r));
    store(next);
    setPending(null);
    setCfg((c) => ({ ...c, participant: nextParticipantId(next) }));
    setChecks((c) => ({ consent: false, noNames: c.noNames, supervised: c.supervised }));
    setPhase('thanks');
  };

  if (phase === 'brief') {
    return (
      <div className="rs-page rs-narrow rs-brief">
        <Brand size={34} />
        <h1 className="page-title">Before you start</h1>
        <ul className="rs-brief-list">
          <li>You’re going to try {flow.modes.length === 2 ? 'two versions' : 'a version'} of a sample social media feed. The posts and creators are fictional.</li>
          <li>Browse the way you normally would. There’s no right or wrong amount of time.</li>
          <li>You can stop whenever you like by tapping “I’m done”. Each feed also ends by itself after {cfg.maxMinutes} minutes at most.</li>
          <li>After {flow.modes.length === 2 ? 'each feed' : 'the feed'} there are a few quick questions. Nothing is linked to your name.</li>
        </ul>
        <button type="button" className="btn btn-primary btn-xl" onClick={() => setPhase('intro')}>
          Continue
        </button>
        <button type="button" className="btn-text" onClick={() => setPhase('home')}>
          Researcher: back to setup
        </button>
      </div>
    );
  }

  if (phase === 'intro') {
    const isB = current === 'B';
    const choices = INTENDED.filter((m) => m <= cfg.maxMinutes);
    return (
      <div className="rs-page rs-narrow rs-brief">
        <p className="eyebrow">{flow.modes.length > 1 || position === 2 ? `Feed ${position} of 2` : 'Your feed'}</p>
        <h1 className="page-title">{isB ? 'This feed has a stopping point' : 'Browse as you normally would'}</h1>
        {isB ? (
          <>
            <p className="rs-lead">It shows {cfg.postLimit} posts, then stops. You can then finish or choose to continue. First, how long would you like to browse?</p>
            <div className="rs-intent" role="radiogroup" aria-label="How long would you like to browse?">
              {choices.map((m) => (
                <button type="button" key={m} role="radio" aria-checked={flow.intended === m} className={cx('rs-intent-opt', flow.intended === m && 'is-on')} onClick={() => setFlow((f) => ({ ...f, intended: m }))}>
                  <b className="tnum">{m}</b>
                  <span>{m === 1 ? 'minute' : 'minutes'}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="rs-lead">Scroll for as long as you like. Tap “I’m done” at the top whenever you want to stop.</p>
        )}
        <button type="button" className="btn btn-primary btn-xl" disabled={isB && !flow.intended} onClick={() => setPhase('run')}>
          Start browsing
        </button>
      </div>
    );
  }

  if (phase === 'run') {
    return (
      <TestFeed
        key={`${flow.code}-${current}`}
        mode={current}
        participant={flow.code}
        position={position}
        maxMinutes={cfg.maxMinutes}
        postLimit={cfg.postLimit}
        intendedMinutes={current === 'B' ? flow.intended : null}
        onEnd={(res) => {
          setPending({
            ...res,
            id: newRecordId(),
            participant: flow.code,
            order: flow.order,
            position,
            mode: current,
            startedAt: Date.now() - res.durationMs,
            maxMinutes: cfg.maxMinutes,
            intendedMinutes: current === 'B' ? flow.intended : null,
            postLimit: current === 'B' ? cfg.postLimit : null,
          });
          setPhase('questions');
        }}
      />
    );
  }

  if (phase === 'questions') return <FeedQuestions key={pending.id} position={position} total={flow.firstPosition + flow.modes.length - 1} onSubmit={saveFeed} />;
  if (phase === 'final') return <FinalQuestions onSubmit={saveFinal} />;

  if (phase === 'thanks') {
    return (
      <div className="rs-page rs-narrow rs-brief">
        <span className="rs-big-ico">
          <Icon name="check" size={34} />
        </span>
        <h1 className="page-title">Thank you!</h1>
        <p className="rs-lead">Your answers were saved anonymously. Please hand the device back to the researcher.</p>
        <button type="button" className="btn btn-primary" onClick={() => setPhase('home')}>
          Researcher: back to setup
        </button>
      </div>
    );
  }

  /* ----- home: setup + overview ----- */
  const sum = summarize(runs);
  const [A, B] = sum.modes;
  const sorted = [...runs].sort((x, y) => y.startedAt - x.startedAt);
  const csvText = showCsv ? toCSV(runs) : '';
  const copyCsv = async () => {
    try {
      await navigator.clipboard.writeText(toCSV(runs));
      notify('CSV copied. Paste it into a spreadsheet or a note.', 'check');
    } catch (e) {
      setShowCsv(true);
      notify('Copying isn’t allowed here. Select the text below and copy it instead.');
    }
  };
  return (
    <div className="rs-page">
      <header className="page-head">
        <div className="page-head-l">
          <button type="button" className="icon-btn outline" onClick={onExit} aria-label="Leave research mode">
            <Icon name="arrowLeft" />
          </button>
          <div>
            <p className="eyebrow">For the student team</p>
            <h1 className="page-title">Research mode</h1>
          </div>
        </div>
      </header>

      <section className="set-card rs-intro">
        <p>
          Does an intentional stopping point change how people browse? Each participant tries a <b>conventional continuous feed (Mode A)</b> and the <b>ScrollWise feed with a stopping point (Mode B)</b>, in a balanced order. Both feeds use the same posts, the same design and the same maximum time.
        </p>
        <ul className="rs-rules">
          <li>Only run tests with your school’s approval, and parental consent where it’s required.</li>
          <li>Taking part is voluntary. Participants can stop or leave at any time.</li>
          <li>Use a code such as P001, never a name. Nothing else about the participant is recorded.</li>
          <li>Results stay in this browser until you export them. They never change anyone’s normal ScrollWise stats.</li>
          <li>Small groups give early signals, not proof. The research guide explains how to report results honestly.</li>
        </ul>
      </section>

      <section className="set-card" aria-labelledby="rs-setup">
        <h2 id="rs-setup" className="set-title">
          New participant
        </h2>
        <div className="set-row">
          <div>
            <h3>
              <label htmlFor="rs-id">Participant code</label>
            </h3>
            <p>
              {!idOk
                ? 'Use letters, numbers and dashes only.'
                : complete
                  ? `${code} has already done both feeds. Use a new code.`
                  : done.size
                    ? `${code} has done ${MODES[[...done][0]].name}. Starting will run only the missing feed.`
                    : 'Letters, numbers and dashes only.'}
            </p>
          </div>
          <input id="rs-id" className={cx('rs-input', (!idOk || complete) && 'is-bad')} value={cfg.participant} maxLength={12} autoComplete="off" autoCapitalize="characters" spellCheck={false} onChange={(e) => setCfg((c) => ({ ...c, participant: e.target.value.replace(/\s/g, '') }))} aria-invalid={!idOk || complete} />
        </div>
        <div className="set-row">
          <div>
            <h3>
              <label htmlFor="rs-order">Order</label>
            </h3>
            <p>{previous && previous.order ? `Kept from ${code}’s first feed.` : cfg.orderPick === 'auto' ? 'Alternates A→B and B→A on this device, so both orders are used equally.' : cfg.orderPick === 'random' ? 'Picked at random for this participant.' : 'Set by hand, e.g. from your printed order list.'}</p>
          </div>
          <select id="rs-order" className="rs-select" value={cfg.orderPick} disabled={!!(previous && previous.order)} onChange={(e) => setCfg((c) => ({ ...c, orderPick: e.target.value }))}>
            <option value="auto">Alternate (recommended)</option>
            <option value="random">Random</option>
            <option value="AB">A then B</option>
            <option value="BA">B then A</option>
          </select>
        </div>
        <div className="set-row">
          <div>
            <h3 id="rs-max-l">Maximum time per feed</h3>
            <p>The same for both feeds. A feed ends here even if the participant keeps going.</p>
          </div>
          <div className="seg seg-sm" role="radiogroup" aria-labelledby="rs-max-l">
            {MAX_MINUTES.map((m) => (
              <button type="button" key={m} role="radio" aria-checked={cfg.maxMinutes === m} onClick={() => setCfg((c) => ({ ...c, maxMinutes: m }))}>
                {m} min
              </button>
            ))}
          </div>
        </div>
        <div className="set-row">
          <div>
            <h3 id="rs-lim-l">Posts before the stopping point</h3>
            <p>Mode B only. The participant chooses their browsing time before Mode B starts.</p>
          </div>
          <div className="seg seg-sm" role="radiogroup" aria-labelledby="rs-lim-l">
            {POST_LIMITS.map((n) => (
              <button type="button" key={n} role="radio" aria-checked={cfg.postLimit === n} onClick={() => setCfg((c) => ({ ...c, postLimit: n }))}>
                {n}
              </button>
            ))}
          </div>
        </div>
        <fieldset className="rs-checks">
          <legend className="sr-only">Before starting</legend>
          {[
            ['consent', 'The participant agreed to take part and knows they can stop at any time.'],
            ['noNames', 'I won’t record names or other personal information.'],
            ['supervised', 'A teacher or responsible adult is supervising (recommended).'],
          ].map(([k, t]) => (
            <label key={k} className="rs-check">
              <input type="checkbox" checked={checks[k]} onChange={(e) => setChecks((c) => ({ ...c, [k]: e.target.checked }))} />
              <span>{t}</span>
            </label>
          ))}
        </fieldset>
        <button type="button" className="btn btn-primary btn-block" disabled={!ready} onClick={begin}>
          <Icon name="play" size={16} />
          {complete ? 'Choose a new code' : `Start ${code || '…'}: ${toRun.map((m) => MODES[m].name).join(' then ')}`}
        </button>
      </section>

      <section className="set-card" aria-labelledby="rs-results">
        <div className="card-head">
          <h2 id="rs-results" className="set-title">
            Results on this device
          </h2>
        </div>
        {runs.length ? (
          <>
            <p className="rs-counts">
              <b className="tnum">{sum.participants}</b> {sum.participants === 1 ? 'participant' : 'participants'} · <b className="tnum">{runs.length}</b> {runs.length === 1 ? 'feed' : 'feeds'} recorded · <b className="tnum">{sum.pairs}</b> did both feeds ({sum.orders.AB} A→B, {sum.orders.BA} B→A)
            </p>
            <div className="rs-charts">
              <Bars label="Average browsing time (min:sec)" a={A.minutes} b={B.minutes} fmt={mmss} />
              <Bars label="Average posts viewed" a={A.posts} b={B.posts} fmt={(v) => `${v.toFixed(1)} posts`} />
            </div>
            <div className="rs-table-wrap">
              <table className="rs-table rs-stats">
                <caption className="sr-only">Descriptive results by mode</caption>
                <thead>
                  <tr>
                    <th scope="col">Measure</th>
                    <th scope="col">Mode A</th>
                    <th scope="col">Mode B</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Feeds recorded', A.runs, B.runs],
                    ['Median browsing time (min:sec)', mmss(A.medianMinutes), mmss(B.medianMinutes)],
                    ['Stopped by choice', pct(A.voluntary), pct(B.voluntary)],
                    ['Reached the maximum time', pct(A.maxTime), pct(B.maxTime)],
                    ['Reached the stopping point', '–', pct(B.reachedStop)],
                    ['Chose to continue', '–', pct(B.continued)],
                    ['Time guess off by (min:sec, average)', mmss(A.estimateError), mmss(B.estimateError)],
                    ['Awareness of time (1–5)', f1(A.awareness), f1(B.awareness)],
                    ['Feeling of control (1–5)', f1(A.control), f1(B.control)],
                    ['Ease of stopping (1–5)', f1(A.ease), f1(B.ease)],
                    ['Overall experience (1–5)', f1(A.overall), f1(B.overall)],
                  ].map(([l, a, b]) => (
                    <tr key={l}>
                      <th scope="row">{l}</th>
                      <td className="tnum">{a}</td>
                      <td className="tnum">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {sum.pairs ? (
              <p className="rs-pair">
                For the {sum.pairs} {sum.pairs === 1 ? 'participant' : 'participants'} who tried both feeds, Mode B averaged <b className="tnum">{mmss(Math.abs(sum.diffMin))} {sum.diffMin <= 0 ? 'less' : 'more'}</b> browsing time and <b className="tnum">{f1(Math.abs(sum.diffPosts))} {sum.diffPosts <= 0 ? 'fewer' : 'more'} posts</b> than Mode A; Mode B was shorter for {sum.bShorter} of {sum.pairs}. Average time in the first feed: {mmss(sum.firstMin)}, in the second: {mmss(sum.secondMin)}.
                {sum.useAgain != null ? ` Willingness to use the ScrollWise feed again: ${f1(sum.useAgain)} out of 5.` : ''}
              </p>
            ) : null}
            <p className="muted rs-note">These numbers describe the people tested on this device. They can’t prove that ScrollWise works on their own: see the research guide for how to report them honestly.</p>

            <div className="rs-export">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => downloadCSV(runs)}>
                <Icon name="download" size={16} />
                Download CSV
              </button>
              {sharable ? (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() =>
                    shareCSV(runs).catch((e) => {
                      if (e && e.name !== 'AbortError') notify('Sharing didn’t work here. Try Download CSV or Copy CSV.');
                    })
                  }
                >
                  <Icon name="share" size={16} />
                  Share CSV
                </button>
              ) : null}
              <button type="button" className="btn btn-outline btn-sm" onClick={copyCsv}>
                Copy CSV
              </button>
              <button type="button" className="btn-text" aria-expanded={showCsv} onClick={() => setShowCsv((v) => !v)}>
                {showCsv ? 'Hide CSV text' : 'Show CSV text'}
              </button>
            </div>
            {showCsv ? <textarea className="rs-csv" readOnly value={csvText} rows={6} aria-label="CSV text" onFocus={(e) => e.target.select()} /> : null}

            <h3 className="rs-sub">Every feed recorded</h3>
            <div className="rs-table-wrap">
              <table className="rs-table">
                <thead>
                  <tr>
                    <th scope="col">Code</th>
                    <th scope="col">Order</th>
                    <th scope="col">Mode</th>
                    <th scope="col">Time</th>
                    <th scope="col">Posts</th>
                    <th scope="col">Ended</th>
                    <th scope="col">
                      <span className="sr-only">Delete</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((r) => (
                    <tr key={r.id}>
                      <td>{r.participant}</td>
                      <td>{r.order ? `${r.order} · ${r.position === 1 ? '1st' : '2nd'}` : '–'}</td>
                      <td>{r.mode}</td>
                      <td className="tnum">{fmtClock(r.durationMs)}</td>
                      <td className="tnum">{r.postsViewed}</td>
                      <td>
                        {SHORT_END[r.endReason] || END_REASONS[r.endReason] || r.endReason}
                        {r.mode === 'B' && r.continues ? ` (+${r.continues} continue${r.continues > 1 ? 's' : ''})` : ''}
                      </td>
                      <td>
                        {confirmDel === r.id ? (
                          <span className="rs-del-confirm">
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => { store(runs.filter((x) => x.id !== r.id)); setConfirmDel(null); }}>
                              Delete
                            </button>
                            <button type="button" className="btn-text" onClick={() => setConfirmDel(null)}>
                              Keep
                            </button>
                          </span>
                        ) : (
                          <button type="button" className="icon-btn rs-del" aria-label={`Delete ${r.participant} Mode ${r.mode}`} onClick={() => setConfirmDel(r.id)}>
                            <Icon name="trash" size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {confirmClear ? (
              <div className="confirm" role="alert">
                <p>
                  <b>Delete all {runs.length} records?</b> Export the CSV first if you need it. This can’t be undone.
                </p>
                <div className="confirm-btns">
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setConfirmClear(false)}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      store([]);
                      setConfirmClear(false);
                      setShowCsv(false);
                      setCfg((c) => ({ ...c, participant: nextParticipantId([]) }));
                    }}
                  >
                    Delete all
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" className="btn btn-outline btn-sm rs-clear" onClick={() => setConfirmClear(true)}>
                <Icon name="trash" size={16} />
                Delete all results
              </button>
            )}
          </>
        ) : (
          <p className="set-desc">No results yet. Each feed is saved as soon as the participant answers (or skips) its questions.</p>
        )}
      </section>
      <Toast toast={toast} onDone={() => setToast(null)} />
    </div>
  );
}
