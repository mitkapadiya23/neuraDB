"use client";

import AIPanel from "@/components/AIPanel";
import Sidebar from "@/components/Sidebar";
import Workspace from "@/components/Workspace";
import { AIResponse } from "@/types/schema";
import { useCallback, useState } from "react";
import { Node, Edge } from "reactflow";

export default function Home() {
  // const [nodes, setNodes] = useState<Node[]>([]);
  // const [edges, setEdges] = useState<any[]>([]);
  const [schema, setSchema] = useState<AIResponse>({} as AIResponse);

  // const handleNodesChange = useCallback(
  //   (updated: Node[]) => setNodes(updated),
  //   []
  // );

  // const handleEdgesChange = useCallback(
  //   (updated: Edge[]) => setEdges(updated),
  //   []
  // );

  console.log(
    '---\n\n{\n  "isSchemaRelated": true,\n  "message": "Created blank users table",\n  "tables": [\n    {\n      "id": "users",\n      "name": "users",\n      "position": { "x": 100, "y": 200 },\n      "columns": []\n    }\n  ],\n  "relationships": []\n}'
  );
  console.log(
    parseAISchemaString(
      '---\n\n{\n  "isSchemaRelated": true,\n  "message": "Created blank users table",\n  "tables": [\n    {\n      "id": "users",\n      "name": "users",\n      "position": { "x": 100, "y": 200 },\n      "columns": []\n    }\n  ],\n  "relationships": []\n}'
    )
  );

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-white">
      {/* <Sidebar /> */}
      <Workspace
        schema={schema}
        // edges={edges}
        // onNodesChange={handleNodesChange}
        // onEdgesChange={handleEdgesChange}
      />
      <AIPanel
        onResult={(newSchema) => {
          setSchema((prevSchema: AIResponse) => newSchema);
        }}
      />
    </div>
  );
}

function parseAISchemaString(raw: string): any {
  try {
    // 1. Remove frontmatter like '---\n'
    let cleaned = raw.trim().replace(/---/g, "");
    console.log({ cleaned });

    // 2. Convert escaped newlines and quotes to real characters
    let cleaned1 = cleaned
      .replace(/\\n/g, "") // Convert escaped \n to actual newline
      .replace(/\\"/g, '"') // Convert escaped quotes
      .replace(/\\'/g, "'"); // Convert escaped quotes

    console.log({ cleaned1 });
    // 3. Parse the cleaned string
    return JSON.parse(cleaned1);
  } catch (err) {
    console.error("Failed to parse AI schema string:", err.message);
    throw err;
  }
}
