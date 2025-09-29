export type QueueLink = {
  label: string;
  href: string;
  target: "_blank";
  rel: string;
};

export const DEFAULT_QUEUE_LABEL = "Save your spot in line";

function sanitizeUrl(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export function hasQueue(queueUrl?: string | null): boolean {
  return Boolean(sanitizeUrl(queueUrl));
}

export function getQueueLink(queueUrl?: string | null): QueueLink | null {
  const sanitized = sanitizeUrl(queueUrl);

  if (!sanitized) {
    return null;
  }

  return {
    label: DEFAULT_QUEUE_LABEL,
    href: sanitized,
    target: "_blank",
    rel: "noopener noreferrer"
  };
}
