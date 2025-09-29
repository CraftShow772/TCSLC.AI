import Link from "next/link";
import { Clock, ExternalLink, ListChecks, MapPin, Phone } from "lucide-react";

import type { Location } from "@/lib/locations.data";
import { getOrderedHours, getTodayHours, isOpenNow } from "@/lib/hours";
import { getQueueLink } from "@/lib/queues";

const serviceBadgeClasses =
  "rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700";

export type LocationCardProps = {
  location: Location;
};

export function LocationCard({ location }: LocationCardProps) {
  const { name, address, phone, hours, services, mapUrl, queueUrl } = location;

  const todayHours = getTodayHours(hours);
  const openNow = isOpenNow(hours);
  const queueLink = getQueueLink(queueUrl);
  const orderedHours = getOrderedHours(hours);

  return (
    <article className="group flex flex-col gap-6 rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm ring-1 ring-transparent transition hover:border-slate-300 hover:shadow-md hover:ring-slate-200 dark:border-slate-800/80 dark:bg-slate-900/70 dark:hover:border-slate-700 dark:hover:ring-slate-800">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{name}</h3>
          <span
            className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${openNow ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200" : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200"}`}
          >
            <Clock className="h-4 w-4" />
            {openNow ? "Open now" : "Closed"}
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">{address}</p>
        {todayHours ? (
          <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Clock className="h-4 w-4" />
            Today: {todayHours}
          </p>
        ) : null}
      </header>

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Services
            </h4>
            <div className="flex flex-wrap gap-2">
              {services.map((service) => (
                <span key={service} className={serviceBadgeClasses}>
                  <ListChecks className="mr-1 inline-block h-3 w-3" />
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Weekly hours
            </h4>
            <dl className="grid grid-cols-1 gap-y-1 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
              {orderedHours.map(({ day, value }) => (
                <div key={day} className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                  <dt className="font-medium text-slate-700 dark:text-slate-200">{day}</dt>
                  <dd className="text-right text-slate-600 dark:text-slate-300">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 md:w-56">
          {phone ? (
            <Link
              href={`tel:${phone.replace(/[^\d]/g, "")}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800"
            >
              <Phone className="h-4 w-4" />
              Call {phone}
            </Link>
          ) : null}
          {mapUrl ? (
            <Link
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              <MapPin className="h-4 w-4" />
              Directions
              <ExternalLink className="h-4 w-4" />
            </Link>
          ) : null}
          {queueLink ? (
            <Link
              href={queueLink.href}
              target={queueLink.target}
              rel={queueLink.rel}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              Join the queue
              <ExternalLink className="h-4 w-4" />
            </Link>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-center text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
              Walk-in service only
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
