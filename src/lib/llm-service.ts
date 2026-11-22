import { retrieveRelevantArticles } from "./rag-engine";
import {
  ChatMessageInput,
  CitationItem,
  LLMConfig,
  Persona,
  QAResponse,
  WebSource,
} from "@/types/legal";

function buildSystemPrompt(persona: Persona, referenceContext: string): string {
  const personaDesc =
    persona === "teacher"
      ? "Giáo viên đang công tác (quan tâm chế độ làm việc, định mức tiết dạy, kiêm nhiệm, dạy thêm học thêm, học bạ số, chuẩn nghề nghiệp, thăng hạng, lương & phụ cấp)."
      : persona === "aspiring"
        ? "Người có nguyện vọng trở thành giáo viên / Sinh viên sư phạm / Cử nhân ngoài sư phạm muốn học chứng chỉ nghiệp vụ sư phạm & dự tuyển viên chức giáo dục."
        : "Giáo viên đang công tác hoặc người có nguyện vọng trở thành giáo viên tại Việt Nam.";

  return `Bạn là **EduLaw AI** — chuyên gia tư vấn pháp lý giáo dục Việt Nam, am hiểu sâu sắc hệ thống Thông tư của Bộ Giáo dục và Đào tạo (Bộ GD&ĐT), Luật Giáo dục 2019, Luật Nhà giáo và các Nghị định hướng dẫn liên quan.

Thời điểm hiện tại: Tháng 11/2026.
Đối tượng người dùng: ${personaDesc}

NGUYÊN TẮC TƯ DUY & TRẢ LỜI:
1. **Tự tư duy logic pháp lý (Reasoning):** Phân tích rõ tình huống của người dùng, xác định đúng văn bản mới nhất đang có hiệu lực hoặc sắp có hiệu lực (ưu tiên Thông tư sửa đổi/thay thế mới nhất, tránh trích dẫn văn bản đã hết hiệu lực mà không cảnh báo).
2. **Trích dẫn rõ ràng:** Luôn nêu rõ **Số hiệu Thông tư / Nghị định / Luật**, **Điều khoản cụ thể** và **ngày hiệu lực** nếu có. Nếu bạn có công cụ tìm kiếm web, hãy chủ động tra cứu văn bản mới nhất thay vì chỉ dựa vào trí nhớ.
3. **Cấu trúc câu trả lời tối ưu cho người tra cứu:**
   - Mở đầu bằng **Kết luận ngắn gọn (1–2 câu)** trả lời thẳng vào câu hỏi.
   - Trình bày chi tiết bằng gạch đầu dòng mạch lạc, dễ đọc (có thể dùng bảng nếu so sánh định mức/điều kiện).
   - Kết thúc bằng mục **Lưu ý thực tiễn** (nếu có ngoại lệ, mốc hiệu lực hoặc hồ sơ cần chuẩn bị).
4. **Trung thực pháp lý:** Nếu một chi tiết phụ thuộc quy định riêng của Sở GD&ĐT địa phương hoặc Quy chế nội bộ nhà trường, hãy nói rõ. Không bịa số hiệu Thông tư.
5. Trả lời hoàn toàn bằng **tiếng Việt** chuẩn mực, thân thiện, dễ hiểu.

${
  referenceContext
    ? `TÀI LIỆU THAM KHẢO NỘI BỘ (chỉ dùng hỗ trợ nếu liên quan, bạn hoàn toàn có thể tự tư duy mở rộng hoặc dùng tìm kiếm web để cập nhật thêm):\n${referenceContext}`
    : ""
}`;
}

function extractThinkTag(raw: string): { reasoning?: string; content: string } {
  const match = raw.match(/<think>([\s\S]*?)<\/think>/i);
  if (!match) return { content: raw.trim() };
  const reasoning = match[1].trim();
  const content = raw.replace(/<think>[\s\S]*?<\/think>/i, "").trim();
  return { reasoning: reasoning || undefined, content };
}

