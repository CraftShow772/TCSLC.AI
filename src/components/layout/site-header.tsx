import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "#overview" },
  { name: "Assistant", href: "#assistant" },
  { name: "Checklists", href: "#checklists" },
  { name: "Compliance", href: "#compliance" },
  { name: "Locations", href: "/locations" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary", "font-mono text-base")}>AI</span>
          <span className="hidden sm:inline-flex">TCSLC.AI</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="transition hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild variant="secondary" size="sm">
            <Link href="#assistant">Launch assistant</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/locations">View locations</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
