"use client";
import { useMemo, useState } from "react";

import { DocumentHelper } from "../../../components/flows/DocumentHelper";
import { Question } from "../../../components/flows/Question";
import {
  ChecklistItem,
  SmartChecklist,
} from "../../../components/flows/SmartChecklist";
import type { FieldHintKey } from "../../../lib/docs/fieldHints";

type BusinessAnswers = {
  entityType: string;
  formationState: string;
  formationDate: string;
  hasEmployees: string;
  needsEin: string;
  dba: string;
  industry: string;
  contactEmail: string;
  contactPhone: string;
  notes: string;
};

type BusinessQuestion = {
  id: keyof BusinessAnswers;
  label: string;
  description?: string;
  placeholder?: string;
  type?: "text" | "textarea" | "select" | "date" | "email" | "tel";
  options?: Array<{ value: string; label: string; description?: string }>;
  className?: string;
  assistiveText?: string;
  required?: boolean;
  disabled?: (answers: BusinessAnswers) => boolean;
};

const businessQuestions: BusinessQuestion[] = [
  {
    id: "entityType",
    label: "Entity type",
    description: "We adjust filings and templates based on your business structure.",
    type: "select",
    options: [
      { value: "llc", label: "Limited Liability Company" },
      { value: "corporation", label: "Corporation" },
      { value: "partnership", label: "Partnership" },
      { value: "sole", label: "Sole proprietorship" },
    ],
    required: true,
  },
  {
    id: "formationState",
    label: "State of formation",
    type: "select",
    options: [
      { value: "ca", label: "California" },
      { value: "nv", label: "Nevada" },
      { value: "de", label: "Delaware" },
      { value: "other", label: "Other" },
    ],
    required: true,
  },
  {
    id: "formationDate",
    label: "Formation date",
    type: "date",
    required: true,
  },
  {
    id: "hasEmployees",
    label: "Will you have employees in the first 12 months?",
    type: "select",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes" },
    ],
    required: true,
  },
  {
    id: "needsEin",
    label: "Do you already have an EIN?",
    type: "select",
    options: [
      { value: "have", label: "Yes" },
      { value: "need", label: "No, I need one" },
    ],
    required: true,
  },
  {
    id: "dba",
    label: "Doing business as (DBA)",
    placeholder: "Harbor City Logistics",
    assistiveText: "Leave blank if operating under the legal name only.",
    className: "md:col-span-2",
  },
  {
    id: "industry",
    label: "Primary industry",
    placeholder: "Transportation, SaaS, Retail...",
    className: "md:col-span-2",
  },
  {
    id: "contactEmail",
    label: "Contact email",
    type: "email",
    placeholder: "founder@company.com",
    className: "md:col-span-2",
    required: true,
  },
  {
    id: "contactPhone",
    label: "Contact phone",
    type: "tel",
    placeholder: "(555) 555-0101",
    className: "md:col-span-2",
  },
  {
    id: "notes",
    label: "Additional notes",
    type: "textarea",
    placeholder: "Licensing deadlines, foreign qualification needs, special ownership structure...",
    className: "md:col-span-2",
  },
];

const articlesDocument = {
  id: "articles",
  title: "Articles of Organization/Incorporation",
  description: "Official state filing showing your legal entity name and filing number.",
  accept: ["application/pdf", "image/*"],
  fields: [
    "businessLegalName",
    "entityType",
    "articlesReference",
    "formationDate",
    "businessAddress",
  ] as FieldHintKey[],
  instructions: [
    "Make sure the state file stamp and signature are visible.",
  ],
};

const einDocument = {
  id: "ein",
  title: "IRS EIN confirmation",
  description: "CP 575 or 147C letter confirming the federal tax ID.",
  accept: ["application/pdf", "image/*"],
  fields: ["fein", "businessLegalName", "businessAddress"] as FieldHintKey[],
  instructions: [
    "Mask the middle digits before sharing externally to protect sensitive data.",
  ],
};

