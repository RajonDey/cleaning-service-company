"use client";

import Image from "next/image";
import { Shield, BadgeCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import { imageConfig } from "@/config/images";
import { QuoteRequestForm } from "@/components/forms/quote-request-form";

export interface QuickBookingHeroProps {
  title: string;
  subtitle: string;
  rutBadge: string;
  guaranteeBadge: string;
  className?: string;
}

export function QuickBookingHero({
  title,
  subtitle,
  rutBadge,
  guaranteeBadge,
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
          className="absolute inset-0 bg-linear-to-r from-foreground/70 via-foreground/50 to-foreground/30"
          aria-hidden
        />
      </div>

      <Container className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-md md:text-5xl lg:text-[3.5rem]">
              {title}
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/85 md:text-xl">
              {subtitle}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <Shield className="h-4 w-4 text-secondary" />
                {rutBadge}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <BadgeCheck className="h-4 w-4 text-secondary" />
                {guaranteeBadge}
              </span>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md lg:mx-0 lg:ml-auto">
            <QuoteRequestForm variant="heroGlass" />
          </div>
        </div>
      </Container>
    </section>
  );
}
