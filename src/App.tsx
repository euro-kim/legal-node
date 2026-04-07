import { useState } from "react";
import { defaultConfig } from "./config";
import { MermaidDiagram } from "./components/MermaidDiagram";
import { generateLegalMap } from "./lib/legalMapClient";
import type { LegalMapResult, LlmConfig } from "./types";

const SAMPLE_FACTS = `2024년 3월 1일 A는 B에게 사업자금 명목으로 1억 원을 빌려주었다.
같은 날 B는 A에게 2024년 6월 30일까지 변제하겠다는 차용증을 작성해 주었다.
이후 2024년 3월 20일 B는 위 금원 중 5천만 원을 자신의 동생 C에게 증여하였다.
2024년 7월 5일 B가 변제를 하지 않자, A는 C를 상대로 사해행위 취소 가능성을 검토하게 되었다.`;

type TimeMode = "single" | "cumulative";

function normalizeConfig(input: LlmConfig): LlmConfig {
  return {
    apiKey: input.apiKey.trim(),
    baseUrl: input.baseUrl.trim(),
    model: input.model.trim()
  };
}

export default function App() {
  const [config, setConfig] = useState<LlmConfig>(defaultConfig);
  const [factText, setFactText] = useState(SAMPLE_FACTS);
  const [result, setResult] = useState<LegalMapResult | null>(null);
  const [timeMode, setTimeMode] = useState<TimeMode>("cumulative");
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const activePhase = result?.phases[activePhaseIndex];
  const entitiesSummary = result?.entities ?? [];

  const handleParse = async () => {
    setIsLoading(true);
    setError("");

    try {
      const parsed = await generateLegalMap(factText, normalizeConfig(config));
      setResult(parsed);
      setActivePhaseIndex(0);
    } catch (parseError) {
      setError(parseError instanceof Error ? parseError.message : "파싱에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="panel input-panel">
        <div className="section-heading">
          <p className="eyebrow">Legal Fact Parser</p>
          <h1>법적 관계도 생성기</h1>
        </div>

        <div className="config-grid">
          <label>
            API_KEY
            <input
              type="password"
              value={config.apiKey}
              onChange={(event) =>
                setConfig((current) => ({ ...current, apiKey: event.target.value }))
              }
              placeholder="sk-..."
            />
          </label>

          <label>
            BASE_URL
            <input
              value={config.baseUrl}
              onChange={(event) =>
                setConfig((current) => ({ ...current, baseUrl: event.target.value }))
              }
              placeholder="https://api.openai.com/v1/chat/completions"
            />
          </label>

          <label>
            MODEL
            <input
              value={config.model}
              onChange={(event) =>
                setConfig((current) => ({ ...current, model: event.target.value }))
              }
              placeholder="gpt-4.1-mini"
            />
          </label>
        </div>

        <label className="fact-input">
          사실관계 입력
          <textarea
            value={factText}
            onChange={(event) => setFactText(event.target.value)}
            rows={12}
            placeholder="사실관계를 시간 순서가 드러나도록 입력하세요."
          />
        </label>

        <div className="actions">
          <button type="button" onClick={handleParse} disabled={isLoading}>
            {isLoading ? "분석 중..." : "LLM으로 구조화"}
          </button>
        </div>

        {error ? <div className="error-panel">{error}</div> : null}

        <div className="json-preview">
          <div className="section-heading compact">
            <h2>JSON 미리보기</h2>
          </div>
          <pre>{JSON.stringify(result, null, 2) || "{\n  \"entities\": [],\n  \"phases\": []\n}"}</pre>
        </div>
      </section>

      <section className="panel output-panel">
        <div className="toolbar">
          <div>
            <p className="eyebrow">Time Structure</p>
            <h2>단계별 관계도</h2>
          </div>

          <div className="segmented">
            <button
              type="button"
              className={timeMode === "single" ? "active" : ""}
              onClick={() => setTimeMode("single")}
            >
              현재 단계만
            </button>
            <button
              type="button"
              className={timeMode === "cumulative" ? "active" : ""}
              onClick={() => setTimeMode("cumulative")}
            >
              누적 보기
            </button>
          </div>
        </div>

        <div className="phase-strip">
          {result?.phases.map((phase, index) => {
            const label = phase.step_name || phase.timestamp || `Phase ${index + 1}`;
            return (
              <button
                type="button"
                key={label + index}
                className={index === activePhaseIndex ? "phase-chip active" : "phase-chip"}
                onClick={() => setActivePhaseIndex(index)}
              >
                {label}
              </button>
            );
          })}
        </div>

        <MermaidDiagram data={result} activePhaseIndex={activePhaseIndex} mode={timeMode} />

        <div className="phase-meta">
          <div>
            <h3>활성 단계</h3>
            <p>{activePhase?.step_name || activePhase?.timestamp || "선택된 단계 없음"}</p>
          </div>
          <div>
            <h3>등장 주체</h3>
            <ul>
              {entitiesSummary.map((entity) => (
                <li key={entity.id}>
                  {entity.id} · {entity.name} ({entity.type})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
