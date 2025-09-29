import Link from 'next/link';

import { siteConfig } from '@/lib/theme';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">{siteConfig.name}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>
        <div className="flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:gap-6">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              className="transition hover:text-foreground"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {siteConfig.legalNav.map((item) => (
            <Link
              key={item.href}
              className="transition hover:text-foreground"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
          <span>&copy; {new Date().getFullYear()} Trumbull Career & Technical Center</span>
        </div>
      </div>
    </footer>
  );
}
