import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { POSTS, POST_BY_ID, CREATORS, FEED_CREATORS, postSlides } from '../data/posts.js';
import { ActivityArt, Art, Avatar, PostArt, Ring, Sheet, Switch, Empty, ratioSize } from '../components/ui.jsx';
import { postPhoto } from '../lib/library.js';
import { Icon } from '../components/Icon.jsx';
import { cx, fmtClock, fmtNum, ago } from '../lib/util.js';
import { POST_CHOICES } from '../store.js';

function timeLabel(t) {
  const n = parseInt(t, 10);
  if (t.endsWith('m')) return `${n} ${n === 1 ? 'minute' : 'minutes'} ago`;
  if (t.endsWith('w')) return `${n} ${n === 1 ? 'week' : 'weeks'} ago`;
  if (t.endsWith('h')) return `${n} ${n === 1 ? 'hour' : 'hours'} ago`;
  if (t.endsWith('d')) return `${n} ${n === 1 ? 'day' : 'days'} ago`;
  return t;
}

/* ---------- session widgets ---------- */
export function TimerChip({ session, onClick }) {
  const L = session.limitMs;
  const e = Math.min(session.elapsedMs, L || Infinity);
  const near = L && L - e <= 60000;
  return (
    <button
      type="button"
      className={cx('timer-chip', near && 'is-near')}
      onClick={onClick}
      aria-label={L ? `${fmtClock(L - e)} left of your ${Math.round(L / 60000)}-minute session. Open session settings` : `Browsing time ${fmtClock(e)}. Open session settings`}
    >
      <Ring p={L ? e / L : 0} size={20} stroke={3} />
      <span className="tnum">{fmtClock(L ? L - e : e)}</span>
      {L ? <span className="timer-of">left</span> : null}
    </button>
  );
}

export function SessionMeter({ session }) {
  const n = session.budget;
  const v = Math.min(n, session.viewed.length);
  return (
    <div className="meter" role="status" aria-label={`${n - v} of ${n} posts left in this session`}>
      <div className="meter-dots" aria-hidden="true">
        {Array.from({ length: n }, (_, i) => (
          <span key={i} className={cx('md', i < v && 'on')} />
        ))}
      </div>
      <span className="meter-txt">
        <b className="tnum">{n - v}</b> left
      </span>
    </div>
  );
}

export function TimerSheet({ state, dispatch, onClose }) {
  const s = state.session;
  const st = state.settings;
  const L = s.limitMs;
  return (
    <Sheet title="This session" onClose={onClose}>
      <div className="ts-top">
        <div className="ts-ring">
          <Ring p={L ? s.elapsedMs / L : 0} size={132} stroke={10} />
          <div className="ts-ring-txt">
            <span className="tnum ts-big">{fmtClock(L ? Math.max(0, L - s.elapsedMs) : s.elapsedMs)}</span>
            <span className="muted">{L ? `left of ${fmtClock(L)}` : 'browsing'}</span>
          </div>
        </div>
        <p className="ts-note">
          {s.viewed.length} of {s.budget} posts viewed. The timer pauses on its own when you leave the feed or switch tabs.
        </p>
      </div>
      <div className="set-row">
        <div>
          <h3 id="ts-posts">Posts per session</h3>
          <p>The feed stops after this many posts.</p>
        </div>
        <div className="seg seg-sm" role="radiogroup" aria-labelledby="ts-posts">
          {POST_CHOICES.map((n) => (
            <button type="button" key={n} role="radio" aria-checked={st.posts === n} onClick={() => dispatch({ type: 'SET', key: 'posts', value: n })}>
              {n}
            </button>
          ))}
        </div>
      </div>
      <div className="set-row">
        <div>
          <h3 id="ts-len">Session length</h3>
          <p>Applies to this session and the next ones.</p>
        </div>
        <div className="seg seg-sm" role="radiogroup" aria-labelledby="ts-len">
          {[5, 10, 15, 20].map((m) => (
            <button type="button" key={m} role="radio" aria-checked={st.minutes === m} disabled={!st.timerOn} onClick={() => dispatch({ type: 'SET', key: 'minutes', value: m })}>
              {m}m
            </button>
          ))}
        </div>
      </div>
      <div className="set-row">
        <div>
          <h3>Session timer</h3>
          <p>Wrap up the feed when the time is up.</p>
        </div>
        <Switch id="ts-timer" checked={st.timerOn} label="Session timer" onChange={(v) => dispatch({ type: 'SET', key: 'timerOn', value: v })} />
      </div>
      <div className="set-row">
        <div>
          <h3>Gentle reminders</h3>
          <p>A quiet note halfway through and with a minute to go.</p>
        </div>
        <Switch id="ts-rem" checked={st.reminders} label="Gentle reminders" onChange={(v) => dispatch({ type: 'SET', key: 'reminders', value: v })} />
      </div>
    </Sheet>
  );
}

