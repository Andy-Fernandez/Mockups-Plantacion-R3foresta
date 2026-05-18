// Mirrors src/components/Icon.tsx — 24×24, stroke 1.8, round caps, fill none.
const ICONS = {
  bell: <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M10 21h4" />,
  dot: <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />,
  home: <path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z" />,
  scan: <path d="M4 6h2v12H4zM18 6h2v12h-2zM8 5v14M16 5v14M11 7v10M13 7v10" />,
  report: <><path d="M4 4h12l4 4v12H4z" /><path d="M16 4v4h4M8 13h8M8 17h6" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.5-4.5" /></>,
  leaf: <path d="M12 3c4 4 6 7 6 11a6 6 0 1 1-12 0c0-4 2-7 6-11zM12 13v8" />,
  vivero: <path d="M5 21v-3a4 4 0 0 1 4-4M5 21h10M15 21v-7a4 4 0 0 0-4-4M9 7a3 3 0 1 0 6 0 3 3 0 0 0-6 0z" />,
  cutting: <path d="M6 18c4-2 8-6 10-12M14 6h4v4M6 18l-2 2" />,
  plus: <path d="M5 12h14M12 5v14" strokeWidth="2.5" />,
  minus: <path d="M19 12H5" strokeWidth="2.5" />,
  'arrow-left': <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2.2" />,
  pin: <><path d="M12 21s-7-6-7-12a7 7 0 0 1 14 0c0 6-7 12-7 12z" /><circle cx="12" cy="9" r="3" /></>,
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  photo: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="M21 19l-6-6-9 8" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></>,
  balance: <path d="M12 4v16M4 9l8-5 8 5M6 9l-2 5a4 4 0 0 0 8 0l-2-5M18 9l-2 5a4 4 0 0 0 8 0l-2-5" />,
  package: <path d="M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v9" />,
  date: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></>,
  qr: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="3" height="3" /><rect x="18" y="18" width="3" height="3" /></>,
  trash: <path d="M6 7h12l-1 13H7zM9 7V4h6v3M10 11v6M14 11v6" />,
  check: <path d="M5 12l5 5L20 7" strokeWidth="2.4" />,
  x: <path d="M6 6l12 12M18 6L6 18" strokeWidth="2.2" />,
  planting: <path d="M12 21V9M12 9c-3-3-6-3-6 0M12 9c3-3 6-3 6 0M5 21h14" />,
  map: <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14" />,
  // Custom additions for Historial del lote — same style: 24×24, stroke 1.8, round caps.
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" /></>,
  shade: <><path d="M3 17h18M6 17v-3a6 6 0 0 1 12 0v3" /><path d="M12 4v3M5 7l1.5 1.5M19 7l-1.5 1.5" /></>,
  'half-shade': <><path d="M3 17h18" /><path d="M6 17v-3a6 6 0 0 1 12 0v3" strokeDasharray="3 2" /><path d="M12 4v3" /></>,
  sprout: <path d="M12 21V11M12 11c-3 0-5-2-5-5 3 0 5 2 5 5zM12 11c2.5 0 4.5-2 4.5-4.5-2.5 0-4.5 2-4.5 4.5z" />,
  truck: <><path d="M3 7h11v9H3zM14 11h4l3 3v2h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></>,
  'chevron-right': <path d="M9 6l6 6-6 6" />,
  filter: <path d="M4 5h16l-6 8v6l-4-2v-4z" />,
  link: <path d="M9 15l6-6M10 7l1-1a4 4 0 0 1 6 6l-1 1M14 17l-1 1a4 4 0 0 1-6-6l1-1" />,
  loss: <path d="M5 12c2 4 5 6 7 6s5-2 7-6M12 4v8M9 9l3 3 3-3" />,
  shield: <path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z" />,
  flag: <path d="M5 21V4M5 4h12l-2 4 2 4H5" />,
  hash: <path d="M5 9h14M5 15h14M10 4l-2 16M16 4l-2 16" />,
};

function Icon({ name, className = 'h-5 w-5' }) {
  const body = ICONS[name];
  if (!body) return null;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {body}
    </svg>
  );
}
window.Icon = Icon;
