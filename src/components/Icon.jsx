// Line icons drawn for ScrollWise on a 24px grid.
const P = {
  home: <path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.5H9v5.5H5.5A1.5 1.5 0 0 1 4 19z" />,
  sunrise: (
    <>
      <path d="M3 19h18" />
      <path d="M6.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M12 5v3M5.2 9.2l1.8 1.8M18.8 9.2 17 11M2.5 14.5H5M19 14.5h2.5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </>
  ),
  flask: <path d="M9.5 3.5h5M10.5 3.5v5.2L5.2 18a1.6 1.6 0 0 0 1.4 2.5h10.8a1.6 1.6 0 0 0 1.4-2.5l-5.3-9.3V3.5M7.6 14h8.8" />,
  download: <path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14" />,
  share: <path d="M12 14.5V3.5M8 7.5l4-4 4 4M8.5 10.5H6.5a1.5 1.5 0 0 0-1.5 1.5v7a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-7a1.5 1.5 0 0 0-1.5-1.5h-2" />,
  shield: <path d="M12 3.5 5 6.2v5.3c0 4.3 2.9 7.6 7 9 4.1-1.4 7-4.7 7-9V6.2zM9 12l2.2 2.2L15.5 10" />,
  chart: <path d="M4 20h16M7 16.5v-5M12 16.5V7M17 16.5v-8" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.2 3.5 8.5s-1.1 6.1-3.5 8.5c-2.4-2.4-3.5-5.2-3.5-8.5S9.6 5.9 12 3.5z" />
    </>
  ),
  batteryLow: (
    <>
      <rect x="3" y="7.5" width="16" height="9" rx="2" />
      <path d="M21 10.5v3" />
      <rect x="5.5" y="10" width="3" height="4" rx=".6" fill="currentColor" stroke="none" />
    </>
  ),
  batteryMid: (
    <>
      <rect x="3" y="7.5" width="16" height="9" rx="2" />
      <path d="M21 10.5v3" />
      <rect x="5.5" y="10" width="6.5" height="4" rx=".6" fill="currentColor" stroke="none" />
    </>
  ),
  batteryFull: (
    <>
      <rect x="3" y="7.5" width="16" height="9" rx="2" />
      <path d="M21 10.5v3" />
      <rect x="5.5" y="10" width="11" height="4" rx=".6" fill="currentColor" stroke="none" />
    </>
  ),
  checklist: <path d="M10 6.5h10M10 12h10M10 17.5h10M4 6.5l1.3 1.3L7.5 5.5M4 12l1.3 1.3L7.5 11M4 17.5l1.3 1.3 2.2-2.3" />,
  external: <path d="M14 4.5h5.5V10M19.5 4.5 11 13M17 14v4.5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1H10" />,
  briefcase: (
    <>
      <rect x="3.5" y="7.5" width="17" height="12" rx="2" />
      <path d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5M3.5 12.5h17" />
    </>
  ),
  bookmark: <path d="M6.5 4h11a.5.5 0 0 1 .5.5V20l-6-4.2L6 20V4.5a.5.5 0 0 1 .5-.5z" />,
  bookmarkFill: <path d="M6.5 4h11a.5.5 0 0 1 .5.5V20l-6-4.2L6 20V4.5a.5.5 0 0 1 .5-.5z" fill="currentColor" />,
  user: (
    <>
      <circle cx="12" cy="8.5" r="4" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h11M19 17h1" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="12" r="2" />
      <circle cx="17" cy="17" r="2" />
    </>
  ),
  heart: <path d="M12 20.3s-7.6-4.6-9.2-9.6C1.7 7.2 4 4 7.3 4c2 0 3.6 1.1 4.7 2.7C13.1 5.1 14.7 4 16.7 4 20 4 22.3 7.2 21.2 10.7c-1.6 5-9.2 9.6-9.2 9.6z" />,
  heartFill: <path d="M12 20.3s-7.6-4.6-9.2-9.6C1.7 7.2 4 4 7.3 4c2 0 3.6 1.1 4.7 2.7C13.1 5.1 14.7 4 16.7 4 20 4 22.3 7.2 21.2 10.7c-1.6 5-9.2 9.6-9.2 9.6z" fill="currentColor" />,
  comment: <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.6-4.3A8.5 8.5 0 1 1 20.5 11.5z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  arrowLeft: <path d="M15 5l-7 7 7 7" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  shuffle: <path d="M16 4h4v4M4 18.5 20 4M20 16v4h-4M14.5 14.5 20 20M4 5.5l5 5" />,
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.7" />
      <path d="M20 4v4.5h-4.5" />
    </>
  ),
  reset: (
    <>
      <path d="M4 12a8 8 0 1 0 2.3-5.7" />
      <path d="M4 4v4.5h4.5" />
    </>
  ),
  play: <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none" />,
  pause: <path d="M8.5 5.5v13M15.5 5.5v13" />,
  bolt: <path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z" />,
  pen: (
    <>
      <path d="M4 20l1.2-4.6L16 4.6a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8z" />
      <path d="M14 6.6l3.4 3.4" />
    </>
  ),
  wave: <path d="M2.5 9c2-2 4-2 6 0s4 2 6 0 4-2 6.5 0M2.5 15c2-2 4-2 6 0s4 2 6 0 4-2 6.5 0" />,
  dice: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="9" cy="9" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="15" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="9" cy="15" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M2.5 19.5a6.5 6.5 0 0 1 13 0" />
      <path d="M16 5.2a3.5 3.5 0 0 1 0 6.6M18.5 14a6.5 6.5 0 0 1 3 5.5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.3-4.3" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="M12 17l3.5-5" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  flag: <path d="M5 21V4.5M5 4.5h12.5l-2.2 4 2.2 4H5" />,
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: <path d="M5 7h14M10 7V4.5h4V7M7 7l1 13h8l1-13" />,
  layers: (
    <>
      <path d="M12 3.5 21 8l-9 4.5L3 8z" />
      <path d="M3 12.5l9 4.5 9-4.5M3 16.5l9 4.5 9-4.5" />
    </>
  ),
  send: <path d="M21 3 10.5 13.5M21 3l-6.5 18-4-7.5L3 9.5z" />,
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  bell: (
    <>
      <path d="M6 10a6 6 0 0 1 12 0c0 5 2 6.5 2 6.5H4S6 15 6 10z" />
      <path d="M10 19.5a2 2 0 0 0 4 0" />
    </>
  ),
  homeFill: <path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.5H9v5.5H5.5A1.5 1.5 0 0 1 4 19z" fill="currentColor" />,
  userFill: (
    <>
      <circle cx="12" cy="8.5" r="4" fill="currentColor" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0z" fill="currentColor" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.2l1.5-2h5.6l1.5 2h2.2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.4 0 1.9-1 1.4-2.1-.5-1.2.2-2.4 1.5-2.4h2.1a3.5 3.5 0 0 0 3.5-3.5C20.5 7.3 16.7 3.5 12 3.5z" />
      <circle cx="7.8" cy="11" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="7.6" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="7.8" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  shirt: <path d="M8.5 4 4 6.5l1.8 4L8 9.6V20h8V9.6l2.2.9 1.8-4L15.5 4c-.6 1.4-2 2.2-3.5 2.2S9.1 5.4 8.5 4z" />,
  scissors: (
    <>
      <circle cx="6.5" cy="7" r="2.5" />
      <circle cx="6.5" cy="17" r="2.5" />
      <path d="M8.6 8.4 20 17M8.6 15.6 20 7" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V5.5l11-2v12.5" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="17.5" cy="16" r="2.5" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11a1 1 0 0 1 1 1v15a2 2 0 0 0-2-2H4z" />
      <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13a1 1 0 0 0-1 1v15a2 2 0 0 1 2-2h6z" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19C4 11 9 5 20 4c0 9-5 15-13 15" />
      <path d="M5 19c3-5 6-8 10-10" />
    </>
  ),
  dumbbell: <path d="M3 10v4M6 7.5v9M18 7.5v9M21 10v4M6 12h12" />,
  utensils: (
    <>
      <path d="M6 3.5V9a2 2 0 0 0 4 0V3.5M8 11v9.5" />
      <path d="M17 20.5V3.5c-2 1-3 3.5-3 7h3" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 17.5h6M10 20.5h4" />
      <path d="M12 3.5a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V17h5.2v-.7c0-.8.4-1.5 1-2A6 6 0 0 0 12 3.5z" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
      <circle cx="9" cy="10" r="1.8" />
      <path d="M4 17l5-4.5 4 3.5 3-2.5 4.5 3.5" />
    </>
  ),
  chevronLeft: <path d="M14.5 6 8.5 12l6 6" />,
  chevronRight: <path d="M9.5 6l6 6-6 6" />,
  star: <path d="M12 3.8l2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.6-5 2.6 1-5.6-4.1-3.9 5.6-.8z" />,
};

export function Icon({ name, size = 22, className, title }) {
  return (
    <svg
      className={className ? `icon ${className}` : 'icon'}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      {P[name] || null}
    </svg>
  );
}
