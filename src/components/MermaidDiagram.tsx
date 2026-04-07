import { useEffect, useId, useState } from "react";
import mermaid from "mermaid";
import { translations, type Language } from "../i18n";
import type { Entity, EntityType, LegalMapResult, Phase } from "../types";

mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  flowchart: {
    curve: "cardinal"
  }
});

interface MermaidDiagramProps {
  data: LegalMapResult | null;
  activePhaseIndex: number;
  mode: "single" | "cumulative";
  language: Language;
}

function getVisiblePhases(phases: Phase[], activePhaseIndex: number, mode: "single" | "cumulative") {
  if (mode === "single") {
    return phases[activePhaseIndex] ? [phases[activePhaseIndex]] : [];
  }

  return phases.slice(0, activePhaseIndex + 1);
}

function escapeLabel(value: string) {
  return value.replace(/"/g, '\\"');
}

function colorFromId(id: string) {
  let hash = 0;
  for (const char of id) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }

  const hue = Math.abs(hash) % 360;
  return {
    fill: `hsl(${hue} 72% 90%)`,
    stroke: `hsl(${hue} 52% 38%)`
  };
}

function entityNode(entity: Entity, label: string) {
  switch (entity.type) {
    case "Person":
      return `${entity.id}(["${label}"])`;
    case "Company":
      return `${entity.id}["${label}"]`;
    case "Organization":
      return `${entity.id}[["${label}"]]`;
    case "Object":
      return `${entity.id}{{"${label}"}}`;
    case "Other":
    default:
      return `${entity.id}("${label}")`;
  }
}

function typeClassName(type: EntityType) {
  return `type-${type.toLowerCase()}`;
}

function buildDiagram(
  data: LegalMapResult,
  activePhaseIndex: number,
  mode: "single" | "cumulative",
  language: Language
) {
  const visiblePhases = getVisiblePhases(data.phases, activePhaseIndex, mode);
  const entityMap = new Map(data.entities.map((entity) => [entity.id, entity]));
  const copy = translations[language];
  const lines = [
    "flowchart LR",
    "  classDef type-person stroke-width:3px;",
    "  classDef type-company stroke-width:3px,stroke-dasharray: 0;",
    "  classDef type-organization stroke-width:3px,stroke-dasharray: 8 4;",
    "  classDef type-object stroke-width:3px;",
    "  classDef type-other stroke-width:2.5px,stroke-dasharray: 3 3;"
  ];
  let edgeCount = 0;

  for (const entity of data.entities) {
    const label = escapeLabel(`${entity.name}\\n(${entity.type})`);
    const colors = colorFromId(entity.id);
    lines.push(`  ${entityNode(entity, label)}`);
    lines.push(`  style ${entity.id} fill:${colors.fill},stroke:${colors.stroke},stroke-width:3px,color:#111827;`);
    lines.push(`  class ${entity.id} ${typeClassName(entity.type)};`);
  }

  visiblePhases.forEach((phase) => {
    phase.interactions.forEach((interaction) => {
      const from = entityMap.get(interaction.from);
      const to = entityMap.get(interaction.to);
      if (!from || !to) {
        return;
      }

      const edgeLabel = [
        interaction.action,
        interaction.object ? `${copy.objectLabel}: ${interaction.object}` : "",
        interaction.legal_basis ? `${copy.legalBasisLabel}: ${interaction.legal_basis}` : ""
      ]
        .filter(Boolean)
        .join("<br/>");

      lines.push(`  ${interaction.from} -->|"${escapeLabel(edgeLabel)}"| ${interaction.to}`);
      lines.push(
        `  linkStyle ${edgeCount} stroke:${mode === "single" ? "#0f766e" : "#2563eb"},stroke-width:2.5px,opacity:0.9;`
      );
      edgeCount += 1;
    });
  });

  return lines.join("\n");
}

export function MermaidDiagram({ data, activePhaseIndex, mode, language }: MermaidDiagramProps) {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const id = useId().replace(/:/g, "");
  const copy = translations[language];

  useEffect(() => {
    if (!data || !data.phases.length) {
      setSvg("");
      setError("");
      return;
    }

    const render = async () => {
      try {
        const diagram = buildDiagram(data, activePhaseIndex, mode, language);
        const rendered = await mermaid.render(`legal-map-${id}`, diagram);
        setSvg(rendered.svg);
        setError("");
      } catch (renderError) {
        setSvg("");
        setError(renderError instanceof Error ? renderError.message : copy.renderError);
      }
    };

    void render();
  }, [activePhaseIndex, copy.renderError, data, id, language, mode]);

  if (!data) {
    return <div className="empty-state">{copy.emptyState}</div>;
  }

  if (error) {
    return <div className="error-panel">{error}</div>;
  }

  return <div className="diagram-shell" dangerouslySetInnerHTML={{ __html: svg }} />;
}
