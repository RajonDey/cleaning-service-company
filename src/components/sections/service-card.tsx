import Image from "next/image";
import { type LucideIcon } from "lucide-react";
import { Link as IntlLink } from "@/i18n/routing";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  image?: string;
  learnMoreText?: string;
  className?: string;
}

export function ServiceCard({
  title,
  description,
  href,
  icon: Icon,
  image,
  learnMoreText = "Learn more",
  className,
}: ServiceCardProps) {
  return (
    <IntlLink href={href} className="block">
      <Card
        className={cn(
          "group h-full overflow-hidden transition-all duration-200 hover:border-primary/30",
          className
        )}
      >
        {image && (
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-background-muted">
            <Image
              src={image}
              alt=""
              fill
              className="object-cover object-center transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}
        <CardHeader>
          {!image && (
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-button bg-primary-light text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Icon className="h-6 w-6" />
            </div>
          )}
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-foreground-muted">{description}</p>
          <Button variant="ghost" size="sm" className="h-auto p-0 font-medium">
            {learnMoreText} →
          </Button>
        </CardContent>
      </Card>
    </IntlLink>
  );
}
