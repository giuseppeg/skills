import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./diagram-flow.css";

type DiagramNode = {
  id: string;
  label: string;
  detail?: string | null;
};

type DiagramEdge = {
  from: string;
  to: string;
  label?: string | null;
};

type DiagramFlowProps = {
  title?: string | null;
  nodes?: DiagramNode[];
  edges?: DiagramEdge[];
};

type DiagramConnector = {
  key: string;
  label: string | null;
  path: string;
  labelX: number;
  labelY: number;
  normalX: number;
  normalY: number;
};

type DiagramModel = {
  nodesById: Map<string, DiagramNode>;
  duplicateIds: string[];
  missingIds: string[];
  validEdges: DiagramEdge[];
};

const LABEL_WIDTH = 112;
const LABEL_HEIGHT = 34;
const LABEL_GAP = 8;

function buildDiagramModel(props: { nodes?: DiagramNode[]; edges?: DiagramEdge[] }): DiagramModel {
  const nodes = props.nodes ?? [];
  const edges = props.edges ?? [];
  const duplicateIds = new Set<string>();
  const seenIds = new Set<string>();
  const nodesById = new Map<string, DiagramNode>();

  for (const node of nodes) {
    if (seenIds.has(node.id)) duplicateIds.add(node.id);
    seenIds.add(node.id);
    if (!nodesById.has(node.id)) nodesById.set(node.id, node);
  }

  const missingIds = new Set<string>();
  const validEdges: DiagramEdge[] = [];

  for (const edge of edges) {
    const hasFrom = nodesById.has(edge.from);
    const hasTo = nodesById.has(edge.to);
    if (hasFrom && hasTo) validEdges.push(edge);
    if (!hasFrom) missingIds.add(edge.from);
    if (!hasTo) missingIds.add(edge.to);
  }

  return {
    nodesById,
    duplicateIds: Array.from(duplicateIds),
    missingIds: Array.from(missingIds),
    validEdges
  };
}

function labelSize(label: string | null | undefined) {
  const text = label ?? "";
  return {
    width: Math.min(LABEL_WIDTH, text.length * 6.5 + 18),
    height: text.length > 14 ? LABEL_HEIGHT : 24
  };
}

function labelBox(props: { x: number; y: number; label: string }) {
  const size = labelSize(props.label);
  return {
    left: props.x - size.width / 2,
    right: props.x + size.width / 2,
    top: props.y - size.height / 2,
    bottom: props.y + size.height / 2
  };
}

function overlaps(
  a: { x: number; y: number; label: string },
  b: { x: number; y: number; label: string }
) {
  const boxA = labelBox(a);
  const boxB = labelBox(b);
  return (
    boxA.left < boxB.right + LABEL_GAP &&
    boxA.right + LABEL_GAP > boxB.left &&
    boxA.top < boxB.bottom + LABEL_GAP &&
    boxA.bottom + LABEL_GAP > boxB.top
  );
}

function clampLabel(props: { x: number; y: number; label: string; frameWidth: number; frameHeight: number }) {
  const size = labelSize(props.label);
  return {
    x: Math.min(props.frameWidth - size.width / 2, Math.max(size.width / 2, props.x)),
    y: Math.min(props.frameHeight - size.height / 2, Math.max(size.height / 2, props.y)),
    label: props.label
  };
}

function spreadLabels(props: {
  connectors: DiagramConnector[];
  frameWidth: number;
  frameHeight: number;
}) {
  const placed: { x: number; y: number; label: string }[] = [];

  return props.connectors.map((connector) => {
    if (!connector.label) return connector;

    const candidates = [0, 18, -18, 36, -36, 54, -54].map((distance) =>
      clampLabel({
        x: connector.labelX + connector.normalX * distance,
        y: connector.labelY + connector.normalY * distance,
        label: connector.label!,
        frameWidth: props.frameWidth,
        frameHeight: props.frameHeight
      })
    );
    const spot = candidates.find((candidate) =>
      placed.every((existing) => !overlaps(candidate, existing))
    ) ?? candidates[candidates.length - 1];

    placed.push({ ...spot, label: connector.label });
    return { ...connector, labelX: spot.x, labelY: spot.y };
  });
}

function nodeLabel(props: { label: string; detail?: string | null }) {
  return (
    <div className="diagram-node">
      <div className="diagram-node-label">{props.label}</div>
      {props.detail ? <div className="diagram-node-detail">{props.detail}</div> : null}
    </div>
  );
}

