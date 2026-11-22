"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CIRCULARS, SUGGESTED_QUESTIONS } from "@/data/circulars";
import { normalizeVietnamese } from "@/lib/rag-engine";
import {
  ChatMessageInput,
  CitationItem,
  LLMConfig,
  Persona,
  QAResponse,
  SavedItem,
} from "@/types/legal";
import { CircularDetailDrawer, CircularLibrary } from "./CircularLibrary";
import { TeacherCalculators } from "./TeacherCalculators";
import { LLMSettingsModal } from "./LLMSettingsModal";
import { StatusBadge } from "./StatusBadge";
import {
  ArrowRight,
  ArrowUp,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Brain,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  FileText,
  Globe,
  GraduationCap,
  LayoutGrid,
  Lightbulb,
  Loader2,
  Menu,
  MessageSquare,
  PanelLeft,
  PencilLine,
  Plus,
  Scale,
  Search,
  Settings,
  SquarePen,
  Trash2,
  User,
  X,
} from "lucide-react";

type ViewKey = "chat" | "library" | "tools" | "prompts" | "saved";

interface ChatTurn {
  id: string;
  query: string;
  response: QAResponse;
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  turns: ChatTurn[];
}

const SAVED_STORAGE_KEY = "edulaw_vn_saved_v2";
const CHATS_STORAGE_KEY = "edulaw_vn_chats_v2";
const LLM_CONFIG_STORAGE_KEY = "edulaw_vn_llm_config_v1";

const DEFAULT_LLM_CONFIG: LLMConfig = {
  provider: "ollama",
  model: "qwen3:4b",
  apiKey: "",
  baseUrl: "http://localhost:11434",
  enableWebSearch: false,
  enableReasoning: true,
};

const PERSONA_OPTIONS: { id: Persona; label: string; short: string }[] = [
  { id: "all", label: "Tất cả đối tượng", short: "Tất cả" },
  { id: "teacher", label: "Giáo viên đang công tác", short: "Giáo viên" },
  { id: "aspiring", label: "Người muốn làm giáo viên", short: "Muốn làm GV" },
];

const QUICK_CARDS: Record<
  Persona,
  { title: string; subtitle: string; prompt: string }[]
