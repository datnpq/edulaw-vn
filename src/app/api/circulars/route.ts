import { NextRequest, NextResponse } from "next/server";
import { CIRCULARS } from "@/data/circulars";
import { normalizeVietnamese } from "@/lib/rag-engine";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const category = searchParams.get("category") ?? "all";
  const status = searchParams.get("status") ?? "all";
  const persona = searchParams.get("persona") ?? "all";

  const normQ = normalizeVietnamese(q);

  const filtered = CIRCULARS.filter((doc) => {
    if (category !== "all" && doc.category !== category) return false;
    if (status !== "all" && doc.status !== status) return false;
    if (
      (persona === "teacher" || persona === "aspiring") &&
      !doc.audience.includes(persona)
    ) {
      return false;
    }
    if (normQ) {
      const haystack = normalizeVietnamese(
        [
          doc.code,
          doc.shortTitle,
          doc.fullTitle,
          doc.summary,
          ...doc.highlights,
          ...doc.articles.flatMap((a) => [a.articleNumber, a.title, a.content, ...a.keywords]),
        ].join(" ")
      );
      return haystack.includes(normQ);
    }
    return true;
  });

  return NextResponse.json({
    total: filtered.length,
    circulars: filtered,
  });
}
