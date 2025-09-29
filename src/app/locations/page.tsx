import type { Metadata } from "next";

import { LocationCard } from "@/components/locations/LocationCard";
import { LOCATIONS } from "@/lib/locations.data";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Find office locations, services, operating hours, and queue information for the St. Lucie County Tax Collector.",
  alternates: {
    canonical: "/locations"
  }
};

export default function LocationsPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 md:px-8">
        <section className="space-y-4 text-center md:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            Visit us in person
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Locations, hours, and live queues
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300 md:text-lg">
            Explore each service center to confirm operating hours, plan your visit with live queue links, and find
            tailored services by location.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {LOCATIONS.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </section>
      </div>
    </main>
  );
}
