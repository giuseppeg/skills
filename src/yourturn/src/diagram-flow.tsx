import { createElement, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  AppWindow, Ban, BookOpen, Bell, Bot, Box, Brain, Bug, CircleCheck, CircleX, Clock, Cloud, Code, Cog, Cpu,
  Database, DoorOpen, Eye, FileText, Folder, GitBranch, Globe, Hand, HardDrive, Hourglass, Inbox, Key, Laptop,
  Layers, Link, List, Lock, Mail, MessageSquare, Monitor, Package, Palette, Play, Plug, Puzzle, Radio, RefreshCw,
  Rocket, Scale, Search, Send, Server, Settings, Shield, Smartphone, Sparkles, Terminal, Trash2, TriangleAlert,
  User, Users, Wrench, Zap,
  type IconNode
} from "lucide";
import type { DiagramIcon } from "./catalog";
import "./diagram-flow.css";

/* What the agent writes: boxes and arrows, plus a few optional fields that
   make a diagram easy to follow.
   - icon: a name from the list below, so a box is recognised at a glance
   - group: boxes that belong together get a labelled zone around them
   - step: a plain sentence on an arrow. Steps are numbered on the arrow and
     listed under the diagram, so the reader can walk through it
   - kind: "maybe" is dashed, "never" is dotted and ends in a red cross
   - shape "stack": boxes become layers, one on top of the other
   Everything else, where boxes go and how arrows run, is worked out here. */
type Tone = "blue" | "green" | "orange" | "violet";

/* Icons are line drawings from Lucide, built into this file. An agent picks
   one by name from a short list in the catalog, so it cannot pick one that
   is missing and every icon looks alike. */
const icons: Record<DiagramIcon, IconNode> = {
  terminal: Terminal,
  plug: Plug,
  server: Server,
  door: DoorOpen,
  package: Package,
  puzzle: Puzzle,
  cog: Cog,
  brain: Brain,
  wrench: Wrench,
  shield: Shield,
  book: BookOpen,
  scale: Scale,
  palette: Palette,
  monitor: Monitor,
  phone: Smartphone,
  laptop: Laptop,
  radio: Radio,
  window: AppWindow,
  ban: Ban,
  file: FileText,
  folder: Folder,
  list: List,
  hourglass: Hourglass,
  play: Play,
  hand: Hand,
  check: CircleCheck,
  cross: CircleX,
  warning: TriangleAlert,
  user: User,
  users: Users,
  globe: Globe,
  database: Database,
  disk: HardDrive,
  cloud: Cloud,
  lock: Lock,
  key: Key,
  chat: MessageSquare,
  mail: Mail,
  bell: Bell,
  bolt: Zap,
  search: Search,
  branch: GitBranch,
  code: Code,
  chip: Cpu,
  layers: Layers,
  eye: Eye,
  clock: Clock,
  bot: Bot,
  sparkles: Sparkles,
  settings: Settings,
  inbox: Inbox,
  send: Send,
  refresh: RefreshCw,
  trash: Trash2,
  link: Link,
  box: Box,
  bug: Bug,
  rocket: Rocket
};

type DiagramNode = {
  id: string;
  label: string;
  detail?: string | null;
  tone?: Tone | null;
  icon?: DiagramIcon | null;
  group?: string | null;
  items?: string[] | null;
};

type DiagramGroup = {
  id: string;
  label: string;
  tone?: Tone | null;
};

type DiagramEdge = {
  from: string;
  to: string;
  label?: string | null;
  kind?: "flow" | "maybe" | "never" | null;
  step?: string | null;
};

type DiagramFlowProps = {
  title?: string | null;
  caption?: string | null;
  shape?: "flow" | "stack" | null;
  direction?: "down" | "right" | null;
  nodes: DiagramNode[];
  groups?: DiagramGroup[] | null;
  edges?: DiagramEdge[] | null;
};

