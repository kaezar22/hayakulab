import type { Metadata } from "next";
import Home from "@/components/Home";
import { alternates } from "@/lib/i18n";

export const metadata: Metadata = { alternates: alternates("en", "/") };

export default function Page() {
  return <Home lang="en" />;
}
