import Link from "next/link";

const links = [
  { href: "/services", label: "Services" },
  { href: "/faqs", label: "FAQs" },
  { href: "/documents", label: "Documents" },
  { href: "/fees", label: "Fees" },
  { href: "/locations", label: "Locations" },
];

export function MainNav() {
  return (
    <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
