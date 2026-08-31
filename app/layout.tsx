import type { Metadata } from "next";
import { Nunito, Fraunces } from "next/font/google";
import "./globals.css";
import SiteNav from "@/components/SiteNav";

const bodyFont = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Used only by the redesigned homepage (and, going forward, other
// redesigned pages) for display headings — the rest of the app still uses
// the body font for headings, so this is additive, not a global swap.
const displayFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal"],
});

const DESCRIPTION =
  "A family-friendly hub of quizzes for couples, parents, and kids — love languages, temperament, parenting style, and more.";

export const metadata: Metadata = {
  metadataBase: new URL("https://family-wise.vercel.app"),
  title: "FamilyWise — Relationship & Personality Quizzes",
  description: DESCRIPTION,
  openGraph: {
    title: "FamilyWise",
    description: DESCRIPTION,
    url: "https://family-wise.vercel.app",
    siteName: "FamilyWise",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FamilyWise",
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-walnut">
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
