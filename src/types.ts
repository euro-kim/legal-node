export type EntityType = "Person" | "Company" | "Object" | "Organization" | "Other";

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
}

export interface Interaction {
  from: string;
  to: string;
  action: string;
  object: string;
  legal_basis: string;
}

export interface Phase {
  timestamp?: string;
  step_name?: string;
  interactions: Interaction[];
}

export interface LegalMapResult {
  entities: Entity[];
  phases: Phase[];
}

export interface LlmConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}