function measureConnectors(props: {
  frame: HTMLDivElement;
  nodeElements: Map<string, HTMLDivElement>;
  edges: DiagramEdge[];
}): DiagramConnector[] {
  const frameRect = props.frame.getBoundingClientRect();

  const connectors = props.edges.flatMap((edge, index): DiagramConnector[] => {
    const fromEl = props.nodeElements.get(edge.from);
    const toEl = props.nodeElements.get(edge.to);
    if (!fromEl || !toEl) return [];

    const key = `${edge.from}-${edge.to}-${index}`;
    const from = fromEl.getBoundingClientRect();
    const to = toEl.getBoundingClientRect();
    const fromCenterX = from.left - frameRect.left + from.width / 2;
    const fromCenterY = from.top - frameRect.top + from.height / 2;
    const toCenterX = to.left - frameRect.left + to.width / 2;
    const toCenterY = to.top - frameRect.top + to.height / 2;
    const horizontal = Math.abs(toCenterX - fromCenterX) >= Math.abs(toCenterY - fromCenterY);

    const startX = horizontal
      ? fromCenterX + (toCenterX >= fromCenterX ? from.width / 2 : -from.width / 2)
      : fromCenterX;
    const startY = horizontal
      ? fromCenterY
      : fromCenterY + (toCenterY >= fromCenterY ? from.height / 2 : -from.height / 2);
    const endX = horizontal
      ? toCenterX + (toCenterX >= fromCenterX ? -to.width / 2 : to.width / 2)
      : toCenterX;
    const endY = horizontal
      ? toCenterY
      : toCenterY + (toCenterY >= fromCenterY ? -to.height / 2 : to.height / 2);

    const curve = horizontal ? Math.max(32, Math.abs(endX - startX) / 2) : 0;
    const path = horizontal
      ? `M ${startX} ${startY} C ${startX + (endX >= startX ? curve : -curve)} ${startY}, ${endX - (endX >= startX ? curve : -curve)} ${endY}, ${endX} ${endY}`
      : `M ${startX} ${startY} L ${endX} ${endY}`;
    const dx = endX - startX;
    const dy = endY - startY;
    const len = Math.hypot(dx, dy) || 1;
    const offset = edge.label ? 14 : 0;

    return [{
      key,
      label: edge.label ?? null,
      path,
      labelX: (startX + endX) / 2 + (-dy / len) * offset,
      labelY: (startY + endY) / 2 + (dx / len) * offset,
      normalX: -dy / len,
      normalY: dx / len
    }];
  });

  return spreadLabels({
    connectors,
    frameWidth: frameRect.width,
    frameHeight: frameRect.height
  });
}

export function DiagramFlow(props: DiagramFlowProps) {
  const arrowId = useId();
  const frameRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [connectors, setConnectors] = useState<DiagramConnector[]>([]);
  const nodes = props.nodes ?? [];
  const edges = props.edges ?? [];
  const model = useMemo(
    () => buildDiagramModel({ nodes, edges }),
    [nodes, edges]
  );

  useLayoutEffect(() => {
    const currentIds = new Set(nodes.map((node) => node.id));
    for (const id of nodeRefs.current.keys()) {
      if (!currentIds.has(id)) nodeRefs.current.delete(id);
    }
  }, [nodes]);

  useLayoutEffect(() => {
    function updateConnectors() {
      const frame = frameRef.current;
      if (!frame) return;
      setConnectors(measureConnectors({
        frame,
        nodeElements: nodeRefs.current,
        edges: model.validEdges
      }));
    }

    updateConnectors();
    const resizeObserver = new ResizeObserver(updateConnectors);
    if (frameRef.current) resizeObserver.observe(frameRef.current);
    for (const el of nodeRefs.current.values()) resizeObserver.observe(el);
    window.addEventListener("resize", updateConnectors);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateConnectors);
    };
  }, [model.validEdges, nodes]);

  return (
    <section className="diagram-flow" aria-label={props.title ?? "Flow diagram"}>
      {props.title ? <h2 className="diagram-title">{props.title}</h2> : null}
      <div className="diagram-frame" ref={frameRef}>
        <svg className="diagram-svg" aria-hidden="true">
          <defs>
            <marker
              id={arrowId}
              viewBox="0 0 10 10"
              refX="8.5"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 1 1.5 L 9 5 L 1 8.5 z" />
            </marker>
          </defs>
          {connectors.map((connector) => (
            <path
              className="diagram-connector"
              d={connector.path}
              key={connector.key}
              markerEnd={`url(#${arrowId})`}
            />
          ))}
        </svg>
        {connectors.filter((connector) => connector.label).map((connector) => (
          <span
            className="diagram-connector-label"
            key={`${connector.key}-label`}
            style={{ left: connector.labelX, top: connector.labelY }}
          >
            {connector.label}
          </span>
        ))}
        {nodes.map((node, index) => (
          <div
            className="diagram-node-wrap"
            key={`${node.id}-${index}`}
            ref={(el) => {
              if (el && !nodeRefs.current.has(node.id)) nodeRefs.current.set(node.id, el);
              else if (!el) nodeRefs.current.delete(node.id);
            }}
          >
            {nodeLabel(node)}
          </div>
        ))}
      </div>
      {model.duplicateIds.length > 0 ? (
        <p className="text muted diagram-warning">
          Duplicate node ids: {model.duplicateIds.join(", ")}
        </p>
      ) : null}
      {model.missingIds.length > 0 ? (
        <p className="text muted diagram-warning">
          Missing node ids: {model.missingIds.join(", ")}
        </p>
      ) : null}
    </section>
  );
}
