export type Persona = "all" | "teacher" | "aspiring";

export type LegalCategory =
  | "che-do-lam-viec"
  | "day-them-hoc-them"
  | "chuan-nghe-nghiep-luong"
  | "nghiep-vu-su-pham-tuyen-dung"
  | "danh-gia-hoc-sinh"
  | "nang-luc-so";

export type DocumentStatus = "active" | "upcoming" | "consolidated";

export type LLMProvider = "gemini" | "ollama" | "openai-compatible";

export interface LLMConfig {
  provider: LLMProvider;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  enableWebSearch: boolean;
  enableReasoning: boolean;
}

export interface ChatMessageInput {
  role: "user" | "assistant";
  content: string;
}

export interface WebSource {
  title: string;
  url: string;
}

export interface LegalArticle {
  id: string;
  articleNumber: string;
  title: string;
  content: string;
  keyPoints: string[];
  keywords: string[];
  audience: ("teacher" | "aspiring")[];
}

export interface CircularDocument {
  id: string;
  code: string;
  shortTitle: string;
  fullTitle: string;
  issuingBody: string;
  issuedDate: string;
  effectiveDate: string;
  status: DocumentStatus;
  category: LegalCategory;
  audience: ("teacher" | "aspiring")[];
  replacesOrAmends?: string;
  summary: string;
  highlights: string[];
  practicalNote?: string;
  sourceUrl: string;
  articles: LegalArticle[];
}

export interface CitationItem {
  circularId: string;
  circularCode: string;
  circularTitle: string;
  effectiveDate: string;
  status: DocumentStatus;
  articleId: string;
  articleNumber: string;
  articleTitle: string;
  excerpt: string;
  relevanceScore: number;
}

export interface QAResponse {
  answer: string;
  directSummary?: string;
  reasoning?: string;
  practicalTips: string[];
  citations: CitationItem[];
  webSources: WebSource[];
  relatedQuestions: string[];
  mode: "gemini" | "ollama" | "openai-compatible" | "local-fallback";
  modelUsed: string;
  matchedKeywords: string[];
  needsSetup?: boolean;
}

export interface SavedItem {
  id: string;
  type: "article" | "qa";
  title: string;
  subtitle: string;
  content: string;
  circularId?: string;
  articleId?: string;
  savedAt: string;
}
