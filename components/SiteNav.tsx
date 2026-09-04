import Link from "next/link";
import { LogoMark } from "@/components/HomeIcons";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Family Summary", href: "/family-summary" },
];

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#ECE7DC] bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-[#1C1C1C]">
          <LogoMark className="h-8 w-8" />
          <span className="font-display text-xl font-semibold">FamilyWise</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[15px] font-medium text-[#3B3B3B] transition hover:text-[#1C1C1C]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
