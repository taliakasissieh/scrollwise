import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { getArt, peekArt, tone } from '../lib/art.js';
import { cx } from '../lib/util.js';
import { Icon } from './Icon.jsx';
import { CREATORS, creatorCover } from '../data/posts.js';
import { activityPhoto, avatarPhoto, photo as libPhoto, postPhoto } from '../lib/library.js';

// The ScrollWise mark: a scroll line that rises into a sun.
export function Mark({ size = 32 }) {
  return (
    <svg className="mark" viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
      <rect width="40" height="40" rx="12" fill="#0B1433" />
      <path d="M11.5 29.5c5 2.2 15.5 1.6 15.5-4.4 0-6.4-14-3.4-14-9.6 0-4.4 5.2-5.6 9.4-4.6" fill="none" stroke="#5B7CFF" strokeWidth="3.6" strokeLinecap="round" />
      <circle cx="28.6" cy="11.4" r="3.5" fill="#3EE3A6" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="wordmark">
      scroll<b>wise</b>
    </span>
  );
}

export function Brand({ size = 32, onClick, label = 'ScrollWise home' }) {
  const inner = (
    <>
      <Mark size={size} />
      <Wordmark />
    </>
  );
  if (!onClick) return <span className="brand">{inner}</span>;
  return (
    <button type="button" className="brand brand-btn" onClick={onClick} aria-label={label}>
      {inner}
    </button>
  );
}

// A picture slot. Shows a photo when one is provided (photos/), otherwise the drawn
// scene for kind/seed (activities only). A photo that fails to load falls back to the scene,
// or to a plain tinted box when there is no scene (feed posts never use drawings).
export function Art({ kind, seed, w = 640, h = 800, alt = '', photo, className, style, children }) {
  const src = photo ? photo.src : null;
  // Tracked per src, so a cached photo that finishes loading instantly is never reset to "loading".
  const [loadedSrc, setLoadedSrc] = useState(null);
  const [failedSrc, setFailedSrc] = useState(null);
  const loaded = !!src && loadedSrc === src;
  const failed = !!src && failedSrc === src;
  const usePhoto = !!(photo && !failed);
  const [url, setUrl] = useState(() => (usePhoto || !kind ? null : peekArt(kind, seed, w, h)));
  const imgRef = useCallback(
    (el) => {
      if (el && el.complete && el.naturalWidth) setLoadedSrc(el.getAttribute('src'));
    },
    [src],
  );
  useEffect(() => {
    if (usePhoto || !kind) return undefined;
    let live = true;
    const ready = peekArt(kind, seed, w, h);
    if (ready) {
      setUrl(ready);
      return undefined;
    }
    setUrl(null);
    getArt(kind, seed, w, h).then((u) => {
      if (live) setUrl(u);
    });
    return () => {
      live = false;
    };
  }, [kind, seed, w, h, usePhoto]);
  const label = alt || (usePhoto && photo.alt) || '';
  return (
    <div
      className={cx('art', (usePhoto ? !loaded : kind && !url) && 'is-loading', usePhoto && 'is-photo', className)}
      style={{ '--tone': usePhoto || !kind ? '#c9c3b8' : tone(kind), aspectRatio: `${w} / ${h}`, ...style }}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
    >
      {usePhoto ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          draggable="false"
          ref={imgRef}
          className={loaded ? 'is-ready' : 'is-pending'}
          style={photo.focus ? { objectPosition: photo.focus } : undefined}
          onLoad={() => setLoadedSrc(src)}
          onError={() => setFailedSrc(src)}
        />
      ) : url ? (
        <img src={url} alt="" draggable="false" />
      ) : null}
      {children}
    </div>
  );
}

const RATIOS = { '4:5': [640, 800], '1:1': [720, 720], '3:2': [780, 520] };
export const ratioSize = (ratio) => RATIOS[ratio] || RATIOS['4:5'];

// A post's main photo (feed posts are photos only).
export function PostArt({ post, w, h, ...rest }) {
  const [rw, rh] = ratioSize(post.ratio);
  return <Art w={w || rw} h={h || rh} photo={postPhoto(post)} {...rest} />;
}

// An activity cover: a licensed photo named activity-<id> if one was added, otherwise its drawn scene.
export function ActivityArt({ a, w = 640, h = 440, ...rest }) {
  return <Art kind={a.art[0]} seed={a.art[1]} w={w} h={h} photo={activityPhoto(a)} {...rest} />;
}

