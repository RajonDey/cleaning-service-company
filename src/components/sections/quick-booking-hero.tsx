"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Shield, BadgeCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import { imageConfig } from "@/config/images";
import {
  formatPostalCodeInput,
  isValidPostalCode,
  normalizePostalCode,
} from "@/lib/postal-code";
import {
  SERVICE_SLUGS,
  SERVICE_CONFIG,
  type ServiceSlug,
} from "@/lib/services";

export interface QuickBookingHeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  postalCodeLabel: string;
  postalCodePlaceholder: string;
  serviceLabel: string;
  invalidPostalCode: string;
  rutBadge: string;
  guaranteeBadge: string;
  className?: string;
}

export function QuickBookingHero({
  title,
  subtitle,
  ctaText,
  postalCodeLabel,
  postalCodePlaceholder,
  serviceLabel,
  invalidPostalCode,
  rutBadge,
  guaranteeBadge,
  className,
}: QuickBookingHeroProps) {
  const router = useRouter();
  const tServices = useTranslations("services");

  const [postalCode, setPostalCode] = useState("");
  const [service, setService] = useState<ServiceSlug>("home-cleaning");
  const [error, setError] = useState<string | null>(null);

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPostalCodeInput(e.target.value);
    setPostalCode(formatted);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizePostalCode(postalCode);
    if (normalized.length > 0 && !isValidPostalCode(postalCode)) {
      setError(invalidPostalCode);
      return;
    }
    setError(null);
    const params = new URLSearchParams();
    if (normalized) params.set("postcode", normalized);
    params.set("service", service);
    router.push(`/book?${params.toString()}`);
  };

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
          className="object-cover"
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
          {/* Left — headline and badges */}
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

          {/* Right — glassmorphism booking card */}
          <div className="mx-auto w-full max-w-md lg:mx-0 lg:ml-auto">
            <form
              onSubmit={handleSubmit}
              className="rounded-card border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md md:p-8"
            >
              <h2 className="mb-6 font-heading text-xl font-bold text-white">
                {ctaText}
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="quick-postcode"
                    className="mb-1.5 block text-sm font-medium text-white/90"
                  >
                    {postalCodeLabel}
                  </label>
                  <Input
                    id="quick-postcode"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder={postalCodePlaceholder}
                    value={postalCode}
                    onChange={handlePostalCodeChange}
                    className={cn(
                      "border-white/30 bg-white/90 text-foreground placeholder:text-foreground-muted",
                      error && "border-error focus:ring-error"
                    )}
                    aria-invalid={!!error}
                    aria-describedby={error ? "postcode-error" : undefined}
                  />
                  {error && (
                    <p
                      id="postcode-error"
                      className="mt-1 text-sm text-red-200"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="quick-service"
                    className="mb-1.5 block text-sm font-medium text-white/90"
                  >
                    {serviceLabel}
                  </label>
                  <Select
                    id="quick-service"
                    value={service}
                    onChange={(e) => setService(e.target.value as ServiceSlug)}
                    className="border-white/30 bg-white/90 text-foreground"
                  >
                    {SERVICE_SLUGS.map((slug) => (
                      <option key={slug} value={slug}>
                        {tServices(`${SERVICE_CONFIG[slug].messageKey}.name`)}
                      </option>
                    ))}
                  </Select>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="mt-2 w-full bg-secondary text-white hover:bg-secondary-hover"
                >
                  {ctaText}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <p className="mt-4 text-center text-xs text-white/60">
                No payment required — we confirm by phone
              </p>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
