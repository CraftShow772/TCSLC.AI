"use client";
import { useState } from "react";

export type ChecklistItem = {
  id: string;
  label: string;
  required?: boolean;
  condition?: (answers: Record<string, string>) => boolean;
};

export function SmartChecklist({ items }: { items: ChecklistItem[] }) {
  const [answers] = useState<Record<string, string>>({});

  const visible = items.filter((item) =>
    item.condition ? item.condition(answers) : true
  );

  return (
    <ul className="list-disc space-y-2 pl-5">
      {visible.map((item) => (
        <li key={item.id}>
          <span className={item.required ? "font-semibold" : ""}>{item.label}</span>
          {item.required && <span className="text-red-500">*</span>}
        </li>
      ))}
    </ul>
  );
}
