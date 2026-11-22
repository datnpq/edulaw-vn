import { NextRequest } from "next/server";
import { retrieveRelevantArticles } from "@/lib/rag-engine";
import {
  ChatMessageInput,
  CitationItem,
  LLMConfig,
  Persona,
  WebSource,
} from "@/types/legal";

export const dynamic = "force-dynamic";

function buildSystemPrompt(persona: Persona, referenceContext: string): string {
  const personaDesc =
    persona === "teacher"
      ? "Giáo viên đang công tác (chế độ làm việc, định mức tiết dạy, kiêm nhiệm, dạy thêm học thêm, học bạ số, chuẩn nghề nghiệp, thăng hạng, lương & phụ cấp)."
      : persona === "aspiring"
        ? "Người có nguyện vọng trở thành giáo viên / Sinh viên sư phạm / Cử nhân ngoài sư phạm muốn học chứng chỉ nghiệp vụ sư phạm & dự tuyển viên chức giáo dục."
        : "Giáo viên đang công tác hoặc người có nguyện vọng trở thành giáo viên tại Việt Nam.";

  return `Bạn là EduLaw AI — chuyên gia tư vấn pháp lý giáo dục Việt Nam, am hiểu sâu sắc các Thông tư của Bộ Giáo dục và Đào tạo (Bộ GD&ĐT), Luật Giáo dục 2019, Luật Nhà giáo và các Nghị định hướng dẫn.
Thời điểm hiện tại: Tháng 11/2026. Đối tượng: ${personaDesc}

Nguyên tắc trả lời:
1. Mở đầu bằng **Kết luận ngắn gọn (1–2 câu)** trả lời thẳng vào câu hỏi.
2. Nêu rõ **Số hiệu Thông tư / Nghị định**, **Điều khoản** và **mốc hiệu lực** nếu có.
3. Trình bày súc tích bằng gạch đầu dòng, dễ tra cứu. Nếu có suy luận nội bộ, chỉ suy luận thật ngắn gọn (tối đa 3–4 ý ngắn) rồi đi thẳng vào câu trả lời.
4. Trả lời hoàn toàn bằng **tiếng Việt**.

${
  referenceContext
    ? `Tài liệu tham khảo nhanh (có thể dùng hoặc mở rộng bằng suy luận/tìm kiếm):\n${referenceContext}`
    : ""
}`;
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  function encodeEvent(obj: Record<string, unknown>) {
    return encoder.encode(JSON.stringify(obj) + "\n");
  }

  let body: {
    query?: string;
    persona?: Persona;
    history?: ChatMessageInput[];
    llmConfig?: Partial<LLMConfig>;
  };

  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Dữ liệu yêu cầu không hợp lệ." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const query = typeof body?.query === "string" ? body.query.trim() : "";
  if (!query || query.length < 2) {
    return new Response(
      JSON.stringify({ error: "Vui lòng nhập câu hỏi tối thiểu 2 ký tự." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const persona: Persona =
    body?.persona === "teacher" || body?.persona === "aspiring"
      ? body.persona
      : "all";

  const history: ChatMessageInput[] = Array.isArray(body?.history)
    ? body.history
        .filter(
          (m): m is ChatMessageInput =>
            typeof m === "object" &&
            m !== null &&
            (m.role === "user" || m.role === "assistant") &&
            typeof m.content === "string"
        )
        .slice(-6)
    : [];

  const config: LLMConfig = {
    provider: body?.llmConfig?.provider ?? "ollama",
    model:
      body?.llmConfig?.model?.trim() ||
      (body?.llmConfig?.provider === "gemini"
        ? "gemini-2.5-flash"
        : body?.llmConfig?.provider === "openai-compatible"
          ? "gpt-4o-mini"
          : "qwen3:4b"),
    apiKey: body?.llmConfig?.apiKey,
    baseUrl: body?.llmConfig?.baseUrl,
    enableWebSearch: body?.llmConfig?.enableWebSearch ?? true,
    enableReasoning: body?.llmConfig?.enableReasoning ?? true,
  };

  // Retrieve top-2 relevant circulars as quick context + clickable citation cards
  const scored = retrieveRelevantArticles(query, persona, 2);
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
        `[${i + 1}] ${s.circular.code} (Hiệu lực ${s.circular.effectiveDate}) - ${s.article.articleNumber}: ${s.article.content}`
    )
    .join("\n");

  const systemPrompt = buildSystemPrompt(persona, referenceContext);

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send metadata & citations immediately so UI shows context right away
        controller.enqueue(
          encodeEvent({
            type: "meta",
            citations,
            modelUsed: config.model,
            mode: config.provider,
          })
        );

        // Check missing API keys for cloud providers
        const geminiKey =
          config.apiKey?.trim() || process.env.GEMINI_API_KEY?.trim();
        const openaiKey =
          config.apiKey?.trim() || process.env.OPENAI_API_KEY?.trim();

        if (
          (config.provider === "gemini" && !geminiKey) ||
          (config.provider === "openai-compatible" && !openaiKey)
        ) {
          controller.enqueue(
            encodeEvent({
              type: "setup_required",
              answer:
                "Bạn chưa cấu hình **API Key** cho mô hình LLM đã chọn. Bấm **⚙ Cài đặt LLM** ở góc trên bên phải để nhập API Key (hoặc chuyển sang **Ollama Local** đang chạy sẵn `qwen3:4b` trên máy).",
            })
          );
          controller.enqueue(encodeEvent({ type: "done" }));
          controller.close();
          return;
        }

        // 1. OLLAMA LOCAL STREAMING
        if (config.provider === "ollama") {
          const baseUrl = (
            config.baseUrl?.trim() ||
            process.env.OLLAMA_BASE_URL?.trim() ||
            "http://localhost:11434"
          ).replace(/\/$/, "");

          const messages = [
            { role: "system", content: systemPrompt },
            ...history.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: query },
          ];

          const res = await fetch(`${baseUrl}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: request.signal,
            body: JSON.stringify({
              model: config.model,
              messages,
              stream: true,
              think: config.enableReasoning,
              options: {
                num_ctx: 4096,
                num_predict: config.enableReasoning ? 2048 : 1024,
                temperature: 0.3,
              },
            }),
          });

          if (!res.ok || !res.body) {
            const errText = await res.text();
            throw new Error(
              `Ollama lỗi (${res.status}): ${errText.slice(0, 180)}`
            );
          }

          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          let inThinkTag = false;

          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (!line.trim()) continue;
              try {
                const chunk = JSON.parse(line);
                const thinkingDelta: string | undefined =
                  chunk?.message?.thinking;
                const contentDelta: string | undefined =
                  chunk?.message?.content;

                if (thinkingDelta) {
                  controller.enqueue(
                    encodeEvent({ type: "reasoning", delta: thinkingDelta })
                  );
                }

                if (contentDelta) {
                  // Handle models that emit <think>...</think> inline inside content
                  let text = contentDelta;
                  if (text.includes("<think>")) {
                    inThinkTag = true;
                    text = text.replace("<think>", "");
                  }
                  if (text.includes("</think>")) {
                    const [before, after] = text.split("</think>");
                    if (before) {
                      controller.enqueue(
                        encodeEvent({ type: "reasoning", delta: before })
                      );
                    }
                    inThinkTag = false;
                    if (after) {
                      controller.enqueue(
                        encodeEvent({ type: "answer", delta: after })
                      );
                    }
                  } else if (text) {
                    controller.enqueue(
                      encodeEvent({
                        type: inThinkTag ? "reasoning" : "answer",
                        delta: text,
                      })
                    );
                  }
                }
              } catch {
                // Skip malformed partial chunk
              }
            }
          }

          controller.enqueue(encodeEvent({ type: "done" }));
          controller.close();
          return;
        }

        // 2. GOOGLE GEMINI STREAMING (SSE)
        if (config.provider === "gemini") {
          const contents = [
            ...history.map((m) => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content }],
            })),
            { role: "user", parts: [{ text: query }] },
          ];

          const payload: Record<string, unknown> = {
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents,
            generationConfig: {
              temperature: 0.3,
              ...(config.enableReasoning && config.model.includes("2.5")
                ? {
                    thinkingConfig: {
                      includeThoughts: true,
                      thinkingBudget: config.model.includes("pro") ? 4096 : 2048,
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
              config.model
            )}:streamGenerateContent?alt=sse&key=${encodeURIComponent(geminiKey!)}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: request.signal,
              body: JSON.stringify(payload),
            }
          );

          if (!res.ok || !res.body) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(
              errData?.error?.message || `Gemini API lỗi HTTP ${res.status}`
            );
          }

          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          const webSourcesMap = new Map<string, WebSource>();

          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const jsonStr = trimmed.slice(5).trim();
              if (!jsonStr || jsonStr === "[DONE]") continue;
              try {
                const chunk = JSON.parse(jsonStr);
                const candidate = chunk?.candidates?.[0];
                const parts: Array<{ text?: string; thought?: boolean }> =
                  candidate?.content?.parts ?? [];

                for (const part of parts) {
                  if (!part?.text) continue;
                  controller.enqueue(
                    encodeEvent({
                      type: part.thought ? "reasoning" : "answer",
                      delta: part.text,
                    })
                  );
                }

                const gChunks: Array<{ web?: { uri?: string; title?: string } }> =
                  candidate?.groundingMetadata?.groundingChunks ?? [];
                for (const gc of gChunks) {
                  const uri = gc?.web?.uri;
                  if (uri && !webSourcesMap.has(uri)) {
                    webSourcesMap.set(uri, {
                      url: uri,
                      title: gc?.web?.title || new URL(uri).hostname,
                    });
                  }
                }
              } catch {
                // Ignore partial SSE JSON
              }
            }
          }

          if (webSourcesMap.size > 0) {
            controller.enqueue(
              encodeEvent({
                type: "sources",
                webSources: Array.from(webSourcesMap.values()).slice(0, 6),
              })
            );
          }

          controller.enqueue(encodeEvent({ type: "done" }));
          controller.close();
          return;
        }

        // 3. OPENAI-COMPATIBLE STREAMING (SSE)
        const baseUrl = (
          config.baseUrl?.trim() ||
          process.env.OPENAI_BASE_URL?.trim() ||
          "https://api.openai.com/v1"
        ).replace(/\/$/, "");

        const res = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          signal: request.signal,
          body: JSON.stringify({
            model: config.model,
            stream: true,
            temperature: 0.3,
            messages: [
              { role: "system", content: systemPrompt },
              ...history.map((m) => ({ role: m.role, content: m.content })),
              { role: "user", content: query },
            ],
          }),
        });

        if (!res.ok || !res.body) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(
            errData?.error?.message || `API lỗi HTTP ${res.status}`
          );
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const jsonStr = trimmed.slice(5).trim();
            if (!jsonStr || jsonStr === "[DONE]") continue;
            try {
              const chunk = JSON.parse(jsonStr);
              const delta = chunk?.choices?.[0]?.delta;
              if (delta?.reasoning_content) {
                controller.enqueue(
                  encodeEvent({
                    type: "reasoning",
                    delta: delta.reasoning_content,
                  })
                );
              }
              if (delta?.content) {
                controller.enqueue(
                  encodeEvent({ type: "answer", delta: delta.content })
                );
              }
            } catch {
              // Ignore partial chunk
            }
          }
        }

        controller.enqueue(encodeEvent({ type: "done" }));
        controller.close();
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          controller.enqueue(
            encodeEvent({
              type: "error",
              error:
                err instanceof Error
                  ? err.message
                  : "Không thể kết nối tới LLM.",
            })
          );
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
