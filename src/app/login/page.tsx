"use client";

import { Suspense } from "react";
import LoginPage from "@/designs/bytevex/LoginPage";

export default function Page() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