/* ---------- post pieces ---------- */
function RichText({ text }) {
  const parts = text.split(/(#[\w]+|@[\w.]+)/g);
  return parts.map((p, i) =>
    p.startsWith('#') || p.startsWith('@') ? (
      <span key={i} className="tag">
        {p}
      </span>
    ) : (
      p
    ),
  );
}

function Caption({ user, text }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 96;
  const shown = long && !open ? text.slice(0, text.lastIndexOf(' ', 86)) : text;
  return (
    <p className="caption">
      <strong>{user}</strong> <RichText text={shown} />
      {long && !open ? (
        <>
          …{' '}
          <button type="button" className="more-btn" onClick={() => setOpen(true)}>
            more
          </button>
        </>
      ) : null}
    </p>
  );
}

function Media({ post, onDoubleTap }) {
  const images = [null, ...postSlides(post)];
  const [rw, rh] = ratioSize(post.ratio);
  const [index, setIndex] = useState(0);
  const track = useRef(null);
  const lastTap = useRef(0);
  const [burst, setBurst] = useState(0);
  const tap = () => {
    const now = Date.now();
    if (now - lastTap.current < 330) {
      onDoubleTap();
      setBurst((b) => b + 1);
      lastTap.current = 0;
    } else lastTap.current = now;
  };
  const onScroll = () => {
    const el = track.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };
  const goTo = (i, e) => {
    e.stopPropagation();
    const el = track.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: document.documentElement.classList.contains('rm') ? 'auto' : 'smooth' });
  };
  return (
    <div className="post-media" onClick={tap}>
      {images.length === 1 ? (
        <PostArt post={post} alt={post.alt} />
      ) : (
        <>
          <div className="carousel" ref={track} onScroll={onScroll} role="group" aria-roledescription="carousel" aria-label={`${images.length} photos`}>
            {images.map((slide, i) => (
              <div className="slide" key={i} aria-label={`Photo ${i + 1} of ${images.length}`}>
                {i === 0 ? <PostArt post={post} alt={post.alt} /> : <Art photo={slide.photo} w={rw} h={rh} alt={slide.alt} />}
              </div>
            ))}
          </div>
          <span className="slide-count tnum" aria-hidden="true">
            {index + 1}/{images.length}
          </span>
          {index > 0 ? (
            <button type="button" className="slide-btn prev" onClick={(e) => goTo(index - 1, e)} aria-label="Previous photo">
              <Icon name="chevronLeft" size={18} />
            </button>
          ) : null}
          {index < images.length - 1 ? (
            <button type="button" className="slide-btn next" onClick={(e) => goTo(index + 1, e)} aria-label="Next photo">
              <Icon name="chevronRight" size={18} />
            </button>
          ) : null}
        </>
      )}
      {burst > 0 ? (
        <span key={burst} className="heart-burst" aria-hidden="true">
          <Icon name="heartFill" size={92} />
        </span>
      ) : null}
      {images.length > 1 ? (
        <span className="slide-dots" aria-hidden="true">
          {images.map((_, i) => (
            <i key={i} className={cx(i === index && 'on')} />
          ))}
        </span>
      ) : null}
    </div>
  );
}

