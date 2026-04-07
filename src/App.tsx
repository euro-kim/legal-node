import { useEffect, useState } from "react";
import { defaultConfig } from "./config";
import { translations, type Language } from "./i18n";
import { CUSTOM_MODEL_ID, CUSTOM_PROVIDER_ID, getProviderById, providerOptions } from "./llmOptions";
import { MermaidDiagram } from "./components/MermaidDiagram";
import { generateLegalMap } from "./lib/legalMapClient";
import type { LegalMapResult, LlmConfig } from "./types";

type TimeMode = "single" | "cumulative";

function normalizeConfig(input: LlmConfig): LlmConfig {
  return {
    apiKey: input.apiKey.trim(),
    baseUrl: input.baseUrl.trim(),
    model: input.model.trim(),
    language: input.language
  };
}

function detectProvider(baseUrl: string) {
  const match = providerOptions.find((provider) => provider.baseUrl === baseUrl);
  return match?.id ?? CUSTOM_PROVIDER_ID;
}

function detectModel(providerId: string, model: string) {
  const provider = getProviderById(providerId);
  if (!provider) {
    return CUSTOM_MODEL_ID;
  }

  return provider.models.includes(model) ? model : CUSTOM_MODEL_ID;
}

export default function App() {
  const [config, setConfig] = useState<LlmConfig>(defaultConfig);
  const [providerId, setProviderId] = useState(() => detectProvider(defaultConfig.baseUrl));
  const [modelChoice, setModelChoice] = useState(() =>
    detectModel(detectProvider(defaultConfig.baseUrl), defaultConfig.model)
  );
  const [factText, setFactText] = useState(translations[defaultConfig.language].sampleFacts);
  const [result, setResult] = useState<LegalMapResult | null>(null);
  const [timeMode, setTimeMode] = useState<TimeMode>("cumulative");
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const copy = translations[config.language];
  const selectedProvider = getProviderById(providerId);
  const activePhase = result?.phases[activePhaseIndex];
  const entitiesSummary = result?.entities ?? [];

  useEffect(() => {
    setFactText((current) => {
      const previousSamples = Object.values(translations).map((item) => item.sampleFacts);
      return previousSamples.includes(current) ? copy.sampleFacts : current;
    });
  }, [copy.sampleFacts]);

  const handleLanguageChange = (language: Language) => {
    setConfig((current) => ({ ...current, language }));
  };

  const handleProviderChange = (nextProviderId: string) => {
    setProviderId(nextProviderId);

    if (nextProviderId === CUSTOM_PROVIDER_ID) {
      setModelChoice(CUSTOM_MODEL_ID);
      return;
    }

    const provider = getProviderById(nextProviderId);
    if (!provider) {
      return;
    }

    setConfig((current) => ({
      ...current,
      baseUrl: provider.baseUrl,
      model: provider.models[0] ?? current.model
    }));
    setModelChoice(provider.models[0] ?? CUSTOM_MODEL_ID);
  };

  const handleModelChange = (nextModel: string) => {
    setModelChoice(nextModel);

    if (nextModel === CUSTOM_MODEL_ID) {
      return;
    }

    setConfig((current) => ({ ...current, model: nextModel }));
  };

  const handleParse = async () => {
    setIsLoading(true);
    setError("");

    try {
      const parsed = await generateLegalMap(factText, normalizeConfig(config));
      setResult(parsed);
      setActivePhaseIndex(0);
    } catch (parseError) {
      setError(parseError instanceof Error ? parseError.message : "Parsing failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="panel input-panel">
        <div className="section-heading">
          <p className="eyebrow">{copy.appEyebrow}</p>
          <h1>{copy.appTitle}</h1>
        </div>

        <div className="control-cluster">
          <div className="section-heading compact">
            <h2>{copy.providerSectionTitle}</h2>
          </div>

          <div className="config-grid">
            <label>
              {copy.languageLabel}
              <select
                value={config.language}
                onChange={(event) => handleLanguageChange(event.target.value as Language)}
              >
                <option value="en">English</option>
                <option value="ko">Korean</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
              </select>
            </label>

            <label>
              {copy.providerLabel}
              <select value={providerId} onChange={(event) => handleProviderChange(event.target.value)}>
                {providerOptions.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.label}
                  </option>
                ))}
                <option value={CUSTOM_PROVIDER_ID}>{copy.customOption}</option>
              </select>
            </label>

            <label>
              {copy.apiKeyLabel}
              <input
                type="password"
                value={config.apiKey}
                onChange={(event) =>
                  setConfig((current) => ({ ...current, apiKey: event.target.value }))
                }
                placeholder="sk-..."
              />
            </label>

            <label className={providerId !== CUSTOM_PROVIDER_ID ? "field-span" : ""}>
              {providerId === CUSTOM_PROVIDER_ID ? copy.customProviderLabel : copy.baseUrlLabel}
              <input
                value={config.baseUrl}
                onChange={(event) =>
                  setConfig((current) => ({ ...current, baseUrl: event.target.value }))
                }
                placeholder="https://api.openai.com/v1/chat/completions"
              />
            </label>

            <label>
              {copy.modelLabel}
              <select value={modelChoice} onChange={(event) => handleModelChange(event.target.value)}>
                {selectedProvider?.models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
                <option value={CUSTOM_MODEL_ID}>{copy.customOption}</option>
              </select>
            </label>

            <label>
              {modelChoice === CUSTOM_MODEL_ID ? copy.customModelLabel : copy.modelLabel}
              <input
                value={config.model}
                onChange={(event) =>
                  setConfig((current) => ({ ...current, model: event.target.value }))
                }
                placeholder="gpt-4.1-mini"
                disabled={modelChoice !== CUSTOM_MODEL_ID}
              />
            </label>
          </div>
        </div>

        <label className="fact-input">
          {copy.factsLabel}
          <textarea
            value={factText}
            onChange={(event) => setFactText(event.target.value)}
            rows={12}
            placeholder={copy.factsPlaceholder}
          />
        </label>

        <div className="actions">
          <button type="button" onClick={handleParse} disabled={isLoading}>
            {isLoading ? copy.parsingButton : copy.parseButton}
          </button>
        </div>

        {error ? <div className="error-panel">{error}</div> : null}

        <div className="json-preview">
          <div className="section-heading compact">
            <h2>{copy.jsonPreviewTitle}</h2>
          </div>
          <pre>{JSON.stringify(result, null, 2) || '{\n  "entities": [],\n  "phases": []\n}'}</pre>
        </div>
      </section>

      <section className="panel output-panel">
        <div className="toolbar">
          <div>
            <p className="eyebrow">{copy.timeStructureEyebrow}</p>
            <h2>{copy.diagramTitle}</h2>
          </div>

          <div className="segmented">
            <button
              type="button"
              className={timeMode === "single" ? "active" : ""}
              onClick={() => setTimeMode("single")}
            >
              {copy.currentPhaseOnly}
            </button>
            <button
              type="button"
              className={timeMode === "cumulative" ? "active" : ""}
              onClick={() => setTimeMode("cumulative")}
            >
              {copy.cumulativeView}
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

        <MermaidDiagram
          data={result}
          activePhaseIndex={activePhaseIndex}
          mode={timeMode}
          language={config.language}
        />

        <div className="phase-meta">
          <div>
            <h3>{copy.activePhaseTitle}</h3>
            <p>{activePhase?.step_name || activePhase?.timestamp || copy.noPhaseSelected}</p>
          </div>
          <div>
            <h3>{copy.participantsTitle}</h3>
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
