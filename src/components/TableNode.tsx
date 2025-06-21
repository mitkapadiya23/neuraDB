// src/components/TableNode.tsx
import React from "react";
import { Handle, Position, NodeProps } from "reactflow";

interface Column {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
}

type TableNodeData = {
  name: string;
  columns: Column[];
};

export default function TableNode({ id, data }: NodeProps<TableNodeData>) {
  // console.log("data.columns");
  // console.log(data.columns);

  return (
    <div className="rounded-md border border-gray-600 bg-gray-800 font-mono text-sm shadow-md min-w-[200px]">
      {/* Title */}
      <div className="bg-blue-900 text-white font-bold text-center py-2 rounded-t-md">
        {data.name}
      </div>

      {/* Columns */}
      <div className="flex flex-col">
        {data?.columns.map((col: any, idx: number) => (
          <div
            key={col.name}
            className="flex items-center justify-between border-t border-gray-700 px-3 py-1 relative"
          >
            {/* Left handle (target) */}
            <Handle
              type="target"
              position={Position.Left}
              id={`${id}-input-${idx}`}
              style={{
                background: "#0f0",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />

            {/* Column name and type */}
            <span className="text-white">{col.name}</span>
            <span className="text-gray-400">{col.type}</span>

            {/* Right handle (source) only for FK */}
            {col.isForeignKey && (
              <Handle
                type="source"
                position={Position.Right}
                id={`${id}-output-${idx}`}
                style={{
                  background: "#f00",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
