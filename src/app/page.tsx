import { CalendarClock, CarFront, FileSearch, Fish, IdCard, Landmark, Repeat, Store, Wallet } from "lucide-react";
import { IntentRouter } from "../components/intents/IntentRouter";
import { QuickActionCard } from "../components/intents/QuickActionCard";

const quickActions = [
  {
    title: "Renew Vehicle",
    description: "Update your vehicle registration or order a new decal.",
    href: "/services/vehicle-renewal",
    icon: CarFront
  },
  {
    title: "Pay Property Tax",
    description: "Submit secure payments for real estate and tangible taxes.",
    href: "/services/property-tax",
    icon: Wallet
  },
  {
    title: "Local Business Tax",
    description: "Register or renew your local business tax receipt online.",
    href: "/services/business-tax",
    icon: Store
  },
  {
    title: "Driver License",
    description: "Schedule a visit or review requirements for identification services.",
    href: "/services/driver-license",
    icon: IdCard
  },
  {
    title: "Title Transfer",
    description: "Transfer ownership, update lienholders, and manage vehicle titles.",
    href: "/documents/title-transfer",
    icon: Repeat
  },
  {
    title: "Hunting & Fishing",
    description: "Purchase or renew hunting, fishing, and sportsman licenses.",
    href: "/services/outdoor-licensing",
    icon: Fish
  },
  {
    title: "Tourist Development Tax",
    description: "File returns for short-term rental and tourist development taxes.",
    href: "/services/tourist-tax",
    icon: Landmark
  },
  {
    title: "Book Appointments",
    description: "Reserve time with our service centers for in-person support.",
    href: "/contact/appointments",
    icon: CalendarClock
  },
  {
    title: "Records Search",
    description: "Access public records, liens, and historical documents online.",
    href: "/documents/records-search",
    icon: FileSearch
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_55%)]" />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16 md:py-24">
          <header className="space-y-6 text-center md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-sky-300">
              AI Native County Experience
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl md:text-6xl">
              Discover services faster with the Treasure Coast Assistant
            </h1>
            <p className="max-w-2xl text-base text-slate-200/80 md:text-lg">
              Our new AI-powered experience understands everyday language so you can renew registrations, pay taxes, and
              access records without the guesswork.
            </p>
          </header>

          <IntentRouter />

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-50">Quick actions</h2>
              <p className="text-sm text-slate-300/80">Popular tasks handled daily across St. Lucie County.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {quickActions.map((action) => (
                <QuickActionCard key={action.title} {...action} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
