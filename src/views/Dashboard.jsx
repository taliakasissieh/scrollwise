import { useState } from 'react';
import { ActivityArt, Ring, Empty } from '../components/ui.jsx';
import { Icon } from '../components/Icon.jsx';
import { ACT_BY_ID, CATEGORIES } from '../data/activities.js';
import { ago, cx, dayKey, fmtDur, lastDays } from '../lib/util.js';

const GOAL_CHOICES = {
  dailyMinutes: [10, 15, 20, 30, 45],
  weeklyMoments: [1, 3, 5, 7],
  stopShare: [50, 70, 90],
};
const mins = (ms) => Math.round(ms / 60000);

function categoryScores(history) {
  const score = {};
  history.forEach((h) => {
    if (h.type !== 'start' && h.type !== 'complete') return;
    const a = ACT_BY_ID[h.id];
    if (!a) return;
    if (!score[a.category]) score[a.category] = { started: 0, completed: 0 };
    score[a.category][h.type === 'start' ? 'started' : 'completed'] += 1;
  });
  return CATEGORIES.map((c) => ({ cat: c, ...(score[c] || { started: 0, completed: 0 }) }))
    .map((c) => ({ ...c, weight: c.completed * 2 + c.started }))
    .filter((c) => c.weight > 0)
    .sort((x, y) => y.weight - x.weight);
}

function HistoryRow({ h, onOpen }) {
  if (h.type === 'continue') {
    return (
      <li className="hist">
        <span className="hist-ico hi-lav">
          <Icon name="refresh" size={16} />
        </span>
        <span className="hist-main">
          <b>Chose to continue</b>
          <span className="muted">Started another limited session</span>
        </span>
        <span className="hist-when muted">{ago(h.at)}</span>
      </li>
    );
  }
  if (h.type === 'session') {
    return (
      <li className="hist">
        <span className="hist-ico hi-blue">
          <Icon name="eye" size={18} />
        </span>
        <span className="hist-main">
          <b>Reached a stopping point</b>
          <span className="muted">
            {h.posts} {h.posts === 1 ? 'post' : 'posts'} · {fmtDur(h.ms)} of browsing
          </span>
        </span>
        <span className="hist-when muted">{ago(h.at)}</span>
      </li>
    );
  }
  const a = ACT_BY_ID[h.id];
  if (!a) return null;
  const complete = h.type === 'complete';
  return (
    <li className="hist">
      <span className={cx('hist-ico', complete ? 'hi-mint' : 'hi-lav')}>
        <Icon name={complete ? 'flag' : 'play'} size={complete ? 18 : 14} />
      </span>
      <button type="button" className="hist-main hist-link" onClick={() => onOpen(a.id)}>
        <b>
          {complete ? 'Completed' : 'Started'} {a.title}
        </b>
        <span className="muted">
          {a.category} · {a.mins} min
        </span>
      </button>
      <span className="hist-when muted">{ago(h.at)}</span>
    </li>
  );
}

function GoalRow({ icon, title, value, max, valueLabel, status, tone, choices, current, unit, onPick, editing }) {
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  return (
    <li className="goal">
      <div className="goal-top">
        <span className={cx('goal-ico', tone)}>
          <Icon name={icon} size={18} />
        </span>
        <div className="goal-txt">
          <b>{title}</b>
          <span className="muted">{status}</span>
        </div>
        <span className="goal-val tnum">{valueLabel}</span>
      </div>
      <div className="goal-track" role="progressbar" aria-label={title} aria-valuemin={0} aria-valuemax={max} aria-valuenow={Math.min(value, max)}>
        <span className={cx('goal-fill', tone)} style={{ width: `${pct * 100}%` }} />
      </div>
      {editing ? (
        <div className="seg seg-sm goal-seg" role="radiogroup" aria-label={`${title}: choose a goal`}>
          {choices.map((c) => (
            <button type="button" key={c} role="radio" aria-checked={current === c} onClick={() => onPick(c)}>
              {c}
              {unit}
            </button>
          ))}
        </div>
      ) : null}
    </li>
  );
}

