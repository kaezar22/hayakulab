"use client";

export default function OpenChatButton({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("hk-open-chat"))}>
      {children}
    </button>
  );
}