const operatingAgreementDocument = {
  id: "operating-agreement",
  title: "Operating agreement / bylaws",
  description:
    "Member or shareholder agreement outlining ownership and authority for the new entity.",
  accept: ["application/pdf", "image/*"],
  fields: ["operatingAgreement", "ownerLegalName", "contactEmail"] as FieldHintKey[],
  instructions: [
    "Upload the signature page and any relevant approval resolutions.",
  ],
};

const registeredAgentDocument = {
  id: "registered-agent",
  title: "Registered agent authorization",
  description: "Agent acceptance form or service agreement.",
  accept: ["application/pdf", "image/*"],
  fields: ["registeredAgent", "businessAddress"] as FieldHintKey[],
};

const statementDocument = {
  id: "statement-information",
  title: "Initial Statement of Information",
  description: "Applicable for California corporations and LLCs within 90 days of formation.",
  accept: ["application/pdf", "image/*"],
  optional: true,
  fields: ["businessLegalName", "registeredAgent", "contactEmail", "contactPhone"] as FieldHintKey[],
};

export default function NewBusinessFlow() {
  const [answers, setAnswers] = useState<BusinessAnswers>({
    entityType: "",
    formationState: "",
    formationDate: "",
    hasEmployees: "",
    needsEin: "",
    dba: "",
    industry: "",
    contactEmail: "",
    contactPhone: "",
    notes: "",
  });

  const checklistItems = useMemo<ChecklistItem[]>(() => {
    const items: ChecklistItem[] = [
      { id: "articles", label: "State-approved formation documents", required: true },
      {
        id: "owner-id",
        label: "Owner government-issued ID",
        required: true,
      },
    ];

    if (answers.needsEin === "need" || answers.entityType !== "sole") {
      items.push({
        id: "ein",
        label: "IRS EIN confirmation letter",
        required: true,
      });
    }

    if (answers.entityType === "llc") {
      items.push({
        id: "operating-agreement",
        label: "Executed operating agreement",
        required: true,
      });
    }

    if (answers.entityType === "corporation") {
      items.push({
        id: "bylaws",
        label: "Corporate bylaws and initial statement of information",
        required: true,
      });
    }

    if (answers.hasEmployees === "yes") {
      items.push({
        id: "payroll",
        label: "Payroll registration (EDD)",
        required: true,
      });
    }

    if (answers.dba.trim().length > 0) {
      items.push({
        id: "dba",
        label: "Filed DBA certificate",
        required: true,
      });
    }

    return items;
  }, [answers.dba, answers.entityType, answers.hasEmployees, answers.needsEin]);

  const documents = useMemo(() => {
    const docs = [articlesDocument, registeredAgentDocument];

    if (answers.needsEin === "need" || answers.entityType !== "sole") {
      docs.push(einDocument);
    }

    if (answers.entityType === "llc" || answers.entityType === "corporation") {
      docs.push(operatingAgreementDocument);
    }

    if (answers.entityType === "corporation") {
      docs.push(statementDocument);
    }

    return docs;
  }, [answers.entityType, answers.needsEin]);

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 pb-16 pt-10">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Guided flow
        </p>
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
          New business formation hub
        </h1>
        <p className="max-w-3xl text-base text-muted-foreground">
          Spin up a new entity, register for tax IDs, and prep compliance docs in one place. Our
          assistant highlights which filings matter most based on your answers.
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Business basics</h2>
            <p className="text-sm text-muted-foreground">
              Provide the core facts so we can populate filings and automate follow-ups.
            </p>
          </div>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            AI assisted
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {businessQuestions.map((question) => (
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
              disabled={question.disabled?.(answers)}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-foreground">Smart checklist</h2>
          <p className="text-sm text-muted-foreground">
            The checklist adapts to your entity type, DBA plans, and payroll needs.
          </p>
        </div>
        <SmartChecklist items={checklistItems} />
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-foreground">Document helper</h2>
          <p className="text-sm text-muted-foreground">
            Upload your filings for AI extraction. We'll surface EINs, filing numbers, and
            missing signatures before you submit anything to the state.
          </p>
        </div>
        <DocumentHelper documents={documents} />
      </section>
    </div>
  );
}
