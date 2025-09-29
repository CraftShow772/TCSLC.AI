import { ShieldCheckIcon } from "lucide-react";

export function AuditLogBanner() {
  return (
    <div className="rounded-md border border-muted bg-muted/40 p-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <ShieldCheckIcon className="h-5 w-5 text-secondary" aria-hidden="true" />
        <p>
          Interactions are recorded in an internal-only audit log stored in an encrypted SQLite database. Logs include action, actor, and timestamp to support compliance reviews.
        </p>
      </div>
    </div>
  );
}
