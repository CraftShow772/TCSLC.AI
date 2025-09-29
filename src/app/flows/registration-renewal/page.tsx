"use client";
import { useMemo, useState } from "react";

import { DocumentHelper } from "../../../components/flows/DocumentHelper";
import { Question } from "../../../components/flows/Question";
import {
  ChecklistItem,
  SmartChecklist,
} from "../../../components/flows/SmartChecklist";
import type { FieldHintKey } from "../../../lib/docs/fieldHints";

type AnswerMap = Record<string, string>;

type QuestionConfig = {
  id: keyof AnswerMap;
  label: string;
  description?: string;
  placeholder?: string;
  type?: "text" | "textarea" | "select" | "date" | "email";
  options?: Array<{ value: string; label: string; description?: string }>;
  assistiveText?: string;
  required?: boolean;
  className?: string;
  disabled?: (answers: AnswerMap) => boolean;
};

const questions: QuestionConfig[] = [
  {
    id: "vehicleType",
    label: "Vehicle category",
    description: "We tailor requirements based on the type of vehicle you are renewing.",
    type: "select",
    options: [
      { value: "passenger", label: "Passenger" },
      { value: "commercial", label: "Commercial" },
      { value: "motorcycle", label: "Motorcycle" },
      { value: "electric", label: "Zero emission" },
    ],
    required: true,
  },
  {
    id: "addressChanged",
    label: "Has your mailing address changed?",
    description: "We'll prompt for proof of address if you recently moved.",
    type: "select",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes" },
    ],
    required: true,
  },
  {
    id: "renewalDueDate",
    label: "Registration expiration date",
    type: "date",
    assistiveText:
      "Helps us prioritize tasks if your renewal deadline is coming up soon.",
    required: true,
  },
  {
    id: "licensePlate",
    label: "License plate number",
    placeholder: "8ABC123",
    assistiveText: "Seven characters, no spaces.",
    required: true,
  },
  {
    id: "insuranceCarrier",
    label: "Insurance provider",
    placeholder: "Carrier name",
    className: "md:col-span-2",
    required: true,
  },
  {
    id: "insurancePolicy",
    label: "Insurance policy number",
    placeholder: "PCL-9081245",
    className: "md:col-span-2",
    required: true,
  },
  {
    id: "addressProof",
    label: "Proof of address you plan to bring",
    description: "Utility bill, lease agreement, or mortgage statement issued within 60 days.",
    type: "textarea",
    className: "md:col-span-2",
    disabled: (answers) => answers.addressChanged !== "yes",
  },
  {
    id: "preferredOffice",
    label: "Preferred DMV or AAA partner location",
    placeholder: "Santa Ana DMV",
    className: "md:col-span-2",
  },
];

const baseDocuments = [
  {
    id: "renewal-notice",
    title: "Renewal notice",
    description:
      "The letter or email reminder from the DMV includes your registration ID and fee breakdown.",
    accept: ["application/pdf", "image/*"],
    fields: [
      "registrationNumber",
      "licensePlateNumber",
      "expirationDate",
      "ownerLegalName",
      "mailingAddress",
    ] as FieldHintKey[],
    instructions: [
      "Capture the barcode section clearly to help the assistant extract the renewal ID.",
      "Ensure the fee table is legible so we can itemize renewal costs.",
    ],
  },
  {
    id: "insurance-proof",
    title: "Proof of insurance",
    description:
      "Upload the insurance card or declarations page showing active coverage for this vehicle.",
    accept: ["application/pdf", "image/*"],
    fields: [
      "insuranceProvider",
      "insurancePolicyNumber",
      "insuranceEffectiveDate",
      "ownerLegalName",
    ] as FieldHintKey[],
    instructions: [
      "Include both the front and back if the policy number is split across sides.",
    ],
  },
];

const addressDocument = {
  id: "address-proof",
  title: "Proof of new address",
  description:
    "Upload a recent utility bill or lease so the DMV accepts your mailing change.",
  optional: false,
  accept: ["application/pdf", "image/*"],
  fields: ["mailingAddress", "ownerLegalName"] as FieldHintKey[],
  instructions: [
    "The statement must show the service address and be dated within the last 60 days.",
  ],
};

