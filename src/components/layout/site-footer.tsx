import Link from "next/link";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "#overview" },
      { label: "Assistant", href: "#assistant" },
      { label: "Smart Checklists", href: "#checklists" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Locations", href: "/locations" },
      { label: "Compliance", href: "#compliance" },
      { label: "Portal", href: "#portals" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Privacy", href: "#privacy" },
      { label: "Security", href: "#compliance" },
      { label: "Prompts", href: "#prompts" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-black/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {section.title}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link className="transition hover:text-foreground" href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 border-t border-border/50 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} TCSLC.AI. Crafted with Next.js 14 and Tailwind.</p>
          <div className="flex gap-3">
            <Link href="#privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="#compliance" className="hover:text-foreground">
              Compliance
            </Link>
            <Link href="#assistant" className="hover:text-foreground">
              Assistant
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
