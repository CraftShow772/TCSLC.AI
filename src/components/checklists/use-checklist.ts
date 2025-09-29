"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChecklistDefinition, ChecklistRuntimeContext } from "@/data/checklists";

export interface ChecklistItemState {
  id: string;
  title: string;
  description: string;
  dependencies: string[];
  status: "pending" | "in-progress" | "complete";
  autoComplete?: (context: ChecklistRuntimeContext) => boolean;
}

export interface ChecklistProgress {
  total: number;
  completed: number;
  percentage: number;
}

export function useChecklist(
  checklist: ChecklistDefinition,
  context: ChecklistRuntimeContext
) {
  const [items, setItems] = useState<ChecklistItemState[]>(() =>
    checklist.items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      dependencies: item.dependencies ?? [],
      status: "pending" as const,
      autoComplete: item.autoComplete,
    }))
  );

  useEffect(() => {
    setItems((current) =>
      current.map((item) => {
        if (!item.autoComplete) {
          return item;
        }
        if (item.status === "complete") {
          return item;
        }
        return item.autoComplete(context)
          ? { ...item, status: "complete" as const }
          : item;
      })
    );
  }, [context]);

  const progress: ChecklistProgress = useMemo(() => {
    const completed = items.filter((item) => item.status === "complete").length;
    const total = items.length;
    return {
      total,
      completed,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  }, [items]);

  const toggle = (id: string) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) {
          return item;
        }
        if (item.dependencies.some((dependency) => {
          const dependencyItem = current.find((candidate) => candidate.id === dependency);
          return !dependencyItem || dependencyItem.status !== "complete";
        })) {
          return item;
        }
        return {
          ...item,
          status: item.status === "complete" ? "pending" : "complete",
        };
      })
    );
  };

  return {
    items,
    progress,
    toggle,
  };
}
