import type { Metadata } from "next";
import { ogImageUrl } from "@/lib/og";

const TITLE = "UGC Video Jobs — Get Paid to Film Everyday Clips (US & Canada) | Claru";
const DESCRIPTION =
  "Earn $15–$30/hr filming short first-person clips of everyday tasks on your phone. No experience needed. Open to collectors in the US and Canada. A Reka AI company, backed by NVIDIA.";
const PATH = "/collect/ugc-video-jobs";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: PATH,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: `https://claru.ai${PATH}`,
    images: [
      {
        url: ogImageUrl("UGC Video Jobs — Get Paid to Film (US & Canada)", {
          category: "jobs",
        }),
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function UgcVideoJobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