> = {
  all: [
    {
      title: "Chứng chỉ nghiệp vụ sư phạm",
      subtitle: "sinh viên tích lũy 70% tín chỉ theo TT 91/2026",
      prompt:
        "Sinh viên năm cuối chưa tốt nghiệp đại học có được học chứng chỉ nghiệp vụ sư phạm không? Cần điều kiện gì?",
    },
    {
      title: "Định mức & giảm tiết dạy",
      subtitle: "giáo viên chủ nhiệm, tổ trưởng theo TT 05/2025",
      prompt:
        "Tôi là giáo viên THCS kiêm chủ nhiệm lớp và tổ trưởng chuyên môn thì phải dạy bao nhiêu tiết/tuần? Có được nhận cả phụ cấp chức vụ không?",
    },
    {
      title: "Quy định dạy thêm, học thêm",
      subtitle: "dạy thêm trong và ngoài trường theo TT 19/2026",
      prompt:
        "Dạy thêm trong và ngoài nhà trường hiện nay được quy định thế nào? Các hoạt động STEM, kỹ năng sống có bị cấm không?",
    },
    {
      title: "Học bạ số & Ký số mới",
      subtitle: "quy trình đánh giá học sinh theo TT 89/2026",
      prompt:
        "Học bạ số và quy trình ký số giữa giáo viên bộ môn và giáo viên chủ nhiệm từ tháng 12/2026 thực hiện ra sao?",
    },
  ],
  teacher: [
    {
      title: "Định mức & giảm tiết kiêm nhiệm",
      subtitle: "tối đa 2 nhiệm vụ theo TT 05/2025/TT-BGDĐT",
      prompt:
        "Tôi là giáo viên THCS kiêm chủ nhiệm lớp và tổ trưởng chuyên môn thì phải dạy bao nhiêu tiết/tuần?",
    },
    {
      title: "Dạy thêm & hoạt động STEM",
      subtitle: "phân định rõ theo TT 19/2026 & TT 29/2024",
      prompt:
        "Các hoạt động STEM, kỹ năng sống, tăng cường ngoại ngữ có bị coi là dạy thêm không?",
    },
    {
      title: "Học bạ số & Ký số từ 01/12/2026",
      subtitle: "quy trình ký số GV bộ môn và GVCN (TT 89/2026)",
      prompt:
        "Học bạ số và quy trình ký số của giáo viên bộ môn, giáo viên chủ nhiệm quy định thế nào?",
    },
    {
      title: "Phụ cấp ưu đãi & Lương 2026",
      subtitle: "9 mức 20%–80% và lương cơ sở 2,53 triệu đồng",
      prompt:
        "Phụ cấp ưu đãi nghề giáo viên năm 2026 có bao nhiêu mức và lương cơ sở mới là bao nhiêu?",
    },
  ],
  aspiring: [
    {
      title: "Sinh viên học chứng chỉ NVSP",
      subtitle: "tích lũy ≥ 70% tín chỉ theo TT 91/2026",
      prompt:
        "Sinh viên năm cuối chưa tốt nghiệp đại học có được học chứng chỉ nghiệp vụ sư phạm không?",
    },
    {
      title: "Chuẩn bằng cấp tuyển dụng",
      subtitle: "yêu cầu trình độ Mầm non, Tiểu học, THCS, THPT",
      prompt:
        "Điều kiện bằng cấp để tuyển dụng làm giáo viên Mầm non, Tiểu học, THCS, THPT là gì?",
    },
    {
      title: "Môn đặc thù trình độ Cao đẳng",
      subtitle: "Mỹ thuật, Âm nhạc, Tin học, Công nghệ (TT 91/2026)",
      prompt:
        "Trình độ cao đẳng có được học nghiệp vụ sư phạm để dạy Mỹ thuật, Âm nhạc, Tin học, Công nghệ không?",
    },
    {
      title: "Chế độ lương Luật Nhà giáo",
      subtitle: "lương xếp cao nhất và phụ cấp ưu đãi năm 2026",
      prompt:
        "Chính sách lương và phụ cấp cho giáo viên mới tuyển dụng theo Luật Nhà giáo 2026 như thế nào?",
    },
  ],
};

