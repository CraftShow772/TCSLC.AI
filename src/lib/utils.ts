import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function chunkText(value: string, size = 48): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < value.length) {
    chunks.push(value.slice(start, start + size));
    start += size;
  }
  return chunks;
}

export function toTitleCase(value: string): string {
  return value
    .split(" ")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}
