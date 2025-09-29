import { ClipboardListIcon } from "lucide-react";

const startupSteps = [
  {
    title: "Entity formation",
    description: "File with the Florida Division of Corporations and gather articles of incorporation.",
  },
  {
    title: "Location approvals",
    description: "Confirm zoning compatibility, conditional use permits, and occupancy certificates.",
  },
  {
    title: "Financial disclosures",
    description: "Prepare source of funds statements and bank verification letters for the application.",
  },
  {
    title: "Operational readiness",
    description: "Enroll managers in mandatory training and schedule Responsible Vendor classes.",
  },
];

export function NewBusinessChecklist() {
  return (
    <section id="new-business-checklist" className="rounded-xl border bg-background p-6 shadow-sm">
      <h2 className="text-xl font-semibold">New business checklist</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Launch with confidence using this curated list aligned to the Department’s licensing timeline.
      </p>
      <ul className="mt-6 space-y-4">
        {startupSteps.map((step) => (
          <li key={step.title} className="flex gap-3 rounded-lg border bg-muted/20 p-4">
            <ClipboardListIcon className="mt-1 h-5 w-5 text-secondary" aria-hidden="true" />
            <div>
              <p className="font-medium text-foreground">{step.title}</p>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
