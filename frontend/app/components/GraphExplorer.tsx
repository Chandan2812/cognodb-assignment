"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  BriefcaseBusiness,
  Check,
  Code2,
  Mail,
  MapPin,
  MousePointer2,
  Move,
  Network,
  UserRound,
  X,
  ZoomIn,
} from "lucide-react";
import { CandidateGraph, GraphNode } from "../types";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface GraphExplorerProps {
  graph: CandidateGraph | null;
  loading?: boolean;
}

const nodeStyles = {
  Candidate: {
    color: "#111827",
    radius: 11,
  },

  Skill: {
    color: "#2563eb",
    radius: 7,
  },

  Job: {
    color: "#059669",
    radius: 9,
  },

  Company: {
    color: "#7c3aed",
    radius: 9,
  },
};

export default function GraphExplorer({
  graph,
  loading = false,
}: GraphExplorerProps) {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const graphData = useMemo(() => {
    if (!graph) {
      return {
        nodes: [],
        links: [],
      };
    }

    return {
      nodes: graph.nodes.map((node) => ({
        ...node,
      })),

      links: graph.links.map((link) => ({
        ...link,
      })),
    };
  }, [graph]);

  /*
   * Find relationships connected to selected node.
   */
  const selectedRelationships = useMemo(() => {
    if (!selectedNode || !graph) {
      return [];
    }

    return graph.links
      .filter(
        (link) =>
          link.source === selectedNode.id || link.target === selectedNode.id,
      )
      .map((link) => {
        const isSource = link.source === selectedNode.id;

        const connectedNodeId = isSource ? link.target : link.source;

        const connectedNode = graph.nodes.find(
          (node) => node.id === connectedNodeId,
        );

        return {
          relationship: link.relationship,
          direction: isSource ? "outgoing" : "incoming",
          node: connectedNode,
        };
      })
      .filter((item) => item.node);
  }, [selectedNode, graph]);

  if (loading) {
    return (
      <section
        id="graph-explorer"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-5">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />

          <div className="mt-3 h-7 w-64 animate-pulse rounded bg-slate-100" />
        </div>

        <div className="h-[520px] animate-pulse rounded-xl bg-slate-50" />
      </section>
    );
  }

  if (!graph || graph.nodes.length === 0) {
    return (
      <section
        id="graph-explorer"
        className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center"
      >
        <Network size={32} className="mx-auto text-slate-400" />

        <p className="mt-4 font-semibold text-slate-800">
          No graph data available
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Select a candidate to explore their graph.
        </p>
      </section>
    );
  }

  return (
    <section
      id="graph-explorer"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="border-b border-slate-100 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Network size={17} className="text-slate-500" />

              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Graph visualization
              </span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-950">
              Explore talent relationships
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Explore how candidates, skills, jobs and companies are connected.
            </p>
          </div>

          {/* Legend */}

          <div className="flex flex-wrap gap-2">
            <Legend label="Candidate" color="#111827" />

            <Legend label="Skill" color="#2563eb" />

            <Legend label="Job" color="#059669" />

            <Legend label="Company" color="#7c3aed" />
          </div>
        </div>
      </div>

      {/* ==================================================
          GRAPH AREA
      ================================================== */}

      <div className="relative h-[520px] bg-slate-50">
        <ForceGraph2D
          graphData={graphData}
          nodeId="id"
          linkSource="source"
          linkTarget="target"
          /*
           * Hover tooltip
           */
          nodeLabel={(node: any) => `${node.label} · ${node.type}`}
          linkLabel={(link: any) => link.relationship}
          /*
           * Node colors
           */
          nodeColor={(node: any) =>
            nodeStyles[node.type as keyof typeof nodeStyles]?.color || "#64748b"
          }
          nodeRelSize={5}
          /*
           * Links
           */
          linkColor={() => "#cbd5e1"}
          linkWidth={1.5}
          linkDirectionalArrowLength={5}
          linkDirectionalArrowRelPos={1}
          cooldownTime={3000}
          /*
           * Click node
           */
          onNodeClick={(node: any) => {
            setSelectedNode(node);
          }}
          /*
           * Custom node drawing
           */
          nodeCanvasObject={(
            node: any,
            ctx: CanvasRenderingContext2D,
            globalScale: number,
          ) => {
            const style = nodeStyles[node.type as keyof typeof nodeStyles] || {
              color: "#64748b",
              radius: 7,
            };

            const radius = style.radius / Math.sqrt(globalScale);

            /*
             * Node circle
             */

            ctx.beginPath();

            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);

            ctx.fillStyle = style.color;

            ctx.fill();

            /*
             * Node border
             */

            ctx.strokeStyle = "#ffffff";

            ctx.lineWidth = 2 / globalScale;

            ctx.stroke();

            /*
             * Node label
             */

            const fontSize = 12 / globalScale;

            ctx.font = `${fontSize}px Inter, sans-serif`;

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillStyle = "#0f172a";

            ctx.fillText(node.label, node.x, node.y + radius + 8 / globalScale);
          }}
        />

        {/* ==================================================
            GRAPH CONTROLS HINT
        ================================================== */}

        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          <GraphHint icon={<MousePointer2 size={13} />} text="Click nodes" />

          <GraphHint icon={<Move size={13} />} text="Drag nodes" />

          <GraphHint icon={<ZoomIn size={13} />} text="Scroll to zoom" />
        </div>

        {/* ==================================================
            NODE DETAIL PANEL
        ================================================== */}

        {selectedNode && (
          <NodeDetails
            node={selectedNode}
            relationships={selectedRelationships}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>

      {/* ==================================================
          GRAPH STATS
      ================================================== */}

      <div className="grid grid-cols-2 border-t border-slate-100 sm:grid-cols-4">
        <GraphStat label="Nodes" value={graph.nodes.length} />

        <GraphStat label="Relationships" value={graph.links.length} />

        <GraphStat
          label="Skills"
          value={graph.nodes.filter((node) => node.type === "Skill").length}
        />

        <GraphStat
          label="Jobs"
          value={graph.nodes.filter((node) => node.type === "Job").length}
        />
      </div>
    </section>
  );
}

/* ======================================================
   NODE DETAILS
====================================================== */

interface NodeDetailsProps {
  node: GraphNode;

  relationships: {
    relationship: string;
    direction: string;
    node?: GraphNode;
  }[];

  onClose: () => void;
}

function NodeDetails({ node, relationships, onClose }: NodeDetailsProps) {
  const properties = node.properties || {};

  return (
    <aside className="absolute right-4 top-4 bottom-4 z-10 flex w-[330px] max-w-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur">
      {/* Header */}

      <div className="flex items-start justify-between border-b border-slate-100 p-5">
        <div className="flex min-w-0 items-start gap-3">
          <NodeIcon type={node.type} />

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              {node.type}
            </p>

            <h3 className="mt-1 break-words text-lg font-bold text-slate-950">
              {node.label}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Close node details"
        >
          <X size={17} />
        </button>
      </div>

      {/* Content */}

      <div className="flex-1 overflow-y-auto p-5">
        {/* Properties */}

        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Details
          </p>

          <div className="space-y-2">
            {Object.entries(properties)
              .filter(([key]) => key !== "id")
              .map(([key, value]) => (
                <PropertyRow
                  key={key}
                  label={formatPropertyName(key)}
                  value={formatPropertyValue(value)}
                />
              ))}
          </div>
        </div>

        {/* Relationships */}

        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Connections
            </p>

            <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
              {relationships.length}
            </span>
          </div>

          {relationships.length === 0 ? (
            <p className="text-sm text-slate-500">No relationships found.</p>
          ) : (
            <div className="space-y-2">
              {relationships.map((item, index) => (
                <div
                  key={`${item.relationship}-${item.node?.id}-${index}`}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        item.direction === "outgoing"
                          ? "text-slate-500"
                          : "text-slate-400"
                      }`}
                    >
                      {item.relationship}
                    </span>

                    <ArrowRight size={13} className="text-slate-400" />
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <NodeIcon type={item.node?.type || "Unknown"} small />

                    <span className="text-sm font-semibold text-slate-800">
                      {item.node?.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

/* ======================================================
   NODE ICON
====================================================== */

function NodeIcon({ type, small = false }: { type: string; small?: boolean }) {
  const size = small ? 15 : 18;

  const wrapper = small
    ? "flex h-7 w-7 items-center justify-center rounded-lg"
    : "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl";

  if (type === "Candidate") {
    return (
      <div className={`${wrapper} bg-slate-100 text-slate-700`}>
        <UserRound size={size} />
      </div>
    );
  }

  if (type === "Skill") {
    return (
      <div className={`${wrapper} bg-blue-50 text-blue-600`}>
        <Code2 size={size} />
      </div>
    );
  }

  if (type === "Job") {
    return (
      <div className={`${wrapper} bg-emerald-50 text-emerald-600`}>
        <BriefcaseBusiness size={size} />
      </div>
    );
  }

  if (type === "Company") {
    return (
      <div className={`${wrapper} bg-violet-50 text-violet-600`}>
        <Building2 size={size} />
      </div>
    );
  }

  return (
    <div className={`${wrapper} bg-slate-100 text-slate-500`}>
      <Network size={size} />
    </div>
  );
}

/* ======================================================
   PROPERTY ROW
====================================================== */

function PropertyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
}

/* ======================================================
   FORMAT PROPERTY NAME
====================================================== */

function formatPropertyName(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}

/* ======================================================
   FORMAT PROPERTY VALUE
====================================================== */

function formatPropertyValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "—";
  }

  if (typeof value === "number") {
    return value.toLocaleString("en-IN");
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
}

/* ======================================================
   LEGEND
====================================================== */

function Legend({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{
          backgroundColor: color,
        }}
      />

      {label}
    </span>
  );
}

/* ======================================================
   GRAPH HINT
====================================================== */

function GraphHint({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-2.5 py-1.5 text-xs font-medium text-slate-500 shadow-sm">
      {icon}

      {text}
    </span>
  );
}

/* ======================================================
   GRAPH STAT
====================================================== */

function GraphStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-r border-slate-100 p-4 last:border-r-0">
      <p className="text-xs font-medium text-slate-400">{label}</p>

      <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
