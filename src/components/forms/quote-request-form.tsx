"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Link as IntlLink } from "@/i18n/routing";
import {
  quoteRequestSchema,
  type QuoteRequestParsed,
} from "@/lib/quote-request-schema";
import { SERVICE_TYPES } from "@/lib/booking-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const SERVICE_OPTIONS: { value: (typeof SERVICE_TYPES)[number]; key: string }[] =
  [
    { value: "home_cleaning", key: "homeCleaning" },
    { value: "deep_cleaning", key: "deepCleaning" },
    { value: "window_cleaning", key: "windowCleaning" },
    { value: "move_out", key: "moveOutCleaning" },
    { value: "office_cleaning", key: "officeCleaning" },
  ];

const heroGlassField =
  "border-white/35 bg-white/88 text-foreground shadow-sm placeholder:text-foreground-muted focus:border-white/50 focus:ring-white/40";

export function QuoteRequestForm({
  className,
  variant = "card",
}: {
  className?: string;
  /** Frosted panel over the hero image (home). */
  variant?: "card" | "heroGlass";
}) {
  const isGlass = variant === "heroGlass";
  const t = useTranslations("home.quoteForm");
  const tServices = useTranslations("services");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      // Placeholder option uses value ""; validated on submit.
      serviceType: "" as QuoteRequestParsed["serviceType"],
      squareMeters: "" as unknown as QuoteRequestParsed["squareMeters"],
      city: "",
      phone: "",
      email: "",
      marketingConsent: false,
    },
  });

  const onSubmit = async (data: QuoteRequestParsed) => {
    setStatus("idle");
    setSubmitError(null);
    try {
      const res = await fetch("/api/quote-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setSubmitError(json.error ?? t("error"));
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setSubmitError(t("error"));
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        className={cn(
          "rounded-card p-8 text-center md:p-10",
          isGlass
            ? "border border-white/25 bg-white/10 shadow-2xl backdrop-blur-xl"
            : "border border-primary/20 bg-background shadow-card",
          className
        )}
      >
        <CheckCircle2
          className={cn(
            "mx-auto mb-4 h-12 w-12",
            isGlass ? "text-secondary" : "text-primary"
          )}
        />
        <p
          className={cn(
            "text-lg font-semibold",
            isGlass ? "text-white drop-shadow-sm" : "text-foreground"
          )}
        >
          {t("success")}
        </p>
        <p
          className={cn(
            "mt-2 text-sm",
            isGlass ? "text-white/85" : "text-foreground-muted"
          )}
        >
          {t("successHint")}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-card p-6 md:p-8",
        isGlass
          ? "border border-white/25 bg-white/10 shadow-2xl backdrop-blur-xl supports-backdrop-filter:bg-white/8"
          : "border border-border bg-background shadow-card",
        className
      )}
    >
      <h2
        className={cn(
          "mb-6 font-heading text-xl font-bold md:text-2xl",
          isGlass ? "text-white drop-shadow-sm" : "text-foreground"
        )}
      >
        {t("title")}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {status === "error" && submitError && (
          <div
            className={cn(
              "rounded-button p-3 text-sm",
              isGlass
                ? "border border-red-300/40 bg-red-950/35 text-red-100 backdrop-blur-sm"
                : "bg-error/10 text-error"
            )}
          >
            {submitError}
          </div>
        )}

        <div>
          <Select
            id="quote-service"
            {...register("serviceType")}
            className={cn(
              errors.serviceType && "border-error",
              isGlass && heroGlassField
            )}
            aria-invalid={!!errors.serviceType}
          >
            <option value="" disabled>
              {t("servicePlaceholder")}
            </option>
            {SERVICE_OPTIONS.map(({ value, key }) => (
              <option key={value} value={value}>
                {tServices(`${key}.name`)}
              </option>
            ))}
          </Select>
          {errors.serviceType && (
            <p
              className={cn(
                "mt-1 text-sm",
                isGlass ? "text-red-200" : "text-error"
              )}
            >
              {errors.serviceType.message}
            </p>
          )}
        </div>

        <div>
          <Input
            id="quote-sqm"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder={t("squareMetersPlaceholder")}
            {...register("squareMeters")}
            className={cn(
              errors.squareMeters && "border-error",
              isGlass && heroGlassField
            )}
            aria-invalid={!!errors.squareMeters}
          />
          {errors.squareMeters && (
            <p
              className={cn(
                "mt-1 text-sm",
                isGlass ? "text-red-200" : "text-error"
              )}
            >
              {errors.squareMeters.message}
            </p>
          )}
        </div>

        <div>
          <Input
            id="quote-city"
            type="text"
            autoComplete="address-level2"
            placeholder={t("cityPlaceholder")}
            {...register("city")}
            className={cn(errors.city && "border-error", isGlass && heroGlassField)}
            aria-invalid={!!errors.city}
          />
          {errors.city && (
            <p
              className={cn(
                "mt-1 text-sm",
                isGlass ? "text-red-200" : "text-error"
              )}
            >
              {errors.city.message}
            </p>
          )}
        </div>

        <div>
          <Input
            id="quote-phone"
            type="tel"
            autoComplete="tel"
            placeholder={t("phonePlaceholder")}
            {...register("phone")}
            className={cn(
              errors.phone && "border-error",
              isGlass && heroGlassField
            )}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <p
              className={cn(
                "mt-1 text-sm",
                isGlass ? "text-red-200" : "text-error"
              )}
            >
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <Input
            id="quote-email"
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            {...register("email")}
            className={cn(
              errors.email && "border-error",
              isGlass && heroGlassField
            )}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p
              className={cn(
                "mt-1 text-sm",
                isGlass ? "text-red-200" : "text-error"
              )}
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <label
          className={cn(
            "flex cursor-pointer items-start gap-3 text-sm leading-snug",
            isGlass ? "text-white/90" : "text-foreground"
          )}
        >
          <input
            type="checkbox"
            {...register("marketingConsent")}
            className="mt-0.5 rounded accent-secondary"
          />
          <span>
            {t.rich("consent", {
              policy: (chunks) => (
                <IntlLink
                  href="/privacy"
                  className="font-medium text-secondary underline-offset-2 hover:underline"
                >
                  {chunks}
                </IntlLink>
              ),
            })}
          </span>
        </label>
        {errors.marketingConsent && (
          <p
            className={cn("text-sm", isGlass ? "text-red-200" : "text-error")}
          >
            {errors.marketingConsent.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="w-full bg-secondary text-white hover:bg-secondary-hover"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("submitting")}
            </>
          ) : (
            t("submit")
          )}
        </Button>
      </form>
    </div>
  );
}