/* Layout, part 1: ranks. A box sits one rank after the furthest box that
   points at it, so every arrow goes the same way, down or right. An arrow
   that closes a loop is set aside first and drawn around the side.
   A stack skips all this: one box per row, in the order written. */
type Layout = {
  rows: string[][];
  forward: { edge: DiagramEdge; index: number; via: string[] }[];
  back: { edge: DiagramEdge; index: number }[];
};

function layout(props: { nodes: DiagramNode[]; edges: DiagramEdge[]; stack: boolean }): Layout {
  if (props.stack) {
    return { rows: props.nodes.map((node) => [node.id]), forward: [], back: [] };
  }
  const ids = props.nodes.map((node) => node.id);
  const known = new Set(ids);
  const edges = props.edges
    .map((edge, index) => ({ edge, index }))
    .filter(({ edge }) => known.has(edge.from) && known.has(edge.to) && edge.from !== edge.to);

  const out = new Map(ids.map((id) => [id, edges.filter(({ edge }) => edge.from === id)]));
  const state = new Map<string, "open" | "done">();
  const backIndexes = new Set<number>();
  function visit(id: string) {
    state.set(id, "open");
    for (const { edge, index } of out.get(id) ?? []) {
      if (state.get(edge.to) === "open") {
        backIndexes.add(index);
      } else if (!state.has(edge.to)) {
        visit(edge.to);
      }
    }
    state.set(id, "done");
  }
  for (const id of ids) {
    if (!state.has(id)) {
      visit(id);
    }
  }

  const forwardEdges = edges.filter(({ index }) => !backIndexes.has(index));
  const rank = new Map(ids.map((id) => [id, 0]));
  for (let pass = 0; pass < ids.length; pass++) {
    for (const { edge } of forwardEdges) {
      rank.set(edge.to, Math.max(rank.get(edge.to)!, rank.get(edge.from)! + 1));
    }
  }

  /* Layout, part 2: an arrow that skips ranks gets an invisible stop in each
     rank it crosses, so it runs between the boxes and never through one. */
  const rows: string[][] = [];
  for (const id of ids) {
    (rows[rank.get(id)!] ??= []).push(id);
  }
  const forward = forwardEdges.map(({ edge, index }) => {
    const via: string[] = [];
    for (let r = rank.get(edge.from)! + 1; r < rank.get(edge.to)!; r++) {
      const stop = `·${index}·${r}`;
      rows[r].push(stop);
      via.push(stop);
    }
    return { edge, index, via };
  });

  /* Layout, part 3: order inside a rank. Each box moves towards the boxes it
     is linked to, a few sweeps down and up, so fewer arrows cross. Boxes of
     one group share their average place, so they stay side by side. */
  const groupOf = new Map(props.nodes.map((node) => [node.id, node.group ?? ""]));
  const links = new Map<string, string[]>();
  for (const { edge, via } of forward) {
    const chain = [edge.from, ...via, edge.to];
    for (let i = 0; i < chain.length - 1; i++) {
      links.set(chain[i], [...(links.get(chain[i]) ?? []), chain[i + 1]]);
      links.set(chain[i + 1], [...(links.get(chain[i + 1]) ?? []), chain[i]]);
    }
  }
  for (let sweep = 0; sweep < 4; sweep++) {
    const order = sweep % 2 === 0 ? rows.map((_, r) => r) : rows.map((_, r) => rows.length - 1 - r);
    for (const r of order) {
      const place = new Map(rows.flatMap((row, i) => (i === r ? [] : row.map((id, x) => [id, x / Math.max(1, row.length - 1)] as const))));
      const own = rows[r].map((id, x) => {
        const near = (links.get(id) ?? []).filter((other) => place.has(other));
        const w = near.length > 0 ? near.reduce((sum, other) => sum + place.get(other)!, 0) / near.length : x / Math.max(1, rows[r].length - 1);
        return { id, w, group: groupOf.get(id) ?? "" };
      });
      function shared(group: string) {
        const members = own.filter((item) => item.group === group);
        return members.reduce((sum, item) => sum + item.w, 0) / members.length;
      }
      rows[r] = own
        .map((item) => ({ ...item, w: item.group ? shared(item.group) : item.w }))
        .sort((a, b) => a.w - b.w || a.group.localeCompare(b.group))
        .map(({ id }) => id);
    }
  }

  return { rows, forward, back: edges.filter(({ index }) => backIndexes.has(index)) };
}

