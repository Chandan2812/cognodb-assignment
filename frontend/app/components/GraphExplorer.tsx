"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Network, ZoomIn, Move, MousePointer2 } from "lucide-react";
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
    radius: 10,
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
      {/* Header */}
      <div className="border-b border-slate-100 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Explore how candidates, skills, jobs and companies are connected.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Legend label="Candidate" color="#111827" />

            <Legend label="Skill" color="#2563eb" />

            <Legend label="Job" color="#059669" />

            <Legend label="Company" color="#7c3aed" />
          </div>
        </div>
      </div>

      {/* Graph */}
      <div className="relative h-[520px] bg-slate-50">
        <ForceGraph2D
          graphData={graphData}
          nodeId="id"
          linkSource="source"
          linkTarget="target"
          nodeLabel={(node: any) => `${node.label} · ${node.type}`}
          linkLabel={(link: any) => link.relationship}
          nodeColor={(node: any) =>
            nodeStyles[node.type as keyof typeof nodeStyles]?.color || "#64748b"
          }
          nodeRelSize={5}
          linkColor={() => "#cbd5e1"}
          linkWidth={1.5}
          linkDirectionalArrowLength={5}
          linkDirectionalArrowRelPos={1}
          cooldownTime={3000}
          onNodeClick={(node: any) => {
            setSelectedNode(node);
          }}
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

            // Node circle
            ctx.beginPath();

            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);

            ctx.fillStyle = style.color;
            ctx.fill();

            // Node border
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2 / globalScale;
            ctx.stroke();

            // Label
            const fontSize = 12 / globalScale;

            ctx.font = `${fontSize}px Inter, sans-serif`;

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillStyle = "#0f172a";

            ctx.fillText(node.label, node.x, node.y + radius + 8 / globalScale);
          }}
        />

        {/* Graph controls hint */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          <GraphHint icon={<MousePointer2 size={13} />} text="Click nodes" />

          <GraphHint icon={<Move size={13} />} text="Drag nodes" />

          <GraphHint icon={<ZoomIn size={13} />} text="Scroll to zoom" />
        </div>

        {/* Selected node */}
        {selectedNode && (
          <div className="absolute right-4 top-4 w-64 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Selected node
            </p>

            <h3 className="mt-1 font-bold text-slate-900">
              {selectedNode.label}
            </h3>

            <p className="mt-1 text-xs font-medium text-slate-500">
              {selectedNode.type}
            </p>

            <button
              type="button"
              onClick={() => setSelectedNode(null)}
              className="mt-3 text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              Clear selection
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
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

function Legend({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />

      {label}
    </span>
  );
}

function GraphHint({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-2.5 py-1.5 text-xs font-medium text-slate-500 shadow-sm">
      {icon}
      {text}
    </span>
  );
}

function GraphStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-r border-slate-100 p-4 last:border-r-0">
      <p className="text-xs font-medium text-slate-400">{label}</p>

      <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
