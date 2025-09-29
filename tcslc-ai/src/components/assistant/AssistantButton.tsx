"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { AssistantDrawer } from "./AssistantDrawer";

export function AssistantButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        aria-label="Open TCSLC assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
      <AssistantDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}