/* Drawing. The browser places the rows with flexbox, then each arrow is
   measured from the boxes. An arrow leaves and enters its boxes straight,
   with a smooth curve in between, and its head is drawn here along that
   straight end, so the head always points the way the line runs. */
type Point = { x: number; y: number };
type Box = Point & { w: number; h: number };

type Arrow = {
  index: number;
  from: string;
  to: string;
  kind: "flow" | "maybe" | "never";
  d: string;
  tip: Point;
  dir: Point;
  step: number | null;
  label: (Point & { text: string | null }) | null;
};

const lead = 4;
const straight = 14;
const headLength = 10;

function measure(props: { boxes: Map<string, Box>; plan: Layout; down: boolean; steps: Map<number, number>; width: number; height: number }): Arrow[] {
  const down = props.down;
  function box(id: string) {
    return props.boxes.get(id)!;
  }
  function at(args: { p: Point; dir: Point; by: number }) {
    return { x: args.p.x + args.dir.x * args.by, y: args.p.y + args.dir.y * args.by };
  }
  /* The line stops inside the head, so its round end never pokes out of the tip. */
  function ends(args: { start: Point; startDir: Point; tip: Point; dir: Point }) {
    const a = at({ p: args.start, dir: args.startDir, by: lead });
    const end = at({ p: args.tip, dir: args.dir, by: 2 - headLength });
    return {
      a,
      z: at({ p: args.tip, dir: args.dir, by: -straight }),
      open: `M ${args.start.x} ${args.start.y} L ${a.x} ${a.y}`,
      close: `L ${end.x} ${end.y}`
    };
  }
  function tag(args: { edge: DiagramEdge; index: number; p: Point }) {
    return args.edge.label || props.steps.has(args.index) ? { text: args.edge.label ?? null, ...args.p } : null;
  }

  /* Several arrows leaving or entering one side are spread along it, in the
     order of where their other end is, so they do not cross. */
  const ports = new Map<string, number[]>();
  for (const { edge, index } of props.plan.forward) {
    for (const key of [`${edge.from}:out`, `${edge.to}:in`]) {
      ports.set(key, [...(ports.get(key) ?? []), index]);
    }
  }
  const otherEnd = new Map(props.plan.forward.map(({ edge, index, via }) => [index, { out: via[0] ?? edge.to, in: via.at(-1) ?? edge.from }]));
  function centre(id: string) {
    return down ? box(id).x + box(id).w / 2 : box(id).y + box(id).h / 2;
  }
  for (const [key, list] of ports) {
    const side = key.endsWith(":out") ? "out" : "in";
    list.sort((a, b) => centre(otherEnd.get(a)![side]) - centre(otherEnd.get(b)![side]));
  }
  function spot(args: { id: string; side: "out" | "in"; index: number }) {
    const b = box(args.id);
    const list = ports.get(`${args.id}:${args.side}`) ?? [args.index];
    const share = (list.indexOf(args.index) + 1) / (list.length + 1);
    const along = 0.5 + (share - 0.5) * 0.6;
    return down
      ? { x: b.x + b.w * along, y: args.side === "out" ? b.y + b.h : b.y }
      : { x: args.side === "out" ? b.x + b.w : b.x, y: b.y + b.h * along };
  }

  /* A forward arrow curves through its stops. Each curve is symmetric, so
     its middle is exactly halfway between its two ends: the label and step
     number sit there on the first curve, right on the line. */
  const flowDir = down ? { x: 0, y: 1 } : { x: 1, y: 0 };
  const forward = props.plan.forward.map(({ edge, index, via }): Arrow => {
    const start = spot({ id: edge.from, side: "out", index });
    const tip = spot({ id: edge.to, side: "in", index });
    const { a, z, open, close } = ends({ start, startDir: flowDir, tip, dir: flowDir });
    const points = [a, ...via.map((id) => ({ x: box(id).x + box(id).w / 2, y: box(id).y + box(id).h / 2 })), z];
    const curves = points.slice(1).map((p, i) => {
      const q = points[i];
      /* Short handles make the middle run on a slant, not flat. */
      const k = down ? (p.y - q.y) * 0.35 : (p.x - q.x) * 0.35;
      return down ? `C ${q.x} ${q.y + k}, ${p.x} ${p.y - k}, ${p.x} ${p.y}` : `C ${q.x + k} ${q.y}, ${p.x - k} ${p.y}, ${p.x} ${p.y}`;
    });
    return {
      index,
      from: edge.from,
      to: edge.to,
      kind: edge.kind ?? "flow",
      d: [open, ...curves, close].join(" "),
      tip,
      dir: flowDir,
      step: props.steps.get(index) ?? null,
      label: tag({ edge, index, p: { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 } })
    };
  });

  /* A loop goes out of the outer side of its box and back in, around the
     rows: the left side for a box in the left half, else the right. */
  const middle = down ? props.width / 2 : props.height / 2;
  const back = props.plan.back.map(({ edge, index }): Arrow => {
    const from = box(edge.from);
    const to = box(edge.to);
    const low = down ? from.x + from.w / 2 < middle : from.y + from.h / 2 < middle;
    function side(b: Box) {
      return down ? { x: low ? b.x : b.x + b.w, y: b.y + b.h / 2 } : { x: b.x + b.w / 2, y: low ? b.y : b.y + b.h };
    }
    const out = down ? { x: low ? -1 : 1, y: 0 } : { x: 0, y: low ? -1 : 1 };
    const into = { x: -out.x, y: -out.y };
    const start = side(from);
    const tip = side(to);
    const { a, z, open, close } = ends({ start, startDir: out, tip, dir: into });
    const reach = low ? -32 : 32;
    const far = down
      ? (low ? Math.min(a.x, z.x) : Math.max(a.x, z.x)) + reach
      : (low ? Math.min(a.y, z.y) : Math.max(a.y, z.y)) + reach;
    const c1 = down ? { x: far, y: a.y } : { x: a.x, y: far };
    const c2 = down ? { x: far, y: z.y } : { x: z.x, y: far };
    return {
      index,
      from: edge.from,
      to: edge.to,
      kind: edge.kind ?? "flow",
      d: `${open} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${z.x} ${z.y} ${close}`,
      tip,
      dir: into,
      step: props.steps.get(index) ?? null,
      /* The middle of a curve: (a + 3·c1 + 3·c2 + z) / 8. */
      label: tag({ edge, index, p: { x: (a.x + 3 * c1.x + 3 * c2.x + z.x) / 8, y: (a.y + 3 * c1.y + 3 * c2.y + z.y) / 8 } })
    };
  });

  return [...forward, ...back];
}