function buildCitations(
  query: string,
  persona: Persona
): { citations: CitationItem[]; referenceContext: string; matchedKeywords: string[] } {
  const scored = retrieveRelevantArticles(query, persona, 3);
  const citations: CitationItem[] = scored.map((item) => ({
    circularId: item.circular.id,
    circularCode: item.circular.code,
    circularTitle: item.circular.shortTitle,
    effectiveDate: item.circular.effectiveDate,
    status: item.circular.status,
    articleId: item.article.id,
    articleNumber: item.article.articleNumber,
    articleTitle: item.article.title,
    excerpt: item.article.content,
    relevanceScore: item.score,
  }));

  const referenceContext = scored
    .map(
      (s, i) =>
        `[${i + 1}] ${s.circular.code} (Hiệu lực: ${s.circular.effectiveDate}, Trạng thái: ${s.circular.status}) — ${s.article.articleNumber}: ${s.article.title}\n${s.article.content}`
    )
    .join("\n\n");

  const matchedKeywords = Array.from(
    new Set(scored.flatMap((s) => s.matchedTerms))
  ).slice(0, 6);

  return { citations, referenceContext, matchedKeywords };
}

async function callGemini(
  query: string,
  history: ChatMessageInput[],
  persona: Persona,
  config: LLMConfig,
  referenceContext: string
): Promise<{ answer: string; reasoning?: string; webSources: WebSource[] }> {
  const apiKey = config.apiKey?.trim() || process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }

  const model = config.model?.trim() || "gemini-2.5-flash";
  const systemPrompt = buildSystemPrompt(persona, referenceContext);

  const contents = [
    ...history.slice(-8).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    {
      role: "user",
      parts: [{ text: query }],
    },
  ];

  const payload: Record<string, unknown> = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents,
    generationConfig: {
      temperature: 0.3,
      ...(config.enableReasoning && model.includes("2.5")
        ? {
            thinkingConfig: {
              includeThoughts: true,
              thinkingBudget: model.includes("pro") ? 4096 : 2048,
            },
          }
        : {}),
    },
  };

  if (config.enableWebSearch) {
    payload.tools = [{ google_search: {} }];
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();
  if (!res.ok) {
    const errMsg =
      data?.error?.message || `Gemini API trả về lỗi HTTP ${res.status}`;
    throw new Error(errMsg);
  }

  const candidate = data?.candidates?.[0];
  const parts: Array<{ text?: string; thought?: boolean }> =
    candidate?.content?.parts ?? [];

  const thoughtParts: string[] = [];
  const answerParts: string[] = [];

  for (const part of parts) {
    if (!part?.text) continue;
    if (part.thought) {
      thoughtParts.push(part.text);
    } else {
      answerParts.push(part.text);
    }
  }

  const rawAnswer = answerParts.join("\n").trim();
  const extracted = extractThinkTag(rawAnswer);
  const reasoning =
    thoughtParts.join("\n\n").trim() || extracted.reasoning || undefined;

  // Extract live Google Search Grounding URLs
  const chunks: Array<{ web?: { uri?: string; title?: string } }> =
    candidate?.groundingMetadata?.groundingChunks ?? [];
  const webSources: WebSource[] = [];
  const seen = new Set<string>();
  for (const ch of chunks) {
    const uri = ch?.web?.uri;
    const title = ch?.web?.title;
    if (uri && !seen.has(uri)) {
      seen.add(uri);
      webSources.push({
        url: uri,
        title: title || new URL(uri).hostname,
      });
    }
  }

  return {
    answer: extracted.content || "Không nhận được nội dung trả lời từ Gemini.",
    reasoning,
    webSources: webSources.slice(0, 6),
  };
}

async function callOllama(
  query: string,
  history: ChatMessageInput[],
  persona: Persona,
  config: LLMConfig,
  referenceContext: string
): Promise<{ answer: string; reasoning?: string; webSources: WebSource[] }> {
  const baseUrl = (
    config.baseUrl?.trim() ||
    process.env.OLLAMA_BASE_URL?.trim() ||
    "http://localhost:11434"
  ).replace(/\/$/, "");
  const model = config.model?.trim() || "qwen3:4b";
  const systemPrompt = buildSystemPrompt(persona, referenceContext);

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-8).map((m) => ({
      role: m.role,
      content: m.content,
    })),
    { role: "user", content: query },
  ];

  const res = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      think: config.enableReasoning,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(
      `Không thể gọi Ollama (${res.status}): ${errText.slice(0, 200)}`
    );
  }

  const data = await res.json();
  const rawContent: string = data?.message?.content ?? "";
  const nativeThinking: string | undefined = data?.message?.thinking;
  const extracted = extractThinkTag(rawContent);

  return {
    answer: extracted.content || "Ollama không trả về nội dung.",
    reasoning: nativeThinking?.trim() || extracted.reasoning || undefined,
    webSources: [],
  };
}

