import type { LlmConfig } from "./types";

export const defaultConfig: LlmConfig = {
  apiKey: "",
  baseUrl: "https://api.openai.com/v1/chat/completions",
  model: "gpt-4.1-mini",
  language: "ko"
};
