/**
 * @file Next.js root layout for the Phase 1 bootstrap task.
 * @author PopoY
 * @created 2026-06-04
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "POCO Scrum Platform",
  description: "Phase 1 bootstrap shell for the Scrum-first workspace."
};

type RootLayoutProps = {
  children: ReactNode;
};

/**
 * @param children The application page subtree.
 * @returns The root HTML structure required by the Next.js App Router.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
