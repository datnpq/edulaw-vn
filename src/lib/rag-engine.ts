import { CIRCULARS } from "@/data/circulars";
import { CircularDocument, LegalArticle, Persona } from "@/types/legal";

export function normalizeVietnamese(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9/\s%-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const SYNONYM_MAP: Record<string, string[]> = {
  nvsp: ["nghiep vu su pham", "chung chi su pham", "91/2026", "11/2021", "12/2021"],
  gvcn: ["giao vien chu nhiem", "chu nhiem lop", "giam 4 tiet"],
  gv: ["giao vien", "nha giao"],
  hs: ["hoc sinh"],
  cdnn: ["chuc danh nghe nghiep", "hang ii", "hang i", "hang iii", "thang hang"],
  hsg: ["hoc sinh gioi", "boi duong hoc sinh gioi"],
  "day them": ["hoc them", "19/2026", "29/2024", "thu tien", "ngoai nha truong"],
  luong: ["phu cap", "xep luong", "luong co so", "182/2026", "161/2026", "luat nha giao"],
  "tiet day": ["dinh muc", "kiem nhiem", "giam tiet", "05/2025", "40 gio"],
  "hoc ba": ["hoc ba so", "ky so", "89/2026", "danh gia hoc sinh"],
  "tuyen dung": ["vien chuc", "bang cap", "chuan trinh do", "cu nhan", "cao dang"],
  "nang luc so": ["18/2026", "chuyen doi so", "cntt", "hoc lieu so"],
};

const STOP_WORDS = new Set([
  "la", "gi", "cua", "va", "cho", "voi", "cac", "nhung", "co", "duoc",
  "khong", "nhu", "the", "nao", "bao", "nhieu", "khi", "ve", "theo",
  "trong", "ngoai", "tai", "tu", "den", "mot", "hay", "hoac", "bi",
  "can", "phai", "toi", "em", "minh", "hoi", "xin", "biet", "thong", "tu", "quy", "dinh",
]);

function expandTokens(normalizedQuery: string): { tokens: string[]; phrases: string[] } {
  const rawTokens = normalizedQuery
    .split(" ")
    .filter((t) => t.length >= 2 && !STOP_WORDS.has(t));

  const phrases: string[] = [];
  const tokenSet = new Set<string>(rawTokens);

  for (const [key, synonyms] of Object.entries(SYNONYM_MAP)) {
    if (normalizedQuery.includes(key)) {
      phrases.push(key);
      for (const syn of synonyms) {
        phrases.push(syn);
        for (const t of syn.split(" ")) {
          if (t.length >= 2 && !STOP_WORDS.has(t)) {
            tokenSet.add(t);
          }
        }
      }
    }
  }

  return { tokens: Array.from(tokenSet), phrases };
}

export interface ScoredArticle {
  circular: CircularDocument;
  article: LegalArticle;
  score: number;
  matchedTerms: string[];
}

export function retrieveRelevantArticles(
  query: string,
  persona: Persona = "all",
  limit = 3
): ScoredArticle[] {
  const normQuery = normalizeVietnamese(query);
  if (!normQuery) return [];

  const { tokens, phrases } = expandTokens(normQuery);
  const results: ScoredArticle[] = [];

  for (const circular of CIRCULARS) {
    const normCode = normalizeVietnamese(circular.code);
    const normShortTitle = normalizeVietnamese(circular.shortTitle);
    const normSummary = normalizeVietnamese(circular.summary);

    for (const article of circular.articles) {
      const normTitle = normalizeVietnamese(article.title);
      const normContent = normalizeVietnamese(article.content);
      const normKeyPoints = normalizeVietnamese(article.keyPoints.join(" "));
      const normKeywords = article.keywords.map(normalizeVietnamese);

      let score = 0;
      const matched = new Set<string>();

      const codeNumbers = normCode.match(/\d+\/\d{4}/g) ?? [];
      for (const num of codeNumbers) {
        if (normQuery.includes(num)) {
          score += 28;
          matched.add(num);
        }
      }

      for (const kw of normKeywords) {
        if (normQuery.includes(kw)) {
          score += 14;
          matched.add(kw);
        } else {
          for (const ph of phrases) {
            if (kw.includes(ph) || ph.includes(kw)) {
              score += 5;
              matched.add(kw);
              break;
            }
          }
        }
      }

      for (const token of tokens) {
        let hit = false;
        if (normTitle.includes(token)) {
          score += 5;
          hit = true;
        }
        if (normShortTitle.includes(token)) {
          score += 3.5;
          hit = true;
        }
        if (normKeywords.some((k) => k.includes(token))) {
          score += 4;
          hit = true;
        }
        if (normKeyPoints.includes(token)) {
          score += 2.5;
          hit = true;
        }
        if (normContent.includes(token) || normSummary.includes(token)) {
          score += 1.5;
          hit = true;
        }
        if (hit) matched.add(token);
      }

      if (score > 0 && persona !== "all") {
        if (article.audience.includes(persona)) {
          score *= 1.18;
        } else if (circular.audience.includes(persona)) {
          score *= 1.05;
        }
      }

      if (score >= 5) {
        results.push({
          circular,
          article,
          score: Math.round(score * 10) / 10,
          matchedTerms: Array.from(matched).slice(0, 6),
        });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