export const PostCard = memo(function PostCard({ post, liked, saved, followed, mine, onLike, onLikeOn, onSave, onFollow, onComments, onProfile, register }) {
  const total = post.likes + (liked ? 1 : 0);
  const count = post.comments.length + (mine ? mine.length : 0);
  const last = mine && mine.length ? mine[mine.length - 1] : null;
  const liker = (post.comments.find(([u]) => u !== post.user) || [FEED_CREATORS.find((u) => u !== post.user) || post.user])[0];
  const pic = postPhoto(post);
  const ai = !!(pic && pic.ai);
  const [aiOpen, setAiOpen] = useState(false);
  return (
    <article className="post" data-post={post.id} ref={register} aria-label={`Post by ${post.user}`}>
      <header className="post-head">
        <Avatar user={post.user} onClick={() => onProfile(post.user)} />
        <div className="post-who">
          <button type="button" className="post-user" onClick={() => onProfile(post.user)}>
            {post.user}
          </button>
          <div className="post-place">
            {post.place || (followed ? CREATORS[post.user].topic : 'Suggested for you')}
            {ai ? (
              <>
                {' · '}
                <button type="button" className="ai-info" onClick={() => setAiOpen((o) => !o)} aria-expanded={aiOpen}>
                  AI info
                </button>
              </>
            ) : null}
          </div>
        </div>
        <button type="button" className={cx('follow-btn', followed && 'is-on')} onClick={() => onFollow(post.user)} aria-pressed={!!followed}>
          {followed ? 'Following' : 'Follow'}
        </button>
      </header>
      {aiOpen ? <p className="ai-note">Made with AI. This is a sample post from a fictional creator.</p> : null}
      <Media post={post} onDoubleTap={() => onLikeOn(post.id)} />
      <div className="post-actions">
        <button type="button" className={cx('act', liked && 'is-liked')} onClick={() => onLike(post.id)} aria-pressed={!!liked} aria-label={liked ? 'Unlike' : 'Like'}>
          <Icon name={liked ? 'heartFill' : 'heart'} size={26} />
        </button>
        <button type="button" className="act" onClick={() => onComments(post.id)} aria-label={`Comments (${count})`}>
          <Icon name="comment" size={25} />
        </button>
        <span className="spacer" />
        <button type="button" className={cx('act', saved && 'is-saved')} onClick={() => onSave(post.id)} aria-pressed={!!saved} aria-label={saved ? 'Remove from saved' : 'Save post'}>
          <Icon name={saved ? 'bookmarkFill' : 'bookmark'} size={25} />
        </button>
      </div>
      <div className="post-body">
        <div className="likes">
          <span className="like-faces" aria-hidden="true">
            <Avatar user={liker} size="xs" />
            {liked ? <Avatar user="you" size="xs" /> : null}
          </span>
          <span>
            Liked by <b>{liked ? 'you' : liker}</b> and <b className="tnum">{fmtNum(total - 1)} others</b>
          </span>
        </div>
        <Caption user={post.user} text={post.caption} />
        {last ? (
          <p className="caption mine">
            <strong>you</strong> {last.text}
          </p>
        ) : null}
        {count > 0 ? (
          <button type="button" className="link-btn" onClick={() => onComments(post.id)}>
            {count === 1 ? 'View 1 comment' : `View all ${count} comments`}
          </button>
        ) : null}
        <p className="post-time">{timeLabel(post.time)}</p>
      </div>
    </article>
  );
});

export function CommentsSheet({ postId, state, dispatch, onClose, onProfile }) {
  const post = POST_BY_ID[postId];
  const [text, setText] = useState('');
  const listRef = useRef(null);
  const mine = state.comments[postId] || [];
  if (!post) return null;
  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch({ type: 'COMMENT', id: postId, text });
    setText('');
    requestAnimationFrame(() => {
      const el = listRef.current && listRef.current.closest('.sheet-body');
      if (el) el.scrollTop = el.scrollHeight;
    });
  };
  const row = (user, body, key, extra) => (
    <li className="comment" key={key}>
      <Avatar user={user} size="sm" onClick={user === 'you' ? undefined : () => onProfile(user)} />
      <div className="comment-main">
        <p>
          <strong>{user}</strong> <RichText text={body} />
        </p>
        {extra}
      </div>
    </li>
  );
  return (
    <Sheet
      title="Comments"
      onClose={onClose}
      footer={
        <form className="comment-form" onSubmit={submit}>
          <Avatar user="you" size="sm" />
          <label className="sr-only" htmlFor="comment-input">
            Add a comment
          </label>
          <input id="comment-input" value={text} onChange={(e) => setText(e.target.value)} placeholder={`Add a comment for ${post.user}…`} maxLength={300} autoComplete="off" />
          <button type="submit" className="btn-text" disabled={!text.trim()}>
            Post
          </button>
        </form>
      }
    >
      <ul className="comments" ref={listRef}>
        {row(post.user, post.caption, 'cap', <span className="comment-meta">{timeLabel(post.time)}</span>)}
        {post.comments.map(([u, t], i) => row(u, t, `c${i}`))}
        {mine.map((m) =>
          row(
            'you',
            m.text,
            m.id,
            <span className="comment-meta">
              {ago(m.at)} · only visible to you ·{' '}
              <button type="button" className="mini-link" onClick={() => dispatch({ type: 'DEL_COMMENT', id: postId, cid: m.id })}>
                Delete
              </button>
            </span>,
          ),
        )}
      </ul>
    </Sheet>
  );
}

