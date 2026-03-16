"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link as IntlLink } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingCta() {
  const t = useTranslations("common");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
      <Button asChild size="lg" className="w-full">
        <IntlLink href="/book">
          {t("book")}
          <ArrowRight className="ml-1 h-4 w-4" />
        </IntlLink>
      </Button>
    </div>
  );
}
