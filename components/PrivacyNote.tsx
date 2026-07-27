export default function PrivacyNote({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`inline-flex items-center gap-2 text-sm text-walnut-soft ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 shrink-0 text-forest"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
        <path d="M7.5 10.5V7.5a4.5 4.5 0 0 1 9 0v3" />
      </svg>
      <span>{children}</span>
    </p>
  );
}
