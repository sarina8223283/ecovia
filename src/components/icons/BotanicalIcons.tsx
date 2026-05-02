import { SVGProps } from 'react';

/**
 * Hand-drawn botanical icon set for Mittika top navigation.
 * Each icon is built on a 24x24 viewBox with organic curves
 * and gold accents. Use `currentColor` for stroke and `text-primary`
 * (or any text-* class) on the parent.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (props: IconProps) => ({
  width: props.size ?? 22,
  height: props.size ?? 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
});

const Accent = ({ cx, cy, r = 1 }: { cx: number; cy: number; r?: number }) => (
  <circle cx={cx} cy={cy} r={r} fill="hsl(var(--accent))" stroke="none" />
);

// Home — leafy roof cottage
export const LeafHome = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M3 11.5L12 4l9 7.5" />
    <path d="M5 10.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9.5" />
    <path d="M12 4c1.5-1.5 3.5-1.5 4 0-.5 1-2.5 1.5-4 0z" fill="hsl(var(--primary) / 0.15)" />
    <Accent cx={12} cy={15} />
  </svg>
);

// Products — herbal pouch
export const HerbPouch = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M7 8h10l-1 11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2L7 8z" />
    <path d="M9 8c0-2 1.5-3 3-3s3 1 3 3" />
    <path d="M10 13c1 1 3 1 4 0" />
    <Accent cx={12} cy={11} />
  </svg>
);

// Categories — botanical grid of leaves
export const LeafGrid = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M5 5c2 0 3 1 3 3s-1 3-3 3c0-2 0-4 0-6z" />
    <path d="M19 5c-2 0-3 1-3 3s1 3 3 3c0-2 0-4 0-6z" />
    <path d="M5 13c2 0 3 1 3 3s-1 3-3 3c0-2 0-4 0-6z" />
    <path d="M19 13c-2 0-3 1-3 3s1 3 3 3c0-2 0-4 0-6z" />
    <Accent cx={12} cy={12} r={0.9} />
  </svg>
);

// Directions — open scroll/book
export const HerbScroll = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M4 5a2 2 0 0 1 2-2h7v16H6a2 2 0 0 0-2 2V5z" />
    <path d="M20 5a2 2 0 0 0-2-2h-5v16h5a2 2 0 0 1 2 2V5z" />
    <path d="M8 8h2M8 11h2M14 8h2M14 11h2" />
    <Accent cx={12} cy={19} />
  </svg>
);

// Bulk Orders — stacked jars
export const JarStack = (props: IconProps) => (
  <svg {...base(props)}>
    <rect x="4" y="11" width="7" height="9" rx="1.5" />
    <rect x="13" y="6" width="7" height="14" rx="1.5" />
    <path d="M5.5 11V9.5h4V11M14.5 6V4.5h4V6" />
    <Accent cx={7.5} cy={15.5} />
    <Accent cx={16.5} cy={13} />
  </svg>
);

// Export — leaf compass / globe with sprout
export const GlobeLeaf = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
    <path d="M12 8c1.5-1 3-.5 3 1-1 0-2.5.5-3-1z" fill="hsl(var(--primary) / 0.2)" />
  </svg>
);

// About — sprout sun
export const SproutSun = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" />
    <path d="M10 12c0-2 1-3 2-3s2 1 2 3" />
    <Accent cx={12} cy={12} r={0.8} />
  </svg>
);

// Purity — shield with leaf
export const LeafShield = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6l8-3z" />
    <path d="M9 12c1-2 3-3 5-3-.5 2-2 4-5 5-.5-.5-.5-1.5 0-2z" fill="hsl(var(--primary) / 0.18)" />
    <Accent cx={12} cy={8} />
  </svg>
);

// Visitors — friendly people
export const HerbalUsers = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20c0-3.5 2.5-6 6-6s6 2.5 6 6" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M15 20c0-3 1.5-5 4-5" />
    <Accent cx={9} cy={8} r={0.7} />
  </svg>
);

// Contact — leaf message
export const LeafChat = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-4 3v-3H6a2 2 0 0 1-2-2V6z" />
    <path d="M9 10c1.5-1 3-1 5 0M9 13c1 .5 2 .5 3 0" />
    <Accent cx={16} cy={9} />
  </svg>
);

// Admin — gear with sprout
export const SproutGear = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M4.2 4.2l2 2M17.8 17.8l2 2M2 12h3M19 12h3M4.2 19.8l2-2M17.8 6.2l2-2" />
    <Accent cx={12} cy={12} r={0.8} />
  </svg>
);

// Cart — woven basket
export const WovenBasket = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M3 8h18l-2 11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L3 8z" />
    <path d="M8 8V6a4 4 0 0 1 8 0v2" />
    <path d="M5 12h14M5 16h14" />
  </svg>
);

// Camera/scanner — leaf lens
export const LeafLens = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M4 8a2 2 0 0 1 2-2h2l1.5-2h5L16 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" />
    <circle cx="12" cy="13" r="3.5" />
    <Accent cx={17} cy={9} />
  </svg>
);

// User — friendly herbal avatar
export const HerbalUser = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
    <path d="M11 5c.5-1.5 2-1.5 2.5 0" />
  </svg>
);

// Globe / language
export const LanguageGlobe = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
  </svg>
);
