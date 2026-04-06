"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { WINDOW_HELP_TYPES } from "@/lib/window-cleaning-fields";
import { cn } from "@/lib/utils";

export function WindowCleaningFieldsBlock({
  register,
  errors,
  variant = "default",
  title,
}: {
  /** Shared across booking + quote; avoid coupling to each form's full value type. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>;
  variant?: "default" | "heroGlass";
  /** Optional override (e.g. hero uses shorter title) */
  title?: string;
}) {
  const t = useTranslations("book");
  const heroGlassField =
    "border-white/35 bg-white/88 text-foreground shadow-sm placeholder:text-foreground-muted focus:border-white/50 focus:ring-white/40";
  const isGlass = variant === "heroGlass";

  return (
    <div
      className={cn(
        "space-y-4 rounded-button border p-4",
        isGlass
          ? "border-white/25 bg-white/10 backdrop-blur-sm"
          : "border-secondary/20 bg-secondary/5"
      )}
    >
      <h3
        className={cn(
          "font-heading text-sm font-semibold",
          isGlass ? "text-white drop-shadow-sm" : "text-foreground"
        )}
      >
        {title ?? t("windowExtras")}
      </h3>

      <fieldset>
        <legend
          className={cn(
            "mb-3 block text-sm font-medium",
            isGlass ? "text-white/95" : "text-foreground"
          )}
        >
          {t("windowHelpQuestion")}
        </legend>
        <div
          className={cn(
            "grid gap-3",
            isGlass
              ? "grid-cols-1"
              : "grid-cols-1 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-2"
          )}
        >
          {WINDOW_HELP_TYPES.map((value) => (
            <label
              key={value}
              className={cn(
                "flex cursor-pointer items-start gap-2.5 rounded-md border border-transparent py-1 text-sm leading-snug has-focus-visible:border-white/40 has-focus-visible:ring-2 has-focus-visible:ring-white/25",
                isGlass
                  ? "text-white/90"
                  : "text-foreground has-focus-visible:border-primary/30 has-focus-visible:ring-primary/20"
              )}
            >
              <input
                type="radio"
                value={value}
                {...register("windowHelpType")}
                className="mt-0.5 shrink-0 accent-primary"
              />
              <span className="min-w-0">{t(`windowHelp.${value}`)}</span>
            </label>
          ))}
        </div>
        {errors.windowHelpType && (
          <p
            className={cn(
              "mt-2 text-sm",
              isGlass ? "text-red-200" : "text-error"
            )}
          >
            {errors.windowHelpType.message as string}
          </p>
        )}
      </fieldset>

      <div
        className={cn(
          "grid gap-4",
          isGlass
            ? "grid-cols-1"
            : "grid-cols-1 sm:grid-cols-3 sm:items-stretch sm:gap-x-4"
        )}
      >
        {(
          [
            { id: "normalWindows" as const, labelKey: "normalWindows" as const },
            { id: "twoPaneWindows" as const, labelKey: "twoPaneWindows" as const },
            { id: "glassDoors" as const, labelKey: "glassDoors" as const },
          ] as const
        ).map(({ id, labelKey }) => (
          <div key={id} className="flex flex-col gap-2">
            <Label
              htmlFor={id}
              className={cn(
                "text-xs font-medium leading-snug sm:text-sm",
                isGlass && "text-white/90",
                !isGlass && "min-h-12 sm:min-h-16 md:min-h-14"
              )}
            >
              {t(labelKey)}
            </Label>
            <Input
              id={id}
              type="number"
              min={0}
              inputMode="numeric"
              {...register(id, { valueAsNumber: true })}
              className={cn(
                "mt-0 w-full",
                errors[id] && "border-error",
                isGlass && heroGlassField
              )}
            />
          </div>
        ))}
      </div>
      {(errors.normalWindows || errors.twoPaneWindows || errors.glassDoors) && (
        <p className={cn("text-sm", isGlass ? "text-red-200" : "text-error")}>
          {(errors.normalWindows?.message ||
            errors.twoPaneWindows?.message ||
            errors.glassDoors?.message) as string}
        </p>
      )}

      <label
        className={cn(
          "flex cursor-pointer items-center gap-2 text-sm",
          isGlass ? "text-white/90" : "text-foreground"
        )}
      >
        <input
          type="checkbox"
          {...register("sprojs")}
          className="rounded accent-primary"
        />
        <span>{t("sprojsQuestion")}</span>
      </label>

      <div>
        <p
          className={cn(
            "mb-2 text-sm font-medium",
            isGlass ? "text-white/95" : "text-foreground"
          )}
        >
          {t("tillvalTitle")}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {(["fonsterbleck", "fonsterkarm"] as const).map((field) => (
            <label
              key={field}
              className={cn(
                "flex cursor-pointer items-center gap-2 text-sm",
                isGlass ? "text-white/90" : "text-foreground"
              )}
            >
              <input
                type="checkbox"
                {...register(field)}
                className="rounded accent-primary"
              />
              <span>{t(field)}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
