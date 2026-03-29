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

export function QuoteRequestForm({ className }: { className?: string }) {
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
          "rounded-card border border-primary/20 bg-background p-8 text-center shadow-card md:p-10",
          className
        )}
      >
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-primary" />
        <p className="text-lg font-semibold text-foreground">{t("success")}</p>
        <p className="mt-2 text-sm text-foreground-muted">{t("successHint")}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-card border border-border bg-background p-6 shadow-card md:p-8",
        className
      )}
    >
      <h2 className="mb-6 font-heading text-xl font-bold text-foreground md:text-2xl">
        {t("title")}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {status === "error" && submitError && (
          <div className="rounded-button bg-error/10 p-3 text-sm text-error">
            {submitError}
          </div>
        )}

        <div>
          <Select
            id="quote-service"
            {...register("serviceType")}
            className={cn(errors.serviceType && "border-error")}
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
            <p className="mt-1 text-sm text-error">{errors.serviceType.message}</p>
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
            className={cn(errors.squareMeters && "border-error")}
            aria-invalid={!!errors.squareMeters}
          />
          {errors.squareMeters && (
            <p className="mt-1 text-sm text-error">{errors.squareMeters.message}</p>
          )}
        </div>

        <div>
          <Input
            id="quote-city"
            type="text"
            autoComplete="address-level2"
            placeholder={t("cityPlaceholder")}
            {...register("city")}
            className={cn(errors.city && "border-error")}
            aria-invalid={!!errors.city}
          />
          {errors.city && (
            <p className="mt-1 text-sm text-error">{errors.city.message}</p>
          )}
        </div>

        <div>
          <Input
            id="quote-phone"
            type="tel"
            autoComplete="tel"
            placeholder={t("phonePlaceholder")}
            {...register("phone")}
            className={cn(errors.phone && "border-error")}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-error">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Input
            id="quote-email"
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            {...register("email")}
            className={cn(errors.email && "border-error")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-error">{errors.email.message}</p>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-foreground">
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
          <p className="text-sm text-error">{errors.marketingConsent.message}</p>
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
