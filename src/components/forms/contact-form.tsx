"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

type ContactSchema = z.infer<typeof contactSchema>;

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactSchema) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to send");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-card border border-primary/20 bg-primary-light/30 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-primary" />
        <p className="text-lg font-medium text-foreground">
          {t("formSuccess")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {status === "error" && (
        <div className="rounded-button bg-error/10 p-4 text-sm text-error">
          {t("formError")}
        </div>
      )}

      <div>
        <Label htmlFor="name">{t("formName")}</Label>
        <Input id="name" {...register("name")} className="mt-2" />
        {errors.name && <p className="mt-1 text-sm text-error">{errors.name.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">{t("formEmail")}</Label>
          <Input id="email" type="email" {...register("email")} className="mt-2" />
          {errors.email && <p className="mt-1 text-sm text-error">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="phone">{t("formPhone")}</Label>
          <Input id="phone" type="tel" {...register("phone")} className="mt-2" />
        </div>
      </div>

      <div>
        <Label htmlFor="message">{t("formMessage")}</Label>
        <Textarea id="message" {...register("message")} className="mt-2" rows={5} />
        {errors.message && <p className="mt-1 text-sm text-error">{errors.message.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          t("formSubmit")
        )}
      </Button>
    </form>
  );
}
