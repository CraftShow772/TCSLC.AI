import { FileCheckIcon } from "lucide-react";

const transferSteps = [
  {
    title: "Bill of sale",
    description: "Ensure notarized signatures and include the FEIN of the purchasing entity.",
  },
  {
    title: "Zoning confirmation",
    description: "Obtain a letter of zoning compliance from the local authority within 30 days of transfer.",
  },
  {
    title: "Responsible vendor training",
    description: "Document staff completion dates to maintain Responsible Vendor Program status.",
  },
  {
    title: "Fingerprints and background",
    description: "Submit LiveScan fingerprints for all officers and upload receipts to the portal.",
  },
];

export function TransferChecklist() {
  return (
    <section id="transfer-checklist" className="rounded-xl border bg-background p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Title transfer checklist</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Use this list to coordinate with buyers, local agencies, and the Department of Revenue.
      </p>
      <ul className="mt-6 space-y-4">
        {transferSteps.map((step) => (
          <li key={step.title} className="flex gap-3 rounded-lg border bg-muted/20 p-4">
            <FileCheckIcon className="mt-1 h-5 w-5 text-secondary" aria-hidden="true" />
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
