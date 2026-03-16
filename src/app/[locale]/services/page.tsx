import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ServiceCard } from "@/components/sections/service-card";
import { Button } from "@/components/ui/button";
import { Link as IntlLink } from "@/i18n/routing";
import { SERVICE_CONFIG, getServiceHref } from "@/lib/services";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata("services", locale as "en" | "sv");
}

export default async function ServicesPage() {
  const t = await getTranslations("services");
  const tCommon = await getTranslations("common");

  return (
    <Section
      title={t("title")}
      subtitle={t("subtitle")}
      className="bg-background"
    >
      <Container>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(SERVICE_CONFIG).map(([slug, { icon, messageKey, image }]) => (
            <ServiceCard
              key={slug}
              title={t(`${messageKey}.name`)}
              description={t(`${messageKey}.description`)}
              href={getServiceHref(slug as keyof typeof SERVICE_CONFIG)}
              icon={icon}
              image={image}
              learnMoreText={tCommon("learnMore")}
            />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button asChild size="lg">
            <IntlLink href="/book">{tCommon("book")}</IntlLink>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
