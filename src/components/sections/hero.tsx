import { Link as IntlLink } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

export interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref?: string;
  className?: string;
}

export function Hero({
  title,
  subtitle,
  ctaText,
  ctaHref = "/book",
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-background-muted py-16 md:py-24",
        className
      )}
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-lg text-foreground-muted md:text-xl">
            {subtitle}
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <IntlLink href={ctaHref}>{ctaText}</IntlLink>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
