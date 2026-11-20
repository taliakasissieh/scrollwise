import { ActivityArt, Ring } from '../components/ui.jsx';
import { Icon } from '../components/Icon.jsx';
import { ACT_BY_ID, ACTIVITIES, ENERGY, ENERGY_LABEL, INTERESTS, INTEREST_LABEL, MOODS, MOOD_LABEL, TIMES } from '../data/activities.js';
import { rank, recommend } from '../lib/recommend.js';
import { cx } from '../lib/util.js';

const CAT_ICON = { Creativity: 'pen', Movement: 'bolt', Relaxation: 'wave', Exploration: 'search', Learning: 'bulb', Connection: 'users', Productive: 'checklist' };
// A sensible starting energy level for each mood (the user can change it).
const MOOD_ENERGY = { creative: 'medium', energetic: 'high', relaxed: 'low', bored: 'medium', social: 'medium', curious: 'medium' };

export function CategoryTag({ category, className }) {
  return (
    <span className={cx('cat-tag', `cat-${category.toLowerCase()}`, className)}>
      <Icon name={CAT_ICON[category] || 'spark'} size={13} />
      {category}
    </span>
  );
}

export function ActivityCard({ a, hits = [], mood, energy, time, label, featured, done, saved, onSave, onOpen, onStart }) {
  const why = [];
  if (mood && a.moods.includes(mood)) why.push(`Fits ${MOOD_LABEL[mood].toLowerCase()}`);
  if (energy && a.energy === energy) why.push(ENERGY_LABEL[energy]);
  if (time && a.mins <= time) why.push(`Fits your ${time} min`);
  hits.slice(0, 2).forEach((i) => why.push(INTEREST_LABEL[i]));
  return (
    <article className={cx('act-card', featured && 'featured')}>
      <button type="button" className="act-cover" onClick={onOpen} aria-label={`Open ${a.title}`}>
        <ActivityArt a={a} w={featured ? 960 : 640} h={featured ? 600 : 440} />
        <span className="act-shade" aria-hidden="true" />
        <CategoryTag category={a.category} className="act-cat" />
        {label ? (
          <span className={cx('match', label === 'Top match' && 'top')}>
            {label === 'Top match' ? <Icon name="star" size={13} /> : null}
            {label}
          </span>
        ) : null}
        <span className="act-chips">
          <span>
            <Icon name="clock" size={14} />
            {a.mins} min
          </span>
          <span>
            <Icon name={a.energy === 'low' ? 'batteryLow' : a.energy === 'high' ? 'batteryFull' : 'batteryMid'} size={14} />
            {a.energy === 'low' ? 'Low energy' : a.energy === 'high' ? 'Active' : 'Some energy'}
          </span>
          <span className="only-wide">
            <Icon name="gauge" size={14} />
            {a.difficulty}
          </span>
          <span className="only-wide">
            <Icon name="pin" size={14} />
            {a.where}
          </span>
        </span>
      </button>
      <div className="act-body">
        <h3 className="act-title">
          <button type="button" className="title-btn" onClick={onOpen}>
            {a.title}
          </button>
          {done ? (
            <span className="done-tag">
              <Icon name="check" size={13} />
              Done before
            </span>
          ) : null}
        </h3>
        <p className="act-blurb">{a.blurb}</p>
        <p className="act-materials">
          <Icon name="layers" size={15} />
          <span>
            <b>You’ll need:</b> {a.materials.join(', ')}
          </span>
        </p>
        <p className="act-materials act-first">
          <Icon name="play" size={13} />
          <span>
            <b>First step:</b> {a.steps[0]}
          </span>
        </p>
        {why.length ? (
          <div className="why" aria-label="Why this matches">
            {why.map((w) => (
              <span key={w} className="why-chip">
                <Icon name="check" size={12} />
                {w}
              </span>
            ))}
          </div>
        ) : null}
        <div className="act-actions">
          <button type="button" className="btn btn-primary" onClick={onStart}>
            <Icon name="play" size={15} />
            Start challenge
          </button>
          <button type="button" className={cx('icon-btn', 'save-btn', saved && 'is-on')} onClick={onSave} aria-pressed={!!saved} aria-label={saved ? `Remove ${a.title} from saved` : `Save ${a.title}`}>
            <Icon name={saved ? 'bookmarkFill' : 'bookmark'} />
          </button>
        </div>
      </div>
    </article>
  );
}

const STEP_TITLES = ['How are you feeling?', 'How much time and energy do you have?', 'What are you into?'];

