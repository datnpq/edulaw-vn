import { NextRequest, NextResponse } from "next/server";
import { LLMProvider } from "@/types/legal";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const provider: LLMProvider = body?.provider ?? "gemini";
    const apiKey: string | undefined = body?.apiKey?.trim();
    const baseUrl: string | undefined = body?.baseUrl?.trim();
    const model: string | undefined = body?.model?.trim();

    if (provider === "gemini") {
      const key = apiKey || process.env.GEMINI_API_KEY?.trim();
      if (!key) {
        return NextResponse.json(
          { ok: false, error: "Chưa nhập Gemini API Key (hoặc biến GEMINI_API_KEY)." },
          { status: 400 }
        );
      }
      const targetModel = model || "gemini-2.5-flash";
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
          targetModel
        )}:generateContent?key=${encodeURIComponent(key)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: "Chào bạn, trả lời ngắn: OK" }] }],
            generationConfig: { maxOutputTokens: 16 },
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json(
          { ok: false, error: data?.error?.message || `HTTP ${res.status}` },
          { status: 400 }
        );
      }
      return NextResponse.json({
        ok: true,
        message: `Kết nối thành công tới ${targetModel}!`,
      });
    }

    if (provider === "ollama") {
      const url = (baseUrl || process.env.OLLAMA_BASE_URL || "http://localhost:11434").replace(
        /\/$/,
        ""
      );
      const res = await fetch(`${url}/api/tags`);
      if (!res.ok) {
        return NextResponse.json(
          { ok: false, error: `Ollama không phản hồi (HTTP ${res.status}).` },
          { status: 400 }
        );
      }
      const data = await res.json();
      const models: string[] = Array.isArray(data?.models)
        ? data.models.map((m: { name: string }) => m.name)
        : [];
      return NextResponse.json({
        ok: true,
        models,
        message:
          models.length > 0
            ? `Kết nối Ollama thành công! Tìm thấy ${models.length} model.`
            : "Kết nối Ollama thành công nhưng chưa có model nào được tải (chạy: ollama pull qwen3:8b).",
      });
    }

    // OpenAI-compatible
    const key = apiKey || process.env.OPENAI_API_KEY?.trim();
    const url = (baseUrl || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(
      /\/$/,
      ""
    );
    if (!key) {
      return NextResponse.json(
        { ok: false, error: "Chưa nhập API Key cho OpenAI-compatible provider." },
        { status: 400 }
      );
    }
    const res = await fetch(`${url}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: model || "gpt-4o-mini",
        messages: [{ role: "user", content: "Reply OK" }],
        max_tokens: 8,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: data?.error?.message || `HTTP ${res.status}` },
        { status: 400 }
      );
    }
    return NextResponse.json({
      ok: true,
      message: `Kết nối thành công tới ${model || "gpt-4o-mini"}!`,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error:
          err instanceof Error
            ? err.message
            : "Không thể kết nối tới máy chủ LLM.",
      },
      { status: 500 }
    );
  }
}
