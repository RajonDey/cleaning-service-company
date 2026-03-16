import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, title, subtitle, children, ...props }, ref) => (
    <section
      ref={ref}
      className={cn("py-12 md:py-20", className)}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-10 text-center md:mb-14">
          {title && (
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-3 text-lg text-foreground-muted md:mt-4">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  )
);
Section.displayName = "Section";

export { Section };
