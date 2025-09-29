import { CheckCircleIcon, CircleIcon } from "lucide-react";

const renewalSteps = [
  {
    title: "Confirm business information",
    description: "Verify mailing address, officers, and responsible persons in MyFloridaLicense.",
  },
  {
    title: "Update dram shop insurance",
    description: "Upload a current certificate that meets Florida dram shop requirements.",
  },
  {
    title: "Schedule inspections",
    description: "Fire and health inspections must be completed before renewal submission.",
  },
  {
    title: "Submit payment",
    description: "Use the tax portal for ACH or credit card; include confirmation in your packet.",
  },
];

export function RenewalChecklist() {
  return (
    <section id="renewal-checklist" className="rounded-xl border bg-background p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Renewal checklist</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Work through these tasks before submitting your annual or quarterly renewal.
      </p>
      <ul className="mt-6 space-y-4">
        {renewalSteps.map((step) => (
          <li key={step.title} className="flex gap-3 rounded-lg border bg-muted/20 p-4">
            <CircleIcon className="mt-1 h-5 w-5 text-secondary" aria-hidden="true" />
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