/* ---------- creator profile ---------- */
export function ProfileSheet({ user, state, dispatch, onClose, openPost }) {
  const c = CREATORS[user];
  if (!c) return null;
  const posts = POSTS.filter((p) => p.user === user);
  const seen = posts.filter((p) => state.seen && state.seen[p.id]).length;
  const followed = !!state.follows[user];
  return (
    <Sheet title={user} onClose={onClose} className="sheet-profile">
      <div className="prof-head">
        <Avatar user={user} size="xl" />
        <div className="prof-meta">
          <h3>{c.name}</h3>
          <p className="prof-topic">{c.topic}</p>
          <p className="prof-bio">{c.bio}</p>
          <p className="prof-sample">Sample account · fictional creator</p>
        </div>
      </div>
      <div className="prof-row">
        <p className="prof-stats">
          <span>
            <b className="tnum">{posts.length}</b> {posts.length === 1 ? 'post' : 'posts'}
          </span>
          <span>
            <b className="tnum">{seen}</b> seen by you
          </span>
        </p>
        <button type="button" className={cx('btn', 'btn-sm', followed ? 'btn-outline' : 'btn-primary')} onClick={() => dispatch({ type: 'FOLLOW', user })} aria-pressed={followed}>
          {followed ? 'Following' : 'Follow'}
        </button>
      </div>
      {posts.length ? (
        <>
          <div className="prof-grid">
            {posts.map((p) =>
              state.seen && state.seen[p.id] ? (
                <button type="button" key={p.id} className="thumb" onClick={() => openPost(p.id)} aria-label={`Open post: ${p.alt}`}>
                  <PostArt post={p} style={{ aspectRatio: '4 / 5' }} />
                </button>
              ) : (
                <div key={p.id} className="thumb is-later" aria-label="Shows up in a future feed">
                  <PostArt post={p} style={{ aspectRatio: '4 / 5' }} />
                  <span>
                    <Icon name="clock" size={16} />
                    Future feed
                  </span>
                </div>
              ),
            )}
          </div>
          <p className="prof-note">Posts open here once they’ve appeared in your feed. The rest arrive in future sessions.</p>
        </>
      ) : (
        <p className="prof-note">No posts yet.</p>
      )}
    </Sheet>
  );
}

