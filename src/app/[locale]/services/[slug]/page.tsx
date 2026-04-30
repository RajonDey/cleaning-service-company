import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link as IntlLink } from "@/i18n/routing";
import {
  Check,
  ClipboardList,
  Info,
  Star,
  Lightbulb,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ServiceCard } from "@/components/sections/service-card";
import { DownloadChecklistButton } from "@/components/ui/download-checklist-button";
import {
  SERVICE_CONFIG,
  SERVICE_SLUGS,
  getServiceHref,
  type ServiceSlug,
} from "@/lib/services";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import { imageConfig } from "@/config/images";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params;
  if (!SERVICE_SLUGS.includes(slug as ServiceSlug)) return {};
  const t = await getTranslations({ locale, namespace: "services" });
  const { messageKey } = SERVICE_CONFIG[slug as ServiceSlug];
  const serviceName = t(`${messageKey}.name`);
  return buildMetadata("serviceDetail", locale as "en" | "sv", {
    serviceName,
    path: `/services/${slug}`,
  });
}

function CheckList({
  items,
  title,
  icon: Icon = Check,
}: {
  items: string[];
  title?: string;
  icon?: typeof Check;
}) {
  return (
    <div>
      {title && (
        <h3 className="mb-3 font-heading text-base font-semibold text-foreground">
          {title}
        </h3>
      )}
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <Icon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />
            <span className="text-sm text-foreground-muted">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type StructuredItem = { title: string; desc: string };

function safeArray<T>(raw: unknown): T[] {
  return Array.isArray(raw) ? (raw as T[]) : [];
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug, locale } = await params;

  if (!SERVICE_SLUGS.includes(slug as ServiceSlug)) {
    notFound();
  }

  const currentSlug = slug as ServiceSlug;
  const { icon: Icon, messageKey, image } = SERVICE_CONFIG[currentSlug];
  const t = await getTranslations("services");
  const tDetail = await getTranslations("serviceDetail");
  const tCommon = await getTranslations("common");
  const tNav = await getTranslations("nav");

  const serviceName = t(`${messageKey}.name`);
  const intro = tDetail(`${messageKey}.intro`);
  const pricing = tDetail(`${messageKey}.pricing`);

  const isMoveOut = currentSlug === "move-out-cleaning";
  const isHome = currentSlug === "home-cleaning";
  const isWindowCleaning = currentSlug === "window-cleaning";
  const hasSubSections = isMoveOut || isHome;

  const hasWhyChooseUs = tDetail.has(`${messageKey}.whyChooseUs`);
  const hasHowItWorks = tDetail.has(`${messageKey}.howItWorks`);
  const hasRutSection = tDetail.has(`${messageKey}.rutSection`);
  const hasTip = tDetail.has(`${messageKey}.tip`);
  const hasCustomerChecklist =
    isMoveOut && tDetail.has(`${messageKey}.customerChecklist`);
  const hasPromise = isMoveOut && tDetail.has(`${messageKey}.promise`);
  const hasIncludesIntro = tDetail.has(`${messageKey}.includesIntro`);
  const hasIncludes = tDetail.has(`${messageKey}.includes`);

  const whyChooseUs: StructuredItem[] = hasWhyChooseUs
    ? safeArray(tDetail.raw(`${messageKey}.whyChooseUs`))
    : [];

  const howItWorks: StructuredItem[] = hasHowItWorks
    ? safeArray(tDetail.raw(`${messageKey}.howItWorks`))
    : [];

  const customerChecklist: StructuredItem[] = hasCustomerChecklist
    ? safeArray(tDetail.raw(`${messageKey}.customerChecklist`))
    : [];

  const includesList: string[] = hasIncludes
    ? safeArray(tDetail.raw(`${messageKey}.includes`))
    : [];

  const sectionTitleKeys: Record<string, string> = {
    includesAllRooms: "includesSectionAllRooms",
    includesBathroom: "includesSectionBathroom",
    includesLaundry: "includesSectionLaundry",
    includesKitchen: "includesSectionKitchen",
    includesWindows: "includesSectionWindows",
  };

  let roomSections: { title: string; items: string[] }[] = [];
  if (hasSubSections) {
    const sectionKeys = [
      "includesAllRooms",
      "includesBathroom",
      "includesLaundry",
      "includesKitchen",
      "includesWindows",
    ] as const;
    for (const key of sectionKeys) {
      if (tDetail.has(`${messageKey}.${key}`)) {
        const raw = tDetail.raw(`${messageKey}.${key}`);
        if (Array.isArray(raw)) {
          const titleKey = sectionTitleKeys[key];
          roomSections.push({
            title: tDetail.has(titleKey) ? tDetail(titleKey) : key,
            items: raw as string[],
          });
        }
      }
    }
  }

  const relatedSlugs = SERVICE_SLUGS.filter((s) => s !== currentSlug).slice(
    0,
    3
  );

  return (
    <>
      <Section className="bg-background">
        <Container>
          <div className="mx-auto max-w-3xl">
            {image && (
              <div className="relative mb-8 aspect-21/9 w-full overflow-hidden rounded-card">
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 896px"
                  priority
                />
              </div>
            )}

            <nav
              className="mb-6 text-sm text-foreground-muted"
              aria-label="Breadcrumb"
            >
              <IntlLink href="/" className="hover:text-primary">
                {tNav("home")}
              </IntlLink>
              <span className="mx-2">/</span>
              <IntlLink href="/services" className="hover:text-primary">
                {tNav("services")}
              </IntlLink>
              <span className="mx-2">/</span>
              <span className="text-foreground">{serviceName}</span>
            </nav>

            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-button bg-primary-light text-primary">
                <Icon className="h-7 w-7" />
              </div>
              <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                {serviceName}
              </h1>
            </div>

            <div className="mb-10 space-y-4 text-lg leading-relaxed text-foreground-muted">
              {intro.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {isWindowCleaning && (
              <div className="mb-10">
                <h2 className="mb-2 font-heading text-xl font-semibold text-foreground md:text-2xl">
                  {tDetail("windowBeforeAfterTitle")}
                </h2>
                <p className="mb-4 max-w-2xl text-sm leading-relaxed text-foreground-muted md:text-base">
                  {tDetail("windowBeforeAfterDescription")}
                </p>
                <figure className="overflow-hidden rounded-card border border-border bg-background-muted shadow-card">
                  <div className="relative aspect-[16/10] w-full md:aspect-[2/1]">
                    <Image
                      src={imageConfig.windowCleaningBeforeAfter}
                      alt={tDetail("windowBeforeAfterAlt")}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 896px"
                    />
                  </div>
                </figure>
              </div>
            )}

            {/* Why choose us */}
            {whyChooseUs.length > 0 && (
              <div className="mb-10">
                <h2 className="mb-6 font-heading text-xl font-semibold text-foreground">
                  {tDetail("whyChooseUsTitle")}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {whyChooseUs.map((item, i) => (
                    <div
                      key={i}
                      className="rounded-card border border-border bg-background-muted p-5"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <Star className="h-4.5 w-4.5 shrink-0 text-primary" />
                        <h3 className="font-heading text-sm font-semibold text-foreground">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground-muted">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Includes intro (move-out) */}
            {hasIncludesIntro && (
              <p className="mb-4 text-sm font-medium text-foreground-muted">
                {tDetail(`${messageKey}.includesIntro`)}
              </p>
            )}

            {/* Includes — services with room sub-sections */}
            {hasSubSections && roomSections.length > 0 && (
              <div className="mb-10 space-y-6 rounded-card border border-border bg-background-muted p-6">
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  {tDetail("whatsIncluded")}
                </h2>
                {roomSections.map(({ title, items }) => (
                  <CheckList key={title} items={items} title={title} />
                ))}
              </div>
            )}

            {/* Includes — flat list for other services */}
            {!hasSubSections && includesList.length > 0 && (
              <div className="mb-10 rounded-card border border-border bg-background-muted p-6">
                <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">
                  {tDetail("whatsIncluded")}
                </h2>
                <CheckList items={includesList} />
              </div>
            )}

            {/* How it works */}
            {howItWorks.length > 0 && (
              <div className="mb-10">
                <h2 className="mb-6 font-heading text-xl font-semibold text-foreground">
                  {tDetail("howItWorksTitle")}
                </h2>
                <div className="space-y-4">
                  {howItWorks.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-heading text-sm font-semibold text-foreground">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-foreground-muted">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer checklist (move-out) */}
            {customerChecklist.length > 0 && (
              <div className="mb-10 rounded-card border border-secondary/20 bg-secondary/5 p-6">
                <h2 className="mb-6 flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                  <ClipboardList className="h-5 w-5 text-secondary" />
                  {tDetail("customerChecklistTitle")}
                </h2>
                <div className="space-y-5">
                  {customerChecklist.map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-xs font-bold text-secondary">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-heading text-sm font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-foreground-muted">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Promise (move-out) */}
            {hasPromise && (
              <div className="mb-10 flex gap-4 rounded-card border border-primary/20 bg-primary-light/30 p-6">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h3 className="mb-2 font-heading text-sm font-semibold text-foreground">
                    {tDetail("promiseTitle")}
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground-muted">
                    {tDetail(`${messageKey}.promise`)}
                  </p>
                </div>
              </div>
            )}

            {/* PDF download (move-out) */}
            {isMoveOut && (
              <div className="mb-10">
                <DownloadChecklistButton locale={locale}>
                  {tDetail("downloadChecklist")}
                </DownloadChecklistButton>
              </div>
            )}

            {/* RUT section */}
            {hasRutSection && (
              <div className="mb-10 flex gap-4 rounded-card border border-primary/20 bg-primary-light/30 p-6">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h3 className="mb-2 font-heading text-sm font-semibold text-foreground">
                    {tDetail("rutTitle")}
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground-muted">
                    {tDetail(`${messageKey}.rutSection`)}
                  </p>
                </div>
              </div>
            )}

            {/* Tip (window cleaning) */}
            {hasTip && (
              <div className="mb-10 flex gap-4 rounded-card border border-secondary/20 bg-secondary/5 p-6">
                <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                <p className="text-sm leading-relaxed text-foreground-muted">
                  <span className="font-semibold text-foreground">Tips: </span>
                  {tDetail(`${messageKey}.tip`)}
                </p>
              </div>
            )}

            {/* Pricing */}
            <div className="mb-10 rounded-card border border-secondary/20 bg-secondary/5 p-6">
              <h3 className="mb-1 font-heading text-sm font-semibold text-foreground">
                {tDetail("pricingHint")}
              </h3>
              <p className="text-lg font-medium text-secondary-hover">
                {pricing}
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <IntlLink href="/book">{tDetail("bookThisService")}</IntlLink>
              </Button>
              <Button asChild size="lg" variant="outline">
                <IntlLink href="/contact">{tDetail("getQuote")}</IntlLink>
              </Button>
              <a
                href={siteConfig.contact.phoneHref}
                className="flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                {siteConfig.contact.phone}
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
        </Container>
      </Section>

      <Section
        title={tDetail("relatedServices")}
        className="bg-background-muted"
      >
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedSlugs.map((relSlug) => {
              const rel = SERVICE_CONFIG[relSlug];
              return (
                <ServiceCard
                  key={relSlug}
                  title={t(`${rel.messageKey}.name`)}
                  description={t(`${rel.messageKey}.description`)}
                  href={getServiceHref(relSlug)}
                  icon={rel.icon}
                  image={rel.image}
                  learnMoreText={tCommon("learnMore")}
                />
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}
