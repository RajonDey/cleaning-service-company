"use client";

import Image from "next/image";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import { imageConfig } from "@/config/images";
import { QuoteRequestForm } from "@/components/forms/quote-request-form";

export interface QuickBookingHeroProps {
  title: string;
  subtitle: string;
  className?: string;
}

export function QuickBookingHero({
  title,
  subtitle,
  className,
}: QuickBookingHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden py-16 md:py-24 lg:py-28",
        className
      )}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={imageConfig.hero}
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-linear-to-b from-foreground/70 via-foreground/50 to-foreground/40 md:bg-linear-to-r md:from-foreground/75 md:via-foreground/50 md:to-foreground/35"
          aria-hidden
        />
      </div>

      <Container className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          <div className="max-w-xl text-center lg:text-left">
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-md md:text-5xl lg:text-[3.25rem] lg:leading-[1.12]">
              {title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/88 md:text-xl">
              {subtitle}
            </p>
          </div>

          <div className="mx-auto w-full max-w-lg lg:mx-0 lg:max-w-xl lg:justify-self-end">
            <QuoteRequestForm variant="heroGlass" />
          </div>
        </div>
      </Container>
    </section>
  );
}
