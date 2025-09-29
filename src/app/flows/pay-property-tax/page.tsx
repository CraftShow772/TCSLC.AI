import type { Metadata } from "next";

import { ExternalPortalCard } from "@/components/portals/ExternalPortalCard";
import { portals } from "@/lib/links";

export const metadata: Metadata = {
  title: "Pay Property Tax | St. Lucie County"
};

const requirements = [
  {
    label: "Property tax account number",
    detail: "Find this on your mailed notice or in your Property Appraiser record."
  },
  {
    label: "Accepted payment method",
    detail: "Credit/debit cards incur a convenience fee. eCheck is free."
  },
  {
    label: "Email address",
    detail: "We send a confirmation receipt after you submit your payment."
  }
];

export default function PayPropertyTaxFlow() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 pb-16 pt-12 sm:px-10">
      <ExternalPortalCard
        title="Review before you pay your property tax"
        description="We partner with the St. Lucie County Tax Collector and MyEasyGov for secure online property tax payments. Have these details ready so your payment goes through smoothly."
        portal={portals.payPropertyTax}
        requirements={requirements}
        continueLabel="Continue to MyEasyGov"
        footerNote={
          <>
            Payments made after 11:59 PM Eastern time are credited the next business day. If you need installment plan help,
            call <a href="tel:17724622900" className="font-medium text-slate-700 underline hover:text-slate-900 dark:text-slate-200 dark:hover:text-white">(772) 462-2900</a>.
          </>
        }
      />
    </main>
  );
}