// Round profile picture: the creator's own picture if one was added (photos/ai/avatar-<username>.jpg),
// else a crop of a licensed photo (CREATORS[user].avatar), else a close crop of their first feed photo,
// else their initial. No real people's faces are used.
export function Avatar({ user, size = 'md', onClick }) {
  let inner;
  const c = CREATORS[user];
  const own = user === 'you' ? null : avatarPhoto(user);
  const crop = !own && c && c.avatar ? libPhoto(c.avatar[0]) : null;
  const cover = !own && !crop && user !== 'you' ? creatorCover(user) : null;
  if (user === 'you') {
    inner = (
      <span className="avatar-face avatar-you">
        <Mark size={64} />
      </span>
    );
  } else if (own) {
    inner = <Art w={200} h={200} photo={own} className="avatar-face" style={{ '--z': 1 }} />;
  } else if (crop) {
    const [, fx, fy, z] = c.avatar;
    inner = <Art w={200} h={200} photo={{ ...crop, focus: null }} className="avatar-face" style={{ '--fx': `${fx}%`, '--fy': `${fy}%`, '--z': z }} />;
  } else if (cover) {
    inner = <Art w={200} h={200} photo={cover} className="avatar-face" style={{ '--z': 1.6 }} />;
  } else {
    inner = (
      <span className="avatar-face avatar-mono" style={{ '--h': c ? c.hue : 220 }}>
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <text x="20" y="20" dy="0.35em" textAnchor="middle">
            {((c && c.name) || user || '?').charAt(0).toUpperCase()}
          </text>
        </svg>
      </span>
    );
  }
  if (onClick) {
    return (
      <button type="button" className={cx('avatar', `avatar-${size}`, 'avatar-btn')} onClick={onClick} aria-label={`Open ${user}'s profile`}>
        {inner}
      </button>
    );
  }
  return (
    <span className={cx('avatar', `avatar-${size}`)} aria-hidden="true">
      {inner}
    </span>
  );
}

export function Ring({ p = 0, size = 24, stroke = 3, className }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, p));
  return (
    <svg className={cx('ring', className)} width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle className="ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none" />
      <circle
        className="ring-fill"
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - v)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

export function Switch({ id, checked, onChange, label }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="switch"
      onClick={() => onChange(!checked)}
    />
  );
}

export function Sheet({ title, onClose, children, footer, className }) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  const titleId = useId();
  closeRef.current = onClose;
  useEffect(() => {
    const prev = document.activeElement;
    document.documentElement.classList.add('lock');
    const onKey = (e) => {
      if (e.key === 'Escape') closeRef.current();
    };
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => {
      const el = ref.current && (ref.current.querySelector('[data-autofocus]') || ref.current.querySelector('.sheet-close'));
      if (el) el.focus({ preventScroll: true });
    }, 30);
    return () => {
      document.documentElement.classList.remove('lock');
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
      if (prev && prev.focus) prev.focus({ preventScroll: true });
    };
  }, []);
  return (
    <div
      className="sheet-wrap"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={cx('sheet', className)} role="dialog" aria-modal="true" aria-labelledby={titleId} ref={ref}>
        <div className="sheet-grip" aria-hidden="true" />
        <div className="sheet-head">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="icon-btn sheet-close" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </div>
        <div className="sheet-body">{children}</div>
        {footer ? <div className="sheet-foot">{footer}</div> : null}
      </div>
    </div>
  );
}

export function Toast({ toast, onDone }) {
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(onDone, toast.ms || 4200);
    return () => clearTimeout(t);
  }, [toast]);
  if (!toast) return null;
  return (
    <div className="toast" role="status" aria-live="polite" key={toast.id}>
      <Icon name={toast.icon || 'bell'} size={18} className="toast-ico" />
      <span>{toast.msg}</span>
      {toast.action ? (
        <button
          type="button"
          className="toast-action"
          onClick={() => {
            toast.action.run();
            onDone();
          }}
        >
          {toast.action.label}
        </button>
      ) : null}
    </div>
  );
}

export function Empty({ icon = 'spark', title, children, action }) {
  return (
    <div className="empty">
      <span className="empty-ico">
        <Icon name={icon} size={26} />
      </span>
      <h3>{title}</h3>
      {children ? <p>{children}</p> : null}
      {action || null}
    </div>
  );
}