function renderInlineFormatting(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-[#181920] px-1.5 py-0.5 text-xs text-sky-300 border border-[#343542]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={i} className="italic text-zinc-200">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function FormattedAnswer({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/);
  return (
    <div className="space-y-3 text-sm leading-relaxed text-zinc-200">
      {blocks.map((block, idx) => {
        const lines = block.split("\n");
        return (
          <div key={idx} className="space-y-1.5">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return null;
              if (trimmed.startsWith("### ")) {
                return (
                  <h4 key={lIdx} className="text-sm font-semibold text-white pt-1.5">
                    {renderInlineFormatting(trimmed.slice(4))}
                  </h4>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <h3 key={lIdx} className="text-base font-semibold text-white pt-1.5">
                    {renderInlineFormatting(trimmed.slice(3))}
                  </h3>
                );
              }
              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-1">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                    <span>{renderInlineFormatting(trimmed.slice(2))}</span>
                  </div>
                );
              }
              const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
              if (numMatch) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-1">
                    <span className="font-semibold text-zinc-300 shrink-0">
                      {numMatch[1]}.
                    </span>
                    <span>{renderInlineFormatting(numMatch[2])}</span>
                  </div>
                );
              }
              return <p key={lIdx}>{renderInlineFormatting(trimmed)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}

function ReasoningAccordion({ reasoning }: { reasoning: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-xl border border-purple-500/25 bg-purple-500/[0.06] overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-3.5 py-2 text-xs font-medium text-purple-200 hover:bg-purple-500/10 transition cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Brain className="h-3.5 w-3.5 text-purple-300" />
          <span>Quá trình tư duy (Reasoning)</span>
        </span>
        {expanded ? (
          <ChevronDown className="h-3.5 w-3.5 text-purple-300" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-purple-300" />
        )}
      </button>
      {expanded && (
        <div className="border-t border-purple-500/20 px-3.5 py-3 text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap max-h-72 overflow-y-auto">
          {reasoning}
        </div>
      )}
    </div>
  );
}

export function EduLawApp() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewKey>("chat");
  const [persona, setPersona] = useState<Persona>("all");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [llmConfig, setLlmConfig] = useState<LLMConfig>(DEFAULT_LLM_CONFIG);

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sidebarSearch, setSidebarSearch] = useState("");

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [drawerCircularId, setDrawerCircularId] = useState<string | null>(null);
  const [highlightedArticleId, setHighlightedArticleId] = useState<string | null>(
    null
  );
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const rawSaved = localStorage.getItem(SAVED_STORAGE_KEY);
      if (rawSaved) {
        const parsed = JSON.parse(rawSaved);
        if (Array.isArray(parsed)) setSavedItems(parsed);
      }
      const rawChats = localStorage.getItem(CHATS_STORAGE_KEY);
      if (rawChats) {
        const parsed = JSON.parse(rawChats);
        if (Array.isArray(parsed)) setSessions(parsed);
      }
      const rawCfg = localStorage.getItem(LLM_CONFIG_STORAGE_KEY);
      if (rawCfg) {
        const parsed = JSON.parse(rawCfg);
        if (parsed && typeof parsed === "object") {
          setLlmConfig({ ...DEFAULT_LLM_CONFIG, ...parsed });
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  function saveLLMConfig(next: LLMConfig) {
    setLlmConfig(next);
    try {
      localStorage.setItem(LLM_CONFIG_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore
    }
  }

  function persistSessions(next: ChatSession[]) {
    setSessions(next);
    try {
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(next.slice(0, 30)));
    } catch {
      // Ignore
    }
  }

  const savedIds = useMemo(
    () => new Set(savedItems.map((i) => i.id)),
    [savedItems]
  );

  function handleToggleSave(item: SavedItem) {
    setSavedItems((prev) => {
      const exists = prev.some((x) => x.id === item.id);
      const next = exists ? prev.filter((x) => x.id !== item.id) : [item, ...prev];
      try {
        localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) ?? null,
    [sessions, activeSessionId]
  );

  const filteredSessions = useMemo(() => {
    const q = normalizeVietnamese(sidebarSearch);
    if (!q) return sessions;
    return sessions.filter((s) =>
      normalizeVietnamese(
        s.title + " " + s.turns.map((t) => t.query).join(" ")
      ).includes(q)
    );
  }, [sessions, sidebarSearch]);

  const drawerCircular = useMemo(
    () => CIRCULARS.find((c) => c.id === drawerCircularId) ?? null,
    [drawerCircularId]
  );

  useEffect(() => {
    if (activeSession?.turns.length) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeSession?.turns.length, loading]);

  function startNewChat() {
    setActiveSessionId(null);
    setActiveView("chat");
    setError(null);
    setMobileSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 60);
  }

  function deleteSession(id: string) {
    const next = sessions.filter((s) => s.id !== id);
    persistSessions(next);
    if (activeSessionId === id) {
      setActiveSessionId(null);
    }
  }

  async function handleAsk(questionText?: string) {
    const q = (questionText ?? input).trim();
    if (!q || loading) return;

    setActiveView("chat");
    setLoading(true);
    setError(null);
    setInput("");

    // Build real multi-turn conversation history for the LLM
    const history: ChatMessageInput[] = [];
    if (activeSession) {
      for (const turn of activeSession.turns.slice(-5)) {
        history.push({ role: "user", content: turn.query });
        history.push({ role: "assistant", content: turn.response.answer });
      }
    }

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          persona,
          history,
          llmConfig,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Đã có lỗi xảy ra khi gọi LLM.");
      } else {
        const turn: ChatTurn = {
          id: `qa-${Date.now()}`,
          query: q,
          response: data as QAResponse,
          timestamp: new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        if (activeSessionId) {
          const updated = sessions.map((s) =>
            s.id === activeSessionId ? { ...s, turns: [...s.turns, turn] } : s
          );
          persistSessions(updated);
        } else {
          const newId = `chat-${Date.now()}`;
          const newSession: ChatSession = {
            id: newId,
            title: q.length > 46 ? q.slice(0, 46) + "…" : q,
            createdAt: new Date().toLocaleDateString("vi-VN"),
            turns: [turn],
          };
          persistSessions([newSession, ...sessions]);
          setActiveSessionId(newId);
        }
      }
    } catch {
      setError("Không thể kết nối máy chủ tra cứu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopyTurn(turn: ChatTurn) {
    const full = `Câu hỏi: ${turn.query}\n\n${turn.response.answer}`;
    navigator.clipboard.writeText(full);
    setCopiedId(turn.id);
    setTimeout(() => setCopiedId(null), 1800);
  }

  function openCircularDrawer(circularId: string, articleId?: string) {
    setDrawerCircularId(circularId);
    setHighlightedArticleId(articleId ?? null);
  }

  const providerLabel =
    llmConfig.provider === "gemini"
      ? `Gemini • ${llmConfig.model}`
      : llmConfig.provider === "ollama"
        ? `Ollama • ${llmConfig.model}`
        : `API • ${llmConfig.model}`;

  const sidebarContent = (
    <div className="flex h-full flex-col bg-black text-zinc-200 select-none">
      <div className="p-2.5">
        <button
          type="button"
          onClick={startNewChat}
          className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium text-white hover:bg-zinc-900 transition cursor-pointer"
        >
          <span className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md border border-zinc-700 bg-zinc-950">
              <Scale className="h-3.5 w-3.5 text-white" />
            </span>
            <span>Hỏi đáp mới</span>
          </span>
          <SquarePen className="h-4 w-4 text-zinc-400" />
        </button>
      </div>

      <div className="px-2.5 space-y-0.5">
        <button
          type="button"
          onClick={() => {
            setActiveView("tools");
            setMobileSidebarOpen(false);
          }}
          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition cursor-pointer ${
            activeView === "tools"
              ? "bg-zinc-800/90 text-white"
              : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
          }`}
        >
          <LayoutGrid className="h-4 w-4 text-zinc-400" />
          <span>Công cụ tra cứu</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveView("prompts");
            setMobileSidebarOpen(false);
          }}
          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition cursor-pointer ${
            activeView === "prompts"
              ? "bg-zinc-800/90 text-white"
              : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
          }`}
        >
          <PencilLine className="h-4 w-4 text-zinc-400" />
          <span>Mẫu câu hỏi</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveView("library");
            setMobileSidebarOpen(false);
          }}
          className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition cursor-pointer ${
            activeView === "library"
              ? "bg-zinc-800/90 text-white"
              : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <FileText className="h-4 w-4 text-zinc-400" />
            <span>Kho Thông tư</span>
          </span>
          <span className="text-[10px] text-zinc-500">{CIRCULARS.length}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveView("saved");
            setMobileSidebarOpen(false);
          }}
          className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition cursor-pointer ${
            activeView === "saved"
              ? "bg-zinc-800/90 text-white"
              : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <Bookmark className="h-4 w-4 text-zinc-400" />
            <span>Đã lưu</span>
          </span>
          {savedItems.length > 0 && (
            <span className="text-[10px] text-zinc-500">{savedItems.length}</span>
          )}
        </button>
      </div>

      <div className="px-2.5 pt-3 pb-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={sidebarSearch}
            onChange={(e) => setSidebarSearch(e.target.value)}
            placeholder="Tìm kiếm lịch sử..."
            className="w-full rounded-lg bg-[#111216] py-1.5 pl-8 pr-3 text-xs text-zinc-200 placeholder:text-zinc-500 border border-zinc-900 focus:border-zinc-700 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2.5 py-1 space-y-0.5">
        {filteredSessions.length > 0 && (
          <p className="px-2 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Lịch sử hỏi đáp
          </p>
        )}
        {filteredSessions.map((session) => {
          const isCurrent =
            activeView === "chat" && activeSessionId === session.id;
          return (
            <div
              key={session.id}
              className={`group flex items-center justify-between gap-1 rounded-lg px-2.5 py-2 text-xs transition ${
                isCurrent
                  ? "bg-zinc-800/90 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveSessionId(session.id);
                  setActiveView("chat");
                  setMobileSidebarOpen(false);
                }}
                className="flex flex-1 items-center gap-2 truncate text-left cursor-pointer"
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-60" />
                <span className="truncate">{session.title}</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(session.id);
                }}
                title="Xóa cuộc trò chuyện"
                className="opacity-0 group-hover:opacity-100 rounded p-1 text-zinc-500 hover:text-rose-400 transition cursor-pointer"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom Settings Shortcut */}
      <div className="border-t border-zinc-900 p-2.5">
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-zinc-900 transition cursor-pointer"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-zinc-200">
            {persona === "aspiring" ? (
              <GraduationCap className="h-3.5 w-3.5" />
            ) : (
              <User className="h-3.5 w-3.5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-zinc-200">
              {providerLabel}
            </p>
            <p className="truncate text-[10px] text-zinc-500">
              Bấm để cấu hình LLM / API Key
            </p>
          </div>
          <Settings className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#212229] text-[#ececf1]">
      <aside
        className={`hidden md:block shrink-0 border-r border-zinc-900 transition-all duration-200 ${
          sidebarOpen ? "w-64" : "w-0 overflow-hidden border-r-0"
        }`}
      >
        {sidebarContent}
      </aside>

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 flex md:hidden bg-black/70"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="h-full w-64 bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0 h-full bg-[#212229]">
        {/* Top Bar (mirrors Ollama Web UI) */}
        <header className="shrink-0 px-4 sm:px-6 pt-3 pb-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setSidebarOpen((v) => !v)}
                className="hidden md:inline-flex rounded-lg p-1.5 text-zinc-400 hover:bg-[#2d2e38] hover:text-white transition cursor-pointer"
                title="Đóng/mở thanh bên"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="inline-flex md:hidden rounded-lg p-1.5 text-zinc-400 hover:bg-[#2d2e38] hover:text-white transition cursor-pointer"
                title="Mở menu"
              >
                <Menu className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveView("chat")}
                className="text-sm font-semibold text-zinc-100 hover:text-white transition cursor-pointer"
              >
                EduLaw Web UI
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={startNewChat}
                title="Hỏi đáp mới"
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-[#2d2e38] hover:text-white transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                title="Cài đặt LLM (API Key, Reasoning, Web Search)"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#3a3c48] bg-[#2a2b34] px-2.5 py-1.5 text-xs font-medium text-zinc-200 hover:border-zinc-400 hover:text-white transition cursor-pointer"
              >
                <Settings className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Cài đặt LLM</span>
              </button>
            </div>
          </div>

          {/* Model + Persona Selector Row (exact match to "Select a model" in screenshot) */}
          {activeView === "chat" && (
            <div className="mt-2.5 ml-1 md:ml-8 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="group text-left cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-sm font-semibold text-white group-hover:text-sky-200 transition">
                  <span>{providerLabel}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                  {llmConfig.enableReasoning && (
                    <span className="inline-flex items-center gap-1 text-purple-300">
                      <Brain className="h-3 w-3" /> Reasoning
                    </span>
                  )}
                  {llmConfig.provider === "gemini" && llmConfig.enableWebSearch && (
                    <span className="inline-flex items-center gap-1 text-sky-300">
                      <Globe className="h-3 w-3" /> Tìm kiếm web trực tiếp
                    </span>
                  )}
                  {!llmConfig.enableReasoning &&
                    !(llmConfig.provider === "gemini" && llmConfig.enableWebSearch) && (
                      <span>Bấm để đổi model hoặc nhập API Key</span>
                    )}
                </div>
              </button>

              {/* Compact Persona Pills */}
              <div className="flex items-center rounded-lg bg-[#191a21] p-0.5 border border-[#2f303c] text-[11px]">
                {PERSONA_OPTIONS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPersona(p.id)}
                    className={`rounded-md px-2.5 py-1 font-medium transition cursor-pointer ${
                      persona === p.id
                        ? "bg-[#2e303c] text-white"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {p.short}
                  </button>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Workspace Body */}
        {activeView === "chat" ? (
          <div className="flex flex-1 flex-col min-h-0">
            <div className="flex-1 overflow-y-auto px-4 sm:px-6">
              {!activeSession && !loading ? (
                <div className="mx-auto flex h-full max-w-3xl flex-col justify-between py-6">
                  <div className="my-auto flex flex-col items-center justify-center text-center py-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-600/70 bg-[#2a2b34] text-white shadow-sm mb-4">
                      <Scale className="h-7 w-7 stroke-[1.75]" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                      Hôm nay tôi có thể giúp gì cho bạn?
                    </h1>
                    <p className="mt-1.5 text-xs text-zinc-400 max-w-md">
                      Trợ lý AI tự tư duy pháp lý & tra cứu Thông tư Bộ GD&ĐT mới nhất cho giáo viên và người muốn trở thành giáo viên.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pb-2">
                    {QUICK_CARDS[persona].map((card, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAsk(card.prompt)}
                        className="group rounded-xl border border-[#3a3b47] bg-[#262730]/70 px-4 py-3 text-left hover:border-zinc-500 hover:bg-[#2d2e38] transition cursor-pointer"
                      >
                        <p className="text-xs font-semibold text-zinc-100 group-hover:text-white">
                          {card.title}
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-400 truncate">
                          {card.subtitle}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mx-auto max-w-3xl py-4 space-y-7">
                  {activeSession?.turns.map((turn) => {
                    const isSaved = savedIds.has(turn.id);
                    return (
                      <div key={turn.id} className="space-y-4">
                        {/* User Bubble */}
                        <div className="flex justify-end">
                          <div className="max-w-[85%] rounded-2xl bg-[#30313d] px-4 py-2.5 text-sm text-white">
                            {turn.query}
                          </div>
                        </div>

                        {/* Assistant Message */}
                        <div className="flex items-start gap-3.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-600 bg-[#2a2b34] text-white mt-0.5">
                            <Scale className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-3.5">
                            {/* Collapsible LLM Reasoning / Thinking Block */}
                            {turn.response.reasoning && (
                              <ReasoningAccordion
                                reasoning={turn.response.reasoning}
                              />
                            )}

                            {/* Main LLM Answer */}
                            <FormattedAnswer text={turn.response.answer} />

                            {/* Prompt to open LLM Settings if API key not yet configured */}
                            {turn.response.needsSetup && (
                              <div>
                                <button
                                  type="button"
                                  onClick={() => setSettingsOpen(true)}
                                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-zinc-200 transition cursor-pointer"
                                >
                                  <Settings className="h-3.5 w-3.5" />
                                  Mở Cài đặt LLM để nhập API Key / kết nối Ollama
                                </button>
                              </div>
                            )}

                            {/* Live Web Sources from Google Search Grounding */}
                            {turn.response.webSources?.length > 0 && (
                              <div className="space-y-1.5 pt-1">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                                  <Globe className="h-3.5 w-3.5" />
                                  Nguồn tìm kiếm trực tiếp ({turn.response.webSources.length})
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {turn.response.webSources.map((src, sIdx) => (
                                    <a
                                      key={sIdx}
                                      href={src.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-2.5 py-1.5 text-xs text-sky-200 hover:bg-sky-500/20 transition max-w-xs truncate"
                                    >
                                      <ExternalLink className="h-3 w-3 shrink-0" />
                                      <span className="truncate">{src.title}</span>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Practical Tips if present */}
                            {turn.response.practicalTips.length > 0 && (
                              <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-3.5">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 mb-1.5">
                                  <Lightbulb className="h-3.5 w-3.5" />
                                  Gợi ý cấu hình
                                </div>
                                <ul className="space-y-1 text-xs leading-relaxed text-amber-100/90">
                                  {turn.response.practicalTips.map((tip, tIdx) => (
                                    <li key={tIdx}>{tip}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Local Circular Reference Cards */}
                            {turn.response.citations.length > 0 && (
                              <div className="space-y-2 pt-1">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                                  Thông tư liên quan trong Kho văn bản ({turn.response.citations.length})
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {turn.response.citations.map((cite: CitationItem) => (
                                    <button
                                      key={cite.articleId}
                                      type="button"
                                      onClick={() =>
                                        openCircularDrawer(
                                          cite.circularId,
                                          cite.articleId
                                        )
                                      }
                                      className="group flex flex-col justify-between rounded-xl border border-[#383945] bg-[#282932] p-3 text-left hover:border-zinc-400 hover:bg-[#30313d] transition cursor-pointer"
                                    >
                                      <div>
                                        <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                                          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[11px] font-bold text-white">
                                            {cite.circularCode}
                                          </span>
                                          <StatusBadge status={cite.status} />
                                        </div>
                                        <p className="text-xs font-semibold text-zinc-100 group-hover:text-sky-200 line-clamp-1">
                                          {cite.articleNumber}: {cite.articleTitle}
                                        </p>
                                      </div>
                                      <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400">
                                        <span>Hiệu lực: {cite.effectiveDate}</span>
                                        <span className="inline-flex items-center gap-0.5 text-sky-300">
                                          Xem chi tiết <ArrowRight className="h-3 w-3" />
                                        </span>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Action Row */}
                            <div className="flex flex-wrap items-center gap-2 pt-1 text-zinc-400">
                              <button
                                type="button"
                                onClick={() => handleCopyTurn(turn)}
                                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] hover:bg-[#2d2e38] hover:text-white transition cursor-pointer"
                              >
                                {copiedId === turn.id ? (
                                  <>
                                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                                    Đã chép
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3.5 w-3.5" />
                                    Sao chép
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleSave({
                                    id: turn.id,
                                    type: "qa",
                                    title: turn.query,
                                    subtitle: turn.response.modelUsed,
                                    content: turn.response.answer,
                                    circularId:
                                      turn.response.citations[0]?.circularId,
                                    savedAt: new Date().toLocaleDateString("vi-VN"),
                                  })
                                }
                                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] transition cursor-pointer ${
                                  isSaved
                                    ? "text-amber-300 bg-amber-500/10"
                                    : "hover:bg-[#2d2e38] hover:text-white"
                                }`}
                              >
                                {isSaved ? (
                                  <BookmarkCheck className="h-3.5 w-3.5" />
                                ) : (
                                  <Bookmark className="h-3.5 w-3.5" />
                                )}
                                {isSaved ? "Đã lưu" : "Lưu"}
                              </button>
                              <span className="text-[10px] text-zinc-500 ml-auto">
                                {turn.response.modelUsed} • {turn.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {loading && (
                    <div className="flex items-center gap-3 text-sm text-zinc-300">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-600 bg-[#2a2b34]">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                      </div>
                      <span>
                        {llmConfig.model} đang tư duy
                        {llmConfig.provider === "gemini" && llmConfig.enableWebSearch
                          ? " & tra cứu Thông tư trực tuyến..."
                          : "..."}
                      </span>
                    </div>
                  )}

                  {error && (
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-xl px-4 py-3">
                      <span>{error}</span>
                      <button
                        type="button"
                        onClick={() => setSettingsOpen(true)}
                        className="font-semibold underline hover:text-white cursor-pointer"
                      >
                        Kiểm tra Cài đặt LLM
                      </button>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>
              )}
            </div>

            {/* Bottom Input Bar */}
            <div className="shrink-0 px-4 sm:px-6 pb-3 pt-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAsk();
                }}
                className="mx-auto max-w-3xl"
              >
                <div className="flex items-center gap-2 rounded-2xl border border-[#3f414f] bg-[#2a2b34] px-3 py-2 focus-within:border-zinc-400 transition">
                  <button
                    type="button"
                    onClick={() => setActiveView("library")}
                    title="Mở Kho Thông tư"
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-[#363744] hover:text-white transition cursor-pointer"
                  >
                    <BookOpen className="h-4 w-4" />
                  </button>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Hỏi bất kỳ tình huống pháp lý giáo dục hoặc Thông tư Bộ GD&ĐT nào..."
                    className="flex-1 bg-transparent py-1 text-sm text-white placeholder:text-zinc-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    title="Gửi câu hỏi"
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition cursor-pointer ${
                      input.trim() && !loading
                        ? "bg-white text-black hover:bg-zinc-200"
                        : "bg-[#3b3d4a] text-zinc-500 cursor-not-allowed"
                    }`}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowUp className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-center text-[11px] text-zinc-500">
                  LLM có thể mắc sai sót. Vui lòng đối chiếu văn bản chính thức tại{" "}
                  <a
                    href="https://moet.gov.vn"
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-zinc-300"
                  >
                    moet.gov.vn
                  </a>
                  .
                </p>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
            {activeView === "library" && (
              <CircularLibrary
                persona={persona}
                onSelectCircular={(id) => openCircularDrawer(id)}
              />
            )}

            {activeView === "tools" && (
              <TeacherCalculators
                onOpenCircular={(id) => openCircularDrawer(id)}
              />
            )}

            {activeView === "prompts" && (
              <div className="mx-auto max-w-4xl space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Mẫu câu hỏi tra cứu nhanh
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Chọn một câu hỏi mẫu bên dưới để hỏi ngay trong giao diện Chat.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SUGGESTED_QUESTIONS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAsk(item.question)}
                      className="group flex flex-col justify-between rounded-xl border border-[#383945] bg-[#2a2b34] p-4 text-left hover:border-zinc-400 hover:bg-[#30313d] transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-zinc-200">
                          {item.tag}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {item.persona === "teacher"
                            ? "Giáo viên"
                            : "Muốn làm giáo viên"}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-zinc-100 group-hover:text-white leading-snug">
                        {item.question}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeView === "saved" && (
              <div className="mx-auto max-w-4xl space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Mục đã lưu ({savedItems.length})
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Các câu trả lời và điều khoản Thông tư bạn đã đánh dấu để tra cứu nhanh.
                  </p>
                </div>

                {savedItems.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#383945] bg-[#2a2b34]/50 p-12 text-center">
                    <Bookmark className="mx-auto h-8 w-8 text-zinc-500" />
                    <p className="mt-2 text-sm text-zinc-300">
                      Chưa có mục nào được lưu.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {savedItems.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-[#383945] bg-[#2a2b34] p-4 flex flex-col justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                              {item.type === "qa" ? "Hỏi đáp" : "Điều khoản"} •{" "}
                              {item.savedAt}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleSave(item)}
                              className="rounded p-1 text-zinc-500 hover:text-rose-400 cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <h3 className="text-sm font-semibold text-white">
                            {item.title}
                          </h3>
                          <p className="text-xs text-sky-300 mt-0.5">
                            {item.subtitle}
                          </p>
                          <p className="mt-2 text-xs text-zinc-400 line-clamp-3">
                            {item.content}
                          </p>
                        </div>
                        {item.circularId && (
                          <button
                            type="button"
                            onClick={() =>
                              openCircularDrawer(item.circularId!, item.articleId)
                            }
                            className="self-start text-xs font-medium text-sky-300 hover:underline cursor-pointer"
                          >
                            Mở văn bản gốc →
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Global Slide-over Circular Detail Drawer */}
      <CircularDetailDrawer
        circular={drawerCircular}
        highlightedArticleId={highlightedArticleId}
        onClose={() => {
          setDrawerCircularId(null);
          setHighlightedArticleId(null);
        }}
        onAskAboutArticle={(question) => handleAsk(question)}
        savedIds={savedIds}
        onToggleSave={handleToggleSave}
      />

      {/* LLM Settings Modal */}
      <LLMSettingsModal
        open={settingsOpen}
        config={llmConfig}
        onSave={saveLLMConfig}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
