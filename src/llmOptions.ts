import type { Language } from "./i18n";

export interface ModelOption {
  id: string;
  label: string;
}

export interface ProviderOption {
  id: string;
  labels: Record<Language, string>;
  baseUrl: string;
  models: ModelOption[];
}

export const CUSTOM_PROVIDER_ID = "custom";
export const CUSTOM_MODEL_ID = "__custom_model__";

export const providerOptions: ProviderOption[] = [
  {
    id: "openai",
    labels: {
      en: "OpenAI",
      ko: "OpenAI",
      zh: "OpenAI",
      ja: "OpenAI"
    },
    baseUrl: "https://api.openai.com/v1/chat/completions",
    models: [
      { id: "gpt-4.1-mini", label: "GPT-4.1 Mini" },
      { id: "gpt-4.1", label: "GPT-4.1" },
      { id: "gpt-4o-mini", label: "GPT-4o Mini" },
      { id: "gpt-4o", label: "GPT-4o" }
    ]
  },
  {
    id: "gemini",
    labels: {
      en: "Google Gemini",
      ko: "Google Gemini",
      zh: "Google Gemini",
      ja: "Google Gemini"
    },
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    models: [
      { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
      { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
      { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash" }
    ]
  },
  {
    id: "factchat",
    labels: {
      en: "FactChat Gateway",
      ko: "FactChat Gateway",
      zh: "FactChat Gateway",
      ja: "FactChat Gateway"
    },
    baseUrl: "https://factchat-cloud.mindlogic.ai/v1/gateway/chat/completions/",
    models: [
      { id: "gemini-3.1-pro-preview", label: "Gemini 3.1 Pro Preview" },
      { id: "claude-sonnet-4.6", label: "Claude Sonnet 4.6" },
      { id: "gpt-5.2", label: "GPT 5.2" }
    ]
  }
];

export function getProviderById(id: string) {
  return providerOptions.find((provider) => provider.id === id);
}
