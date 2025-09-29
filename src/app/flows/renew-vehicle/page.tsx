import type { Metadata } from "next";

import { ExternalPortalCard } from "@/components/portals/ExternalPortalCard";
import { portals } from "@/lib/links";

export const metadata: Metadata = {
  title: "Renew Vehicle Registration | St. Lucie County"
};

const requirements = [
  {
    label: "License plate or vehicle identification number",
    detail: "Enter the information exactly as it appears on your registration."
  },
  {
    label: "Valid form of payment",
    detail: "Visa, Mastercard, Discover, American Express, and eCheck are accepted."
  },
  {
    label: "Insurance and driver record compliance",
    detail: "Registrations cannot be renewed online if you have insurance or driver license holds."
  }
];

export default function RenewVehicleFlow() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 pb-16 pt-12 sm:px-10">
      <ExternalPortalCard
        title="Renew your St. Lucie County vehicle registration"
        description="Confirm you have the details the State of Florida requires before we send you to MyEasyGov to complete your renewal."
        portal={portals.renewVehicle}
        requirements={requirements}
        continueLabel="Continue to Renewal Portal"
        supportContent={
          <p>
            Need to renew in person? Visit one of our service centers or mail your payment to 2300 Virginia Avenue, Fort Pierce,
            FL 34982.
          </p>
        }
      />
    </main>
  );
}
