const ICON = {
  web: 'M3 4h18v16H3zM3 9h18M6.5 6.5h.01M9.5 6.5h.01M8 13h8M8 16h5',
  rocket: 'M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M14 4c3-1 6-1 6-1s0 3-1 6l-7 7-5-5zM9 10H5l-2 3 4 1M14 15v4l-3 2-1-4M15 9.5a.5.5 0 100-1 .5.5 0 000 1z',
  building: 'M4 21V5l8-3v19M12 9l8 3v9M8 8h.01M8 12h.01M8 16h.01M16 15h.01M16 18h.01M2 21h20',
  target: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 18a6 6 0 100-12 6 6 0 000 12zM12 14a2 2 0 100-4 2 2 0 000 4z',
  link: 'M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7.5-7l-1.7 1.7M14 11a5 5 0 00-7.5-.5l-3 3a5 5 0 007 7l1.7-1.7',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 018 0v4M12 15v2',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z',
  repeat: 'M17 2l4 4-4 4M3 11V9a3 3 0 013-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 01-3 3H3',
  ruler: 'M3 17L17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2',
  refresh: 'M21 12a9 9 0 11-2.6-6.4L21 8M21 3v5h-5',
  gift: 'M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8C10 4 7 3 6.5 5S9 8 12 8zM12 8c2-4 5-5 5.5-3S15 8 12 8z',
  cocktail: 'M4 3h16l-8 9zM12 12v8M8 21h8M15 6.5l3-3.5',
  calc: 'M6 2h12a1 1 0 011 1v18a1 1 0 01-1 1H6a1 1 0 01-1-1V3a1 1 0 011-1zM8 6h8v3H8zM8.5 13h.01M12 13h.01M15.5 13h.01M8.5 17h.01M12 17h.01M15.5 17h.01',
  plus: 'M12 5v14M5 12h14',
  check: 'M5 13l4 4L19 7',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.8.7 1 1.5 1 2.5h6c0-1 .2-1.8 1-2.5A6 6 0 0012 3z',
  up: 'M7 17L17 7M8 7h9v9',
  seed: 'M12 22V12M12 12C12 7 8 4 3 4c0 5 4 8 9 8zM12 14c0-4 3-7 8-7 0 4-3 7-8 7z',
  diamond: 'M6 3h12l4 6-10 12L2 9zM2 9h20M10 3L8 9l4 12 4-12-2-6',
  crown: 'M3 19h18M4 16L3 6l5 4 4-6 4 6 5-4-1 10z',
  factory: 'M3 21V10l6 4v-4l6 4V6l6 3v12zM3 21h18M7 18h2M13 18h2',
  scissors: 'M6 9a3 3 0 100-6 3 3 0 000 6zM6 21a3 3 0 100-6 3 3 0 000 6zM8.1 8.1L20 20M8.1 15.9L20 4',
  health: 'M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 000-7.8zM12 9v5M9.5 11.5h5',
  bag: 'M6 7h12l1 14H5zM9 7a3 3 0 016 0',
  cup: 'M4 8h13v6a5 5 0 01-5 5H9a5 5 0 01-5-5zM17 10h2a2 2 0 010 4h-2M8 2v3M12 2v3',
  laptop: 'M4 5h16v11H4zM2 19h20',
  truck: 'M2 6h12v10H2zM14 10h4l4 4v2h-8M6 19a2 2 0 100-4 2 2 0 000 4zM18 19a2 2 0 100-4 2 2 0 000 4z',
  briefcase: 'M3 7h18v13H3zM9 7V4h6v3M3 13h18',
  bank: 'M3 10l9-6 9 6M5 10v9M9.5 10v9M14.5 10v9M19 10v9M3 21h18',
  digital: 'M3 17l6-6 4 4 8-8M14 7h7v7',
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14zM21 21l-5-5M8 11h6M11 8v6',
  ai: 'M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M7 5h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2zM9.5 9.5h5v5h-5z',
  product: 'M12 2l10 5-10 5L2 7zM2 12l10 5 10-5M2 17l10 5 10-5',
  brand: 'M12 2.5l2.9 6.2 6.6.7-5 4.5 1.4 6.6L12 17.2l-5.9 3.3 1.4-6.6-5-4.5 6.6-.7z',
  personal: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0',
  influencer: 'M3 10.5v3a1 1 0 001 1h2l6 4.5V5L6 9.5H4a1 1 0 00-1 1zM16 8.5a5 5 0 010 7M19 5.5a9 9 0 010 13',
  data: 'M4 20V11M10 20V4M16 20v-8M22 20H2',
  consult: 'M12 22a10 10 0 100-20 10 10 0 000 20zM16.2 7.8l-2.1 6.3-6.3 2.1 2.1-6.3z',
  academy: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6',
  instagram: 'M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zM16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01',
  linkedin: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z',
};

export default function Icon({ name, color = 'currentColor', className = '', wrap = true }) {
  const path = ICON[name];
  if (!path) return null;

  const svg = (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );

  if (!wrap) return svg;
  return <span className={`ico ${className}`.trim()}>{svg}</span>;
}
