export function AccessibilityPlaceholder() {
  return (
    <section className="rounded-lg border bg-muted/20 p-6">
      <h2 className="text-lg font-semibold">Accessibility roadmap</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        WCAG 2.2 AA conformance testing is underway. Keyboard and screen-reader flows have dedicated QA and the assistant UI is fully operable without a mouse. Additional audits will be published here.
      </p>
    </section>
  );
}
