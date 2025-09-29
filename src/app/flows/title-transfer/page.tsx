"use client";
import { useMemo, useState } from "react";

import { DocumentHelper } from "../../../components/flows/DocumentHelper";
import { Question } from "../../../components/flows/Question";
import {
  ChecklistItem,
  SmartChecklist,
} from "../../../components/flows/SmartChecklist";
import type { FieldHintKey } from "../../../lib/docs/fieldHints";

type TransferAnswers = {
  saleType: string;
  hasLien: string;
  odometerDisclosure: string;
  vehicleYear: string;
  salePrice: string;
  saleDate: string;
  buyerEmail: string;
  buyerPhone: string;
  notes: string;
};

type TransferQuestion = {
  id: keyof TransferAnswers;
  label: string;
  description?: string;
  type?: "text" | "textarea" | "select" | "date" | "email" | "tel";
  placeholder?: string;
  options?: Array<{ value: string; label: string; description?: string }>;
  className?: string;
  assistiveText?: string;
  required?: boolean;
};

const transferQuestions: TransferQuestion[] = [
  {
    id: "saleType",
    label: "What type of sale is this?",
    description: "Different sale types adjust whether a smog check or bill of sale is needed.",
    type: "select",
    options: [
      { value: "private", label: "Private party" },
      { value: "dealer", label: "Dealer" },
      { value: "family", label: "Family gift" },
      { value: "inheritance", label: "Inheritance" },
    ],
    required: true,
  },
  {
    id: "hasLien",
    label: "Is there a lien on the title?",
    description: "We'll check for lien release requirements.",
    type: "select",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes" },
    ],
    required: true,
  },
  {
    id: "vehicleYear",
    label: "Vehicle model year",
    placeholder: "2019",
    assistiveText: "Used to determine odometer disclosure requirements.",
    required: true,
  },
  {
    id: "odometerDisclosure",
    label: "Odometer disclosure completed?",
    description: "For vehicles under 20 years old, the buyer and seller must sign.",
    type: "select",
    options: [
      { value: "not-started", label: "Not yet" },
      { value: "in-progress", label: "In progress" },
      { value: "complete", label: "Yes, completed" },
    ],
    required: true,
  },
  {
    id: "saleDate",
    label: "Sale date",
    type: "date",
    required: true,
  },
  {
    id: "salePrice",
    label: "Sale price",
    placeholder: "$18,250",
    required: true,
  },
  {
    id: "buyerEmail",
    label: "Buyer email",
    type: "email",
    placeholder: "buyer@email.com",
    assistiveText: "We'll send digital signature requests here if needed.",
    className: "md:col-span-2",
  },
  {
    id: "buyerPhone",
    label: "Buyer phone",
    type: "tel",
    placeholder: "(555) 555-0192",
    className: "md:col-span-2",
  },
  {
    id: "notes",
    label: "Any special circumstances?",
    type: "textarea",
    placeholder: "Vehicle inherited, smog exemption letter submitted...",
    className: "md:col-span-2",
  },
];

const titleDocument = {
  id: "title-document",
  title: "California Certificate of Title",
  description: "Scan or upload the front and back of the current title (pink slip).",
  accept: ["application/pdf", "image/*"],
  fields: [
    "ownerLegalName",
    "buyerName",
    "sellerName",
    "vin",
    "titleNumber",
  ] as FieldHintKey[],
  instructions: [
    "Confirm the seller signatures are complete on line 1 and line 2 if applicable.",
    "Ensure no white-out or corrections appear—DMV rejects altered titles.",
  ],
};

const billOfSaleDocument = {
  id: "bill-of-sale",
  title: "Bill of sale",
  description:
    "Used when the purchase price or special terms need to be documented in addition to the title.",
  accept: ["application/pdf", "image/*"],
  fields: [
    "buyerName",
    "sellerName",
    "saleDate",
    "purchasePrice",
    "vin",
  ] as FieldHintKey[],
  instructions: [
    "Verify both parties have signed and the purchase price matches the title.",
  ],
};

const odometerDocument = {
  id: "odometer",
  title: "Odometer disclosure",
  description:
    "Form REG 262 or the federal odometer disclosure statement required for vehicles under 20 years old.",
  accept: ["application/pdf", "image/*"],
  fields: ["odometerReading", "buyerName", "sellerName", "vin"] as FieldHintKey[],
  instructions: [
    "Ensure the mileage is clearly legible and both signatures are present.",
  ],
};

