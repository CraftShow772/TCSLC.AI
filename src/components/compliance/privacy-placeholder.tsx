import Link from "next/link";

export function PrivacyPlaceholder() {
  return (
    <section className="rounded-lg border bg-muted/20 p-6">
      <h2 className="text-lg font-semibold">Privacy commitment</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We never store documents or chat conversations longer than necessary to deliver the service. A detailed privacy policy is in progress and will outline retention, access controls, and opt-out options.
      </p>
      <Link href="/privacy" className="mt-3 inline-block text-sm text-primary hover:underline">
        Privacy policy placeholder
      </Link>
    </section>
  );
}
