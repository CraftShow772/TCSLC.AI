import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Locations',
  description: 'Explore TC SLC campuses and connected learning environments.',
};

export default function LocationsPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-4xl font-semibold text-foreground">Locations</h1>
        <p className="text-lg text-muted-foreground">
          Each campus will soon feature interactive maps, real-time transportation updates, and AI
          copilots for scheduling and visitor management. Stay tuned as we layer in dynamic data
          feeds that power every location.
        </p>
        <div className="space-y-4">
          {['Main Campus', 'Career Tech Annex', 'Community Innovation Hub'].map((location) => (
            <div key={location} className="rounded-2xl border border-border/60 bg-background p-5">
              <h2 className="text-xl font-semibold text-foreground">{location}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Future-ready integrations will surface transportation routes, building services,
                and accessibility pathways tailored to your needs.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
