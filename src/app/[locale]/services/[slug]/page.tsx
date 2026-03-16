import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link as IntlLink } from "@/i18n/routing";
import { Check, AlertTriangle, ClipboardList, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ServiceCard } from "@/components/sections/service-card";
import {
  SERVICE_CONFIG,
  SERVICE_SLUGS,
  getServiceHref,
  type ServiceSlug,
} from "@/lib/services";
import { buildMetadata } from "@/lib/metadata";

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

function CheckList({ items, title, icon: Icon = Check }: { items: string[]; title?: string; icon?: typeof Check }) {
  return (
    <div>
      {title && (
        <h3 className="mb-3 font-heading text-base font-semibold text-foreground">{title}</h3>
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

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;

  if (!SERVICE_SLUGS.includes(slug as ServiceSlug)) {
    notFound();
  }

  const currentSlug = slug as ServiceSlug;
  const { icon: Icon, messageKey, image } = SERVICE_CONFIG[currentSlug];
  const t = await getTranslations("services");
  const tDetail = await getTranslations("serviceDetail");
  const tCommon = await getTranslations("common");

  const serviceName = t(`${messageKey}.name`);
  const intro = tDetail(`${messageKey}.intro`);
  const includesRaw = tDetail.raw(`${messageKey}.includes`);
  const includesList = Array.isArray(includesRaw) ? includesRaw as string[] : [includesRaw as string];
  const pricing = tDetail(`${messageKey}.pricing`);

  const isMoveOut = currentSlug === "move-out-cleaning";
  const isWindow = currentSlug === "window-cleaning";
  const isHome = currentSlug === "home-cleaning";

  const hasPreparation = tDetail.has(`${messageKey}.preparation`);
  const hasNotIncluded = isMoveOut && tDetail.has(`${messageKey}.notIncluded`);
  const hasRutExplainer = isMoveOut && tDetail.has(`${messageKey}.rutExplainer`);

  let preparationList: string[] = [];
  if (hasPreparation) {
    const raw = tDetail.raw(`${messageKey}.preparation`);
    preparationList = Array.isArray(raw) ? raw as string[] : [];
  }

  let notIncludedList: string[] = [];
  if (hasNotIncluded) {
    const raw = tDetail.raw(`${messageKey}.notIncluded`);
    notIncludedList = Array.isArray(raw) ? raw as string[] : [];
  }

  let moveOutSections: { title: string; items: string[] }[] = [];
  if (isMoveOut) {
    const sectionKeys = ["includesAllRooms", "includesBathroom", "includesLaundry", "includesKitchen", "includesWindows"] as const;
    const sectionTitles: Record<string, string> = {
      includesAllRooms: isHome ? "" : "All rooms",
      includesBathroom: "Bathroom & Toilet",
      includesLaundry: "Laundry & Utility Room",
      includesKitchen: "Kitchen",
      includesWindows: "Windows",
    };
    for (const key of sectionKeys) {
      if (tDetail.has(`${messageKey}.${key}`)) {
        const raw = tDetail.raw(`${messageKey}.${key}`);
        if (Array.isArray(raw)) {
          moveOutSections.push({ title: sectionTitles[key], items: raw as string[] });
        }
      }
    }
  }

  const relatedSlugs = SERVICE_SLUGS.filter((s) => s !== currentSlug).slice(0, 3);

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
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                />
              </div>
            )}

            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-foreground-muted" aria-label="Breadcrumb">
              <IntlLink href="/" className="hover:text-primary">Home</IntlLink>
              <span className="mx-2">/</span>
              <IntlLink href="/services" className="hover:text-primary">Services</IntlLink>
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

            <p className="mb-10 text-lg leading-relaxed text-foreground-muted">
              {intro}
            </p>

            {/* RUT explainer for move-out */}
            {hasRutExplainer && (
              <div className="mb-10 flex gap-4 rounded-card border border-primary/20 bg-primary-light/30 p-6">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-foreground-muted">
                  {tDetail(`${messageKey}.rutExplainer`)}
                </p>
              </div>
            )}

            {/* Includes — standard services */}
            {!isMoveOut && (
              <div className="mb-10 rounded-card border border-border bg-background-muted p-6">
                <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">
                  {tDetail("whatsIncluded")}
                </h2>
                <CheckList items={includesList} />
              </div>
            )}

            {/* Includes — move-out with room sections */}
            {isMoveOut && moveOutSections.length > 0 && (
              <div className="mb-10 space-y-6 rounded-card border border-border bg-background-muted p-6">
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  {tDetail("whatsIncluded")}
                </h2>
                {moveOutSections.map(({ title, items }) => (
                  <CheckList key={title} items={items} title={title} />
                ))}
              </div>
            )}

            {/* Preparation */}
            {preparationList.length > 0 && (
              <div className="mb-10 rounded-card border border-secondary/20 bg-secondary/5 p-6">
                <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                  <ClipboardList className="h-5 w-5 text-secondary" />
                  {tDetail("preparation")}
                </h2>
                <CheckList items={preparationList} icon={ClipboardList} />
              </div>
            )}

            {/* Not included */}
            {notIncludedList.length > 0 && (
              <div className="mb-10 rounded-card border border-border bg-background p-6">
                <h2 className="mb-4 flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  {tDetail("notIncluded")}
                </h2>
                <CheckList items={notIncludedList} icon={AlertTriangle} />
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

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <IntlLink href="/book">{tDetail("bookThisService")}</IntlLink>
              </Button>
              <Button asChild size="lg" variant="outline">
                <IntlLink href="/contact">{tDetail("getQuote")}</IntlLink>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section title={tDetail("relatedServices")} className="bg-background-muted">
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
