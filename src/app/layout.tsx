import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "lenis/dist/lenis.css";
import MotionProvider from "./components/providers/MotionProvider";
import CalendlyProvider from "./components/providers/CalendlyProvider";
import CalendlyModal from "./components/ui/CalendlyModal";

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
    "Claru | Purpose-Built Training Data for Frontier AI Labs",
  description:
    "Training data built to your model's exact specifications. From raw capture to production-ready dataset — sourced, labeled, and validated for frontier video, vision, and robotics AI.",
  keywords: [
    "AI training data",
    "frontier AI data",
    "video generation training data",
    "robotics training data",
    "vision model annotation",
    "egocentric video data",
    "RLHF annotation",
    "manipulation trajectory data",
    "embodied AI data",
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
    title: "Claru | Purpose-Built Training Data for Frontier AI Labs",
    description:
      "Training data built to your model's exact specifications. Sourced, labeled, and validated for frontier video, vision, and robotics AI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Claru - Purpose-Built Training Data for Frontier AI Labs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claru | Purpose-Built Training Data for Frontier AI Labs",
    description:
      "Training data built to your model's exact specifications. From raw capture to production-ready dataset for video, vision, and robotics AI.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <MotionProvider>
          <CalendlyProvider>
            {children}
            <CalendlyModal />
          </CalendlyProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