async function callOpenAICompatible(
  query: string,
  history: ChatMessageInput[],
  persona: Persona,
  config: LLMConfig,
  referenceContext: string
): Promise<{ answer: string; reasoning?: string; webSources: WebSource[] }> {
  const apiKey = config.apiKey?.trim() || process.env.OPENAI_API_KEY?.trim();
  const baseUrl = (
    config.baseUrl?.trim() ||
    process.env.OPENAI_BASE_URL?.trim() ||
    "https://api.openai.com/v1"
  ).replace(/\/$/, "");
  const model = config.model?.trim() || "gpt-4o-mini";

  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }

  const systemPrompt = buildSystemPrompt(persona, referenceContext);
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-8).map((m) => ({
      role: m.role,
      content: m.content,
    })),
    { role: "user", content: query },
  ];

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.3,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    const errMsg =
      data?.error?.message || `API trả về lỗi HTTP ${res.status}`;
    throw new Error(errMsg);
  }

  const msg = data?.choices?.[0]?.message;
  const rawContent: string = msg?.content ?? "";
  const reasoningContent: string | undefined = msg?.reasoning_content;
  const extracted = extractThinkTag(rawContent);

  return {
    answer: extracted.content || "Model không trả về nội dung.",
    reasoning: reasoningContent?.trim() || extracted.reasoning || undefined,
    webSources: [],
  };
}

export async function askLLM(
  query: string,
  history: ChatMessageInput[],
  persona: Persona,
  rawConfig?: Partial<LLMConfig>
): Promise<QAResponse> {
  const config: LLMConfig = {
    provider: rawConfig?.provider ?? "gemini",
    model:
      rawConfig?.model ||
      (rawConfig?.provider === "ollama"
        ? "qwen3:8b"
        : rawConfig?.provider === "openai-compatible"
          ? "gpt-4o-mini"
          : "gemini-2.5-flash"),
    apiKey: rawConfig?.apiKey,
    baseUrl: rawConfig?.baseUrl,
    enableWebSearch: rawConfig?.enableWebSearch ?? true,
    enableReasoning: rawConfig?.enableReasoning ?? true,
  };

  const { citations, referenceContext, matchedKeywords } = buildCitations(
    query,
    persona
  );

  // Check if credentials/endpoint exist for chosen provider
  const hasGeminiKey = Boolean(
    config.apiKey?.trim() || process.env.GEMINI_API_KEY?.trim()
  );
  const hasOpenAIKey = Boolean(
    config.apiKey?.trim() || process.env.OPENAI_API_KEY?.trim()
  );

  if (
    (config.provider === "gemini" && !hasGeminiKey) ||
    (config.provider === "openai-compatible" && !hasOpenAIKey)
  ) {
    // Graceful prompt guiding user to connect their LLM in Settings
    return {
      answer:
        "Bạn chưa cấu hình **API Key** cho mô hình LLM đã chọn. Hãy bấm biểu tượng **⚙ Cài đặt LLM** ở góc trên bên phải để:\n\n- Nhập **Gemini API Key** (miễn phí tại `aistudio.google.com/apikey`) để bật **Tư duy (Reasoning) + Tự tìm kiếm Thông tư mới nhất trên mạng (Google Search Grounding)**.\n- Hoặc chuyển sang **Ollama Local** nếu bạn đang chạy model nội bộ (`qwen3`, `deepseek-r1`, `gemma3`) trên máy.\n- Hoặc nhập **OpenAI / DeepSeek / OpenRouter API Key**.",
      practicalTips: [
        "Bạn cũng có thể lưu cố định GEMINI_API_KEY trong file .env.local của dự án để không phải nhập lại.",
      ],
      citations,
      webSources: [],
      relatedQuestions: [],
      mode: "local-fallback",
      modelUsed: "Chưa kết nối LLM",
      matchedKeywords,
      needsSetup: true,
    };
  }

  let llmResult: {
    answer: string;
    reasoning?: string;
    webSources: WebSource[];
  };

  if (config.provider === "gemini") {
    llmResult = await callGemini(
      query,
      history,
      persona,
      config,
      referenceContext
    );
  } else if (config.provider === "ollama") {
    llmResult = await callOllama(
      query,
      history,
      persona,
      config,
      referenceContext
    );
  } else {
    llmResult = await callOpenAICompatible(
      query,
      history,
      persona,
      config,
      referenceContext
    );
  }

  return {
    answer: llmResult.answer,
    reasoning: llmResult.reasoning,
    practicalTips: [],
    citations,
    webSources: llmResult.webSources,
    relatedQuestions: [],
    mode: config.provider,
    modelUsed: config.model,
    matchedKeywords,
  };
}
