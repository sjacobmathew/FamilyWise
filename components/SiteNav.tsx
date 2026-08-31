import Link from "next/link";
import { LogoMark, PersonIcon } from "@/components/HomeIcons";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/#assessments" },
  { label: "About", href: "/#about" },
  { label: "How it works", href: "/#how-it-works" },
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

        <Link
          href="/#assessments"
          className="flex items-center gap-2 rounded-full bg-[#1C1C1C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#333]"
        >
          <PersonIcon className="h-4 w-4" />
          Get started
        </Link>
      </div>
    </header>
  );
}