/* What the reader points at. Pointing at a box lights its arrows; pointing at
   a step lights that one arrow. Everything else fades back. */
type Focus = { type: "none" } | { type: "node"; id: string } | { type: "step"; index: number };

export function DiagramFlow(props: DiagramFlowProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef(new Map<string, HTMLElement>());
  const [drawn, setDrawn] = useState<{ arrows: Arrow[]; zones: { group: DiagramGroup; box: Box; labelEnd: number | null }[] }>({
    arrows: [],
    zones: []
  });
  const [focus, setFocus] = useState<Focus>({ type: "none" });
  const down = props.direction !== "right";
  const stack = props.shape === "stack";
  const edges = props.edges ?? [];
  const groups = props.groups ?? [];
  const plan = useMemo(() => layout({ nodes: props.nodes, edges, stack }), [props.nodes, props.edges, stack]);
  const byId = new Map(props.nodes.map((node) => [node.id, node]));
  /* Ids that clash or point at no box. The layout skips those arrows. */
  const duplicates = props.nodes.map((node) => node.id).filter((id, i, ids) => ids.indexOf(id) !== i);
  const missing = [...new Set(edges.flatMap((edge) => [edge.from, edge.to]).filter((id) => !byId.has(id)))];
  const steps = new Map(
    edges
      .map((edge, index) => ({ edge, index }))
      .filter(({ edge }) => edge.step)
      .map(({ index }, n) => [index, n + 1])
  );

  useLayoutEffect(() => {
    function draw() {
      const frame = frameRef.current;
      if (!frame) {
        return;
      }
      const origin = frame.getBoundingClientRect();
      const boxes = new Map(
        [...boxRefs.current].map(([id, el]) => {
          const r = el.getBoundingClientRect();
          return [id, { x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height }];
        })
      );
      /* A zone is the box around all of its group's boxes, with some room. */
      const zones = groups.flatMap((group) => {
        const members = props.nodes.filter((node) => node.group === group.id).map((node) => boxes.get(node.id)!);
        if (members.length === 0) {
          return [];
        }
        const pad = 14;
        const x = Math.min(...members.map((b) => b.x)) - pad;
        const y = Math.min(...members.map((b) => b.y)) - pad - 6;
        const w = Math.max(...members.map((b) => b.x + b.w)) + pad - x;
        const h = Math.max(...members.map((b) => b.y + b.h)) + pad - y;
        return [{ group, box: { x, y, w, h } }];
      });
      /* A zone's name sits on its top edge. When arrows come in through that
         edge, the name ends just left of the first one, so none runs over it. */
      const arrows = measure({ boxes, plan, down, steps, width: origin.width, height: origin.height });
      const named = zones.map((zone) => {
        const entering = arrows
          .filter((arrow) => byId.get(arrow.to)?.group === zone.group.id && byId.get(arrow.from)?.group !== zone.group.id)
          .filter((arrow) => arrow.dir.y > 0 && arrow.tip.y - zone.box.y < 40)
          .map((arrow) => arrow.tip.x);
        return { ...zone, labelEnd: entering.length > 0 ? Math.min(...entering) - 14 : null };
      });
      setDrawn({ arrows, zones: named });
    }
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(frameRef.current!);
    return () => observer.disconnect();
  }, [plan, down, props.groups]);

  function lit(arrow: Arrow) {
    return (
      focus.type === "none" ||
      (focus.type === "node" && (arrow.from === focus.id || arrow.to === focus.id)) ||
      (focus.type === "step" && arrow.index === focus.index)
    );
  }
  const litNodes = new Set([...(focus.type === "node" ? [focus.id] : []), ...drawn.arrows.filter(lit).flatMap((a) => [a.from, a.to])]);
  function nodeLit(id: string) {
    return focus.type === "none" || litNodes.has(id);
  }
  function toneOf(id: string) {
    return byId.get(id)?.tone ?? "";
  }
  function ref(id: string) {
    return (el: HTMLElement | null) => {
      if (el) {
        boxRefs.current.set(id, el);
      } else {
        boxRefs.current.delete(id);
      }
    };
  }

  return (
    <figure className={`diagram ${focus.type === "none" ? "" : "focused"}`}>
      {props.title ? <figcaption className="diagram-title">{props.title}</figcaption> : null}
      {props.caption ? <p className="diagram-caption">{props.caption}</p> : null}
      <div className={`diagram-frame ${stack ? "stack" : down ? "down" : "right"} ${groups.length > 0 ? "grouped" : ""}`} ref={frameRef}>
        {drawn.zones.map(({ group, box, labelEnd }) => (
          <div key={group.id} className={`diagram-zone ${group.tone ?? ""}`} style={{ left: box.x, top: box.y, width: box.w, height: box.h }}>
            <span className="diagram-zone-label" style={labelEnd === null ? { left: 18 } : { right: box.x + box.w - labelEnd }}>
              {group.label}
            </span>
          </div>
        ))}
        <svg className="diagram-svg" aria-hidden="true">
          {drawn.arrows.map((arrow) => {
            /* The head: a triangle, or a cross for "never", at the tip. */
            const { tip, dir } = arrow;
            const base = { x: tip.x - dir.x * headLength, y: tip.y - dir.y * headLength };
            const side = { x: -dir.y * 5.5, y: dir.x * 5.5 };
            const head =
              arrow.kind === "never"
                ? `M ${tip.x - 5} ${tip.y - 5} L ${tip.x + 5} ${tip.y + 5} M ${tip.x + 5} ${tip.y - 5} L ${tip.x - 5} ${tip.y + 5}`
                : `M ${tip.x} ${tip.y} L ${base.x + side.x} ${base.y + side.y} L ${base.x - side.x} ${base.y - side.y} Z`;
            return (
              <g key={arrow.index} className={`diagram-arrow ${arrow.kind} ${toneOf(arrow.from)} ${lit(arrow) ? (focus.type === "none" ? "" : "lit") : "dim"}`}>
                <path d={arrow.d} className="diagram-line" />
                <path d={arrow.d} className="diagram-pulse" />
                <path d={head} className="diagram-head" />
              </g>
            );
          })}
        </svg>
        {plan.rows.map((row, r) => (
          <div className="diagram-row" key={r}>
            {row.map((id) => {
              const node = byId.get(id);
              if (!node) {
                return <div key={id} className="diagram-stop" ref={ref(id)} />;
              }
              const icon = node.icon ? icons[node.icon] : null;
              return (
                <div
                  key={id}
                  ref={ref(id)}
                  className={`diagram-node ${node.tone ?? ""} ${nodeLit(id) ? "" : "dim"}`}
                  onPointerEnter={() => setFocus({ type: "node", id })}
                  onPointerLeave={() => setFocus({ type: "none" })}
                >
                  {icon ? (
                    <span className="diagram-icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        {icon.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs }))}
                      </svg>
                    </span>
                  ) : null}
                  <span className="diagram-text">
                    <span className="diagram-label">{node.label}</span>
                    {node.detail ? <span className="diagram-detail">{node.detail}</span> : null}
                  </span>
                  {node.items && node.items.length > 0 ? (
                    <span className="diagram-items">
                      {node.items.map((item) => (
                        <span key={item} className="diagram-item">
                          {item}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
        {/* The step number sits right on the line; the label runs on from it. */}
        {drawn.arrows
          .filter((arrow) => arrow.label)
          .map((arrow) => (
            <span
              key={`${arrow.index}l`}
              className={`diagram-edge-label ${arrow.kind} ${arrow.step ? "numbered" : ""} ${lit(arrow) ? "" : "dim"}`}
              style={{ left: arrow.label!.x, top: arrow.label!.y }}
            >
              {arrow.step ? <b className="diagram-badge">{arrow.step}</b> : null}
              {arrow.label!.text ? <span>{arrow.label!.text}</span> : null}
            </span>
          ))}
      </div>
      {duplicates.length > 0 ? <p className="diagram-warning">Duplicate box ids: {duplicates.join(", ")}</p> : null}
      {missing.length > 0 ? <p className="diagram-warning">Arrows point at missing boxes: {missing.join(", ")}</p> : null}
      {steps.size > 0 ? (
        <ol className="diagram-steps">
          {[...steps].map(([index, n]) => (
            <li
              key={index}
              tabIndex={0}
              className={focus.type === "step" && focus.index === index ? "lit" : ""}
              onPointerEnter={() => setFocus({ type: "step", index })}
              onPointerLeave={() => setFocus({ type: "none" })}
              onFocus={() => setFocus({ type: "step", index })}
              onBlur={() => setFocus({ type: "none" })}
            >
              <b className="diagram-badge">{n}</b>
              <span>{edges[index].step}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </figure>
  );
}
