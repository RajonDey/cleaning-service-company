import { getTranslations } from "next-intl/server";
import {
  Shield, Sliders, Zap, ClipboardList, CalendarCheck, Sparkles,
  Star, Phone, MessageCircle, Mail, ArrowRight,
} from "lucide-react";
import { QuickBookingHero } from "@/components/sections/quick-booking-hero";
import { ServiceCard } from "@/components/sections/service-card";
import { TrustBadge } from "@/components/sections/trust-badge";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Link as IntlLink } from "@/i18n/routing";
import { SERVICE_CONFIG, getServiceHref } from "@/lib/services";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata("home", locale as "en" | "sv");
}

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
      ))}
    </div>
  );
}

export default async function HomePage() {
  const t = await getTranslations("home");
  const tServices = await getTranslations("services");
  const tTrust = await getTranslations("trust");
  const tCommon = await getTranslations("common");

  return (
    <>
      <QuickBookingHero
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        ctaText={t("cta")}
        postalCodeLabel={t("quickBooking.postalCodeLabel")}
        postalCodePlaceholder={t("quickBooking.postalCodePlaceholder")}
        serviceLabel={t("quickBooking.serviceLabel")}
        invalidPostalCode={t("quickBooking.invalidPostalCode")}
        rutBadge={t("hero.rutBadge")}
        guaranteeBadge={t("hero.guaranteeBadge")}
      />

      {/* Stats bar */}
      <div className="border-b border-border bg-background py-8">
        <Container>
          <div className="grid grid-cols-3 divide-x divide-border text-center">
            {[
              { value: t("statsCustomers"), label: t("statsCustomersLabel") },
              { value: t("statsYears"), label: t("statsYearsLabel") },
              { value: t("statsServices"), label: t("statsServicesLabel") },
            ].map(({ value, label }) => (
              <div key={label} className="px-4">
                <p className="font-heading text-2xl font-bold text-primary md:text-3xl">
                  {value}
                </p>
                <p className="mt-1 text-sm text-foreground-muted">{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Services */}
      <Section
        title={t("servicesTitle")}
        subtitle={t("servicesSubtitle")}
        className="bg-background"
      >
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(SERVICE_CONFIG).map(([slug, { icon, messageKey, image }]) => (
              <ServiceCard
                key={slug}
                title={tServices(`${messageKey}.name`)}
                description={tServices(`${messageKey}.description`)}
                href={getServiceHref(slug as keyof typeof SERVICE_CONFIG)}
                icon={icon}
                image={image}
                learnMoreText={tCommon("learnMore")}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* How it works */}
      <Section
        title={t("howItWorksTitle")}
        className="bg-background-muted"
      >
        <Container>
          <div className="relative mx-auto max-w-4xl">
            <div className="absolute left-1/2 top-8 hidden h-0.5 w-[60%] -translate-x-1/2 bg-linear-to-r from-primary/20 via-primary/40 to-primary/20 md:block" />
            <div className="grid gap-10 md:grid-cols-3 md:gap-8">
              {[
                { icon: ClipboardList, step: "1", titleKey: "step1Title", descKey: "step1Desc" },
                { icon: CalendarCheck, step: "2", titleKey: "step2Title", descKey: "step2Desc" },
                { icon: Sparkles, step: "3", titleKey: "step3Title", descKey: "step3Desc" },
              ].map(({ icon: Icon, step, titleKey, descKey }) => (
                <div key={step} className="relative text-center">
                  <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                    <Icon className="h-7 w-7" />
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
                      {step}
                    </span>
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                    {t(titleKey)}
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground-muted">
                    {t(descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 text-center">
            <Button asChild size="lg">
              <IntlLink href="/book">
                {tCommon("book")}
                <ArrowRight className="ml-1 h-4 w-4" />
              </IntlLink>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Trust values */}
      <Section
        title={t("trustTitle")}
        className="bg-background"
      >
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            <TrustBadge
              title={tTrust("trustworthy")}
              description={tTrust("trustworthyDesc")}
              icon={Shield}
            />
            <TrustBadge
              title={tTrust("flexible")}
              description={tTrust("flexibleDesc")}
              icon={Sliders}
            />
            <TrustBadge
              title={tTrust("easy")}
              description={tTrust("easyDesc")}
              icon={Zap}
            />
          </div>
        </Container>
      </Section>

      {/* Testimonials */}
      <Section
        title={t("testimonialTitle")}
        className="bg-background-muted"
      >
        <Container>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {[
              { quoteKey: "testimonial1Quote", authorKey: "testimonial1Author", locationKey: "testimonial1Location" },
              { quoteKey: "testimonial2Quote", authorKey: "testimonial2Author", locationKey: "testimonial2Location" },
            ].map(({ quoteKey, authorKey, locationKey }) => (
              <div
                key={quoteKey}
                className="rounded-card border border-border bg-background p-8 shadow-card"
              >
                <Stars />
                <blockquote className="mt-4 text-lg font-medium leading-relaxed text-foreground">
                  &ldquo;{t(quoteKey)}&rdquo;
                </blockquote>
                <p className="mt-4 text-sm font-medium text-foreground-muted">
                  {t(authorKey)}, {t(locationKey)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA section */}
      <section className="bg-linear-to-br from-primary to-primary-hover py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
              {t("ctaSectionTitle")}
            </h2>
            <p className="mt-4 text-lg text-white/80">
              {t("ctaSectionSubtitle")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <IntlLink href="/book">
                  {tCommon("book")}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </IntlLink>
              </Button>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <a
                href={siteConfig.contact.phoneHref}
                className="flex flex-col items-center gap-2 rounded-card bg-white/10 p-5 backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <Phone className="h-6 w-6 text-white" />
                <span className="text-sm font-medium text-white">{t("ctaSectionPhone")}</span>
                <span className="text-xs text-white/70">{siteConfig.contact.phone}</span>
              </a>
              <a
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 rounded-card bg-white/10 p-5 backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <MessageCircle className="h-6 w-6 text-white" />
                <span className="text-sm font-medium text-white">{t("ctaSectionWhatsapp")}</span>
                <span className="text-xs text-white/70">WhatsApp</span>
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex flex-col items-center gap-2 rounded-card bg-white/10 p-5 backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <Mail className="h-6 w-6 text-white" />
                <span className="text-sm font-medium text-white">{t("ctaSectionEmail")}</span>
                <span className="text-xs text-white/70">{siteConfig.contact.email}</span>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
