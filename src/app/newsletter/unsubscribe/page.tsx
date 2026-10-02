"use client";

import { useEffect, useState } from "react";

export default function NewsletterUnsubscribePage() {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"ready" | "submitting" | "done" | "error">("ready");

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") ?? "");
  }, []);

  async function unsubscribe() {
    setStatus("submitting");
    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const result = await response.json();
      setStatus(response.ok && result.unsubscribed ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="mx-auto flex min-h-[55vh] max-w-xl flex-col justify-center px-5 py-16">
      <h1 className="text-2xl font-semibold text-neutral-950">Email preferences</h1>
      {status === "done" ? <p className="mt-3 text-sm text-neutral-700">You have been unsubscribed from marketing emails.</p> : (
        <>
          <p className="mt-3 text-sm text-neutral-700">Confirm that you no longer want to receive newsletter campaigns.</p>
          {status === "error" ? <p role="alert" className="mt-3 text-sm text-red-700">This unsubscribe link is invalid or has already been used.</p> : null}
          <button type="button" onClick={unsubscribe} disabled={!token || status === "submitting"} className="mt-6 inline-flex h-10 w-fit items-center justify-center bg-neutral-950 px-4 text-sm font-semibold text-white disabled:opacity-50">
            {status === "submitting" ? "Updating…" : "Unsubscribe"}
          </button>
        </>
      )}
    </main>
  );
}