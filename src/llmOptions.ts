export interface ProviderOption {
  id: string;
  label: string;
  baseUrl: string;
  models: string[];
}

export const CUSTOM_PROVIDER_ID = "custom";
export const CUSTOM_MODEL_ID = "__custom_model__";

export const providerOptions: ProviderOption[] = [
  {
    id: "openai",
    label: "OpenAI",
    baseUrl: "https://api.openai.com/v1/chat/completions",
    models: ["gpt-4.1-mini", "gpt-4.1", "gpt-4o-mini", "gpt-4o"]
  },
  {
    id: "gemini",
    label: "Google Gemini (OpenAI-compatible)",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    models: ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash"]
  },
  {
    id: "factchat",
    label: "FactChat Gateway",
    baseUrl: "https://factchat-cloud.mindlogic.ai/v1/gateway/chat/completions/",
    models: [
      "Claude Sonnet 4.6",
      "Claude Opus 4.6",
      "GPT 5.2",
      "Gemini 3 Flash",
      "Gemini 3 Pro",
      "Gemini 3.1 Pro",
      "GPT 5.2 Codex",
      "GPT 5.1 Codex Max"
    ]
  }
];

export function getProviderById(id: string) {
  return providerOptions.find((provider) => provider.id === id);
}
