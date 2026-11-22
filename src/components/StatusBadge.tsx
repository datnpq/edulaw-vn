"use client";

import { DocumentStatus } from "@/types/legal";
import { CheckCircle2, Clock, Layers } from "lucide-react";

export function StatusBadge({ status }: { status: DocumentStatus }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
        <CheckCircle2 className="h-3 w-3" />
        Đang có hiệu lực
      </span>
    );
  }
  if (status === "upcoming") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-medium text-amber-300 ring-1 ring-inset ring-amber-500/30">
        <Clock className="h-3 w-3" />
        Sắp có hiệu lực
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 px-2.5 py-0.5 text-[11px] font-medium text-sky-300 ring-1 ring-inset ring-sky-500/30">
      <Layers className="h-3 w-3" />
      Hợp nhất / Sửa đổi
    </span>
  );
}
