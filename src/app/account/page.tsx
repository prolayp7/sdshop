"use client";

import { Suspense } from "react";
import AccountPage from "@/components/pages/AccountPage";
import { parts } from "@/designs/bytevex";

export default function Page() {
  return <Suspense><AccountPage parts={parts} /></Suspense>;
}
