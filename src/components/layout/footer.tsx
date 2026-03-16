import { useTranslations } from "next-intl";
import { Phone, Mail, MessageCircle, Shield, BadgeCheck } from "lucide-react";
import { Link as IntlLink } from "@/i18n/routing";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { SERVICE_CONFIG, SERVICE_SLUGS, getServiceHref } from "@/lib/services";

const navLinks = [
  { href: "/", key: "home" },
  { href: "/book", key: "book" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export function Footer({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const tServices = useTranslations("services");

  return (
    <footer
      className={cn(
        "border-t border-border bg-foreground py-12 text-white/80 md:py-16",
        className
      )}
    >
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 md:gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <IntlLink
              href="/"
              className="font-heading text-lg font-bold text-white"
            >
              {siteConfig.siteName}
            </IntlLink>
            <p className="text-sm leading-relaxed">
              {tFooter("tagline")}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                <Shield className="h-3.5 w-3.5" />
                {tFooter("rutBadge")}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                <BadgeCheck className="h-3.5 w-3.5" />
                {tFooter("guaranteeBadge")}
              </span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold text-white">
              {tFooter("ourServices")}
            </h3>
            <nav className="flex flex-col gap-2.5" aria-label="Services">
              {SERVICE_SLUGS.map((slug) => (
                <IntlLink
                  key={slug}
                  href={getServiceHref(slug)}
                  className="text-sm transition-colors hover:text-white"
                >
                  {tServices(`${SERVICE_CONFIG[slug].messageKey}.name`)}
                </IntlLink>
              ))}
            </nav>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold text-white">
              {tFooter("quickLinks")}
            </h3>
            <nav className="flex flex-col gap-2.5" aria-label="Footer">
              {navLinks.map(({ href, key }) => (
                <IntlLink
                  key={key}
                  href={href}
                  className="text-sm transition-colors hover:text-white"
                >
                  {t(key)}
                </IntlLink>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-heading text-sm font-semibold text-white">
              {tFooter("contactUs")}
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href={siteConfig.contact.phoneHref}
                className="flex items-center gap-2 text-sm transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0" />
                {siteConfig.contact.phone}
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-2 text-sm transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {siteConfig.contact.email}
              </a>
              <a
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm transition-colors hover:text-white"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/50">
          &copy; {new Date().getFullYear()} {siteConfig.siteName}. {tFooter("allRightsReserved")}
        </div>
      </Container>
    </footer>
  );
}
