const PATHS = {
  base: <path d="M12 3c4 5 7 8.5 7 12a7 7 0 0 1-14 0c0-3.5 3-7 7-12z" />,
  emollient: (
    <>
      <path d="M9 4c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9z" />
      <path d="M16 10c1.6 2 2.5 3.5 2.5 5a3 3 0 0 1-6 0" />
    </>
  ),
  moisturizing: (
    <>
      <path d="M12 4c3.4 3.8 5.5 6.7 5.5 9.5a5.5 5.5 0 0 1-11 0C6.5 10.7 8.6 7.8 12 4z" />
      <path d="M9 14.5a3 3 0 0 0 3 3" />
    </>
  ),
  surfactant: (
    <>
      <circle cx="9" cy="14" r="4.5" />
      <circle cx="15.5" cy="9" r="3" />
    </>
  ),
  thickener: <path d="M12 3a9 9 0 1 0 6.4 15.4M12 7a5 5 0 1 0 3.5 8.5M12 11a1.5 1.5 0 1 0 1 2.5" />,
  preservative: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  antioxidant: <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z" />,
  phadjuster: (
    <>
      <path d="M12 3v14M6 8h12" />
      <path d="M4 8l2.5 5a2.5 2.5 0 0 0 5 0L9 8M15 8l2.5 5a2.5 2.5 0 0 0 5 0L20 8" />
      <path d="M9 21h6" />
    </>
  ),
  chelating: (
    <>
      <ellipse cx="9" cy="9" rx="3.4" ry="4.4" transform="rotate(-30 9 9)" />
      <ellipse cx="15" cy="15" rx="3.4" ry="4.4" transform="rotate(-30 15 15)" />
    </>
  ),
  filmformer: (
    <>
      <rect x="5" y="6" width="12" height="8" rx="2.5" />
      <rect x="8" y="11" width="12" height="8" rx="2.5" />
    </>
  ),
  sunscreen: (
    <>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.6 5.4l-2 2M7.4 16.6l-2 2M18.6 18.6l-2-2M7.4 7.4l-2-2" />
    </>
  ),
  brightening: <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />,
  antiaging: <path d="M7 3h10M7 21h10M8 3c0 4 8 4 8 8s-8 4-8 8M16 3c0 4-8 4-8 8s8 4 8 8" />,
  exfoliant: (
    <>
      <path d="M20 8a8 8 0 1 0 1.6 6" />
      <path d="M20 3v5h-5" />
    </>
  ),
  soothing: (
    <>
      <path d="M4 20c8 1 15-4 16-16C11 5 5 10 4 20z" />
      <path d="M4 20c3-5 7-8 13-11" />
    </>
  ),
  fermented: (
    <>
      <path d="M9 3h6M10 3v5.5l-4.3 8A2.2 2.2 0 0 0 7.7 20h8.6a2.2 2.2 0 0 0 2-3.5L14 8.5V3" />
      <circle cx="10.5" cy="16" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="17.5" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  plantextract: (
    <>
      <path d="M4 20c8 1 15-4 16-16C11 5 5 10 4 20z" />
      <path d="M4 20c3-5 7-8 13-11" />
    </>
  ),
  haircare: <path d="M6 3c2 4-2 6 0 10s-2 6 0 8M12 3c2 4-2 6 0 10s-2 6 0 8M18 3c2 4-2 6 0 10s-2 6 0 8" />,
  fragrance: (
    <>
      <circle cx="12" cy="12" r="2.3" />
      <circle cx="12" cy="6.5" r="2.6" /><circle cx="17" cy="15" r="2.6" /><circle cx="7" cy="15" r="2.6" />
    </>
  ),
  mineral: <path d="M7 3h10l4 6-9 12L3 9l4-6z" />,
};

/** 카테고리별 커스텀 라인 아이콘. 매핑이 없으면 이모지로 폴백. */
export default function CategoryIcon({ category, size = 22, color, fallbackEmoji }) {
  const path = PATHS[category];
  if (!path) return <span style={{ fontSize: size }}>{fallbackEmoji}</span>;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'}
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {path}
    </svg>
  );
}
