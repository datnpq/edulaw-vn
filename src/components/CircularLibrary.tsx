"use client";

import { useMemo, useState } from "react";
import { CATEGORY_META, CIRCULARS } from "@/data/circulars";
import { normalizeVietnamese } from "@/lib/rag-engine";
import {
  CircularDocument,
  DocumentStatus,
  LegalCategory,
  Persona,
  SavedItem,
} from "@/types/legal";
import { StatusBadge } from "./StatusBadge";
import {
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  Calendar,
  Check,
  Copy,
  FileText,
  Filter,
  MessageSquarePlus,
  Search,
  X,
} from "lucide-react";

interface CircularDetailDrawerProps {
  circular: CircularDocument | null;
  highlightedArticleId: string | null;
  onClose: () => void;
  onAskAboutArticle: (question: string) => void;
  savedIds: Set<string>;
  onToggleSave: (item: SavedItem) => void;
}

export function CircularDetailDrawer({
  circular,
  highlightedArticleId,
  onClose,
  onAskAboutArticle,
  savedIds,
  onToggleSave,
}: CircularDetailDrawerProps) {
  const [copiedArticleId, setCopiedArticleId] = useState<string | null>(null);

  if (!circular) return null;

  function copyCitation(
    doc: CircularDocument,
    articleNumber: string,
    title: string,
    content: string,
    id: string
  ) {
    const text = `[${doc.code} — ${articleNumber}: ${title} (Hiệu lực ${doc.effectiveDate})]\n${content}`;
    navigator.clipboard.writeText(text);
    setCopiedArticleId(id);
    setTimeout(() => setCopiedArticleId(null), 1800);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-2xl overflow-y-auto border-l border-[#383945] bg-[#1a1b22] text-[#ececf1] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#32333f] bg-[#1a1b22]/95 backdrop-blur px-6 py-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="rounded-md bg-white px-2.5 py-0.5 text-xs font-bold text-black">
                {circular.code}
              </span>
              <StatusBadge status={circular.status} />
              <span className="rounded-full bg-[#2a2b34] px-2.5 py-0.5 text-[11px] font-medium text-zinc-300">
                {CATEGORY_META[circular.category].shortLabel}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-white leading-snug">
              {circular.shortTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-[#2a2b34] hover:text-white transition cursor-pointer"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl bg-[#24252f] p-4 border border-[#343542] text-xs">
            <div>
              <span className="text-zinc-400 block">Cơ quan ban hành</span>
              <span className="font-semibold text-zinc-100">
                {circular.issuingBody}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block">Ngày ban hành</span>
              <span className="font-semibold text-zinc-100">
                {circular.issuedDate}
              </span>
            </div>
            <div>
              <span className="text-zinc-400 block">Ngày có hiệu lực</span>
              <span className="font-semibold text-emerald-400">
                {circular.effectiveDate}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Tên đầy đủ văn bản
            </h3>
            <p className="text-sm text-zinc-200 leading-relaxed">
              {circular.fullTitle}
            </p>
            {circular.replacesOrAmends && (
              <p className="mt-2 text-xs font-medium text-rose-300">
                • {circular.replacesOrAmends}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-[#343542] bg-[#24252f] p-4">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-2.5">
              Điểm mới & Nội dung nổi bật
            </h3>
            <ul className="space-y-2 text-sm text-zinc-200">
              {circular.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                  <span className="leading-relaxed">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {circular.practicalNote && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-100">
              <strong className="block text-amber-300 mb-1">
                Lưu ý áp dụng thực tế:
              </strong>
              {circular.practicalNote}
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Các điều khoản cốt lõi ({circular.articles.length})
            </h3>
            {circular.articles.map((article) => {
              const isHighlighted = highlightedArticleId === article.id;
              const isSaved = savedIds.has(article.id);
              return (
                <div
                  key={article.id}
                  className={`rounded-xl border p-4 transition ${
                    isHighlighted
                      ? "border-white/50 bg-[#2d2f3b] ring-1 ring-white/20"
                      : "border-[#343542] bg-[#24252f]"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-bold text-sky-300">
                        {article.articleNumber}
                      </span>
                      <h4 className="text-sm font-semibold text-white">
                        {article.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          copyCitation(
                            circular,
                            article.articleNumber,
                            article.title,
                            article.content,
                            article.id
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-[#3d3f4d] bg-[#1e1f27] px-2 py-1 text-[11px] font-medium text-zinc-300 hover:bg-[#323442] cursor-pointer"
                      >
                        {copiedArticleId === article.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            Đã chép
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Trích dẫn
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onToggleSave({
                            id: article.id,
                            type: "article",
                            title: `${circular.code} — ${article.articleNumber}`,
                            subtitle: article.title,
                            content: article.content,
                            circularId: circular.id,
                            articleId: article.id,
                            savedAt: new Date().toLocaleDateString("vi-VN"),
                          })
                        }
                        className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium cursor-pointer ${
                          isSaved
                            ? "border-amber-400/50 bg-amber-500/15 text-amber-300"
                            : "border-[#3d3f4d] bg-[#1e1f27] text-zinc-300 hover:bg-[#323442]"
                        }`}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="h-3 w-3" />
                        ) : (
                          <Bookmark className="h-3 w-3" />
                        )}
                        {isSaved ? "Đã lưu" : "Lưu"}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
                    {article.content}
                  </p>

                  <ul className="mt-3 space-y-1 text-xs text-zinc-300 bg-[#1a1b22] rounded-lg p-3 border border-[#2f303c]">
                    {article.keyPoints.map((kp, kIdx) => (
                      <li key={kIdx} className="flex items-start gap-1.5">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                        <span>{kp}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onAskAboutArticle(
                          `Giải thích chi tiết ${article.articleNumber} của ${circular.code} về ${article.title}`
                        );
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 hover:text-sky-200 hover:underline cursor-pointer"
                    >
                      <MessageSquarePlus className="h-3.5 w-3.5" />
                      Hỏi tiếp trong Chat về điều khoản này
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

interface CircularLibraryProps {
  persona: Persona;
  onSelectCircular: (id: string) => void;
}

export function CircularLibrary({
  persona,
  onSelectCircular,
}: CircularLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<LegalCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "all">("all");

  const filteredCirculars = useMemo(() => {
    const normQ = normalizeVietnamese(searchQuery);
    return CIRCULARS.filter((doc) => {
      if (categoryFilter !== "all" && doc.category !== categoryFilter) return false;
      if (statusFilter !== "all" && doc.status !== statusFilter) return false;
      if (persona !== "all" && !doc.audience.includes(persona)) return false;

      if (normQ) {
        const haystack = normalizeVietnamese(
          [
            doc.code,
            doc.shortTitle,
            doc.fullTitle,
            doc.summary,
            ...doc.highlights,
            ...doc.articles.flatMap((a) => [
              a.articleNumber,
              a.title,
              a.content,
              ...a.keywords,
            ]),
          ].join(" ")
        );
        return haystack.includes(normQ);
      }
      return true;
    });
  }, [searchQuery, categoryFilter, statusFilter, persona]);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Kho Thông tư Bộ GD&ĐT (2024–2026)
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Tra cứu nhanh theo số hiệu Thông tư, trạng thái hiệu lực và nhóm chủ đề.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-[#383945] bg-[#2a2b34] p-4 space-y-3.5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo số Thông tư (91/2026, 05/2025, 89/2026...) hoặc từ khóa..."
              className="w-full rounded-xl border border-[#3e404e] bg-[#1e1f27] py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | "all")}
              className="rounded-xl border border-[#3e404e] bg-[#1e1f27] px-3 py-2.5 text-xs font-medium text-zinc-200 focus:border-zinc-400 focus:outline-none"
            >
              <option value="all">Mọi trạng thái hiệu lực</option>
              <option value="active">Đang có hiệu lực</option>
              <option value="upcoming">Sắp có hiệu lực (T12/2026)</option>
              <option value="consolidated">Hợp nhất / Sửa đổi</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCategoryFilter("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
              categoryFilter === "all"
                ? "bg-white text-black font-semibold"
                : "bg-[#1e1f27] text-zinc-300 hover:bg-[#343644]"
            }`}
          >
            Tất cả ({CIRCULARS.length})
          </button>
          {(Object.keys(CATEGORY_META) as LegalCategory[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                categoryFilter === cat
                  ? "bg-white text-black font-semibold"
                  : "bg-[#1e1f27] text-zinc-300 hover:bg-[#343644]"
              }`}
            >
              {CATEGORY_META[cat].shortLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filteredCirculars.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#383945] bg-[#2a2b34]/50 p-10 text-center">
          <FileText className="mx-auto h-8 w-8 text-zinc-500" />
          <p className="mt-2 text-sm text-zinc-300">
            Không tìm thấy Thông tư nào khớp bộ lọc hiện tại.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredCirculars.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectCircular(doc.id)}
              className="group flex flex-col justify-between rounded-xl border border-[#383945] bg-[#2a2b34] p-4 hover:border-zinc-400 hover:bg-[#30313c] transition cursor-pointer"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center rounded-md bg-white/10 px-2 py-0.5 text-xs font-bold text-white">
                    {doc.code}
                  </span>
                  <StatusBadge status={doc.status} />
                </div>

                <h3 className="text-sm font-semibold text-white group-hover:text-sky-200 leading-snug">
                  {doc.shortTitle}
                </h3>

                <p className="mt-1.5 text-xs leading-relaxed text-zinc-400 line-clamp-3">
                  {doc.summary}
                </p>

                {doc.replacesOrAmends && (
                  <p className="mt-2 text-[11px] text-rose-300/90 bg-rose-500/10 rounded-lg px-2.5 py-1 border border-rose-500/20">
                    {doc.replacesOrAmends}
                  </p>
                )}
              </div>

              <div className="mt-3.5 pt-3 border-t border-[#383945] flex items-center justify-between text-[11px] text-zinc-400">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Hiệu lực: <strong className="text-zinc-200">{doc.effectiveDate}</strong>
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-zinc-200 group-hover:text-white">
                  Chi tiết <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
