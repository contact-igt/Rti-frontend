"use client";

export default function Error({ reset }: { reset: () => void }) {
  return <main className="page-shell"><h1>Something went wrong</h1><button onClick={reset} type="button">Try again</button></main>;
}
