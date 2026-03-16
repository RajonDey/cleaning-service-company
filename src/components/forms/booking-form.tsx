"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import {
  bookingSchema,
  SERVICE_TYPES,
  type BookingSchema,
} from "@/lib/booking-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const SERVICE_OPTIONS: { value: (typeof SERVICE_TYPES)[number]; key: string }[] = [
  { value: "home_cleaning", key: "homeCleaning" },
  { value: "deep_cleaning", key: "deepCleaning" },
  { value: "window_cleaning", key: "windowCleaning" },
  { value: "move_out", key: "moveOutCleaning" },
  { value: "office_cleaning", key: "officeCleaning" },
];

const TIME_OPTIONS = Array.from({ length: 21 }, (_, i) => {
  const hour = 8 + Math.floor(i / 2);
  const min = (i % 2) * 30;
  return `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
});

export function BookingForm({
  initialPostcode,
  initialService,
}: {
  initialPostcode?: string;
  initialService?: string;
} = {}) {
  const t = useTranslations("book");
  const tServices = useTranslations("services");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const initialServiceType =
    initialService && SERVICE_TYPES.includes(initialService as (typeof SERVICE_TYPES)[number])
      ? (initialService as (typeof SERVICE_TYPES)[number])
      : "home_cleaning";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingSchema>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceType: initialServiceType,
      homeSize: "3-4",
      postcode: initialPostcode ?? "",
      sprojs: false,
      fonsterbleck: false,
      fonsterkarm: false,
      flexibleDate: false,
    },
  });

  const serviceType = watch("serviceType");
  const isWindowCleaning = serviceType === "window_cleaning";

  const onSubmit = async (data: BookingSchema) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to submit");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-card border border-primary/20 bg-primary-light/30 p-10 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-primary" />
        <p className="text-xl font-semibold text-foreground">{t("success")}</p>
        <p className="mt-3 text-sm text-foreground-muted">{t("successNext")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {status === "error" && (
        <div className="rounded-button bg-error/10 p-4 text-sm text-error">
          {t("error")}
        </div>
      )}

      {/* Section 1: Service details */}
      <fieldset className="space-y-5 rounded-card border border-border bg-background p-6">
        <legend className="px-2 font-heading text-sm font-semibold uppercase tracking-wider text-primary">
          {t("sectionService")}
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="serviceType">{t("serviceType")}</Label>
            <Select id="serviceType" {...register("serviceType")} className="mt-2">
              {SERVICE_OPTIONS.map(({ value, key }) => (
                <option key={value} value={value}>
                  {tServices(`${key}.name`)}
                </option>
              ))}
            </Select>
            {errors.serviceType && <p className="mt-1 text-sm text-error">{errors.serviceType.message}</p>}
          </div>
          <div>
            <Label htmlFor="homeSize">{t("homeSize")}</Label>
            <Select id="homeSize" {...register("homeSize")} className="mt-2">
              <option value="1-2">{t("homeSizeOptions.1-2")}</option>
              <option value="3-4">{t("homeSizeOptions.3-4")}</option>
              <option value="5+">{t("homeSizeOptions.5+")}</option>
            </Select>
            {errors.homeSize && <p className="mt-1 text-sm text-error">{errors.homeSize.message}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="date">{t("date")}</Label>
            <Input id="date" type="date" {...register("date")} className="mt-2" />
            {errors.date && <p className="mt-1 text-sm text-error">{errors.date.message}</p>}
          </div>
          <div>
            <Label htmlFor="time">{t("time")}</Label>
            <Select id="time" {...register("time")} className="mt-2">
              {TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </Select>
            {errors.time && <p className="mt-1 text-sm text-error">{errors.time.message}</p>}
          </div>
        </div>

        {isWindowCleaning && (
          <div className="space-y-4 rounded-button border border-secondary/20 bg-secondary/5 p-4">
            <h3 className="font-heading text-sm font-semibold text-foreground">{t("windowExtras")}</h3>
            <div>
              <Label htmlFor="windowCount">{t("windowCount")}</Label>
              <Input id="windowCount" type="number" min={1} {...register("windowCount", { valueAsNumber: true })} className="mt-2" />
            </div>
            <div className="flex flex-wrap gap-4">
              {(["sprojs", "fonsterbleck", "fonsterkarm", "flexibleDate"] as const).map((field) => (
                <label key={field} className="flex items-center gap-2">
                  <input type="checkbox" {...register(field)} className="rounded accent-primary" />
                  <span className="text-sm">{t(field)}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </fieldset>

      {/* Section 2: Personal info */}
      <fieldset className="space-y-5 rounded-card border border-border bg-background p-6">
        <legend className="px-2 font-heading text-sm font-semibold uppercase tracking-wider text-primary">
          {t("sectionPersonal")}
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">{t("name")}</Label>
            <Input id="name" {...register("name")} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="phone">{t("phone")}</Label>
            <Input id="phone" type="tel" {...register("phone")} className="mt-2" />
            {errors.phone && <p className="mt-1 text-sm text-error">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="email">{t("email")}</Label>
            <Input id="email" type="email" {...register("email")} className="mt-2" />
            {errors.email && <p className="mt-1 text-sm text-error">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="personnummer">
              {t("personnummer")}
            </Label>
            <Input id="personnummer" {...register("personnummer")} className="mt-2" placeholder="YYYYMMDD-XXXX" />
            <p className="mt-1 text-xs text-foreground-muted">{t("personnummerHint")}</p>
          </div>
        </div>

        <div>
          <Label htmlFor="address">{t("address")}</Label>
          <Input id="address" {...register("address")} className="mt-2" />
          {errors.address && <p className="mt-1 text-sm text-error">{errors.address.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="postcode">{t("postcode")}</Label>
            <Input id="postcode" {...register("postcode")} className="mt-2" placeholder="123 45" />
            {errors.postcode && <p className="mt-1 text-sm text-error">{errors.postcode.message}</p>}
          </div>
        </div>
      </fieldset>

      {/* Section 3: Extra details */}
      <fieldset className="space-y-5 rounded-card border border-border bg-background p-6">
        <legend className="px-2 font-heading text-sm font-semibold uppercase tracking-wider text-primary">
          {t("sectionExtra")}
        </legend>
        <div>
          <Label htmlFor="instructions">{t("instructions")}</Label>
          <Textarea id="instructions" {...register("specialInstructions")} className="mt-2" rows={3} />
        </div>
      </fieldset>

      <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("submitting")}
          </>
        ) : (
          <>
            {t("submit")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
