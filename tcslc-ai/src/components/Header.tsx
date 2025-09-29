'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { MobileNav } from './MobileNav';

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-6">
        <Link className="flex items-center gap-2 text-lg font-semibold" href="/">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            AI
          </span>
          <span className="hidden sm:block">{siteConfig.name}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                'text-foreground/70'
              )}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button className="hidden md:inline-flex" size="sm">
            Explore AI Portal
          </Button>
          <Button
            className="md:hidden"
            size="icon"
            variant="outline"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open navigation</span>
          </Button>
        </div>
      </div>
      <MobileNav open={open} onOpenChange={setOpen} />
    </header>
  );
}
