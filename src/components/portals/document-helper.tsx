"use client";

import { useState } from "react";
import { UploadCloudIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAnalytics } from "@/hooks/use-analytics";

export function DocumentHelper() {
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const { logEvent } = useAnalytics();

  return (
    <Card className="space-y-4">
      <header className="flex items-center gap-3">
        <UploadCloudIcon className="h-5 w-5 text-secondary" aria-hidden="true" />
        <div>
          <h3 className="text-lg font-semibold">Document helper</h3>
          <p className="text-sm text-muted-foreground">
            Upload renewal, transfer, or startup PDFs to extract key fields. Extraction connects to agency APIs in production.
          </p>
        </div>
      </header>
      <label className="block text-sm font-medium text-foreground">Upload PDF</label>
      <Input
        type="file"
        accept="application/pdf"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) {
            return;
          }
          setFileName(file.name);
          logEvent({
            category: "document",
            action: "upload_selected",
            metadata: { fileName: file.name, size: file.size },
          });
        }}
      />
      {fileName && <p className="text-xs text-muted-foreground">Selected file: {fileName}</p>}
      <Textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Add context for analysts (optional)."
        rows={3}
      />
      <div className="flex justify-end">
        <Button
          onClick={() => {
            logEvent({
              category: "document",
              action: "extraction_requested",
              metadata: { fileName, noteLength: notes.length },
            });
            alert("Extraction stub: integration pending.");
          }}
          disabled={!fileName}
        >
          Run extraction
        </Button>
      </div>
    </Card>
  );
}