const lienReleaseDocument = {
  id: "lien-release",
  title: "Lien release",
  description: "Needed when the title lists a financial institution as lienholder.",
  accept: ["application/pdf", "image/*"],
  fields: ["lienholder", "titleNumber", "vin"] as FieldHintKey[],
  instructions: [
    "Upload the original lien release letter or stamped title indicating lien satisfied.",
  ],
};

const smogDocument = {
  id: "smog",
  title: "Smog certificate",
  description:
    "Required for most gasoline vehicles unless exempt by age or location.",
  accept: ["application/pdf", "image/*"],
  optional: true,
  fields: ["smogCertificateId", "emissionsStation", "vin"] as FieldHintKey[],
  instructions: [
    "Verify the certificate date is within 90 days of the transfer.",
  ],
};

export default function TitleTransferFlow() {
  const [answers, setAnswers] = useState<TransferAnswers>({
    saleType: "",
    hasLien: "",
    odometerDisclosure: "",
    vehicleYear: "",
    salePrice: "",
    saleDate: "",
    buyerEmail: "",
    buyerPhone: "",
    notes: "",
  });

  const checklistItems = useMemo<ChecklistItem[]>(() => {
    const items: ChecklistItem[] = [
      { id: "title", label: "Signed title (pink slip)", required: true },
      {
        id: "buyer-id",
        label: "Buyer and seller photo ID",
        required: true,
      },
      {
        id: "bill-of-sale",
        label: "Bill of sale",
        required: answers.saleType !== "family" && answers.saleType !== "inheritance",
        condition: () => answers.saleType !== "family" && answers.saleType !== "inheritance",
      },
    ];

    if (answers.hasLien === "yes") {
      items.push({
        id: "lien-release",
        label: "Lien release letter or notarized payoff statement",
        required: true,
        condition: () => answers.hasLien === "yes",
      });
    }

    const vehicleYear = Number.parseInt(answers.vehicleYear, 10);
    const needsOdometer = Number.isFinite(vehicleYear)
      ? new Date().getFullYear() - vehicleYear < 20
      : true;

    if (needsOdometer) {
      items.push({
        id: "odometer",
        label: "Completed odometer disclosure",
        required: true,
      });
    }

    if (answers.saleType !== "family" && answers.saleType !== "inheritance") {
      items.push({
        id: "smog",
        label: "Smog inspection certificate",
        required: true,
        condition: () => answers.saleType !== "dealer",
      });
    }

    return items;
  }, [answers.hasLien, answers.saleType, answers.vehicleYear]);

  const documents = useMemo(() => {
    const docs = [titleDocument, billOfSaleDocument];

    const vehicleYear = Number.parseInt(answers.vehicleYear, 10);
    const needsOdometer = Number.isFinite(vehicleYear)
      ? new Date().getFullYear() - vehicleYear < 20
      : true;

    if (needsOdometer) {
      docs.push(odometerDocument);
    }

    if (answers.hasLien === "yes") {
      docs.push(lienReleaseDocument);
    }

    if (answers.saleType !== "family" && answers.saleType !== "inheritance") {
      docs.push(smogDocument);
    }

    return docs;
  }, [answers.hasLien, answers.saleType, answers.vehicleYear]);

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 pb-16 pt-10">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Guided flow
        </p>
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
          Title transfer assistant
        </h1>
        <p className="max-w-3xl text-base text-muted-foreground">
          Manage private-party or dealer transfers with confidence. Smart automations surface
          missing paperwork and help you finalize signatures faster.
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Transaction details</h2>
            <p className="text-sm text-muted-foreground">
              Your answers drive which forms we prep, from lien releases to odometer statements.
            </p>
          </div>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Live preview
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {transferQuestions.map((question) => (
            <Question
              key={question.id}
              id={question.id}
              label={question.label}
              description={question.description}
              placeholder={question.placeholder}
              type={question.type}
              options={question.options}
              className={question.className}
              assistiveText={question.assistiveText}
              required={question.required}
              value={answers[question.id] ?? ""}
              onChange={(value) =>
                setAnswers((prev) => ({
                  ...prev,
                  [question.id]: value,
                }))
              }
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-foreground">Smart checklist</h2>
          <p className="text-sm text-muted-foreground">
            We highlight every document the DMV expects so nothing is missed on transfer day.
          </p>
        </div>
        <SmartChecklist items={checklistItems} />
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-foreground">Document helper</h2>
          <p className="text-sm text-muted-foreground">
            Upload drafts for AI review. We extract VINs, parties, signatures, and alert you if
            something is missing.
          </p>
        </div>
        <DocumentHelper documents={documents} />
      </section>
    </div>
  );
}
