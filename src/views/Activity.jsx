import { useEffect, useRef, useState } from 'react';
import { ActivityArt, Ring, Empty } from '../components/ui.jsx';
import { Icon } from '../components/Icon.jsx';
import { ACT_BY_ID } from '../data/activities.js';
import { CategoryTag } from './Discover.jsx';
import { shrinkImage } from '../lib/photos.js';
import { ago, cx, fmtClock, ordinal } from '../lib/util.js';

// Step-by-step mode shown while a challenge is in progress.
function Guided({ a, active, dispatch }) {
  const total = a.steps.length;
  const step = Math.min(active.step || 0, total - 1);
  const checks = active.checks || [];
  const goTo = (n) => dispatch({ type: 'ACT_PATCH', id: a.id, patch: { step: n } });
  const next = () => {
    const c = a.steps.map((_, i) => (i === step ? true : !!checks[i]));
    dispatch({ type: 'ACT_PATCH', id: a.id, patch: { checks: c, step: Math.min(step + 1, total - 1) } });
  };
  const last = step === total - 1;
  return (
    <div className="guided" aria-live="polite">
      <div className="guided-top">
        <span className="guided-n">
          Step {step + 1} of {total}
        </span>
        <span className="guided-bar" aria-hidden="true">
          {a.steps.map((_, i) => (
            <i key={i} className={cx(checks[i] && 'done', i === step && 'now')} />
          ))}
        </span>
      </div>
      <p className="guided-text" key={step}>
        {a.steps[step]}
      </p>
      <div className="guided-btns">
        <button type="button" className="btn btn-quiet btn-sm" disabled={step === 0} onClick={() => goTo(step - 1)}>
          <Icon name="chevronLeft" size={16} />
          Back
        </button>
        {last && checks[step] ? (
          <span className="guided-done">
            <Icon name="check" size={16} />
            Every step done
          </span>
        ) : (
          <button type="button" className="btn btn-primary btn-sm" onClick={next}>
            {last ? 'Finish last step' : 'Next step'}
            <Icon name={last ? 'check' : 'chevronRight'} size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

function TimerRow({ a, active, dispatch }) {
  const total = a.mins * 60000;
  const [, tick] = useState(0);
  const running = !!active.endsAt;
  useEffect(() => {
    if (!running) return undefined;
    const iv = setInterval(() => tick((x) => x + 1), 250);
    return () => clearInterval(iv);
  }, [running]);
  const used = !!(active.endsAt || active.leftMs != null);
  const left = active.endsAt ? Math.max(0, active.endsAt - Date.now()) : active.leftMs != null ? active.leftMs : total;
  const finished = used && left <= 0;
  useEffect(() => {
    if (running && left <= 0) dispatch({ type: 'ACT_PATCH', id: a.id, patch: { endsAt: null, leftMs: 0 } });
  });
  const startTimer = () => dispatch({ type: 'ACT_PATCH', id: a.id, patch: { endsAt: Date.now() + (active.leftMs > 0 ? active.leftMs : total), leftMs: null } });
  const pause = () => dispatch({ type: 'ACT_PATCH', id: a.id, patch: { endsAt: null, leftMs: left } });
  const reset = () => dispatch({ type: 'ACT_PATCH', id: a.id, patch: { endsAt: null, leftMs: null } });
  return (
    <div className="timer-row">
      <div className="countdown-ring">
        <Ring p={used ? 1 - left / total : 0} size={58} stroke={6} />
        <Icon name={finished ? 'check' : 'clock'} size={18} className="countdown-ico" />
      </div>
      <div className="countdown-txt">
        <span className="tnum cd-big">{fmtClock(left)}</span>
        <span className="muted">{finished ? 'Time’s up. Finish when you’re ready.' : running ? 'remaining' : used ? 'Paused' : 'Optional timer'}</span>
      </div>
      <div className="timer-btns">
        {!used ? (
          <button type="button" className="btn btn-outline btn-sm" onClick={startTimer} aria-label={`Start ${a.mins}-minute timer`}>
            <Icon name="play" size={13} />
            Start
          </button>
        ) : null}
        {running ? (
          <button type="button" className="btn btn-outline btn-sm" onClick={pause}>
            <Icon name="pause" size={16} />
            Pause
          </button>
        ) : null}
        {used && !running && !finished ? (
          <button type="button" className="btn btn-outline btn-sm" onClick={startTimer}>
            <Icon name="play" size={13} />
            Resume
          </button>
        ) : null}
        {used ? (
          <button type="button" className="icon-btn btn-icon-sm" onClick={reset} aria-label="Reset timer">
            <Icon name="reset" size={18} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function ChallengePanel({ a, active, done, saved, onStart, onSave, onComplete, onAnother, dispatch }) {
  return (
    <div className={cx('panel', active && 'is-active')}>
      {!active ? (
        <>
          <p className="panel-kicker">{done ? `Completed ${done.n === 1 ? 'once' : `${done.n} times`} · last ${ago(done.last)}` : `${a.mins} minutes · ${a.difficulty.toLowerCase()} · ${a.where.toLowerCase()}`}</p>
          <button type="button" className="btn btn-primary btn-xl btn-block" onClick={onStart}>
            <Icon name="play" size={18} />
            Start challenge
          </button>
          <button type="button" className="btn-text btn-block" onClick={onComplete}>
            Already did it? Mark as completed
          </button>
        </>
      ) : (
        <>
          <p className="panel-kicker live">
            <span className="live-dot" aria-hidden="true" />
            Challenge in progress
          </p>
          <Guided a={a} active={active} dispatch={dispatch} />
          <TimerRow a={a} active={active} dispatch={dispatch} />
          <button type="button" className="btn btn-mint btn-xl btn-block" onClick={onComplete}>
            <Icon name="check" size={18} />
            Mark as completed
          </button>
        </>
      )}
      <div className="panel-row">
        <button type="button" className={cx('btn', 'btn-quiet', 'btn-sm', saved && 'is-saved')} onClick={onSave} aria-pressed={!!saved}>
          <Icon name={saved ? 'bookmarkFill' : 'bookmark'} size={16} />
          {saved ? 'Saved' : 'Save to favorites'}
        </button>
        <button type="button" className="btn btn-quiet btn-sm" onClick={onAnother}>
          <Icon name="shuffle" size={16} />
          Discover another activity
        </button>
      </div>
    </div>
  );
}

export function ActivityView({ id, state, dispatch, onBack, backLabel, onComplete, onAnother }) {
  const a = ACT_BY_ID[id];
  const [localChecks, setLocalChecks] = useState([]);
  useEffect(() => {
    setLocalChecks(a ? a.steps.map(() => false) : []);
  }, [id]);
  if (!a) {
    return (
      <div className="page">
        <Empty icon="info" title="That challenge isn’t available" action={<button type="button" className="btn btn-primary" onClick={onBack}>Go back</button>} />
      </div>
    );
  }
  const active = state.active && state.active.id === id ? state.active : null;
  const saved = !!state.savedActs[id];
  const done = state.done[id];
  const checks = active ? active.checks || [] : localChecks;
  const toggle = (i) => {
    const next = a.steps.map((_, j) => (j === i ? !checks[j] : !!checks[j]));
    if (active) dispatch({ type: 'ACT_PATCH', id, patch: { checks: next, step: i } });
    else setLocalChecks(next);
  };
  const save = () => dispatch({ type: 'SAVE_ACT', id });
  const doneCount = a.steps.filter((_, i) => checks[i]).length;
  return (
    <div className="page page-act" key={id}>
      <div className="act-hero">
        <ActivityArt a={a} w={960} h={600} alt={`Cover image for ${a.title}`} />
        <div className="act-hero-shade" aria-hidden="true" />
        <button type="button" className="float-btn fb-back" onClick={onBack} aria-label={`Back to ${backLabel}`}>
          <Icon name="arrowLeft" />
        </button>
        <button type="button" className={cx('float-btn', 'fb-save', saved && 'is-on')} onClick={save} aria-pressed={saved} aria-label={saved ? 'Remove from favorites' : 'Save to favorites'}>
          <Icon name={saved ? 'bookmarkFill' : 'bookmark'} />
        </button>
      </div>
      <div className="act-layout">
        <div className="act-top">
          <div className="act-pills">
            <CategoryTag category={a.category} />
            {done ? (
              <span className="pill pill-mint">
                <Icon name="check" size={14} />
                Done {done.n === 1 ? 'once' : `${done.n}×`}
              </span>
            ) : null}
          </div>
          <h1 className="act-h1">{a.title}</h1>
          <p className="act-lead">{a.blurb}</p>
          <dl className="act-facts">
            <div>
              <dt>Time</dt>
              <dd>{a.mins} min</dd>
            </div>
            <div>
              <dt>Difficulty</dt>
              <dd>{a.difficulty}</dd>
            </div>
            <div>
              <dt>Where</dt>
              <dd>{a.where}</dd>
            </div>
          </dl>
        </div>
        <div className="act-side">
          <ChallengePanel
            a={a}
            active={active}
            done={done}
            saved={saved}
            dispatch={dispatch}
            onStart={() => dispatch({ type: 'START_ACT', id, checks: localChecks })}
            onSave={save}
            onComplete={() => onComplete(id)}
            onAnother={onAnother}
          />
        </div>
        <div className="act-rest">
          <section>
            <h2 className="section-label">You’ll need</h2>
            <ul className="materials">
              {a.materials.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </section>
          <section>
            <div className="steps-head">
              <h2 className="section-label">How to do it</h2>
              <span className="steps-count tnum">
                {doneCount}/{a.steps.length} done
              </span>
            </div>
            <ol className="steps">
              {a.steps.map((t, i) => (
                <li key={i}>
                  <button type="button" className={cx('step', checks[i] && 'is-done', active && (active.step || 0) === i && 'is-now')} onClick={() => toggle(i)} aria-pressed={!!checks[i]}>
                    <span className="step-n">{checks[i] ? <Icon name="check" size={15} /> : i + 1}</span>
                    <span className="step-t">{t}</span>
                  </button>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}

function confetti(canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.scale(dpr, dpr);
  const colors = ['#3EE3A6', '#5B7CFF', '#B7A6FF', '#FFFFFF', '#FFD166'];
  const parts = Array.from({ length: 150 }, () => ({
    x: W / 2 + (Math.random() - 0.5) * 80,
    y: H * 0.35,
    vx: (Math.random() - 0.5) * 13,
    vy: -Math.random() * 13 - 4,
    w: 5 + Math.random() * 6,
    h: 8 + Math.random() * 8,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    c: colors[Math.floor(Math.random() * colors.length)],
  }));
  const t0 = performance.now();
  let raf = 0;
  const frame = (t) => {
    const age = t - t0;
    ctx.clearRect(0, 0, W, H);
    parts.forEach((p) => {
      p.vy += 0.32;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - age / 2800);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (age < 2800) raf = requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, W, H);
  };
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

export function Celebration({ data, photo, reduce, onAddPhoto, onDiscover, onDashboard, onClose }) {
  const a = ACT_BY_ID[data.id];
  const canvas = useRef(null);
  const first = useRef(null);
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    document.documentElement.classList.add('lock');
    const stop = reduce ? null : confetti(canvas.current);
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    if (first.current) first.current.focus({ preventScroll: true });
    return () => {
      document.documentElement.classList.remove('lock');
      window.removeEventListener('keydown', onKey);
      if (stop) stop();
    };
  }, []);
  const onFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const src = await shrinkImage(file);
      if (!onAddPhoto(data.mid, src)) setError('This browser is out of space for photos. Remove one from your dashboard and try again.');
    } catch (err) {
      setError(err.message || 'That photo could not be added.');
    }
    setBusy(false);
  };
  return (
    <div className="celebrate" role="dialog" aria-modal="true" aria-labelledby="cel-title">
      <canvas ref={canvas} className="confetti" aria-hidden="true" />
      <div className="cel-card">
        <div className="cel-badge" aria-hidden="true">
          <Icon name="check" size={40} />
        </div>
        <p className="eyebrow on-night">{a ? a.title : 'Challenge'}</p>
        <h2 id="cel-title" className="cel-title">
          Moment completed!
        </h2>
        <p className="cel-sub">You made something worth remembering.</p>
        <p className="cel-count">That’s your {ordinal(data.n)} moment.</p>
        <div className="cel-photo">
          {photo ? (
            <div className="cel-photo-done">
              <img src={photo} alt="Your photo for this moment" />
              <span>
                <Icon name="check" size={16} />
                Added to your moments
              </span>
            </div>
          ) : (
            <>
              <input ref={fileRef} type="file" accept="image/*" className="sr-only" tabIndex={-1} onChange={onFile} aria-hidden="true" />
              <button type="button" className="cel-upload" onClick={() => fileRef.current && fileRef.current.click()} disabled={busy}>
                <Icon name="camera" size={18} />
                {busy ? 'Adding photo…' : 'Add a photo of your moment (optional)'}
              </button>
            </>
          )}
          {error ? <p className="cel-error">{error}</p> : null}
        </div>
        <div className="cel-actions">
          <button type="button" ref={first} className="btn btn-mint btn-block" onClick={onDiscover}>
            <Icon name="sunrise" size={18} />
            Discover another activity
          </button>
          <button type="button" className="btn btn-ghost-night btn-block" onClick={onDashboard}>
            Go to your dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
