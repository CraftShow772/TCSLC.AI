"use client";

interface EscalateButtonProps {
  className?: string;
}

export function EscalateButton({ className }: EscalateButtonProps) {
  const handleClick = () => {
    window.open("https://www.tcslc.com/contact", "_blank", "noopener");
  };

  const baseClasses =
    "inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-indigo-600 transition hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400";

  return (
    <button type="button" onClick={handleClick} className={[baseClasses, className].filter(Boolean).join(" ")}>
      Talk to a human
    </button>
  );
}
