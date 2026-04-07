import type { LegalMapResult, LlmConfig } from "../types";

const SYSTEM_PROMPTS: Record<LlmConfig["language"], string> = {
  en: [
    "You are a Legal Data Architect who structures legal fact patterns into a relationship map.",
    "Return strict JSON only.",
    "Only allow two top-level keys: entities and phases.",
    'entities must follow [{"id":"E1","name":"A","type":"Person"}].',
    "phases must be a chronological array, and each phase must include timestamp or step_name plus interactions.",
    'interactions must follow [{"from":"E1","to":"E2","action":"Loan","object":"KRW 100 million","legal_basis":"Contract"}].',
    "Do not add explanations, markdown, or code fences.",
    "Do not infer facts that are not stated. Structure only the minimum supported by the text."
  ].join(" "),
  ko: [
    "당신은 한국어 법률 사실관계를 법적 관계도로 구조화하는 Legal Data Architect이다.",
    "반드시 strict JSON만 반환한다.",
    "최상위 키는 entities, phases 두 개만 허용한다.",
    'entities는 [{"id":"E1","name":"A","type":"Person"}] 형식이다.',
    "phases는 시간순 배열이며 각 phase는 timestamp 또는 step_name 중 하나 이상과 interactions 배열을 포함한다.",
    'interactions는 [{"from":"E1","to":"E2","action":"금전 소비대차","object":"1억원","legal_basis":"Contract"}] 형식이다.',
    "설명문, 코드펜스, 마크다운을 절대 추가하지 않는다.",
    "명시되지 않은 사실은 추정하지 말고 필요한 최소한만 구조화한다."
  ].join(" "),
  zh: [
    "你是一名 Legal Data Architect，负责将法律事实结构化为关系图。",
    "只返回 strict JSON。",
    "顶层只允许两个键：entities 和 phases。",
    'entities 必须采用 [{"id":"E1","name":"A","type":"Person"}] 格式。',
    "phases 必须是按时间顺序排列的数组，每个 phase 至少包含 timestamp 或 step_name 之一，以及 interactions。",
    'interactions 必须采用 [{"from":"E1","to":"E2","action":"Loan","object":"KRW 100 million","legal_basis":"Contract"}] 格式。',
    "不要添加解释、Markdown 或代码块。",
    "不要推断未明确写出的事实，只保留文本支持的最小结构。"
  ].join(" "),
  ja: [
    "あなたは法律上の事実関係を関係図に構造化する Legal Data Architect です。",
    "strict JSON のみを返してください。",
    "最上位キーは entities と phases のみ許可されます。",
    'entities は [{"id":"E1","name":"A","type":"Person"}] 形式です。',
    "phases は時系列配列で、各 phase は timestamp または step_name のいずれかと interactions を含みます。",
    'interactions は [{"from":"E1","to":"E2","action":"Loan","object":"KRW 100 million","legal_basis":"Contract"}] 形式です。',
    "説明文、Markdown、コードフェンスは追加しないでください。",
    "明示されていない事実は推測せず、本文が支える最小限の構造だけを返してください。"
  ].join(" ")
};

const USER_PROMPT_PREFIX: Record<LlmConfig["language"], string> = {
  en: "Parse the following legal fact pattern so its time structure is explicit. Return strict JSON only.",
  ko: "다음 한국어 사실관계를 시간 구조가 드러나도록 파싱해 주세요. 출력은 strict JSON만 반환하세요.",
  zh: "请解析下列法律事实，使时间结构清晰可见。只返回 strict JSON。",
  ja: "次の法律上の事実関係を、時間構造が明確になるよう解析してください。strict JSON のみ返してください。"
};

function extractJson(content: string): string {
  const trimmed = content.trim();
  if (trimmed.startsWith("{")) {
    return trimmed;
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1);
  }

  throw new Error("LLM 응답에서 JSON 객체를 찾지 못했습니다.");
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function isLegalMapResult(value: unknown): value is LegalMapResult {
  const candidate = asRecord(value);
  if (!candidate) {
    return false;
  }

  const entities = candidate.entities;
  const phases = candidate.phases;

  return (
    Array.isArray(entities) &&
    entities.every((entity) => {
      const entityRecord = asRecord(entity);
      return (
        !!entityRecord &&
        typeof entityRecord.id === "string" &&
        typeof entityRecord.name === "string" &&
        typeof entityRecord.type === "string"
      );
    }) &&
    Array.isArray(phases) &&
    phases.every((phase) => {
      const phaseRecord = asRecord(phase);
      if (!phaseRecord || !Array.isArray(phaseRecord.interactions)) {
        return false;
      }

      const hasTimeKey =
        (typeof phaseRecord.timestamp === "string" && phaseRecord.timestamp.length > 0) ||
        (typeof phaseRecord.step_name === "string" && phaseRecord.step_name.length > 0);

      return (
        hasTimeKey &&
        phaseRecord.interactions.every((interaction) => {
          const interactionRecord = asRecord(interaction);
          return (
            !!interactionRecord &&
            typeof interactionRecord.from === "string" &&
            typeof interactionRecord.to === "string" &&
            typeof interactionRecord.action === "string" &&
            typeof interactionRecord.object === "string" &&
            typeof interactionRecord.legal_basis === "string"
          );
        })
      );
    })
  );
}

export async function generateLegalMap(
  factText: string,
  config: LlmConfig
): Promise<LegalMapResult> {
  if (!config.apiKey.trim()) {
    throw new Error("API_KEY를 입력해야 합니다.");
  }

  if (!config.baseUrl.trim()) {
    throw new Error("BASE_URL을 입력해야 합니다.");
  }

  const response = await fetch(config.baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.1,
      response_format: {
        type: "json_object"
      },
      messages: [
        { role: "system", content: SYSTEM_PROMPTS[config.language] },
        {
          role: "user",
          content: [USER_PROMPT_PREFIX[config.language], "", factText].join("\n")
        }
      ]
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`LLM 호출 실패: ${response.status} ${detail}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    throw new Error("LLM 응답 형식이 예상과 다릅니다.");
  }

  const parsed = JSON.parse(extractJson(content));
  if (!isLegalMapResult(parsed)) {
    throw new Error("JSON 구조가 entities/phases 스키마를 충족하지 않습니다.");
  }

  return parsed;
}
