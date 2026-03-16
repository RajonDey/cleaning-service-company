import { getTranslations } from "next-intl/server";
import { Phone, MessageCircle, Mail, Clock, MapPin } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/forms/contact-form";
import { Accordion } from "@/components/ui/accordion";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata("contact", locale as "en" | "sv");
}

export default async function ContactPage() {
  const t = await getTranslations("contact");
  const tFaq = await getTranslations("faq");

  const contactMethods = [
    {
      icon: Phone,
      title: t("phoneTitle"),
      desc: t("phoneDesc"),
      value: siteConfig.contact.phone,
      href: siteConfig.contact.phoneHref,
    },
    {
      icon: MessageCircle,
      title: t("whatsappTitle"),
      desc: t("whatsappDesc"),
      value: "WhatsApp",
      href: siteConfig.contact.whatsapp,
      external: true,
    },
    {
      icon: Mail,
      title: t("emailTitle"),
      desc: t("emailDesc"),
      value: siteConfig.contact.email,
      href: `mailto:${siteConfig.contact.email}`,
    },
  ];

  const faqItems = [
    { question: tFaq("rut.q"), answer: tFaq("rut.a") },
    { question: tFaq("booking.q"), answer: tFaq("booking.a") },
    { question: tFaq("cancel.q"), answer: tFaq("cancel.a") },
    { question: tFaq("pricing.q"), answer: tFaq("pricing.a") },
  ];

  return (
    <>
      <Section title={t("title")} subtitle={t("subtitle")} className="bg-background">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1fr]">
            {/* Contact form */}
            <div className="rounded-card border border-border bg-background p-6 md:p-8">
              <h2 className="mb-1 font-heading text-xl font-bold text-foreground">
                {t("formTitle")}
              </h2>
              <p className="mb-6 text-sm text-foreground-muted">
                {t("formSubtitle")}
              </p>
              <ContactForm />
            </div>

            {/* Right side */}
            <div className="space-y-6">
              {/* Contact methods */}
              <div className="space-y-4">
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {t("orContactDirectly")}
                </h3>
                {contactMethods.map(({ icon: Icon, title, desc, value, href, external }) => (
                  <a
                    key={title}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 rounded-card border border-border bg-background p-5 transition-all hover:border-primary/30 hover:shadow-card-hover"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{title}</p>
                      <p className="text-sm text-foreground-muted">{desc}</p>
                      <p className="mt-0.5 text-sm font-medium text-primary">{value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Hours */}
              <div className="rounded-card border border-border bg-background-muted p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="font-heading text-base font-semibold text-foreground">{t("hoursTitle")}</h3>
                </div>
                <div className="space-y-1 text-sm text-foreground-muted">
                  <p>{t("hoursWeekday")}</p>
                  <p>{t("hoursWeekend")}</p>
                  <p>{t("hoursSunday")}</p>
                </div>
              </div>

              {/* Service area */}
              <div className="rounded-card border border-border bg-background-muted p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-heading text-base font-semibold text-foreground">{t("areaTitle")}</h3>
                </div>
                <p className="text-sm text-foreground-muted">
                  {t("areaDesc")}
                </p>
              </div>
            </div>
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
    </>
  );
}
