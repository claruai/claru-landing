import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import MotionProvider from "./components/providers/MotionProvider";
import CalendlyProvider from "./components/providers/CalendlyProvider";
import CalendlyModal from "./components/ui/CalendlyModal";
import PostHogProvider from "./components/providers/PostHogProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "Menlo",
    "Monaco",
    "Consolas",
    "monospace",
  ],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "Menlo",
    "Monaco",
    "Consolas",
    "monospace",
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://claru.ai"),
  title:
    "Claru \u2014 The Training Data Catalog for Physical AI",
  description:
    "3.7M+ human annotations across real-world video, game environments, and custom captures. 25+ commercially licensed datasets built for robotics, embodied AI, and frontier video generation teams.",
  keywords: [
    "AI training data",
    "physical AI",
    "robotics training data",
    "embodied AI data",
    "world models",
    "frontier AI data",
    "video generation training data",
    "vision model annotation",
    "egocentric video data",
    "RLHF annotation",
    "manipulation trajectory data",
    "synthetic data generation",
    "expert annotation",
    "multimodal AI data",
  ],
  authors: [{ name: "Claru" }],
  creator: "Claru",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://claru.ai",
    siteName: "Claru",
    title: "Claru \u2014 The Training Data Catalog for Physical AI",
    description:
      "3.7M+ human annotations across real-world video, game environments, and custom captures. 25+ licensed datasets for robotics and embodied AI.",
    images: [
      {
        url: "/images/og-v2.webp",
        width: 1200,
        height: 630,
        alt: "Claru \u2014 The Training Data Catalog for Physical AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claru \u2014 The Training Data Catalog for Physical AI",
    description:
      "3.7M+ human annotations across real-world video and game environments. Built for robotics and embodied AI.",
    images: ["/images/og-v2.webp"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Organization + WebSite JSON-LD (US-002)
const globalJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://claru.ai/#organization",
      name: "Claru",
      legalName: "Reka AI Inc.",
      url: "https://claru.ai",
      logo: {
        "@type": "ImageObject",
        "@id": "https://claru.ai/#logo",
        url: "https://claru.ai/android-chrome-512x512.png",
        width: 512,
        height: 512,
        caption: "Claru",
      },
      image: { "@id": "https://claru.ai/#logo" },
      description:
        "Purpose-built human annotation data for frontier AI labs, specializing in text, vision, video, and robotics modalities.",
      foundingDate: "2024",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "contact@claru.ai",
        url: "https://claru.ai/#contact",
      },
      sameAs: [
        "https://github.com/claruai",
        "https://www.linkedin.com/company/claruai",
      ],
      knowsAbout: [
        "AI training data",
        "Data annotation",
        "RLHF",
        "Egocentric video data",
        "Robotics training data",
        "Video generation training data",
        "Expert annotation",
        "Synthetic data generation",
        "Multimodal AI data",
        "Vision model annotation",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://claru.ai/#website",
      url: "https://claru.ai",
      name: "Claru",
      description:
        "Purpose-built training data for frontier AI labs.",
      publisher: { "@id": "https://claru.ai/#organization" },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://claru.ai" />
        <link rel="preconnect" href="https://claru.ai" />
        <link rel="preconnect" href="https://calendly.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <PostHogProvider>
          <MotionProvider>
            <CalendlyProvider>
              {children}
              <CalendlyModal />
            </CalendlyProvider>
          </MotionProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
