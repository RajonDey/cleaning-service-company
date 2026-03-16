import { Phone, Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export interface ContactBlockProps {
  phone?: string;
  phoneHref?: string;
  email?: string;
  whatsappHref?: string;
  className?: string;
}

const DEFAULT_CONTACT = siteConfig.contact;

export function ContactBlock({
  phone = DEFAULT_CONTACT.phone,
  phoneHref = DEFAULT_CONTACT.phoneHref,
  email = DEFAULT_CONTACT.email,
  whatsappHref = DEFAULT_CONTACT.whatsapp,
  className,
}: ContactBlockProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-6 md:gap-8",
        className
      )}
    >
      <a
        href={phoneHref}
        className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
      >
        <Phone className="h-5 w-5 shrink-0" />
        <span className="font-medium">{phone}</span>
      </a>
      <a
        href={`mailto:${email}`}
        className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
      >
        <Mail className="h-5 w-5 shrink-0" />
        <span className="font-medium">{email}</span>
      </a>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
      >
        <MessageCircle className="h-5 w-5 shrink-0" />
        <span className="font-medium">WhatsApp</span>
      </a>
    </div>
  );
}
