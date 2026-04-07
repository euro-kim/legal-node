import { useEffect, useId, useState } from "react";
import mermaid from "mermaid";
import type { LegalMapResult, Phase } from "../types";

mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  flowchart: {
    curve: "basis"
  }
});

interface MermaidDiagramProps {
  data: LegalMapResult | null;
  activePhaseIndex: number;
  mode: "single" | "cumulative";
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

function buildDiagram(data: LegalMapResult, activePhaseIndex: number, mode: "single" | "cumulative") {
  const visiblePhases = getVisiblePhases(data.phases, activePhaseIndex, mode);
  const entityMap = new Map(data.entities.map((entity) => [entity.id, entity]));
  const lines = ["flowchart LR"];
  let edgeCount = 0;

  for (const entity of data.entities) {
    const label = escapeLabel(`${entity.name}\\n(${entity.type})`);
    lines.push(`  ${entity.id}["${label}"]`);
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
        interaction.object ? `목적물: ${interaction.object}` : "",
        interaction.legal_basis ? `법적근거: ${interaction.legal_basis}` : ""
      ]
        .filter(Boolean)
        .join("<br/>");

      lines.push(`  ${interaction.from} -->|"${escapeLabel(edgeLabel)}"| ${interaction.to}`);
      lines.push(
        `  linkStyle ${edgeCount} stroke:${mode === "single" ? "#14532d" : "#1d4ed8"},stroke-width:2px;`
      );
      edgeCount += 1;
    });
  });

  return lines.join("\n");
}

export function MermaidDiagram({ data, activePhaseIndex, mode }: MermaidDiagramProps) {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    if (!data || !data.phases.length) {
      setSvg("");
      setError("");
      return;
    }

    const render = async () => {
      try {
        const diagram = buildDiagram(data, activePhaseIndex, mode);
        const rendered = await mermaid.render(`legal-map-${id}`, diagram);
        setSvg(rendered.svg);
        setError("");
      } catch (renderError) {
        setSvg("");
        setError(
          renderError instanceof Error ? renderError.message : "Mermaid 렌더링에 실패했습니다."
        );
      }
    };

    void render();
  }, [activePhaseIndex, data, id, mode]);

  if (!data) {
    return <div className="empty-state">LLM 파싱 결과가 여기에 렌더링됩니다.</div>;
  }

  if (error) {
    return <div className="error-panel">{error}</div>;
  }

  return <div className="diagram-shell" dangerouslySetInnerHTML={{ __html: svg }} />;
}
