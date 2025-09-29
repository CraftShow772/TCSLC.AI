import type { ComponentProps } from "react";
import { useMDXComponent } from "next-contentlayer/hooks";
import { Badge } from "@/components/ui/badge";

const components = {
  h2: (props: ComponentProps<"h2">) => <h2 className="text-2xl font-semibold" {...props} />,
  p: (props: ComponentProps<"p">) => <p className="text-sm leading-relaxed text-muted-foreground" {...props} />,
  strong: (props: ComponentProps<"strong">) => <strong className="font-semibold text-foreground" {...props} />,
  Badge,
};

export function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}
