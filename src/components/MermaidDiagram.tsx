import { useEffect, useId, useState } from "react";
import mermaid from "mermaid";
import { localizeEntityType, localizeLegalBasis, translations, type Language } from "../i18n";
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
    fill: hslToHex(hue, 72, 90),
    stroke: hslToHex(hue, 52, 38)
  };
}

function hslToHex(hue: number, saturation: number, lightness: number) {
  const s = saturation / 100;
  const l = lightness / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (hue < 60) {
    r = c;
    g = x;
  } else if (hue < 120) {
    r = x;
    g = c;
  } else if (hue < 180) {
    g = c;
    b = x;
  } else if (hue < 240) {
    g = x;
    b = c;
  } else if (hue < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  const toHex = (value: number) =>
    Math.round((value + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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
    const label = escapeLabel(`${entity.name}\\n(${localizeEntityType(entity.type, language)})`);
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
        interaction.legal_basis
          ? `${copy.legalBasisLabel}: ${localizeLegalBasis(interaction.legal_basis, language)}`
          : ""
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
  const [isExpanded, setIsExpanded] = useState(false);
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

  const handlePrint = () => {
    if (!svg) {
      return;
    }

    const printWindow = window.open("", "_blank", "noopener,noreferrer,width=1200,height=900");
    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${copy.printMap}</title>
          <style>
            body { margin: 0; padding: 24px; font-family: Arial, sans-serif; background: #ffffff; }
            .frame { border: 1px solid #d1d5db; border-radius: 20px; padding: 24px; }
            svg { width: 100%; height: auto; }
            @media print { body { padding: 0; } .frame { border: 0; padding: 0; } }
          </style>
        </head>
        <body>
          <div class="frame">${svg}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <>
      <div className="diagram-panel">
        <div className="diagram-actions" aria-label={copy.mapActionsLabel}>
          <button type="button" className="secondary-button" onClick={() => setIsExpanded(true)} disabled={!svg}>
            {copy.enlargeMap}
          </button>
          <button type="button" className="secondary-button" onClick={handlePrint} disabled={!svg}>
            {copy.printMap}
          </button>
        </div>
        <div className="diagram-shell" dangerouslySetInnerHTML={{ __html: svg }} />
      </div>

      {isExpanded ? (
        <div className="dialog-backdrop" role="dialog" aria-modal="true" aria-label={copy.enlargeMap}>
          <div className="dialog-panel">
            <div className="dialog-toolbar">
              <strong>{copy.enlargeMap}</strong>
              <div className="dialog-actions">
                <button type="button" className="secondary-button" onClick={handlePrint}>
                  {copy.printMap}
                </button>
                <button type="button" className="secondary-button" onClick={() => setIsExpanded(false)}>
                  {copy.closePreview}
                </button>
              </div>
            </div>
            <div className="diagram-shell expanded" dangerouslySetInnerHTML={{ __html: svg }} />
          </div>
        </div>
      ) : null}
    </>
  );
}
