import type { Metadata } from "next";
import { ogImageUrl } from "@/lib/og";

export const metadata: Metadata = {
  title: "Gaming Capture Catalog | Title-Level Availability | Claru",
  description:
    "Indexed gaming corpus by title — total hours, clip counts, and corpus share across 30+ games. Source data for world-model, agent, and reinforcement-learning training.",
  alternates: {
    canonical: "/catalog-gaming",
  },
  openGraph: {
    title: "Gaming Capture Catalog | Title-Level Availability | Claru",
    description:
      "Indexed gaming corpus by title — hours, clips, and corpus share for world-model and agent training.",
    images: [{ url: ogImageUrl("Gaming Catalog", { category: "data-catalog" }), width: 1200, height: 630 }],
  },
  twitter: {
    title: "Gaming Capture Catalog | Title-Level Availability | Claru",
    description:
      "Indexed gaming corpus by title — hours, clips, and corpus share for world-model and agent training.",
  },
};

export default function CatalogGamingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
