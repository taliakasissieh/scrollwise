import { ActivityArt, PostArt, Empty } from '../components/ui.jsx';
import { Icon } from '../components/Icon.jsx';
import { POST_BY_ID } from '../data/posts.js';
import { ACT_BY_ID } from '../data/activities.js';
import { ago, cx } from '../lib/util.js';
import { MiniActivity } from './Pause.jsx';

export function Saved({ state, photos = {}, dispatch, tab, setTab, openPost, openActivity, onDiscover }) {
  const posts = Object.entries(state.saves)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => POST_BY_ID[id])
    .filter(Boolean);
  const acts = Object.entries(state.savedActs)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => ACT_BY_ID[id])
    .filter(Boolean);
  const done = Object.entries(state.done)
    .sort((a, b) => b[1].last - a[1].last)
    .map(([id, d]) => {
      const withPhoto = state.history.find((h) => h.type === 'complete' && h.id === id && h.mid && photos[h.mid]);
      return { a: ACT_BY_ID[id], d, photo: withPhoto ? photos[withPhoto.mid].src : null };
    })
    .filter((x) => x.a);
  const tabs = [
    { id: 'posts', label: 'Posts', n: posts.length },
    { id: 'activities', label: 'Activities', n: acts.length },
    { id: 'completed', label: 'Completed', n: done.length },
  ];
  return (
    <div className="page saved">
      <header className="page-head">
        <div>
          <p className="eyebrow">Favorites</p>
          <h1 className="page-title">Saved</h1>
        </div>
      </header>
      <div className="seg seg-wide" role="tablist" aria-label="Saved items">
        {tabs.map((t) => (
          <button type="button" key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label} <span className="seg-n tnum">{t.n}</span>
          </button>
        ))}
      </div>

      {tab === 'posts' ? (
        posts.length ? (
          <div className="thumbs">
            {posts.map((p) => (
              <button type="button" key={p.id} className="thumb" onClick={() => openPost(p.id)} aria-label={`Open post by ${p.user}`}>
                <PostArt post={p} style={{ aspectRatio: '1 / 1' }} />
              </button>
            ))}
          </div>
        ) : (
          <Empty icon="bookmark" title="No saved posts yet">
            Tap the bookmark on any post in your feed to keep it here.
          </Empty>
        )
      ) : null}

      {tab === 'activities' ? (
        acts.length ? (
          <ul className="saved-acts">
            {acts.map((a) => (
              <li key={a.id} className="saved-act">
                <MiniActivity a={a} onOpen={() => openActivity(a.id)} />
                <button type="button" className="icon-btn" onClick={() => dispatch({ type: 'SAVE_ACT', id: a.id })} aria-label={`Remove ${a.title} from saved`}>
                  <Icon name="bookmarkFill" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <Empty icon="sunrise" title="No saved activities yet" action={<button type="button" className="btn btn-primary" onClick={onDiscover}>Find your next moment</button>}>
            Save challenges you want to try later and they’ll wait for you here.
          </Empty>
        )
      ) : null}

      {tab === 'completed' ? (
        done.length ? (
          <ul className="saved-acts">
            {done.map(({ a, d, photo }) => (
              <li key={a.id} className="saved-act">
                <button type="button" className="mini-act" onClick={() => openActivity(a.id)}>
                  {photo ? <img src={photo} alt="" className="mini-thumb mini-photo" /> : <ActivityArt a={a} className="mini-thumb" />}
                  <span className="mini-txt">
                    <b>{a.title}</b>
                    <span className="muted">
                      {d.n === 1 ? 'Completed once' : `Completed ${d.n} times`} · {ago(d.last)}
                    </span>
                  </span>
                  <span className={cx('done-badge')} aria-hidden="true">
                    <Icon name="check" size={16} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <Empty icon="flag" title="No completed challenges yet" action={<button type="button" className="btn btn-primary" onClick={onDiscover}>Find your next moment</button>}>
            Every challenge you finish is collected here.
          </Empty>
        )
      ) : null}
    </div>
  );
}
