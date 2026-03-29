"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Menu, X, Phone } from "lucide-react";
import { Link as IntlLink, usePathname } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { imageConfig } from "@/config/images";

const navLinks = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/book", key: "book" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/" || pathname === "";
  return pathname.startsWith(href);
}

export function Header() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between md:h-18">
          <IntlLink
            href="/"
            className="group inline-flex shrink-0 items-center rounded-2xl bg-background-muted/90 p-2 ring-1 ring-border/80 shadow-sm transition-colors hover:bg-background-muted hover:ring-primary/20"
            aria-label={siteConfig.siteName}
          >
            <Image
              src={imageConfig.logo}
              alt=""
              width={48}
              height={48}
              className="size-10 object-contain md:size-12"
              priority
            />
            <span className="sr-only">{siteConfig.siteName}</span>
          </IntlLink>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
            {navLinks.map(({ href, key }) => {
              const isActive = isActivePath(pathname, href);
              return (
                <IntlLink
                  key={key}
                  href={href}
                  className={cn(
                    "relative px-1 py-2 text-sm font-medium transition-colors hover:text-primary",
                    isActive
                      ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                      : "text-foreground-muted"
                  )}
                >
                  {t(key)}
                </IntlLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={siteConfig.contact.phoneHref}
              className="hidden items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary md:flex"
            >
              <Phone className="h-4 w-4" />
              {siteConfig.contact.phone}
            </a>

            <LanguageSwitcher className="hidden sm:flex" />

            <Button asChild className="hidden md:inline-flex">
              <IntlLink href="/book">{tCommon("book")}</IntlLink>
            </Button>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-button p-2.5 text-foreground hover:bg-background-muted md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className="border-t border-border py-4 md:hidden"
            role="dialog"
            aria-label="Mobile navigation"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {navLinks.map(({ href, key }) => {
                const isActive = isActivePath(pathname, href);
                return (
                  <IntlLink
                    key={key}
                    href={href}
                    className={cn(
                      "rounded-button px-4 py-3.5 text-base font-medium hover:bg-background-muted",
                      isActive
                        ? "bg-primary-light text-primary"
                        : "text-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(key)}
                  </IntlLink>
                );
              })}

              <a
                href={siteConfig.contact.phoneHref}
                className="flex items-center gap-2 rounded-button px-4 py-3.5 text-base font-medium text-foreground hover:bg-background-muted"
              >
                <Phone className="h-5 w-5" />
                {siteConfig.contact.phone}
              </a>

              <div className="mt-4 flex items-center justify-between px-4">
                <LanguageSwitcher />
                <Button asChild>
                  <IntlLink href="/book" onClick={() => setMobileMenuOpen(false)}>
                    {tCommon("book")}
                  </IntlLink>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