export function Discover({ state, dispatch, disc, setDisc, openActivity, startActivity, demoOn, notify }) {
  const set = (patch) => setDisc((d) => ({ ...d, ...patch }));
  const step = disc.step;
  const picksFrom = (d) => ({ mood: d.mood, time: d.time, interests: d.interests, energy: d.energy || MOOD_ENERGY[d.mood] || 'medium' });
  const energyNow = disc.energy || MOOD_ENERGY[disc.mood] || 'medium';
  const energyObj = ENERGY.find((e) => e.id === energyNow);
  const moodObj = MOODS.find((m) => m.id === disc.mood);

  const pinQuest = (res) => {
    if (!demoOn || res.some((x) => x.a.id === 'three-photo-quest')) return res;
    const q = ACT_BY_ID['three-photo-quest'];
    if (q.mins > (disc.time || 30)) return res;
    return [{ a: q, hits: q.interests.filter((i) => disc.interests.includes(i)), label: 'Top match' }, ...res.slice(0, 3).map((x) => ({ ...x, label: x.label === 'Top match' ? 'Great match' : x.label }))];
  };
  const store = (res) => res.map((x) => ({ id: x.a.id, hits: x.hits, label: x.label }));

  const showResults = () => {
    const picks = picksFrom(disc);
    dispatch({ type: 'PICKS', picks });
    const seed = (disc.seed || 1) + 1;
    const res = pinQuest(recommend(picks, { seed, count: 4, done: state.done, recent: state.recent }));
    dispatch({ type: 'SHOWN', ids: res.map((x) => x.a.id) });
    set({ step: 3, seed, results: store(res), shown: res.map((x) => x.a.id) });
    window.scrollTo(0, 0);
  };

  const differentIdeas = () => {
    const picks = picksFrom(disc);
    const seed = disc.seed + 1;
    let res = recommend(picks, { seed, exclude: disc.shown, count: 4, done: state.done, recent: state.recent });
    let shown = [...disc.shown, ...res.map((x) => x.a.id)];
    if (res.length < 3) {
      res = recommend(picks, { seed, exclude: disc.results.map((x) => x.id), count: 4, done: state.done });
      shown = res.map((x) => x.a.id);
      notify('You’ve seen every match for these picks. Starting a fresh round.', 'refresh');
    }
    dispatch({ type: 'SHOWN', ids: res.map((x) => x.a.id) });
    set({ seed, results: store(res), shown });
    window.scrollTo({ top: 0, behavior: document.documentElement.classList.contains('rm') ? 'auto' : 'smooth' });
  };

  const surprise = () => {
    const current = disc.results.map((x) => x.id);
    let pool;
    if (disc.mood && disc.time) pool = rank(picksFrom(disc), { seed: Date.now() % 9973, exclude: current, recent: state.recent }).slice(0, 10).map((x) => x.a);
    else pool = ACTIVITIES.filter((a) => a.mins <= 15 && !current.includes(a.id));
    if (!pool.length) pool = ACTIVITIES;
    openActivity(pool[Math.floor(Math.random() * pool.length)].id);
  };

  const toggleInterest = (id) => {
    const has = disc.interests.includes(id);
    set({ interests: has ? disc.interests.filter((x) => x !== id) : [...disc.interests, id] });
  };

  const summary = (
    <div className="pick-summary" aria-label="Your picks. Tap one to change it.">
      {disc.mood ? (
        <button type="button" className={cx('pick-chip', step === 0 && 'is-now')} onClick={() => set({ step: 0 })}>
          <Icon name={moodObj ? moodObj.icon : 'spark'} size={16} />
          {MOOD_LABEL[disc.mood]}
        </button>
      ) : null}
      {disc.time && step >= 2 ? (
        <button type="button" className={cx('pick-chip', step === 1 && 'is-now')} onClick={() => set({ step: 1 })}>
          <Icon name="clock" size={16} />
          {disc.time} min
        </button>
      ) : null}
      {disc.time && step >= 2 && energyObj ? (
        <button type="button" className="pick-chip" onClick={() => set({ step: 1 })}>
          <Icon name={energyObj.icon} size={16} />
          {ENERGY_LABEL[energyNow]}
        </button>
      ) : null}
      {step === 3 ? (
        <button type="button" className="pick-chip" onClick={() => set({ step: 2 })}>
          <Icon name="layers" size={16} />
          {disc.interests.length ? disc.interests.slice(0, 2).map((i) => INTEREST_LABEL[i]).join(', ') + (disc.interests.length > 2 ? ` +${disc.interests.length - 2}` : '') : 'Any interest'}
        </button>
      ) : null}
    </div>
  );

  if (step === 3) {
    const results = disc.results.map((r) => ({ a: ACT_BY_ID[r.id], hits: r.hits, label: r.label })).filter((r) => r.a);
    const [top, ...rest] = results;
    const card = (r, featured) => (
      <ActivityCard
        key={r.a.id}
        a={r.a}
        hits={r.hits}
        label={r.label}
        featured={featured}
        mood={disc.mood}
        energy={energyNow}
        time={disc.time}
        done={!!state.done[r.a.id]}
        saved={!!state.savedActs[r.a.id]}
        onSave={() => dispatch({ type: 'SAVE_ACT', id: r.a.id })}
        onOpen={() => openActivity(r.a.id)}
        onStart={() => startActivity(r.a.id)}
      />
    );
    return (
      <div className="disc disc-results">
        <header className="results-head">
          <p className="eyebrow">Find Your Next Moment</p>
          <h1 className="disc-title">Here’s what fits right now</h1>
          {summary}
        </header>
        {top ? card(top, true) : null}
        {rest.length ? (
          <>
            <h2 className="section-label results-more">More moments for you</h2>
            <div className="act-grid">{rest.map((r) => card(r, false))}</div>
          </>
        ) : null}
        <div className="results-actions">
          <button type="button" className="btn btn-outline" onClick={differentIdeas}>
            <Icon name="refresh" size={18} />
            Show different ideas
          </button>
          <button type="button" className="btn btn-lav" onClick={surprise}>
            <Icon name="shuffle" size={18} />
            Surprise me
          </button>
        </div>
        <details className="how-pick">
          <summary>How are these chosen?</summary>
          <p>
            Every activity gets points for matching your mood, your energy, the time you have and your interests. Activities you’ve been shown or finished recently get fewer points, so you see something new next time, and the top picks come from different kinds of activity. It all runs on this device: nothing is sent anywhere.
          </p>
        </details>
      </div>
    );
  }

  return (
    <div className="disc">
      <header className="disc-head">
        <div className="disc-top">
          {step > 0 ? (
            <button type="button" className="icon-btn back-btn" onClick={() => set({ step: step - 1 })} aria-label="Back">
              <Icon name="arrowLeft" />
            </button>
          ) : null}
          <p className="eyebrow">Find Your Next Moment · Step {step + 1} of 3</p>
        </div>
        <div className="disc-progress" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className={cx(i < step && 'done', i === step && 'now')} />
          ))}
        </div>
        <h1 className="disc-title" key={step}>
          {STEP_TITLES[step]}
        </h1>
        {step > 0 ? summary : null}
      </header>

      {step === 0 ? (
        <>
          <div className="mood-grid stepin" role="radiogroup" aria-label="Mood">
            {MOODS.map((m) => (
              <button type="button" key={m.id} role="radio" aria-checked={disc.mood === m.id} className={cx('mood-card', `tone-${m.tone}`, `mood-${m.id}`)} onClick={() => set({ mood: m.id, step: 1 })}>
                <span className="mc-ico">
                  <Icon name={m.icon} size={24} />
                </span>
                <span>
                  <strong>{m.label}</strong>
                  <span className="mc-hint">{m.hint}</span>
                </span>
                {disc.mood === m.id ? (
                  <span className="mc-check" aria-hidden="true">
                    <Icon name="check" size={14} />
                  </span>
                ) : null}
              </button>
            ))}
          </div>
          <button type="button" className="btn-text surprise-link" onClick={surprise}>
            <Icon name="shuffle" size={16} />
            Not sure? Surprise me
          </button>
        </>
      ) : null}

      {step === 1 ? (
        <>
        <div className="energy-row stepin" role="radiogroup" aria-label="Energy level">
          {ENERGY.map((e) => (
            <button type="button" key={e.id} role="radio" aria-checked={energyNow === e.id} className={cx('energy-opt', energyNow === e.id && 'is-on')} onClick={() => set({ energy: e.id })}>
              <Icon name={e.icon} size={22} />
              <span>
                <b>{e.label} energy</b>
                <span className="muted">{e.hint}</span>
              </span>
            </button>
          ))}
        </div>
        <p className="disc-sub disc-sub-time">Then pick your time:</p>
        <div className="time-grid stepin" role="radiogroup" aria-label="Available time">
          {TIMES.map((t) => (
            <button type="button" key={t.v} role="radio" aria-checked={disc.time === t.v} className="time-card" onClick={() => set({ time: t.v, step: 2 })}>
              <span className="tc-ring">
                <Ring p={t.v / 30} size={44} stroke={5} />
              </span>
              <span className="tc-num tnum">{t.v}</span>
              <span className="tc-unit">minutes</span>
              <span className="tc-hint">{t.hint}</span>
            </button>
          ))}
        </div>
        </>
      ) : null}

      {step === 2 ? (
        <>
          <p className="disc-sub">
            Pick as many as you like.{' '}
            {disc.interests.length ? (
              <span className="disc-count">{disc.interests.length} selected</span>
            ) : null}
          </p>
          <div className="chips stepin" role="group" aria-label="Interests">
            {INTERESTS.map((i) => {
              const on = disc.interests.includes(i.id);
              return (
                <button type="button" key={i.id} aria-pressed={on} className={cx('chip', 'chip-ico', on && 'is-on')} onClick={() => toggleInterest(i.id)}>
                  <Icon name={on ? 'check' : i.icon} size={17} />
                  {i.label}
                </button>
              );
            })}
          </div>
          <div className="disc-foot">
            <button type="button" className="btn btn-primary btn-xl btn-block" onClick={showResults}>
              {disc.interests.length ? 'Show my moments' : 'Show moments for any interest'}
              <Icon name="arrowRight" />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
