"use client";

import { useRouter } from "next/navigation";

export default function BackArrowButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label="Go back"
      onClick={() => router.back()}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#C5D1E0] bg-white text-[#2A4A75] transition hover:bg-[#F3F6FA]"
    >
      <span className="text-lg leading-none">←</span>
    </button>
  );
}
