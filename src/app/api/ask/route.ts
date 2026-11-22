import { NextRequest, NextResponse } from "next/server";
import { askLLM } from "@/lib/llm-service";
import { ChatMessageInput, LLMConfig, Persona } from "@/types/legal";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = typeof body?.query === "string" ? body.query.trim() : "";
    const persona: Persona =
      body?.persona === "teacher" || body?.persona === "aspiring"
        ? body.persona
        : "all";

    const history: ChatMessageInput[] = Array.isArray(body?.history)
      ? body.history
          .filter(
            (m: unknown): m is ChatMessageInput =>
              typeof m === "object" &&
              m !== null &&
              ((m as ChatMessageInput).role === "user" ||
                (m as ChatMessageInput).role === "assistant") &&
              typeof (m as ChatMessageInput).content === "string"
          )
          .slice(-10)
      : [];

    const llmConfig: Partial<LLMConfig> | undefined =
      body?.llmConfig && typeof body.llmConfig === "object"
        ? body.llmConfig
        : undefined;

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: "Vui lòng nhập câu hỏi tối thiểu 2 ký tự." },
        { status: 400 }
      );
    }

    const result = await askLLM(query, history, persona, llmConfig);
    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Không thể kết nối tới LLM. Vui lòng kiểm tra lại cấu hình.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
