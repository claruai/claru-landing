import type { Metadata } from "next";
import PartnershipsContent from "./PartnershipsContent";

const TITLE = "Get Paid For Your Footage — Claru Partnerships";
const DESCRIPTION =
  "Cafes, factories, farms, fleets, retail — AI labs pay for footage of real work. License, get paid to capture, or co-supply. Net-15 payouts.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/partnerships",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://claru.ai/partnerships",
    siteName: "Claru",
    images: ["/og/partnerships"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og/partnerships"],
  },
  keywords: [
    "monetize security camera footage",
    "sell business video to AI",
    "get paid for surveillance footage",
    "data licensing for businesses",
    "AI training data partner program",
    "sell footage to AI companies",
    "license footage to AI labs",
    "AI data partnership",
    "data partnership program",
    "sell training data to AI",
    "get paid for video footage",
    "AI training data buyer",
  ],
};

export default function PartnershipsPage() {
  return <PartnershipsContent />;
}
