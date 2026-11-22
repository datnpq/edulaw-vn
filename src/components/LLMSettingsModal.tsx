"use client";

import { useState } from "react";
import { LLMConfig, LLMProvider } from "@/types/legal";
import {
  Brain,
  CheckCircle2,
  Globe,
  KeyRound,
  Loader2,
  Server,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";

interface LLMSettingsModalProps {
  open: boolean;
  config: LLMConfig;
  onSave: (next: LLMConfig) => void;
  onClose: () => void;
}

const GEMINI_MODELS = [
  { id: "gemini-2.5-flash", label: "gemini-2.5-flash (Nhanh • Reasoning + Web Search)" },
  { id: "gemini-2.5-pro", label: "gemini-2.5-pro (Tư duy pháp lý chuyên sâu)" },
];

const OLLAMA_PRESETS = [
  "qwen2.5:3b",
  "qwen3:4b",
  "qwen3:8b",
  "deepseek-r1:8b",
];

export function LLMSettingsModal({
  open,
  config,
  onSave,
  onClose,
}: LLMSettingsModalProps) {
  const [draft, setDraft] = useState<LLMConfig>(config);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
    models?: string[];
  } | null>(null);

  if (!open) return null;

  function switchProvider(provider: LLMProvider) {
    setTestResult(null);
    if (provider === "gemini") {
      setDraft({
        ...draft,
        provider,
        model: "gemini-2.5-flash",
        baseUrl: "",
        enableWebSearch: true,
        enableReasoning: true,
      });
    } else if (provider === "ollama") {
      setDraft({
        ...draft,
        provider,
        model: "qwen3:8b",
        baseUrl: draft.baseUrl || "http://localhost:11434",
        enableWebSearch: false,
        enableReasoning: true,
      });
    } else {
      setDraft({
        ...draft,
        provider,
        model: "gpt-4o-mini",
        baseUrl: "https://api.openai.com/v1",
        enableWebSearch: false,
        enableReasoning: true,
      });
    }
  }

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/llm/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (data.ok) {
        setTestResult({
          ok: true,
          message: data.message,
          models: data.models,
        });
        if (
          draft.provider === "ollama" &&
          Array.isArray(data.models) &&
          data.models.length > 0 &&
          !data.models.includes(draft.model)
        ) {
          setDraft((d) => ({ ...d, model: data.models[0] }));
        }
      } else {
        setTestResult({
          ok: false,
          message: data.error || "Kết nối thất bại.",
        });
      }
    } catch {
      setTestResult({
        ok: false,
        message: "Lỗi mạng khi kiểm tra kết nối LLM.",
      });
    } finally {
      setTesting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-[2px] p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-[#3a3c48] bg-[#1a1b22] text-[#ececf1] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2e303c] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-white">
                Cài đặt mô hình LLM (Tư duy & Hỏi đáp thực tế)
              </h2>
              <p className="text-[11px] text-zinc-400">
                Gắn Gemini (có tìm kiếm web), Ollama Local hoặc OpenAI / DeepSeek
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-[#2a2b34] hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Provider Tabs */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">
              1. Chọn nhà cung cấp LLM
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "gemini", label: "Google Gemini", sub: "Khuyên dùng" },
                { id: "ollama", label: "Ollama Local", sub: "Chạy máy cá nhân" },
                { id: "openai-compatible", label: "OpenAI / Khác", sub: "DeepSeek, OR..." },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => switchProvider(p.id as LLMProvider)}
                  className={`rounded-xl border p-2.5 text-left transition cursor-pointer ${
                    draft.provider === p.id
                      ? "border-white bg-white/10 text-white"
                      : "border-[#343542] bg-[#24252f] text-zinc-300 hover:border-zinc-500"
                  }`}
                >
                  <p className="text-xs font-semibold">{p.label}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{p.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              2. Mô hình (Model)
            </label>
            {draft.provider === "gemini" ? (
              <select
                value={draft.model}
                onChange={(e) => setDraft({ ...draft, model: e.target.value })}
                className="w-full rounded-xl border border-[#3e404e] bg-[#24252f] px-3 py-2.5 text-xs text-white focus:border-zinc-400 focus:outline-none"
              >
                {GEMINI_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={draft.model}
                  onChange={(e) => setDraft({ ...draft, model: e.target.value })}
                  placeholder={
                    draft.provider === "ollama"
                      ? "VD: qwen3:8b, deepseek-r1:8b..."
                      : "VD: gpt-4o-mini, deepseek-reasoner..."
                  }
                  className="w-full rounded-xl border border-[#3e404e] bg-[#24252f] px-3 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none"
                />
                {draft.provider === "ollama" && (
                  <div className="flex flex-wrap gap-1.5">
                    {(testResult?.models?.length
                      ? testResult.models
                      : OLLAMA_PRESETS
                    ).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setDraft({ ...draft, model: m })}
                        className="rounded-md bg-[#2a2b34] px-2 py-1 text-[10px] text-zinc-300 hover:bg-[#383a47] cursor-pointer"
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* API Key / Base URL */}
          {draft.provider !== "ollama" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-zinc-400" />
                  API Key
                </label>
                {draft.provider === "gemini" && (
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-sky-300 hover:underline"
                  >
                    Lấy Gemini API Key miễn phí →
                  </a>
                )}
              </div>
              <input
                type="password"
                value={draft.apiKey ?? ""}
                onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })}
                placeholder={
                  draft.provider === "gemini"
                    ? "AIza... (hoặc để trống nếu đã cấu hình GEMINI_API_KEY trong .env.local)"
                    : "sk-... (hoặc đặt OPENAI_API_KEY trong .env.local)"
                }
                className="w-full rounded-xl border border-[#3e404e] bg-[#24252f] px-3 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none"
              />
            </div>
          )}

          {draft.provider !== "gemini" && (
            <div>
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5 mb-1.5">
                <Server className="h-3.5 w-3.5 text-zinc-400" />
                Endpoint Base URL
              </label>
              <input
                type="text"
                value={draft.baseUrl ?? ""}
                onChange={(e) => setDraft({ ...draft, baseUrl: e.target.value })}
                placeholder={
                  draft.provider === "ollama"
                    ? "http://localhost:11434"
                    : "https://api.openai.com/v1 (hoặc https://api.deepseek.com/v1)"
                }
                className="w-full rounded-xl border border-[#3e404e] bg-[#24252f] px-3 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none"
              />
            </div>
          )}

          {/* Reasoning & Web Search Toggles */}
          <div className="space-y-2.5 pt-1">
            <label className="flex items-start justify-between gap-3 rounded-xl border border-[#343542] bg-[#24252f] p-3 cursor-pointer">
              <div className="flex items-start gap-2.5">
                <Brain className="h-4 w-4 text-purple-300 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-white">
                    Bật chế độ Tư duy (Reasoning / Thinking)
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    LLM tự phân tích tình huống pháp lý từng bước và hiển thị quá trình suy luận.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={draft.enableReasoning}
                onChange={(e) =>
                  setDraft({ ...draft, enableReasoning: e.target.checked })
                }
                className="mt-1 h-4 w-4 accent-white"
              />
            </label>

            {draft.provider === "gemini" && (
              <label className="flex items-start justify-between gap-3 rounded-xl border border-[#343542] bg-[#24252f] p-3 cursor-pointer">
                <div className="flex items-start gap-2.5">
                  <Globe className="h-4 w-4 text-sky-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-white">
                      Tự tìm kiếm Thông tư trực tiếp (Google Search Grounding)
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Không phụ thuộc mock data — tự tra cứu văn bản mới nhất trên moet.gov.vn & cổng pháp luật.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={draft.enableWebSearch}
                  onChange={(e) =>
                    setDraft({ ...draft, enableWebSearch: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 accent-white"
                />
              </label>
            )}
          </div>

          {/* Test Result */}
          {testResult && (
            <div
              className={`flex items-start gap-2 rounded-xl border p-3 text-xs ${
                testResult.ok
                  ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-200"
                  : "border-rose-500/35 bg-rose-500/10 text-rose-200"
              }`}
            >
              {testResult.ok ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-[#2e303c] bg-[#16171d] px-5 py-3.5">
          <button
            type="button"
            onClick={handleTest}
            disabled={testing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#3e404e] bg-[#24252f] px-3.5 py-2 text-xs font-medium text-zinc-200 hover:bg-[#30313d] disabled:opacity-50 cursor-pointer"
          >
            {testing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Kiểm tra kết nối
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-white cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={() => {
                onSave(draft);
                onClose();
              }}
              className="rounded-xl bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-zinc-200 cursor-pointer"
            >
              Lưu cấu hình
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