// "12 min less than the 7 days before": a plain comparison, no judgement.
function weekCompare(now, before) {
  const diff = Math.round((now - before) / 60000);
  if (Math.abs(diff) < 1) return 'About the same as the 7 days before';
  return `${Math.abs(diff)} min ${diff < 0 ? 'less' : 'more'} than the 7 days before`;
}

export function Dashboard({ state, dispatch, photos = {}, removePhoto, onDiscover, openActivity, openSettings, goSaved }) {
  const [editGoals, setEditGoals] = useState(false);
  const t = state.totals;
  const days = lastDays(7).map((d) => ({ ...d, ...(state.daily[d.key] || { browseMs: 0, posts: 0, started: 0, completed: 0 }) }));
  // The 7 days before those, to compare with (only shown when there is data for them).
  const prevDays = lastDays(14).slice(0, 7);
  const prevMs = prevDays.reduce((n, d) => n + ((state.daily[d.key] && state.daily[d.key].browseMs) || 0), 0);
  const hasPrev = prevDays.some((d) => state.daily[d.key] && (state.daily[d.key].browseMs || state.daily[d.key].posts));
  const maxMin = Math.max(1, ...days.map((d) => d.browseMs / 60000));
  const cats = categoryScores(state.history);
  const maxCat = cats.length ? cats[0].weight : 1;
  const rate = t.started ? t.completed / t.started : 0;
  const savedCount = Object.keys(state.savedActs).length;
  const weekMoments = days.reduce((n, d) => n + d.completed, 0);
  const isNew = !t.posts && !t.started && !t.completed;
  const moments = state.history.filter((h) => h.type === 'complete' && ACT_BY_ID[h.id]).slice(0, 6);
  const goals = state.settings.goals || { dailyMinutes: 20, weeklyMoments: 3, stopShare: 70 };
  const today = { browseMs: 0, posts: 0, ...(state.daily[dayKey()] || {}) };
  const weekMs = days.reduce((n, d) => n + d.browseMs, 0);
  const weekPosts = days.reduce((n, d) => n + d.posts, 0);
  const sessions = t.sessions || 0;
  const sessionHist = state.history.filter((h) => h.type === 'session' && h.ms);
  const sessionMs = t.sessionMs != null ? t.sessionMs : sessionHist.reduce((n, h) => n + h.ms, 0);
  const avgMs = sessions ? sessionMs / (t.sessionMs != null ? sessions : Math.max(1, sessionHist.length)) : 0;
  const continues = Math.min(t.continues || 0, sessions);
  const stopped = Math.max(0, sessions - continues);
  const stopShare = sessions ? stopped / sessions : 0;
  const todayMin = today.browseMs / 60000;
  const setGoal = (key, value) => dispatch && dispatch({ type: 'GOAL', key, value });
  const favorites = Object.entries(state.done)
    .filter(([id]) => ACT_BY_ID[id])
    .sort((x, y) => y[1].n - x[1].n || y[1].last - x[1].last)
    .slice(0, 4)
    .map(([id, d]) => ({ a: ACT_BY_ID[id], d, saved: !!state.savedActs[id] }));

  return (
    <div className="page page-wide dash">
      <header className="page-head">
        <div>
          <p className="eyebrow">Your dashboard</p>
          <h1 className="page-title">Your moments</h1>
        </div>
        <button type="button" className="icon-btn outline" onClick={openSettings} aria-label="Settings">
          <Icon name="sliders" />
        </button>
      </header>

      <section className="habit-grid" aria-label="Browsing habits">
        <div className="card habit">
          <p className="habit-l">Today</p>
          <p className="habit-v tnum">{fmtDur(today.browseMs)}</p>
          <p className="muted habit-s">
            {today.posts} {today.posts === 1 ? 'post' : 'posts'} viewed
          </p>
        </div>
        <div className="card habit">
          <p className="habit-l">This week</p>
          <p className="habit-v tnum">{fmtDur(weekMs)}</p>
          <p className="muted habit-s">
            {weekPosts} {weekPosts === 1 ? 'post' : 'posts'} viewed
          </p>
          {hasPrev ? <p className="habit-cmp">{weekCompare(weekMs, prevMs)}</p> : null}
        </div>
        <div className="card habit">
          <p className="habit-l">Sessions completed</p>
          <p className="habit-v tnum">{sessions}</p>
          <p className="muted habit-s">{sessions ? `Average session: ${fmtDur(avgMs)}` : 'Counted when a feed reaches its stopping point'}</p>
        </div>
      </section>

      <div className="dash-cols">
        <section className="card stops-card" aria-labelledby="stop-title">
          <div className="card-head">
            <h2 id="stop-title" className="card-title">
              At the stopping point
            </h2>
          </div>
          {sessions ? (
            <div className="stops">
              <div className="stops-ring">
                <Ring p={stopShare} size={116} stroke={11} className="ring-mint" />
                <div className="stops-ring-txt">
                  <b className="tnum">{Math.round(stopShare * 100)}%</b>
                  <span>stopped</span>
                </div>
              </div>
              <dl className="stops-list">
                <div>
                  <dt>
                    <i className="dot dot-mint" />
                    Stopped there
                  </dt>
                  <dd className="tnum">{stopped}</dd>
                </div>
                <div>
                  <dt>
                    <i className="dot dot-lav" />
                    Chose to continue
                  </dt>
                  <dd className="tnum">{continues}</dd>
                </div>
                <div>
                  <dt>
                    <i className="dot dot-blue" />
                    Stopping points reached
                  </dt>
                  <dd className="tnum">{sessions}</dd>
                </div>
              </dl>
            </div>
          ) : (
            <p className="card-empty">When a session reaches its stopping point, you’ll see here how often you stopped and how often you chose to continue.</p>
          )}
        </section>

        <section className="card goals-card" aria-labelledby="goal-title">
          <div className="card-head">
            <h2 id="goal-title" className="card-title">
              Your goals
            </h2>
            <button type="button" className="btn-text" onClick={() => setEditGoals((v) => !v)} aria-expanded={editGoals}>
              {editGoals ? 'Done' : 'Edit goals'}
            </button>
          </div>
          <ul className="goals">
            <GoalRow
              icon="clock"
              tone="g-blue"
              title={`Browse ${goals.dailyMinutes} min or less a day`}
              value={todayMin}
              max={goals.dailyMinutes}
              valueLabel={`${mins(today.browseMs)} / ${goals.dailyMinutes} min`}
              status={todayMin === 0 ? 'Nothing yet today' : todayMin <= goals.dailyMinutes ? `${Math.max(0, Math.round(goals.dailyMinutes - todayMin))} min left today` : 'Over your goal today. Tomorrow is a fresh start.'}
              choices={GOAL_CHOICES.dailyMinutes}
              current={goals.dailyMinutes}
              unit=" min"
              onPick={(v) => setGoal('dailyMinutes', v)}
              editing={editGoals}
            />
            <GoalRow
              icon="sunrise"
              tone="g-mint"
              title={`${goals.weeklyMoments} offline ${goals.weeklyMoments === 1 ? 'moment' : 'moments'} a week`}
              value={weekMoments}
              max={goals.weeklyMoments}
              valueLabel={`${weekMoments} / ${goals.weeklyMoments}`}
              status={weekMoments >= goals.weeklyMoments ? 'Goal reached this week' : `${goals.weeklyMoments - weekMoments} to go in the last 7 days`}
              choices={GOAL_CHOICES.weeklyMoments}
              current={goals.weeklyMoments}
              unit=""
              onPick={(v) => setGoal('weeklyMoments', v)}
              editing={editGoals}
            />
            <GoalRow
              icon="flag"
              tone="g-lav"
              title={`Stop at ${goals.stopShare}% of stopping points`}
              value={stopShare * 100}
              max={goals.stopShare}
              valueLabel={sessions ? `${Math.round(stopShare * 100)}%` : '–'}
              status={!sessions ? 'Starts counting after your first session' : stopShare * 100 >= goals.stopShare ? 'On track' : 'Not there yet'}
              choices={GOAL_CHOICES.stopShare}
              current={goals.stopShare}
              unit="%"
              onPick={(v) => setGoal('stopShare', v)}
              editing={editGoals}
            />
          </ul>
        </section>
      </div>

      <section className="dash-hero">
        <div className="dh-main">
          <p className="eyebrow on-night">Offline moments completed</p>
          <p className="dh-num tnum">{t.completed}</p>
          <p className="dh-sub">{isNew ? 'Your first one is a few taps away.' : weekMoments ? weekMoments === 1 ? 'One moment this week. Nice work.' : `${weekMoments} moments this week. Nice work.` : 'Ready for the next one?'}</p>
          <button type="button" className="btn btn-mint" onClick={onDiscover}>
            <Icon name="sunrise" size={18} />
            Find your next moment
          </button>
        </div>
        <div className="dh-ring">
          <Ring p={rate} size={132} stroke={11} className="ring-mint" />
          <div className="dh-ring-txt">
            <b className="tnum">{t.started ? Math.round(rate * 100) : 0}%</b>
            <span>finished</span>
          </div>
          <p className="dh-ring-cap tnum">
            {t.completed} of {t.started} started
          </p>
        </div>
      </section>

      <section className="stat-grid" aria-label="Totals">
        <div className="stat">
          <Icon name="clock" size={20} className="stat-ico si-blue" />
          <span className="stat-v tnum">{fmtDur(t.browseMs)}</span>
          <span className="stat-l">Total browsing time</span>
        </div>
        <div className="stat">
          <Icon name="eye" size={20} className="stat-ico si-blue" />
          <span className="stat-v tnum">{t.posts}</span>
          <span className="stat-l">Posts viewed</span>
        </div>
        <div className="stat">
          <Icon name="play" size={18} className="stat-ico si-lav" />
          <span className="stat-v tnum">{t.started}</span>
          <span className="stat-l">Activities chosen</span>
        </div>
        <div className="stat">
          <Icon name="flag" size={20} className="stat-ico si-mint" />
          <span className="stat-v tnum">{t.completed}</span>
          <span className="stat-l">Activities completed</span>
        </div>
        <button type="button" className="stat stat-btn" onClick={goSaved}>
          <Icon name="bookmark" size={20} className="stat-ico si-lav" />
          <span className="stat-v tnum">{savedCount}</span>
          <span className="stat-l">Saved activities</span>
        </button>
      </section>

      <section className="card" aria-labelledby="mom-title">
        <div className="card-head">
          <h2 id="mom-title" className="card-title">
            Moments you made
          </h2>
          {moments.length ? <span className="muted card-note">Add a photo when you finish a challenge</span> : null}
        </div>
        {moments.length ? (
          <ul className="moments">
            {moments.map((h) => {
              const a = ACT_BY_ID[h.id];
              const ph = h.mid && photos[h.mid];
              return (
                <li key={`${h.id}-${h.at}`} className="moment">
                  <button type="button" className="moment-img" onClick={() => openActivity(a.id)} aria-label={`Open ${a.title}`}>
                    {ph ? <img src={ph.src} alt={`Your photo from ${a.title}`} /> : <ActivityArt a={a} w={640} h={800} style={{ aspectRatio: '4 / 5' }} />}
                    {ph ? <span className="moment-tag"><Icon name="camera" size={13} />Your photo</span> : null}
                  </button>
                  <div className="moment-txt">
                    <b>{a.title}</b>
                    <span className="muted">{ago(h.at)}</span>
                  </div>
                  {ph && removePhoto ? (
                    <button type="button" className="moment-x" onClick={() => removePhoto(h.mid)} aria-label={`Remove your photo from ${a.title}`}>
                      <Icon name="close" size={14} />
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="card-empty">Finish a challenge and it shows up here, with a photo if you add one.</p>
        )}
      </section>

      <div className="dash-cols">
        <section className="card week-card" aria-labelledby="wk-title">
          <div className="card-head">
            <h2 id="wk-title" className="card-title">
              Last 7 days
            </h2>
            <div className="legend" aria-hidden="true">
              <span>
                <i className="lg-bar" />
                Minutes browsing
              </span>
              <span>
                <i className="lg-dot" />
                Moments
              </span>
            </div>
          </div>
          <div className="week" role="img" aria-label={days.map((d) => `${d.label}: ${Math.round(d.browseMs / 60000)} minutes browsing, ${d.completed} moments`).join('; ')}>
            {days.map((d) => {
              const min = d.browseMs / 60000;
              const pct = min > 0 ? Math.max(4, (min / maxMin) * 100) : 0;
              return (
                <div key={d.key} className={cx('wk-col', d.isToday && 'today')}>
                  <span className="wk-val tnum">{min >= 1 ? `${Math.round(min)}m` : min > 0 ? '<1m' : ''}</span>
                  <div className="wk-track">
                    <div className={cx('wk-bar', !pct && 'zero')} style={{ height: pct ? `${pct}%` : '3px' }} />
                  </div>
                  <div className="wk-dots">
                    {Array.from({ length: Math.min(d.completed, 4) }, (_, i) => (
                      <i key={i} className="wk-dot" />
                    ))}
                    {d.completed > 4 ? <span className="wk-more">+{d.completed - 4}</span> : null}
                  </div>
                  <span className="wk-day">{d.isToday ? 'Today' : d.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card" aria-labelledby="cat-title">
          <div className="card-head">
            <h2 id="cat-title" className="card-title">
              Favorite categories
            </h2>
          </div>
          {cats.length ? (
            <ul className="cats">
              {cats.slice(0, 6).map((c) => (
                <li key={c.cat} className="cat-row">
                  <span className="cat-name">{c.cat}</span>
                  <span className="cat-track">
                    <span className="cat-fill" style={{ width: `${(c.weight / maxCat) * 100}%` }} />
                  </span>
                  <span className="cat-n tnum" aria-label={`${c.completed} completed, ${c.started} started`}>
                    {c.completed}/{c.started}
                  </span>
                </li>
              ))}
              <li className="cat-key muted">Completed / started</li>
            </ul>
          ) : (
            <p className="card-empty">Start a challenge and your favorite kinds of moments show up here.</p>
          )}
        </section>
      </div>

      <section className="card" aria-labelledby="fav-title">
        <div className="card-head">
          <h2 id="fav-title" className="card-title">
            Favorite activities
          </h2>
          <button type="button" className="btn-text" onClick={goSaved}>
            Saved ({savedCount})
          </button>
        </div>
        {favorites.length ? (
          <ul className="favs">
            {favorites.map(({ a, d, saved }) => (
              <li key={a.id}>
                <button type="button" className="fav" onClick={() => openActivity(a.id)}>
                  <ActivityArt a={a} className="fav-thumb" />
                  <span className="fav-txt">
                    <b>{a.title}</b>
                    <span className="muted">
                      {a.category} · {a.mins} min
                    </span>
                  </span>
                  <span className="fav-n tnum">{d.n}×</span>
                  {saved ? <Icon name="bookmarkFill" size={16} className="fav-saved" /> : null}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="card-empty">The challenges you complete most often appear here.</p>
        )}
      </section>

      <section className="card" aria-labelledby="hist-title">
        <div className="card-head">
          <h2 id="hist-title" className="card-title">
            Activity history
          </h2>
        </div>
        {state.history.length ? (
          <ul className="hist-list">
            {state.history.slice(0, 12).map((h, i) => (
              <HistoryRow key={`${h.at}-${i}`} h={h} onOpen={openActivity} />
            ))}
          </ul>
        ) : (
          <Empty icon="flag" title="Nothing here yet">
            Browse a session or finish a challenge and it’s logged here.
          </Empty>
        )}
      </section>
    </div>
  );
}
