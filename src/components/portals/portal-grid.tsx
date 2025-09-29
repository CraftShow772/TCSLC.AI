import { PortalFrame } from "./portal-frame";
import type { PortalDefinition } from "@/data/portals";

interface PortalGridProps {
  portals: PortalDefinition[];
}

export function PortalGrid({ portals }: PortalGridProps) {
  return (
    <div id="portals" className="grid gap-4 md:grid-cols-2">
      {portals.map((portal) => (
        <PortalFrame key={portal.id} portal={portal} />
      ))}
    </div>
  );
}
