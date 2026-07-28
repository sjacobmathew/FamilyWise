import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const bodyFont = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
    <html lang="en" className={`${bodyFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-walnut">
        {children}
      </body>
    </html>
  );
}
