"use client";

import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DownloadChecklistButton({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const handleClick = () => {
    const url = `/${locale}/checklist`;
    window.open(url, "_blank");
  };

  return (
    <Button variant="outline" size="lg" onClick={handleClick}>
      <FileDown className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
}
