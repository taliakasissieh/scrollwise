import { useState } from 'react';
import { ActivityArt, PostArt, Sheet } from '../components/ui.jsx';
import { Icon } from '../components/Icon.jsx';
import { POSTS, POST_BY_ID } from '../data/posts.js';
import { sessionSize, unseenCount } from '../store.js';
import { MOODS } from '../data/activities.js';
import { cx, fmtClock } from '../lib/util.js';

export function MiniActivity({ a, onOpen, badge }) {
  return (
    <button type="button" className="mini-act" onClick={onOpen}>
      <ActivityArt a={a} className="mini-thumb" />
      <span className="mini-txt">
        <b>{a.title}</b>
        <span className="muted">
          {a.mins} min · {a.category}
        </span>
      </span>
      {badge || <Icon name="arrowRight" size={18} className="mini-go" />}
    </button>
  );
}

export function Pause({ state, onDiscover, onMood, onContinue, onDone, ideas, openActivity }) {
  const s = state.session;
  const byTime = s.ended && s.ended.reason === 'time';
  const eyebrow = byTime ? `Your ${Math.round(s.limitMs / 60000)}-minute session is done` : 'Session complete';
  const seen = s.viewed.map((id) => POST_BY_ID[id]).filter(Boolean);
  return (
    <section className="pause" aria-labelledby="pause-title">
      <div className="pause-panel">
        <div className="pause-glow" aria-hidden="true" />
        <p className="eyebrow on-night">{eyebrow}</p>
        <h1 id="pause-title" className="pause-title">
          You’ve reached the end of your feed.
        </h1>
        <p className="pause-sub">Your next moment is waiting.</p>
        {seen.length ? (
          <div className="pause-strip" aria-label={`You viewed ${seen.length} posts`}>
            {seen.slice(0, 8).map((p, i) => (
              <span key={p.id} className="ps-thumb" style={{ '--i': i }}>
                <PostArt post={p} style={{ aspectRatio: '1 / 1' }} />
              </span>
            ))}
          </div>
        ) : null}
        <dl className="pause-stats">
          <div>
            <dt>Posts viewed</dt>
            <dd className="tnum">{s.viewed.length}</dd>
          </div>
          <div>
            <dt>Time browsing</dt>
            <dd className="tnum">{fmtClock(s.elapsedMs)}</dd>
          </div>
        </dl>
        <div className="pause-cta">
          <button type="button" className="btn btn-mint btn-xl" onClick={onDiscover}>
            <Icon name="sunrise" />
            Find Your Next Moment
          </button>
          <div className="pause-cta-row">
            <button type="button" className="btn btn-ghost-night" onClick={onDone}>
              <Icon name="check" size={18} />
              I’m done for now
            </button>
            <button type="button" className="btn btn-ghost-night" onClick={onContinue}>
              Continue intentionally
            </button>
          </div>
        </div>
        <div className="pause-horizon" aria-hidden="true">
          <span className="pause-sun" />
        </div>
      </div>

      <div className="pause-moods">
        <h2 className="section-label">Or jump in with how you feel</h2>
        <div className="mood-quick">
          {MOODS.map((m) => (
            <button type="button" key={m.id} className={cx('mq', `tone-${m.tone}`)} onClick={() => onMood(m.id)}>
              <span className="mq-ico">
                <Icon name={m.icon} size={18} />
              </span>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pause-ideas">
        <h2 className="section-label">A few ideas for right now</h2>
        <div className="mini-list">
          {ideas.map(({ a }) => (
            <MiniActivity key={a.id} a={a} onOpen={() => openActivity(a.id)} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContinueSheet({ minutes, timerOn, posts = 8, seen, onStart, onClose }) {
  const fresh = unseenCount(seen);
  const options = [
    { id: 'quick', budget: 3, minutes: 3, kind: 'short', title: 'Quick look', icon: 'eye' },
    { id: 'short', budget: 5, minutes: 5, kind: 'short', title: 'Short session', icon: 'layers' },
    { id: 'full', budget: posts, minutes, kind: 'full', title: 'Full feed', icon: 'home' },
  ].map((o) => {
    const n = sessionSize(o.budget, seen);
    return { ...o, detail: fresh > 0 ? `${n} new ${n === 1 ? 'post' : 'posts'}` : `${n} ${n === 1 ? 'post' : 'posts'} you’ve seen` };
  });
  const [pick, setPick] = useState('quick');
  const chosen = options.find((o) => o.id === pick);
  return (
    <Sheet
      title="Continue intentionally"
      onClose={onClose}
      footer={
        <button type="button" className="btn btn-primary btn-block" onClick={() => onStart(chosen)}>
          Start {chosen.title.toLowerCase()}
        </button>
      }
    >
      <p className="sheet-lead">Pick a session size. It ends on its own, just like the last one, and you can stop any time.</p>
      {fresh === 0 ? (
        <p className="sheet-note" role="note">
          <Icon name="check" size={16} />
          You’re all caught up: you’ve seen all {POSTS.length} posts. Continuing shows posts you’ve already seen, starting with the oldest.
        </p>
      ) : fresh < posts ? (
        <p className="sheet-note" role="note">
          {fresh} new {fresh === 1 ? 'post is' : 'posts are'} left in your feed.
        </p>
      ) : null}
      <div className="choice-list" role="radiogroup" aria-label="Session size">
        {options.map((o) => (
          <button type="button" key={o.id} role="radio" aria-checked={pick === o.id} className={cx('choice', pick === o.id && 'is-on')} onClick={() => setPick(o.id)}>
            <span className="choice-ico">
              <Icon name={o.icon} size={20} />
            </span>
            <span className="choice-main">
              <b>{o.title}</b>
              <span className="muted">
                {o.detail}
                {timerOn ? ` · ${o.minutes} min` : ''}
              </span>
            </span>
            <span className="choice-dot" aria-hidden="true" />
          </button>
        ))}
      </div>
    </Sheet>
  );
}