const smogDocument = {
  id: "smog-certificate",
  title: "Smog certificate",
  description:
    "Only required if your vehicle is gasoline powered and not exempt.",
  accept: ["application/pdf", "image/*"],
  optional: true,
  fields: ["smogCertificateId", "emissionsStation", "vin"] as FieldHintKey[],
  instructions: [
    "Ensure the certificate shows the station ID and pass result.",
    "Certificates older than 90 days may be rejected.",
  ],
};

export default function RegistrationRenewalFlow() {
  const [answers, setAnswers] = useState<AnswerMap>({
    vehicleType: "",
    addressChanged: "",
    renewalDueDate: "",
    licensePlate: "",
    insuranceCarrier: "",
    insurancePolicy: "",
    addressProof: "",
    preferredOffice: "",
  });

  const checklistItems = useMemo<ChecklistItem[]>(() => {
    const items: ChecklistItem[] = [
      {
        id: "renewal-notice",
        label: "DMV renewal notice",
        required: true,
      },
      {
        id: "id-card",
        label: "Valid California driver license or ID",
        required: true,
      },
      {
        id: "insurance",
        label: "Proof of liability insurance",
        required: true,
      },
      {
        id: "payment",
        label: "Payment method for renewal fees",
        required: true,
      },
    ];

    if (answers.vehicleType !== "electric") {
      items.push({
        id: "smog",
        label: "Smog inspection certificate",
        required: answers.vehicleType !== "motorcycle",
        condition: () => answers.vehicleType !== "electric",
      });
    }

    if (answers.addressChanged === "yes") {
      items.push({
        id: "proof-of-address",
        label: "Proof of new address issued within 60 days",
        required: true,
        condition: () => answers.addressChanged === "yes",
      });
    }

    if (answers.vehicleType === "commercial") {
      items.push({
        id: "weight-cert",
        label: "Current weight certification or CVRA paperwork",
        required: true,
      });
    }

    return items;
  }, [answers.addressChanged, answers.vehicleType]);

  const documentRequirements = useMemo(() => {
    const docs = [...baseDocuments];

    if (answers.vehicleType !== "electric") {
      docs.push({
        ...smogDocument,
        optional: answers.vehicleType === "electric",
      });
    }

    if (answers.addressChanged === "yes") {
      docs.push(addressDocument);
    }

    return docs;
  }, [answers.addressChanged, answers.vehicleType]);

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 pb-16 pt-10">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Guided flow
        </p>
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
          Registration renewal workflow
        </h1>
        <p className="max-w-3xl text-base text-muted-foreground">
          Answer a few questions and let the assistant confirm the documents you need before
          your DMV visit. The smart checklist updates instantly as requirements change.
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Vehicle context</h2>
            <p className="text-sm text-muted-foreground">
              These answers help the assistant tailor compliance steps and highlight potential
              blockers early.
            </p>
          </div>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Updated live
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {questions.map((question) => (
            <Question
              key={question.id}
              id={question.id}
              label={question.label}
              description={question.description}
              placeholder={question.placeholder}
              type={question.type}
              options={question.options}
              assistiveText={question.assistiveText}
              required={question.required}
              value={answers[question.id] ?? ""}
              onChange={(value) =>
                setAnswers((prev) => ({
                  ...prev,
                  [question.id]: value,
                }))
              }
              className={question.className}
              disabled={question.disabled?.(answers)}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-foreground">Smart checklist</h2>
          <p className="text-sm text-muted-foreground">
            Requirements shift based on your answers. Anything marked with a red asterisk is
            required before the DMV will process the renewal.
          </p>
        </div>
        <SmartChecklist items={checklistItems} />
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-foreground">Document helper</h2>
          <p className="text-sm text-muted-foreground">
            Upload a document and the assistant will extract the key fields, flag missing
            sections, and summarize next steps.
          </p>
        </div>
        <DocumentHelper documents={documentRequirements} />
      </section>
    </div>
  );
}
