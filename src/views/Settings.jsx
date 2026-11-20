import { useState } from 'react';
import { Switch, Mark } from '../components/ui.jsx';
import { Icon } from '../components/Icon.jsx';
import { INTERESTS } from '../data/activities.js';
import { cx } from '../lib/util.js';
import { POST_CHOICES } from '../store.js';
import { allPhotos } from '../lib/library.js';

export function Settings({ state, dispatch, demoOn, onStartDemo, onExitDemo, onReset, onResetSettings, onBack, onOpen }) {
  const st = state.settings;
  const set = (key, value) => dispatch({ type: 'SET', key, value });
  const [confirm, setConfirm] = useState(false);
  const licensed = allPhotos().filter((p) => !p.ai);
  const aiCount = allPhotos().filter((p) => p.ai).length;
  const toggleInterest = (id) => set('interests', st.interests.includes(id) ? st.interests.filter((x) => x !== id) : [...st.interests, id]);

  return (
    <div className="page settings">
      <header className="page-head">
        <div className="page-head-l">
          <button type="button" className="icon-btn outline" onClick={onBack} aria-label="Back">
            <Icon name="arrowLeft" />
          </button>
          <div>
            <p className="eyebrow">Preferences</p>
            <h1 className="page-title">Settings</h1>
          </div>
        </div>
      </header>

      <section className="set-card" aria-labelledby="s-browse">
        <h2 id="s-browse" className="set-title">
          Browsing sessions
        </h2>
        <div className="set-row">
          <div>
            <h3 id="s-len">Session length</h3>
            <p>How long a full feed session lasts before it wraps up.</p>
          </div>
          <div className="seg seg-sm" role="radiogroup" aria-labelledby="s-len">
            {[5, 10, 15, 20].map((m) => (
              <button type="button" key={m} role="radio" aria-checked={st.minutes === m} disabled={!st.timerOn} onClick={() => set('minutes', m)}>
                {m} min
              </button>
            ))}
          </div>
        </div>
        <div className="set-row">
          <div>
            <h3 id="s-posts">Posts per session</h3>
            <p>The feed reaches its stopping point after this many posts.</p>
          </div>
          <div className="seg seg-sm" role="radiogroup" aria-labelledby="s-posts">
            {POST_CHOICES.map((n) => (
              <button type="button" key={n} role="radio" aria-checked={st.posts === n} onClick={() => set('posts', n)}>
                {n} posts
              </button>
            ))}
          </div>
        </div>
        <div className="set-row">
          <div>
            <h3>Session timer</h3>
            <p>Off means sessions end only when you reach the last post.</p>
          </div>
          <Switch id="s-timer" checked={st.timerOn} onChange={(v) => set('timerOn', v)} label="Session timer" />
        </div>
        <div className="set-row">
          <div>
            <h3>Gentle reminders</h3>
            <p>A quiet note halfway through a session and with a minute to go.</p>
          </div>
          <Switch id="s-rem" checked={st.reminders} onChange={(v) => set('reminders', v)} label="Gentle reminders" />
        </div>
      </section>

      <section className="set-card" aria-labelledby="s-int">
        <h2 id="s-int" className="set-title">
          Interests
        </h2>
        <p className="set-desc">Your starting picks in Find Your Next Moment. You can still change them each time.</p>
        <div className="chips chips-sm">
          {INTERESTS.map((i) => {
            const on = st.interests.includes(i.id);
            return (
              <button type="button" key={i.id} aria-pressed={on} className={cx('chip', on && 'is-on')} onClick={() => toggleInterest(i.id)}>
                {on ? <Icon name="check" size={15} /> : null}
                {i.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="set-card" aria-labelledby="s-motion">
        <h2 id="s-motion" className="set-title">
          Motion
        </h2>
        <div className="set-row">
          <div>
            <h3 id="s-motion-l">Animations</h3>
            <p>Reduce turns off confetti, slides and other movement.</p>
          </div>
          <div className="seg seg-sm" role="radiogroup" aria-labelledby="s-motion-l">
            {[
              ['system', 'Match device'],
              ['reduce', 'Reduce'],
              ['full', 'Full'],
            ].map(([v, l]) => (
              <button type="button" key={v} role="radio" aria-checked={st.motion === v} onClick={() => set('motion', v)}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="set-card set-card-row" aria-labelledby="s-defaults">
        <div>
          <h2 id="s-defaults" className="set-title">
            Default settings
          </h2>
          <p className="set-desc">Puts session length, posts per session, timer, reminders, goals, interests and motion back to how they started. Your history stays.</p>
        </div>
        <button type="button" className="btn btn-outline" onClick={onResetSettings}>
          <Icon name="reset" size={18} />
          Restore defaults
        </button>
      </section>

      <section className={cx('set-card', 'demo-card')} aria-labelledby="s-demo">
        <div className="demo-card-top">
          <span className="demo-ico">
            <Icon name="play" size={18} />
          </span>
          <div>
            <h2 id="s-demo" className="set-title">
              Demo Mode
            </h2>
            <p className="set-desc">
              Walk through the full journey in about two minutes: browse three posts, reach the stopping point, find a moment, complete the 3-Photo Quest and see it on your dashboard. Demo Mode uses separate sample data, so your own progress stays untouched.
            </p>
          </div>
        </div>
        {demoOn ? (
          <button type="button" className="btn btn-outline" onClick={onExitDemo}>
            Exit Demo Mode
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={onStartDemo}>
            Start Demo Mode
          </button>
        )}
      </section>

      <section className="set-card" aria-labelledby="s-data">
        <h2 id="s-data" className="set-title">
          {demoOn ? 'Demo data' : 'Your data'}
        </h2>
        <p className="set-desc">
          {demoOn ? 'Demo data lives in memory and disappears when you exit Demo Mode.' : 'Everything is stored only in this browser. No account, no sign-in.'}
        </p>
        {confirm ? (
          <div className="confirm" role="alert">
            <p>
              <b>Reset everything?</b> This clears likes, saves, comments, photos, history, stats and settings{demoOn ? ' for this demo' : ' on this device'}.
            </p>
            <div className="confirm-btns">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setConfirm(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => {
                  setConfirm(false);
                  onReset();
                }}
              >
                Reset data
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className="btn btn-outline" onClick={() => setConfirm(true)}>
            <Icon name="trash" size={18} />
            Reset data
          </button>
        )}
      </section>

      <section className="set-card" aria-labelledby="s-credits">
        <h2 id="s-credits" className="set-title">
          Photo credits
        </h2>
        <p className="set-desc">
          The creators and posts in the feed are fictional samples. Feed photos are real licensed photographs (credited below){aiCount ? ' or pictures made with AI, which are marked “AI info” on each post' : ''}. Pictures for activities are illustrations drawn by ScrollWise.
        </p>
        {aiCount ? (
          <p className="set-desc">
            <b>{aiCount}</b> {aiCount === 1 ? 'picture was' : 'pictures were'} made with an AI image generator for the sample feed.
          </p>
        ) : null}
        {licensed.length ? (
          <ul className="credits">
            {licensed.map((p) => (
              <li key={p.id} className="credit">
                <img src={p.src} alt="" loading="lazy" className="credit-img" />
                <div className="credit-txt">
                  <b>{p.alt}</b>
                  <span>
                    {p.author} ·{' '}
                    {p.licenseLink ? (
                      <a href={p.licenseLink} target="_blank" rel="noreferrer">
                        {p.license}
                      </a>
                    ) : (
                      p.license
                    )}
                    {p.changes ? ` · ${p.changes}` : ''}
                  </span>
                  {p.link ? (
                    <a href={p.link} target="_blank" rel="noreferrer" className="credit-src">
                      {p.source || 'Source'}
                    </a>
                  ) : (
                    <span className="credit-src">{p.source}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="set-desc">No photos added yet.</p>
        )}
      </section>

      <section className="set-card" aria-labelledby="s-more">
        <h2 id="s-more" className="set-title">
          About and privacy
        </h2>
        <ul className="link-list">
          <li>
            <button type="button" className="link-row" onClick={() => onOpen('about')}>
              <Icon name="info" size={20} />
              <span>
                <b>About ScrollWise</b>
                <span className="muted">The problem, our idea and how it was built</span>
              </span>
              <Icon name="chevronRight" size={18} className="link-go" />
            </button>
          </li>
          <li>
            <button type="button" className="link-row" onClick={() => onOpen('privacy')}>
              <Icon name="shield" size={20} />
              <span>
                <b>Privacy notice</b>
                <span className="muted">What is stored, where, and how to delete it</span>
              </span>
              <Icon name="chevronRight" size={18} className="link-go" />
            </button>
          </li>
          {!demoOn ? (
            <li>
              <button type="button" className="link-row" onClick={() => onOpen('research')}>
                <Icon name="flask" size={20} />
                <span>
                  <b>Research mode</b>
                  <span className="muted">For the student team: supervised A/B testing with anonymous results</span>
                </span>
                <Icon name="chevronRight" size={18} className="link-go" />
              </button>
            </li>
          ) : null}
        </ul>
      </section>

      <footer className="about">
        <Mark size={28} />
        <p>
          <b>ScrollWise</b> · Less scroll. More life.
          <br />
          Created by Talia Kassissieh
        </p>
      </footer>
    </div>
  );
}
