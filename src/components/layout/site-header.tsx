import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/layout/main-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-base font-semibold text-foreground">
            TCSLC.AI
          </Link>
          <MainNav />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation">
            <MenuIcon className="h-5 w-5" />
          </Button>
          <Link href="/documents" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground md:block">
            Prepare documents
          </Link>
          <Button asChild>
            <Link href="/services">Explore services</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
