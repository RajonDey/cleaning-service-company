import { getTranslations } from "next-intl/server";
import { Shield, CreditCard, BadgeCheck, Phone } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { ContactBlock } from "@/components/sections/contact-block";
import { BookingForm } from "@/components/forms/booking-form";
import { ServiceCalculator } from "@/components/forms/service-calculator";
import { buildMetadata } from "@/lib/metadata";
import { slugToServiceType } from "@/lib/services";
import { formatPostalCode, isValidPostalCode } from "@/lib/postal-code";
import { siteConfig } from "@/config/site";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ postcode?: string; service?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata("book", locale as "en" | "sv");
}

export default async function BookPage({ params, searchParams }: Props) {
  const t = await getTranslations("book");
  const { postcode: rawPostcode, service: serviceSlug } = await searchParams;

  const initialPostcode =
    rawPostcode && isValidPostalCode(rawPostcode)
      ? formatPostalCode(rawPostcode)
      : undefined;
  const initialService = serviceSlug ? slugToServiceType(serviceSlug) ?? undefined : undefined;

  const trustItems = [
    { icon: CreditCard, title: t("trustNoPayment"), desc: t("trustNoPaymentDesc") },
    { icon: Shield, title: t("trustRut"), desc: t("trustRutDesc") },
    { icon: BadgeCheck, title: t("trustGuarantee"), desc: t("trustGuaranteeDesc") },
    { icon: Phone, title: t("trustPhone"), desc: siteConfig.contact.phone },
  ];

  return (
    <Section title={t("title")} subtitle={t("subtitle")} className="bg-background">
      <Container>
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_380px]">
          {/* Main form */}
          <div>
            <BookingForm
              initialPostcode={initialPostcode}
              initialService={initialService}
            />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-card border border-border bg-background-muted p-6">
              <ServiceCalculator
                serviceType={initialService ?? "home_cleaning"}
                homeSize="3-4"
              />
            </div>

            <div className="space-y-4 rounded-card border border-border bg-background p-6">
              {trustItems.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-foreground-muted">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">
                {t("contactToBook")}
              </h3>
              <ContactBlock className="flex-col items-center gap-3" />
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
