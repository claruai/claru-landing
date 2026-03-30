"use client";

import dynamic from "next/dynamic";

const V2Content = dynamic(() => import("./V2Content"), { ssr: false });

export default function V2Page() {
  return <V2Content />;
}
