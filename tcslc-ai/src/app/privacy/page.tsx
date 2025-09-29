import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Our commitment to privacy and responsible AI for TC SLC.',
};

export default function PrivacyPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-4xl font-semibold text-foreground">Privacy Policy</h1>
        <p className="text-lg text-muted-foreground">
          We are building AI-native experiences that honor student privacy, safeguard data, and
          provide transparent control over how information is used.
        </p>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            As prototypes roll out, we will detail how data is collected, stored, and processed. Our
            approach centers on minimal data usage, explicit consent, and compliance with FERPA and
            other applicable regulations.
          </p>
          <p>
            Families, staff, and community members will have access to dashboards that explain what
            AI models power each experience and offer easy ways to manage preferences or opt out.
          </p>
        </div>
      </div>
    </div>
  );
}
