import { ActivityArt, Avatar, Brand, Mark, PostArt } from '../components/ui.jsx';
import { Icon } from '../components/Icon.jsx';
import { MAIN_MESSAGE } from './About.jsx';
import { POSTS } from '../data/posts.js';
import { SESSION_POSTS, capBudget } from '../store.js';
import { ACT_BY_ID, MOODS } from '../data/activities.js';
import { fmtNum } from '../lib/util.js';

const STEPS = [
  { t: 'Browse', icon: 'home', tone: 'blue', d: 'A few great posts' },
  { t: 'Pause', icon: 'clock', tone: 'lav', d: 'The feed really ends' },
  { t: 'Discover', icon: 'sunrise', tone: 'mint', d: 'Ideas for right now' },
  { t: 'Do', icon: 'flag', tone: 'ink', d: 'Go live it' },
];

function MiniPost({ post }) {
  return (
    <article className="lp-post" aria-hidden="true">
      <div className="lp-head">
        <Avatar user={post.user} size="sm" />
        <b>{post.user}</b>
      </div>
      <PostArt post={post} className="lp-img" style={{ aspectRatio: '4 / 5' }} />
      <div className="lp-actions">
        <Icon name="heartFill" size={18} className="lp-heart" />
        <Icon name="comment" size={18} />
        <span />
        <Icon name="bookmark" size={18} />
      </div>
      <p className="lp-likes tnum">{fmtNum(post.likes)} likes</p>
    </article>
  );
}

function EndCard() {
  return (
    <div className="lp-end" aria-hidden="true">
      <span className="lp-sun" />
      <p className="lp-end-k">{capBudget(SESSION_POSTS)} posts · 6 min</p>
      <p className="lp-end-t">You’ve reached the end of your feed.</p>
      <p className="lp-end-s">Your next moment is waiting.</p>
      <span className="lp-end-btn">
        <Icon name="sunrise" size={15} />
        Find Your Next Moment
      </span>
    </div>
  );
}

export function Landing({ onStart, onMood, onAbout, onPrivacy }) {
  const previews = POSTS.slice(0, 4);
  const acts = ['three-photo-quest', 'fashion-studio', 'dance-break'].map((id) => ACT_BY_ID[id]);
  return (
    <div className="landing">
      <header className="l-nav">
        <Brand size={34} />
        <div className="l-nav-r">
          <button type="button" className="btn-text l-nav-link" onClick={onAbout}>
            About
          </button>
          <button type="button" className="btn btn-outline btn-sm" onClick={onStart}>
            Skip to the app
          </button>
        </div>
      </header>

      <section className="l-hero">
        <div className="l-copy">
          <h1 className="l-title">
            <span>Less scroll.</span>
            <span className="l-title-2">
              More life<span className="l-dot" aria-hidden="true" />
              <span className="sr-only">.</span>
            </span>
          </h1>
          <p className="l-lead">Most feeds are designed never to end. ScrollWise is a social feed with a finish line: you choose how long to browse, it stops when you’re done, and then helps you find something worth doing offline.</p>
          <div className="l-cta">
            <button type="button" className="btn btn-primary btn-xl" onClick={onStart}>
              Start Exploring
              <Icon name="arrowRight" />
            </button>
            <button type="button" className="btn btn-outline btn-xl l-about-btn" onClick={onAbout}>
              About the project
            </button>
          </div>
          <p className="l-note">Public beta · a working student prototype · free, no account needed</p>
        </div>
        <div className="l-preview" aria-label="Preview: a short feed that ends with a suggestion for what to do next">
          <div className="lp-row">
            {previews.map((p) => (
              <MiniPost key={p.id} post={p} />
            ))}
            <EndCard />
          </div>
        </div>
      </section>

      <section className="l-message" aria-label="Our message">
        <blockquote>
          <p>“{MAIN_MESSAGE}”</p>
        </blockquote>
      </section>

      <section className="l-compare" aria-labelledby="cmp-title">
        <h2 id="cmp-title" className="l-h2 l-h2-ink">
          How it’s different
        </h2>
        <div className="cmp">
          <div className="cmp-col cmp-old">
            <p className="cmp-head">A typical feed</p>
            <ul>
              <li>Keeps loading more posts, forever</li>
              <li>No sense of how long you’ve been scrolling</li>
              <li>Ends only when you force yourself to stop</li>
            </ul>
          </div>
          <div className="cmp-col cmp-new">
            <p className="cmp-head">ScrollWise</p>
            <ul>
              <li>You choose the posts and minutes per session</li>
              <li>A subtle timer and progress you can see</li>
              <li>A clear stopping point, then your choice: finish, find an offline idea or continue on purpose</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="l-steps" aria-label="How ScrollWise works">
        <ol className="steps4">
          {STEPS.map((s) => (
            <li key={s.t}>
              <span className={`s4-ico tone-${s.tone}`}>
                <Icon name={s.icon} size={20} />
              </span>
              <b>{s.t}</b>
              <span>{s.d}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="l-wrap" aria-labelledby="moment-title">
        <div className="l-moment">
          <div className="l-moment-copy">
            <p className="eyebrow on-night">Find Your Next Moment</p>
            <h2 id="moment-title" className="l-h2">
              How do you feel right now?
            </h2>
            <div className="mood-row">
              {MOODS.map((m) => (
                <button type="button" key={m.id} className="mood-pill" onClick={() => onMood(m.id)}>
                  <Icon name={m.icon} size={16} />
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <ul className="l-moment-cards">
            {acts.map((a) => (
              <li key={a.id} className="lm-card">
                <ActivityArt a={a} className="lm-thumb" />
                <span>
                  <b>{a.title}</b>
                  <span>
                    {a.mins} min · {a.category}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="l-foot">
        <p className="l-foot-line">Don’t just stop scrolling. Start something worth doing.</p>
        <p className="l-credit">
          <Mark size={20} />
          ScrollWise · Created by Talia Kassissieh
        </p>
        <p className="l-fine">Public beta of a student-built prototype. Feed posts are samples from fictional creators, and more photos are on the way.</p>
        <p className="l-links">
          <button type="button" className="btn-text" onClick={onAbout}>
            About ScrollWise
          </button>
          <span aria-hidden="true">·</span>
          <button type="button" className="btn-text" onClick={onPrivacy}>
            Privacy
          </button>
        </p>
      </footer>
    </div>
  );
}
