import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type QuickActionCardProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export function QuickActionCard({ title, description, href, icon: Icon }: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_45px_-20px_rgba(15,23,42,0.35)] backdrop-blur transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_25px_60px_-25px_rgba(15,23,42,0.45)]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white shadow-inner">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-50">{title}</h3>
          <p className="text-sm text-slate-200/80">{description}</p>
        </div>
      </div>
      <span className="mt-6 inline-flex items-center text-sm font-medium text-sky-300 transition group-hover:text-sky-200">
        Explore
        <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Link>
  );
}
