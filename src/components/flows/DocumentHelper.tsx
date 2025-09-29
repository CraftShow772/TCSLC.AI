"use client";
import {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { extractImage } from "../../lib/docs/extractImage";
import { extractPdf } from "../../lib/docs/extractPdf";
import {
  fieldHints,
  FieldHint,
  FieldHintKey,
} from "../../lib/docs/fieldHints";

type DocumentRequirement = {
  id: string;
  title: string;
  description?: string;
  optional?: boolean;
  accept?: string[];
  instructions?: string[];
  fields?: FieldHintKey[];
};

type ExtractionSnapshot = {
  text: string;
  error?: string;
  fileName?: string;
  updatedAt?: Date;
};

export type DocumentHelperProps = {
  documents: DocumentRequirement[];
  className?: string;
};

function classNames(
  ...classes: Array<string | null | false | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

function formatTimestamp(date?: Date) {
  if (!date) return "";
  try {
    return `${date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })} · ${date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } catch (error) {
    return date.toISOString();
  }
}

function sanitizeExtraction(text: string) {
  return text
    .replace(/\u0000/g, "")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function DocumentHelper({
  documents,
  className,
}: DocumentHelperProps) {
  const [activeId, setActiveId] = useState(() => documents[0]?.id ?? "");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [extractions, setExtractions] = useState<Record<string, ExtractionSnapshot>>({});

  useEffect(() => {
    if (!documents.length) {
      setActiveId("");
      return;
    }

    if (!documents.some((doc) => doc.id === activeId)) {
      setActiveId(documents[0].id);
    }
  }, [activeId, documents]);

  const activeDoc = useMemo(() => {
    if (!documents.length) {
      return undefined;
    }

    return documents.find((doc) => doc.id === activeId) ?? documents[0];
  }, [activeId, documents]);

  const activeHints = useMemo(() => {
    if (!activeDoc?.fields?.length) {
      return [] as Array<{ key: FieldHintKey; hint: FieldHint }>;
    }

    return activeDoc.fields
      .map((key) => {
        const hint = fieldHints[key];
        if (!hint) {
          return null;
        }

        return { key, hint };
      })
      .filter((entry): entry is { key: FieldHintKey; hint: FieldHint } =>
        Boolean(entry)
      );
  }, [activeDoc]);

  const handleFileChange = async (
    docId: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setLoadingId(docId);

    try {
      let text = "";
      if (
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
      ) {
        text = await extractPdf(file);
      } else if (file.type.startsWith("image/")) {
        text = await extractImage(file);
      } else {
        text = await file.text();
      }

      setExtractions((prev) => ({
        ...prev,
        [docId]: {
          text: sanitizeExtraction(text),
          fileName: file.name,
          updatedAt: new Date(),
        },
      }));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to analyze the selected document.";

      setExtractions((prev) => ({
        ...prev,
        [docId]: {
          text: "",
          error: message,
          fileName: file.name,
          updatedAt: new Date(),
        },
      }));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div
      className={classNames(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
        className
      )}
    >
      <div className="grid gap-0 lg:grid-cols-[260px,1fr]">
        <div className="border-b border-border bg-muted/40 p-4 lg:border-b-0 lg:border-r">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Documents
          </div>
          <div className="mt-3 space-y-2">
            {documents.map((doc) => {
              const isActive = doc.id === (activeDoc?.id ?? activeId);
              return (
                <button
                  type="button"
                  key={doc.id}
                  onClick={() => setActiveId(doc.id)}
                  className={classNames(
                    "w-full rounded-xl border px-3 py-2 text-left text-sm transition",
                    isActive
                      ? "border-primary/60 bg-background text-foreground shadow-sm"
                      : "border-transparent bg-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{doc.title}</span>
                    {doc.optional && (
                      <span className="text-xs font-medium uppercase text-muted-foreground">
                        Optional
                      </span>
                    )}
                  </div>
                  {doc.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {doc.description}
                    </p>
                  )}
                </button>
              );
            })}
            {!documents.length && (
              <div className="rounded-lg border border-dashed border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
                Add document requirements to configure the helper.
              </div>
            )}
          </div>
        </div>
        <div className="p-6">
          {activeDoc ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {activeDoc.title}
                  </h3>
                  {activeDoc.optional && (
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Optional
                    </span>
                  )}
                </div>
                {activeDoc.description && (
                  <p className="text-sm text-muted-foreground">
                    {activeDoc.description}
                  </p>
                )}
                {activeDoc.instructions?.length ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {activeDoc.instructions.map((instruction) => (
                      <li key={instruction}>{instruction}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <div className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label
                    htmlFor={`${activeDoc.id}-upload`}
                    className="text-sm font-medium text-foreground"
                  >
                    Upload for AI review
                  </label>
                  <input
                    id={`${activeDoc.id}-upload`}
                    type="file"
                    accept={activeDoc.accept?.join(",")}
                    onChange={(event) => handleFileChange(activeDoc.id, event)}
                    className="w-full max-w-sm cursor-pointer rounded-lg border border-dashed border-border bg-background px-3 py-2 text-sm text-muted-foreground transition hover:border-primary/60 hover:text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {loadingId === activeDoc.id && (
                    <span className="text-sm text-muted-foreground">
                      Analyzing…
                    </span>
                  )}
                  {extractions[activeDoc.id]?.updatedAt && (
                    <span className="text-xs text-muted-foreground">
                      {extractions[activeDoc.id]?.fileName}
                      {" · "}
                      {formatTimestamp(extractions[activeDoc.id]?.updatedAt)}
                    </span>
                  )}
                </div>
                {extractions[activeDoc.id]?.error && (
                  <p className="text-sm text-red-500">
                    {extractions[activeDoc.id]?.error}
                  </p>
                )}
              </div>
              {activeHints.length ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Key fields to verify
                  </h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    {activeHints.map(({ key, hint }) => (
                      <div
                        key={key}
                        className="rounded-xl border border-border/60 bg-muted/30 p-4"
                      >
                        <p className="text-sm font-semibold text-foreground">
                          {hint.title}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {hint.description}
                        </p>
                        {hint.examples?.length ? (
                          <p className="mt-2 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">
                              Examples:
                            </span>{" "}
                            {hint.examples.join(", ")}
                          </p>
                        ) : null}
                        {hint.aiTips?.length ? (
                          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                            {hint.aiTips.map((tip) => (
                              <li key={tip}>{tip}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Extracted text preview
                </h4>
                <div className="min-h-[160px] rounded-xl border border-dashed border-border/70 bg-muted/20 p-4">
                  {loadingId === activeDoc.id ? (
                    <p className="text-sm text-muted-foreground">
                      Running extraction…
                    </p>
                  ) : extractions[activeDoc.id]?.text ? (
                    <pre className="max-h-64 whitespace-pre-wrap break-words text-sm text-foreground">
                      {extractions[activeDoc.id]?.text}
                    </pre>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Upload {activeDoc.title.toLowerCase()} to see the
                      extracted details here.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-6 text-sm text-muted-foreground">
              Add at least one document to begin using the helper.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
