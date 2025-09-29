export type LinkOutArgs = { url: string; label?: string };

export type LinkOutResult = { url: string; label: string };

export function createLinkOutSuggestion(args: LinkOutArgs): LinkOutResult {
  const url = args.url.trim();
  if (!/^https?:\/\//.test(url)) {
    throw new Error("link.out requires an absolute http(s) URL");
  }
  return {
    url,
    label: args.label?.trim() || "Open full details",
  };
}
