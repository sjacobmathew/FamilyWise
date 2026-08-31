type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function LogoMark({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="9" cy="10" r="4" fill="currentColor" />
      <circle cx="23" cy="9" r="3" fill="currentColor" />
      <circle cx="16" cy="23" r="3.5" fill="currentColor" />
      <path
        d="M9,14 C9,18 12,21 16,21 M23,12 C22,16 19,19 16,20.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function PersonIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5" />
    </svg>
  );
}

export function TwoPersonIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="9" cy="8" r="2.8" />
      <path d="M3.5 20c0-3.4 2.5-5.8 5.5-5.8s5.5 2.4 5.5 5.8" />
      <circle cx="17.5" cy="6.5" r="2" />
      <path d="M13.5 12.2c.8-.6 1.8-1 2.9-1 2.5 0 4.5 2 4.5 5" />
    </svg>
  );
}

export function HeartIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 6.9a4.3 4.3 0 0 1 7.5 2.9C19.5 15.4 12 20 12 20Z" />
    </svg>
  );
}

export function SmileyIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 14c1 1.3 2.2 2 3.5 2s2.5-.7 3.5-2" />
      <circle cx="8.7" cy="10" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15.3" cy="10" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PlayIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
    </svg>
  );
}

export function LockIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} strokeWidth={1.8} className={className} aria-hidden="true">
      <rect x="5" y="10.5" width="14" height="9" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}

export function ArrowIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} strokeWidth={2} className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ContentFaceIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 14.5h7" />
      <circle cx="8.7" cy="10" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15.3" cy="10" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ConcernedFaceIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 15c1-.8 2.2-1.2 3.5-1.2s2.5.4 3.5 1.2" />
      <path d="M7.5 9.3 9.7 10" />
      <path d="M16.5 9.3 14.3 10" />
    </svg>
  );
}

export function SadFaceIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 15.8c1-1.3 2.2-2 3.5-2s2.5.7 3.5 2" />
      <circle cx="8.7" cy="10" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15.3" cy="10" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ClockIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function BackArrowIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} strokeWidth={2} className={className} aria-hidden="true">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function LeafSprig({ className = "h-6 w-6 text-sage" }: IconProps) {
  return (
    <svg {...base} strokeWidth={1.4} className={className} aria-hidden="true">
      <path d="M12 21V6" />
      <path d="M12 15c-2.5 0-4.5-2-4.5-4.5" />
      <path d="M12 10c2.2 0 4-1.8 4-4" />
      <path d="M12 18c1.8 0 3.2-1.4 3.2-3.2" />
    </svg>
  );
}

// Temperament theme icons — one visual metaphor per dominant temperament.
export function SunIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.4 5.6l-1.5 1.5M7.1 16.9l-1.5 1.5M18.4 18.4l-1.5-1.5M7.1 7.1 5.6 5.6" />
    </svg>
  );
}

export function LightningIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M13 3 6 13h5l-1 8 7-11h-5l1-7Z" />
    </svg>
  );
}

export function CloudRainIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M7.5 15a4.2 4.2 0 0 1 .3-8.4 5 5 0 0 1 9.6 1.3A3.7 3.7 0 0 1 17 15H7.5Z" />
      <path d="M9 18.5 8 20.5M12.5 18.5l-1 2M16 18.5l-1 2" />
    </svg>
  );
}

export function WaveIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M3 10c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" />
      <path d="M3 15c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" />
    </svg>
  );
}

export function BrainIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M9 4.5a2.5 2.5 0 0 0-2.5 2.5c0 .3 0 .6.1.9A2.7 2.7 0 0 0 5 10.4c0 .9.4 1.6 1 2.1a2.6 2.6 0 0 0 1.6 3.9 2.5 2.5 0 0 0 2.9 1.6" />
      <path d="M9 4.5c1 0 2 .5 2.5 1.4M11.5 5.9V18M15 4.5a2.5 2.5 0 0 1 2.5 2.5c0 .3 0 .6-.1.9A2.7 2.7 0 0 1 19 10.4c0 .9-.4 1.6-1 2.1a2.6 2.6 0 0 1-1.6 3.9 2.5 2.5 0 0 1-2.9 1.6" />
    </svg>
  );
}

export function BellIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9Z" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function ChatBubbleIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4 11.5a7 7 0 1 1 3.2 5.9L4 18l1.1-3.2a6.9 6.9 0 0 1-1.1-3.3Z" />
    </svg>
  );
}

export function PencilIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="m14.5 5.5 4 4-9.5 9.5H5v-4Z" />
      <path d="m13 7 4 4" />
    </svg>
  );
}

export function MoonIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

export function StarIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="m12 3.5 2.4 5.1 5.6.7-4.1 3.9 1 5.6L12 15.9l-5 2.9 1-5.6-4.1-3.9 5.6-.7Z" />
    </svg>
  );
}

export function SproutIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 21v-9" />
      <path d="M12 12c0-3.5-2.7-5-6-5 0 3.5 2.7 5 6 5Z" />
      <path d="M12 12c0-3.5 2.7-5 6-5 0 3.5-2.7 5-6 5Z" />
    </svg>
  );
}

export function RefreshIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" />
      <path d="M17.5 4.5v3.2h-3.2M6.5 19.5v-3.2h3.2" />
    </svg>
  );
}

export function DownloadIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 4v11M8 11.5 12 15l4-3.5" />
      <path d="M5 17.5v1.7a1.8 1.8 0 0 0 1.8 1.8h10.4a1.8 1.8 0 0 0 1.8-1.8v-1.7" />
    </svg>
  );
}

export function LightbulbIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.3 1 2.1h5c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3Z" />
    </svg>
  );
}

export function ShieldIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 3.5 19 6.5v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9v-5Z" />
      <path d="m9 12 2 2 4-4.5" />
    </svg>
  );
}

export function BookmarkIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M6 4h12v16l-6-4-6 4Z" />
    </svg>
  );
}

export function CheckCircleIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.3 2.3 2.3 4.7-5" />
    </svg>
  );
}

export function DollarIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 3v18" />
      <path d="M16.5 7.5c0-1.9-2-3-4.5-3s-4.5 1.2-4.5 3c0 4 9 2.5 9 6.5 0 1.9-2 3-4.5 3s-4.5-1.1-4.5-3" />
    </svg>
  );
}

export function ScaleIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 3v18M7 21h10" />
      <path d="M12 6 5 8.5M12 6l7 2.5" />
      <path d="M5 8.5 2.5 14a3 3 0 0 0 5 0Z" />
      <path d="M19 8.5 16.5 14a3 3 0 0 0 5 0Z" />
    </svg>
  );
}

export function TrophyIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M7 4h10v5a5 5 0 0 1-10 0Z" />
      <path d="M7 5H4v1.5A3.5 3.5 0 0 0 7 10M17 5h3v1.5A3.5 3.5 0 0 1 17 10" />
      <path d="M12 14v3M9 20.5h6M10 20.5v-3.2c0-.3.3-.6.6-.6h2.8c.3 0 .6.3.6.6v3.2" />
    </svg>
  );
}

export function HomeIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4 11 12 4l8 7" />
      <path d="M6 9.5V20h12V9.5" />
      <path d="M10 20v-6h4v6" />
    </svg>
  );
}

export function ChevronRightIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg {...base} strokeWidth={2} className={className} aria-hidden="true">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
