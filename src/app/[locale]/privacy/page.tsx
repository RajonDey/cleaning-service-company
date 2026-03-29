import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata("privacy", locale as "en" | "sv");
}

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");

  return (
    <div className="border-b border-border bg-background py-14 md:py-20">
      <Container className="max-w-3xl">
        <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-foreground-muted">{t("intro")}</p>
        <div className="prose prose-neutral mt-10 max-w-none text-foreground-muted">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            {t("dataHeading")}
          </h2>
          <p className="mt-3">{t("dataBody")}</p>
          <h2 className="mt-10 font-heading text-xl font-semibold text-foreground">
            {t("contactHeading")}
          </h2>
          <p className="mt-3">{t("contactBody")}</p>
        </div>
      </Container>
    </div>
  );
}
