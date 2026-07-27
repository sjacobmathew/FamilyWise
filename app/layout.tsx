import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const bodyFont = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "FamilyWise — Relationship & Personality Quizzes",
  description:
    "A family-friendly hub of quizzes for couples, parents, and kids — love languages, temperament, parenting style, and more.",
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
