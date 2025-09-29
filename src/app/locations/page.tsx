import { BuildingIcon, ClockIcon, PhoneIcon } from "lucide-react";

import { WhyPanel } from "@/components/compliance/why-panel";
import { Card } from "@/components/ui/card";

const offices = [
  {
    name: "Tallahassee HQ",
    address: "123 Capital Circle NE, Tallahassee, FL 32301",
    phone: "(850) 555-0101",
    hours: "Mon–Fri 8:00am–4:30pm",
  },
  {
    name: "South Monroe Service Center",
    address: "415 S Monroe St, Tallahassee, FL 32301",
    phone: "(850) 555-0112",
    hours: "Tue–Sat 9:00am–5:00pm",
  },
  {
    name: "Midtown Satellite",
    address: "812 Thomasville Rd, Tallahassee, FL 32303",
    phone: "(850) 555-0145",
    hours: "Mon–Fri 10:00am–6:00pm",
  },
];

export const metadata = {
  title: "Locations | TCSLC.AI",
  description: "Regional offices with upcoming wait-time integrations for licensing and fee payments.",
};

export default function LocationsPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">Locations</h1>
        <p className="text-muted-foreground">
          Visit in person for payments, fingerprinting, and same-day document reviews. Real-time queue data will stream into this page soon.
        </p>
        <WhyPanel context="Wait-time integration hooks are stubbed for partner APIs and will power the assistant’s recommendations." />
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {offices.map((office) => (
          <Card key={office.name} className="space-y-4 p-6">
            <div className="flex items-center gap-3">
              <BuildingIcon className="h-5 w-5 text-secondary" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-semibold">{office.name}</h2>
                <p className="text-sm text-muted-foreground">{office.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <PhoneIcon className="h-4 w-4" aria-hidden="true" />
              <a href={`tel:${office.phone.replace(/[^\d]/g, "")}`} className="text-primary hover:underline">
                {office.phone}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ClockIcon className="h-4 w-4" aria-hidden="true" />
              <span>{office.hours}</span>
            </div>
            <div className="rounded-md border border-dashed border-primary/40 bg-muted/20 p-4 text-sm text-muted-foreground">
              Queue integration placeholder: waiting for partner API credentials.
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
