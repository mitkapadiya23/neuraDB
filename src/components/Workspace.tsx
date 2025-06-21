"use client";

import React, { JSX, useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";

import "reactflow/dist/style.css";
import TableNode from "./TableNode";
import { AIResponse } from "@/types/schema";

const nodeTypes = { table: TableNode };

interface WorkspaceProps {
  schema: AIResponse;
}

export default function Workspace({ schema }: WorkspaceProps): JSX.Element {
  const [nodes, setNodes] = useState<Node[]>(createNodes(schema));
  const [edges, setEdges] = useState<any[]>(createEdges(schema));

  useEffect(() => {
    setNodes((prevNodes) => {
      let newNodes = createNodes(schema);
      let prevNodeIds = prevNodes.map((ele) => ele.id);
      newNodes = newNodes.map((n) => {
        if (prevNodeIds.includes(n.id)) {
          n.position = prevNodes.filter((p) => p.id == n.id)[0].position;
        }
        return n;
      });
      return newNodes;
    });
    setEdges(createEdges(schema));
  }, [schema]);

  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const handleConnect = useCallback(
    (params: Edge | any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <main className="flex-1 bg-gray-900 p-0 overflow-hidden">
      <div className="h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={handleConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background variant="dots" gap={16} size={1} />
          <Controls />
        </ReactFlow>
      </div>
    </main>
  );
}

function createNodes(data: AIResponse) {
  const initNodes: Node[] =
    data?.tables?.map((t) => ({
      id: t.name,
      type: "table",
      position: getRandomPosition(),
      data: { name: t.name, columns: t.columns },
    })) ?? [];

  return initNodes;
}

const getRandomPosition = () => ({
  x: Math.floor(Math.random() * 800) + 100, // between 100 and 900
  y: Math.floor(Math.random() * 600) + 100, // between 100 and 700
});

function createEdges(data: AIResponse) {
  const initEdges: Edge[] =
    data?.relationships?.map((r, i) => ({
      id: `rel-${r.from.table}-${r.to.table}`,
      source: r.from.table,
      sourceHandle: `${r.from.table}-output-${data?.tables
        ?.find((t) => t.id === r.from.table)!
        .columns.findIndex((c) => c.name === r.from.column)}`,
      target: r.to.table,
      targetHandle: `${r.to.table}-input-${data?.tables
        ?.find((t) => t.id === r.to.table)
        ?.columns.findIndex((c) => c.name === r.to.column)}`,
      type: "smoothstep",
    })) ?? [];

  return initEdges;
}
