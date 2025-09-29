import type { Metadata } from "next";

import { ExternalPortalCard } from "@/components/portals/ExternalPortalCard";
import { portals } from "@/lib/links";

export const metadata: Metadata = {
  title: "Pay Tourist Development Tax | St. Lucie County"
};

const requirements = [
  {
    label: "Account number and filing period",
    detail: "Have your tourist tax account ID and the period you are submitting ready."
  },
  {
    label: "Rental income totals",
    detail: "Report gross taxable rent collected for the period before fees or taxes."
  },
  {
    label: "Supporting documentation",
    detail: "Upload exemption certificates or adjustments if requested during filing."
  }
];

export default function TouristTaxFlow() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 pb-16 pt-12 sm:px-10">
      <ExternalPortalCard
        title="File and pay the Tourist Development Tax"
        description="Vacation rental hosts and property managers submit their monthly remittance through MyEasyGov. Review the checklist so you can finish in one visit."
        portal={portals.touristTax}
        requirements={requirements}
        continueLabel="Continue to Tourist Tax Portal"
        supportContent={
          <p>
            Filing monthly? Schedule reminders in your MyEasyGov dashboard once you sign in to avoid penalties.
          </p>
        }
        footerNote={
          <>
            Need help? Email <a href="mailto:touristtax@tcslc.com" className="font-medium text-slate-700 underline hover:text-slate-900 dark:text-slate-200 dark:hover:text-white">touristtax@tcslc.com</a> or call (772) 462-1650.
          </>
        }
      />
    </main>
  );
}
