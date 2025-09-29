import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg space-y-4 rounded-lg border bg-background p-8 text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">
        The resource you are looking for has moved or no longer exists. Try exploring services or ask the assistant for help.
      </p>
      <div className="flex justify-center gap-3">
        <Button asChild>
          <Link href="/">Return home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/services">View services</Link>
        </Button>
      </div>
    </div>
  );
}
