import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrustBadgeProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

export function TrustBadge({
  title,
  description,
  icon: Icon,
  className,
}: TrustBadgeProps) {
  return (
    <div
      className={cn(
        "group flex flex-col items-center gap-4 rounded-card border border-border bg-background p-8 text-center transition-all duration-200 hover:border-primary/30 hover:shadow-card-hover",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
        <Icon className="h-7 w-7" />
      </div>
      <div className="space-y-3">
        <h3 className="font-heading text-xl font-semibold text-foreground">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-foreground-muted">{description}</p>
      </div>
    </div>
  );
}
