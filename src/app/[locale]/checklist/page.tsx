import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { imageConfig } from "@/config/images";
import { PrintButton } from "./print-button";

export default async function ChecklistPage() {
  const tDetail = await getTranslations("serviceDetail");

  const customerChecklist = (() => {
    if (tDetail.has("moveOutCleaning.customerChecklist")) {
      const raw = tDetail.raw("moveOutCleaning.customerChecklist");
      return Array.isArray(raw)
        ? (raw as { title: string; desc: string }[])
        : [];
    }
    return [];
  })();

  return (
    <div className="mx-auto max-w-2xl px-8 py-12 print:px-0 print:py-4">
      <style>{`
        @media print {
          header, footer, nav, .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="mb-8 flex items-center gap-4 border-b border-gray-200 pb-6 print:mb-6 print:pb-4">
        <Image
          src={imageConfig.logo}
          alt={siteConfig.siteName}
          width={64}
          height={64}
          className="size-16 object-contain"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {siteConfig.siteName}
          </h1>
          <p className="text-sm text-gray-500">{siteConfig.contact.address}</p>
          <p className="text-sm text-gray-500">
            {siteConfig.contact.phone} &middot; {siteConfig.contact.email}
          </p>
        </div>
      </div>

      <h2 className="mb-2 text-xl font-bold text-gray-900">
        {tDetail("customerChecklistTitle")}
      </h2>
      <p className="mb-8 text-sm text-gray-600">
        {tDetail("moveOutCleaning.includesIntro")}
      </p>

      <div className="space-y-6">
        {customerChecklist.map((item, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-700 print:border print:border-gray-300">
              {i + 1}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t border-gray-200 pt-6">
        <p className="text-sm font-medium text-gray-900">
          {tDetail("moveOutCleaning.promise")}
        </p>
      </div>

      <div className="mt-8 text-center text-xs text-gray-400 print:mt-4">
        {siteConfig.siteName} &middot; {siteConfig.contact.phone} &middot;{" "}
        {siteConfig.contact.email}
      </div>

      <div className="no-print mt-8 text-center">
        <PrintButton />
      </div>
    </div>
  );
}
