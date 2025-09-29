import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TCSLC. All rights reserved. Built with accessibility and privacy top of mind.
            </p>
          </div>
          <div className="space-y-2 text-sm">
            <Link href="/privacy" className="block text-muted-foreground hover:text-foreground">
              Privacy placeholder
            </Link>
            <Link href="/accessibility" className="block text-muted-foreground hover:text-foreground">
              Accessibility placeholder
            </Link>
          </div>
          <div className="space-y-2 text-sm">
            <Link href="/documents" className="block text-muted-foreground hover:text-foreground">
              Document helper
            </Link>
            <Link href="/locations" className="block text-muted-foreground hover:text-foreground">
              Visit a regional office
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
