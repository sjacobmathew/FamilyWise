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
