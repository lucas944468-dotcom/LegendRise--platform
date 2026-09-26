import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "LegendRise — Career & Venture OS",
  description:
    "Choose what you want to become or build. LegendRise maps the route and walks it with you.",
};

// NOTE (Phase 1 on hold): no design system yet — plain structural shell only.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
