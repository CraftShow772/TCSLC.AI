import Link from "next/link";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { locations } from "@/data/locations";
import { buildPrivacySnapshot, evaluateProcessingRisk } from "@/modules/compliance/privacy";

export const metadata: Metadata = {
  title: "Locations",
  description: "Explore TCSLC studios by region and connect with the closest delivery team.",
};

const availabilityStyles = {
  open: "bg-accent/20 text-accent",
  limited: "bg-secondary/20 text-secondary",
  waitlist: "bg-muted/40 text-muted-foreground",
} as const;

export default function LocationsPage() {
  const snapshot = buildPrivacySnapshot();
  const risk = evaluateProcessingRisk(snapshot);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6">
      <header className="space-y-4">
        <Badge className="bg-primary/20 text-primary">Global reach</Badge>
        <h1 className="text-balance text-4xl font-semibold sm:text-5xl">Meet the studios powering TCSLC.AI</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Every studio blends AI-native production, compliance advisory, and human craftsmanship. Use the assistant to route directly to a location team or launch a smart checklist tailored to your market.
        </p>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        {locations.map((location) => (
          <Card key={location.id} className="flex flex-col justify-between space-y-4">
            <CardHeader className="space-y-3 pb-0">
              <div className="flex items-center justify-between">
                <Badge className={availabilityStyles[location.availability]}>
                  {location.availability === "open" && "Accepting projects"}
                  {location.availability === "limited" && "Limited availability"}
                  {location.availability === "waitlist" && "Join the waitlist"}
                </Badge>
                <span className="text-xs text-muted-foreground">{location.region}</span>
              </div>
              <CardTitle>{location.name}</CardTitle>
              <CardDescription>{location.address}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Capabilities</h3>
                <ul className="mt-2 grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                  {location.capabilities.map((capability) => (
                    <li key={capability} className="rounded-lg border border-border/40 bg-background/60 px-3 py-2">
                      {capability}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/60 px-4 py-3 text-sm">
                <p className="font-medium text-foreground">Contact</p>
                <p className="text-muted-foreground">{location.contact.email}</p>
                <p className="text-muted-foreground">{location.contact.phone}</p>
              </div>
              <Button asChild variant="secondary" className="w-full justify-center">
                <Link href={`/#assistant`}>Talk to the assistant about {location.name}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
      <section className="rounded-3xl border border-border/50 bg-black/30 p-6">
        <h2 className="text-2xl font-semibold">Compliance alignment across every studio</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Current privacy score across locations is {(snapshot.score * 100).toFixed(0)}% with a {risk.rating} risk rating. {risk.explanation}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {snapshot.controlsInPlace.map((control) => (
            <span key={control} className="rounded-full border border-border/60 bg-background/50 px-3 py-1">
              {control}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
