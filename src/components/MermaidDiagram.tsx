import { useEffect, useId, useRef, useState } from "react";
import mermaid from "mermaid";
import { localizeEntityType, localizeLegalBasis, translations, type Language } from "../i18n";
import type { Entity, EntityType, LegalMapResult, Phase } from "../types";

mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  htmlLabels: true,
  securityLevel: "loose",
  themeVariables: {
    fontSize: "20px"
  },
  flowchart: {
    curve: "monotoneX",
    nodeSpacing: 48,
    rankSpacing: 72,
    padding: 20,
    useMaxWidth: false,
    htmlLabels: true
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function colorFromId(id: string) {
  let hash = 0;
  for (const char of id) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }

  const hue = Math.abs(hash) % 24;
  const hueOffset = hue - 12;
  return {
    hueOffset
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

function typePalette(type: EntityType, hueOffset: number) {
  switch (type) {
    case "Person":
      return {
        fill: hslToHex(214 + hueOffset, 84, 90),
        stroke: hslToHex(217 + hueOffset, 72, 40),
        edge: "#2563eb",
        strokeWidth: "3.5px",
        dasharray: "0"
      };
    case "Company":
      return {
        fill: hslToHex(154 + hueOffset, 58, 90),
        stroke: hslToHex(160 + hueOffset, 64, 32),
        edge: "#0f766e",
        strokeWidth: "3.5px",
        dasharray: "0"
      };
    case "Organization":
      return {
        fill: hslToHex(38 + hueOffset, 88, 89),
        stroke: hslToHex(26 + hueOffset, 78, 36),
        edge: "#d97706",
        strokeWidth: "3.5px",
        dasharray: "8 4"
      };
    case "Object":
      return {
        fill: hslToHex(272 + hueOffset, 70, 92),
        stroke: hslToHex(270 + hueOffset, 66, 42),
        edge: "#7c3aed",
        strokeWidth: "3.5px",
        dasharray: "0"
      };
    case "Other":
    default:
      return {
        fill: hslToHex(212 + hueOffset, 24, 93),
        stroke: hslToHex(214 + hueOffset, 22, 36),
        edge: "#475569",
        strokeWidth: "2.75px",
        dasharray: "3 3"
      };
  }
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
  const lines = ["flowchart LR"];
  let linkIndex = 0;

  const linkStyles: string[] = [];
  const pushLinkStyle = (style: string) => {
    linkStyles.push(`  linkStyle ${linkIndex} ${style}`);
    linkIndex += 1;
  };

  for (const entity of data.entities) {
    const label = escapeLabel(`${entity.name}\\n(${localizeEntityType(entity.type, language)})`);
    const colors = typePalette(entity.type, colorFromId(entity.id).hueOffset);
    lines.push(`  ${entityNode(entity, label)}`);
    lines.push(
      `  style ${entity.id} fill:${colors.fill},stroke:${colors.stroke},stroke-width:${colors.strokeWidth},stroke-dasharray:${colors.dasharray},color:#0f172a;`
    );
  }

  visiblePhases.forEach((phase) => {
    phase.interactions.forEach((interaction) => {
      const from = entityMap.get(interaction.from);
      const to = entityMap.get(interaction.to);
      if (!from || !to) {
        return;
      }

      const rows = [
        interaction.object
          ? `<tr><th>${escapeHtml(copy.objectLabel)}</th><td>${escapeHtml(interaction.object)}</td></tr>`
          : "",
        interaction.legal_basis
          ? `<tr><th>${escapeHtml(copy.legalBasisLabel)}</th><td>${escapeHtml(localizeLegalBasis(interaction.legal_basis, language))}</td></tr>`
          : ""
      ]
        .filter(Boolean)
        .join("");

      const edgeLabel = [
        `<div class='interaction-card'>`,
        `<div class='interaction-action'>${escapeHtml(interaction.action)}</div>`,
        rows ? `<table class='interaction-meta'><tbody>${rows}</tbody></table>` : "",
        `</div>`
      ].join("");

      lines.push(`  ${interaction.from} -->|"${escapeLabel(edgeLabel)}"| ${interaction.to}`);
      const fromColors = typePalette(from.type, colorFromId(from.id).hueOffset);
      const toColors = typePalette(to.type, colorFromId(to.id).hueOffset);
      const edgeColor = mode === "single" ? fromColors.edge : toColors.edge;
      pushLinkStyle(`stroke:${edgeColor},stroke-width:2.75px,opacity:0.96;`);
    });
  });

  return [...lines, ...linkStyles].join("\n");
}

export function MermaidDiagram({ data, activePhaseIndex, mode, language }: MermaidDiagramProps) {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoomPercent, setZoomPercent] = useState(100);
  const id = useId().replace(/:/g, "");
  const diagramRef = useRef<HTMLDivElement | null>(null);
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

  const handleDownload = async () => {
    const svgElement = diagramRef.current?.querySelector("svg");
    if (!svgElement) {
      return;
    }

    const exportCss = `
      .label text, .edgeLabel { font-family: "Pretendard Variable", "Noto Sans KR", "Noto Sans", Arial, sans-serif; }
      .edgeLabel { font-size: 14px; line-height: 1.45; color: #172033; }
      .edgeLabel .labelBkg { display: block !important; background: rgba(255, 252, 245, 0.98) !important; border: 1px solid rgba(148, 163, 184, 0.55) !important; border-radius: 12px; padding: 10px 12px; white-space: normal !important; overflow-wrap: anywhere; word-break: break-word; box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08); }
      .edgeLabel rect { fill: transparent !important; stroke: transparent !important; }
      .edgeLabel .interaction-card { display: block; background: transparent !important; }
      .edgeLabel .interaction-action { margin: 0 0 8px; font-size: 14px; font-weight: 800; line-height: 1.35; text-align: center; color: #0f172a; white-space: normal !important; overflow-wrap: anywhere; word-break: break-word; }
      .edgeLabel .interaction-meta { width: 100%; border-collapse: collapse; table-layout: fixed; background: transparent !important; }
      .edgeLabel .interaction-meta th, .edgeLabel .interaction-meta td { padding: 4px 0; vertical-align: top; text-align: left; background: transparent !important; white-space: normal !important; overflow-wrap: anywhere; word-break: break-word; }
      .edgeLabel .interaction-meta th { width: 42%; font-size: 12px; font-weight: 700; color: #475569; padding-right: 10px; }
      .edgeLabel .interaction-meta td { font-size: 13px; color: #172033; }
      .nodeLabel { color: #0f172a !important; font-weight: 600; font-size: 21px !important; }
      .flowchart-link { stroke-linecap: round; stroke-linejoin: round; }
      foreignObject, .labelBkg { overflow: visible; }
    `;

    const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
    const bbox = svgElement.getBBox();
    const padding = 24;
    const width = Math.max(Math.ceil(bbox.width + padding * 2), 1);
    const height = Math.max(Math.ceil(bbox.height + padding * 2), 1);

    clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clonedSvg.setAttribute("xmlns:xhtml", "http://www.w3.org/1999/xhtml");
    clonedSvg.setAttribute("width", String(width));
    clonedSvg.setAttribute("height", String(height));
    clonedSvg.setAttribute(
      "viewBox",
      `${Math.floor(bbox.x - padding)} ${Math.floor(bbox.y - padding)} ${width} ${height}`
    );

    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = exportCss;
    clonedSvg.insertBefore(style, clonedSvg.firstChild);

    const serialized = new XMLSerializer().serializeToString(clonedSvg);
    const svgMarkup = `<?xml version="1.0" encoding="UTF-8"?>\n${serialized}`;
    const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to load diagram image for download."));
        img.src = url;
      });

      const canvas = document.createElement("canvas");
      const scale = window.devicePixelRatio > 1 ? 2 : 1;
      canvas.width = width * scale;
      canvas.height = height * scale;
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Failed to create PNG export context.");
      }

      context.scale(scale, scale);
      context.fillStyle = "#f8fafc";
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);

      const pngUrl = canvas.toDataURL("image/png");
      const anchor = document.createElement("a");
      const phasePart = activePhaseIndex + 1;
      anchor.href = pngUrl;
      anchor.download = `legal-node-map-${mode}-phase-${phasePart}.png`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      <div className="diagram-panel">
        <div className="diagram-actions" aria-label={copy.mapActionsLabel}>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setZoomPercent(100);
              setIsExpanded(true);
            }}
            disabled={!svg}
          >
            {copy.enlargeMap}
          </button>
          <button type="button" className="secondary-button" onClick={handleDownload} disabled={!svg}>
            {copy.downloadMap}
          </button>
        </div>
        <div className="diagram-shell">
          <div ref={diagramRef} className="diagram-canvas" dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
      </div>

      {isExpanded ? (
        <div className="dialog-backdrop" role="dialog" aria-modal="true" aria-label={copy.enlargeMap}>
          <div className="dialog-panel">
            <div className="dialog-toolbar">
              <div className="dialog-heading">
                <strong>{copy.enlargeMap}</strong>
                <label className="zoom-control">
                  <span>{copy.zoomLabel}</span>
                  <div className="zoom-control-row">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      step="10"
                      value={zoomPercent}
                      onChange={(event) => setZoomPercent(Number(event.target.value))}
                    />
                    <strong>{copy.zoomValue.replace("{value}", String(zoomPercent))}</strong>
                  </div>
                </label>
              </div>
              <div className="dialog-actions">
                <button type="button" className="secondary-button" onClick={handleDownload}>
                  {copy.downloadMap}
                </button>
                <button type="button" className="secondary-button" onClick={() => setIsExpanded(false)}>
                  {copy.closePreview}
                </button>
              </div>
            </div>
            <div className="diagram-shell expanded">
              <div
                className="zoom-stage"
                style={{
                  transform: `scale(${Math.max(zoomPercent, 1) / 100})`,
                  opacity: zoomPercent === 0 ? 0 : 1
                }}
              >
                <div className="diagram-canvas" dangerouslySetInnerHTML={{ __html: svg }} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
