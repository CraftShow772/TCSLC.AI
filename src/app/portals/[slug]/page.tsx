import { notFound } from "next/navigation";

import { PortalWrapper } from "@/components/portals/portal-wrapper";
import { getPortal } from "@/data/portals";

interface PortalPageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: PortalPageProps) {
  const portal = getPortal(params.slug);
  if (!portal) {
    return {
      title: "Portal not found",
    };
  }
  return {
    title: `${portal.name} | TCSLC.AI`,
    description: portal.description,
  };
}

export default function PortalPage({ params }: PortalPageProps) {
  const portal = getPortal(params.slug);
  if (!portal) {
    notFound();
  }
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">{portal.name}</h1>
        <p className="text-muted-foreground">{portal.description}</p>
      </header>
      <PortalWrapper portal={portal} />
    </div>
  );
}