function Suggested({ follows, dispatch, onProfile }) {
  const list = FEED_CREATORS.filter((u) => !follows[u]).slice(0, 6);
  if (!list.length) return null;
  return (
    <section className="suggest" aria-label="Suggested creators">
      <div className="suggest-head">
        <h2>Suggested for you</h2>
      </div>
      <ul className="suggest-row">
        {list.map((u) => (
          <li key={u} className="suggest-card">
            <Avatar user={u} size="lg" onClick={() => onProfile(u)} />
            <button type="button" className="suggest-name" onClick={() => onProfile(u)}>
              <b>{u}</b>
              <span>{CREATORS[u].topic}</span>
            </button>
            <button type="button" className="btn btn-primary btn-sm btn-block" onClick={() => dispatch({ type: 'FOLLOW', user: u })}>
              Follow
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- feed ---------- */
function EndMarker({ onReached }) {
  const ref = useRef(null);
  const fired = useRef(false);
  const cb = useRef(onReached);
  cb.current = onReached;
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !fired.current) {
          fired.current = true;
          setTimeout(() => cb.current(), 800);
        }
      },
      { threshold: [0, 0.35] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="end-marker" ref={ref}>
      <span className="end-sun" aria-hidden="true" />
      <p className="end-title">That’s your feed for now.</p>
      <p className="end-sub">Finding your next moment…</p>
    </div>
  );
}

// Topics for Explore. Choosing one only changes which of this session's posts you see:
// the session keeps the same number of posts and the same stopping point.
const TOPICS = [
  ['all', 'All'],
  ['friends', 'Friends'],
  ['food', 'Food'],
  ['style', 'Style'],
  ['pets', 'Pets'],
  ['travel', 'Travel'],
  ['hobbies', 'Hobbies'],
];
const TOPIC_LABEL = Object.fromEntries(TOPICS);

export function Feed({ state, dispatch, tab, setTab, onEnd, openComments, onProfile, onSaveToast }) {
  const s = state.session;
  const [topic, setTopic] = useState('all');
  const topics = useMemo(() => TOPICS.filter(([id]) => id === 'all' || POSTS.some((p) => p.cat === id)), []);
  // The order is fixed when the session starts: new posts first, then ones seen before.
  const order = useMemo(() => (s.order || POSTS.map((p) => p.id)).map((id) => POST_BY_ID[id]).filter(Boolean), [s.order]);
  const isOld = useMemo(() => new Set((s.order || []).slice(s.fresh == null ? Infinity : s.fresh)), [s.order, s.fresh]);
  const viewed = s.viewed;
  const remaining = Math.max(0, s.budget - viewed.length);
  const list = useMemo(() => {
    const source = tab === 'following' ? order.filter((p) => state.follows[p.user]) : topic === 'all' ? order : order.filter((p) => p.cat === topic);
    let extra = 0;
    return source.filter((p) => {
      if (viewed.includes(p.id)) return true;
      if (extra < remaining) {
        extra += 1;
        return true;
      }
      return false;
    });
  }, [order, tab, topic, state.follows, viewed, remaining]);

  // A post counts as viewed once half of it has been on screen.
  const viewRef = useRef(null);
  viewRef.current = (id) => {
    if (!viewed.includes(id)) dispatch({ type: 'VIEW_POST', id });
  };
  const obs = useRef(null);
  useEffect(() => {
    // Viewed = half the post is on screen, or (for posts taller than the screen,
    // e.g. a phone in landscape) the post fills half of the screen.
    obs.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const screen = e.rootBounds ? e.rootBounds.height : window.innerHeight;
          const need = Math.min(e.boundingClientRect.height, screen) * 0.5;
          if (e.intersectionRect.height >= need - 1) viewRef.current(e.target.getAttribute('data-post'));
        });
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.75, 1] },
    );
    document.querySelectorAll('[data-post]').forEach((el) => obs.current.observe(el));
    return () => obs.current.disconnect();
  }, []);
  const register = useCallback((el) => {
    if (el && obs.current) obs.current.observe(el);
  }, []);

  const onLike = useCallback((id) => dispatch({ type: 'LIKE', id }), [dispatch]);
  const onLikeOn = useCallback((id) => dispatch({ type: 'LIKE_ON', id }), [dispatch]);
  const savesRef = useRef(state.saves);
  savesRef.current = state.saves;
  const onSave = useCallback(
    (id) => {
      const wasSaved = !!savesRef.current[id];
      dispatch({ type: 'SAVE_POST', id });
      if (!wasSaved && onSaveToast) onSaveToast();
    },
    [dispatch, onSaveToast],
  );
  const onFollow = useCallback((user) => dispatch({ type: 'FOLLOW', user }), [dispatch]);

  const followingEmpty = tab === 'following' && !list.length && !Object.keys(state.follows).length;
  const skipped = list.filter((p) => !viewed.includes(p.id));
  const jumpTo = (id) => {
    const el = document.querySelector(`[data-post="${id}"]`);
    if (el) el.scrollIntoView({ block: 'center', behavior: document.documentElement.classList.contains('rm') ? 'auto' : 'smooth' });
  };

  return (
    <div className="feed-col">
      <div className="feed-head">
        <div className="seg" role="tablist" aria-label="Feed">
          <button type="button" role="tab" aria-selected={tab === 'explore'} onClick={() => setTab('explore')}>
            Explore
          </button>
          <button type="button" role="tab" aria-selected={tab === 'following'} onClick={() => setTab('following')}>
            Following
          </button>
        </div>
        <SessionMeter session={s} />
      </div>
      {tab === 'explore' && topics.length > 2 && remaining > 0 ? (
        <div className="topics" role="group" aria-label="Show posts about">
          {topics.map(([id, label]) => (
            <button type="button" key={id} className={cx('topic', topic === id && 'is-on')} aria-pressed={topic === id} onClick={() => setTopic(id)}>
              {label}
            </button>
          ))}
        </div>
      ) : null}
      {!state.dismissed || !state.dismissed.feedNote ? (
        <aside className="feed-note" aria-label="About this feed">
          <span className="feed-note-ico" aria-hidden="true">
            <Icon name="info" size={18} />
          </span>
          <p>
            <b>This is a sample feed.</b> The creators and posts are fictional. Your likes, comments and follows are simulated: they stay on this device and nobody else sees them.
          </p>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => dispatch({ type: 'DISMISS', key: 'feedNote' })}>
            Got it
          </button>
        </aside>
      ) : null}
      {!POSTS.length ? (
        <Empty icon="image" title="No posts yet" action={<button type="button" className="btn btn-primary" onClick={() => onEnd('posts')}>Find Your Next Moment</button>}>
          Posts appear here once their photos are added.
        </Empty>
      ) : followingEmpty ? (
        <Empty icon="users" title="You’re not following anyone yet" action={<button type="button" className="btn btn-outline" onClick={() => setTab('explore')}>Find creators in Explore</button>}>
          Tap Follow on any post in Explore and their posts show up here.
        </Empty>
      ) : (
        <div className="posts">
          {list.map((p, i) => (
            <div key={p.id} className="post-slot">
              {isOld.has(p.id) && (i === 0 || !isOld.has(list[i - 1].id)) ? (
                <div className="seen-all" role="note">
                  <span className="seen-all-ico">
                    <Icon name="check" size={22} />
                  </span>
                  <strong>You’ve seen all new posts</strong>
                  <p>Here are some you’ve seen before.</p>
                </div>
              ) : null}
              <PostCard
                post={p}
                liked={!!state.likes[p.id]}
                saved={!!state.saves[p.id]}
                followed={!!state.follows[p.user]}
                mine={state.comments[p.id]}
                onLike={onLike}
                onLikeOn={onLikeOn}
                onSave={onSave}
                onFollow={onFollow}
                onComments={openComments}
                onProfile={onProfile}
                register={register}
              />
              {tab === 'explore' && i === 2 ? <Suggested follows={state.follows} dispatch={dispatch} onProfile={onProfile} /> : null}
            </div>
          ))}
          {remaining === 0 ? (
            <EndMarker key={`end-${s.id}`} onReached={() => onEnd('posts')} />
          ) : tab === 'explore' && topic !== 'all' && !skipped.length ? (
            <div className="caught-up">
              <span className="caught-ico">
                <Icon name="check" size={20} />
              </span>
              <div>
                <strong>That’s every {TOPIC_LABEL[topic].toLowerCase()} post for now.</strong>
                <p>
                  {remaining} {remaining === 1 ? 'post' : 'posts'} left in this session.
                </p>
              </div>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setTopic('all')}>
                Show all topics
              </button>
            </div>
          ) : tab === 'explore' ? (
            list.length && skipped.length && viewed.includes(list[list.length - 1].id) ? (
              <div className="caught-up">
                <span className="caught-ico">
                  <Icon name="eye" size={20} />
                </span>
                <div>
                  <strong>{skipped.length === 1 ? 'You skipped a post above.' : `You skipped ${skipped.length} posts above.`}</strong>
                  <p>Your session ends once you’ve seen it.</p>
                </div>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => jumpTo(skipped[0].id)}>
                  Show me
                </button>
              </div>
            ) : null
          ) : (
            <div className="caught-up">
              <span className="caught-ico">
                <Icon name="check" size={20} />
              </span>
              <div>
                <strong>You’re caught up with the people you follow.</strong>
                <p>
                  {remaining} {remaining === 1 ? 'post' : 'posts'} left in this session.
                </p>
              </div>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setTab('explore')}>
                Go to Explore
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function FeedAside({ state, openTimer, ideas, openActivity }) {
  const s = state.session;
  const L = s.limitMs;
  return (
    <aside className="feed-aside" aria-label="Session">
      <div className="aside-card">
        <p className="section-label">This session</p>
        <button type="button" className="aside-timer" onClick={openTimer} aria-label="Open session settings">
          <Ring p={L ? s.elapsedMs / L : 0} size={64} stroke={6} />
          <span>
            <b className="tnum">{fmtClock(L ? Math.max(0, L - s.elapsedMs) : s.elapsedMs)}</b>
            <span className="muted">{L ? `left of ${fmtClock(L)}` : 'no time limit'}</span>
          </span>
        </button>
        <SessionMeter session={s} />
      </div>
      <div className="aside-card">
        <p className="section-label">Waiting after your feed</p>
        <ul className="aside-ideas">
          {ideas.map(({ a }) => (
            <li key={a.id}>
              <button type="button" onClick={() => openActivity(a.id)}>
                <ActivityArt a={a} className="aside-thumb" />
                <span>
                  <b>{a.title}</b>
                  <span className="muted">
                    {a.mins} min · {a.category}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p className="aside-foot">ScrollWise · Created by Talia Kassissieh</p>
    </aside>
  );
}
