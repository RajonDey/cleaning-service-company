import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Shield, Sliders, Zap, Award, BadgeCheck, Users, Clock, ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { TrustBadge } from "@/components/sections/trust-badge";
import { Accordion } from "@/components/ui/accordion";
import { ContactBlock } from "@/components/sections/contact-block";
import { Button } from "@/components/ui/button";
import { Link as IntlLink } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { imageConfig } from "@/config/images";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata("about", locale as "en" | "sv");
}

export default async function AboutPage() {
  const t = await getTranslations("about");
  const tTrust = await getTranslations("trust");
  const tFaq = await getTranslations("faq");

  const faqItems = [
    { question: tFaq("rut.q"), answer: tFaq("rut.a") },
    { question: tFaq("guarantee.q"), answer: tFaq("guarantee.a") },
    { question: tFaq("preparation.q"), answer: tFaq("preparation.a") },
    { question: tFaq("pricing.q"), answer: tFaq("pricing.a") },
    { question: tFaq("booking.q"), answer: tFaq("booking.a") },
    { question: tFaq("cancel.q"), answer: tFaq("cancel.a") },
  ];

  const whyChoose = [
    { icon: Clock, title: t("why1Title"), desc: t("why1Desc") },
    { icon: Shield, title: t("why2Title"), desc: t("why2Desc") },
    { icon: BadgeCheck, title: t("why3Title"), desc: t("why3Desc") },
    { icon: Users, title: t("why4Title"), desc: t("why4Desc") },
  ];

  return (
    <>
      {/* Hero with image */}
      <Section title={t("title")} className="bg-background">
        <Container>
          <div className="mb-12 overflow-hidden rounded-card">
            <div className="relative aspect-video w-full md:aspect-21/9">
              <Image
                src={imageConfig.about}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1280px"
                priority
              />
            </div>
          </div>

          {/* Story */}
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              {t("storyTitle")}
            </h2>
            <p className="text-lg leading-relaxed text-foreground-muted">
              {t("intro")}
            </p>
            <p className="text-lg leading-relaxed text-foreground-muted">
              {t("storyP1")}
            </p>
            <p className="text-lg leading-relaxed text-foreground-muted">
              {t("storyP2")}
            </p>
          </div>
        </Container>
      </Section>

      {/* Why choose us */}
      <Section title={t("whyChooseTitle")} className="bg-background-muted">
        <Container>
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
            {whyChoose.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-card border border-border bg-background p-6 transition-shadow hover:shadow-card-hover"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-foreground-muted">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA banner */}
      <section className="bg-linear-to-br from-primary to-primary-hover py-14 md:py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
              {t("ctaBannerTitle")}
            </h2>
            <p className="mt-3 text-white/80">{t("ctaBannerSubtitle")}</p>
            <div className="mt-6">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <IntlLink href="/book">
                  Book Now
                  <ArrowRight className="ml-1 h-4 w-4" />
                </IntlLink>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <Section title={t("valuesTitle")} className="bg-background">
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

      {/* FAQ */}
      <Section title={tFaq("title")} className="bg-background-muted">
        <Container>
          <div className="mx-auto max-w-2xl">
            <Accordion items={faqItems} />
          </div>
        </Container>
      </Section>

      {/* Contact */}
      <Section title={t("contactTitle")} className="bg-background">
        <ContactBlock />
      </Section>
    </>
  );
}
