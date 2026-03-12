"use client";

import dynamic from "next/dynamic";

const AnimatedLogo = dynamic(
  () => import("./AnimatedLogo"),
  { ssr: false },
);

export default function AnimatedLogoWrapper() {
  return <AnimatedLogo />;
}
