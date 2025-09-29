'use client';

import Link from 'next/link';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/theme';
import { cn } from '@/lib/utils';

type MobileNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileNav({ onOpenChange, open }: MobileNavProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-40 bg-background/80 backdrop-blur-lg transition-opacity md:hidden',
        open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      <div
        className={cn(
          'absolute right-0 top-0 flex h-full w-4/5 max-w-sm flex-col border-l border-border bg-background p-6 shadow-xl transition-transform',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">{siteConfig.name}</span>
          <Button size="icon" variant="ghost" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close navigation</span>
          </Button>
        </div>
        <nav className="mt-6 flex flex-col gap-4 text-base">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              className="text-foreground/80 transition hover:text-foreground"
              href={item.href}
              onClick={() => onOpenChange(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-10">
          <Button className="w-full" size="lg">
            Explore AI Portal
          </Button>
        </div>
      </div>
    </div>
  );
}
