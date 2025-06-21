// src/types/schema.ts
import { Node } from "reactflow";

// export interface AIResponse {
//   nodes: Node[];
//   edges: any[]; // define a strict Edge type when ready
// }

export interface AIResponse {
  // actions: Action[];
  isSchemaRelated: boolean;
  tables?: Table[];
  relationships?: Relationship[];
  message?: string;
}

export interface Table {
  id: string;
  name: string;
  position: { x: number; y: number };
  columns: Column[];
}
export interface Column {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  default?: string | null;
}
export interface Relationship {
  from: { table: string; column: string };
  to: { table: string; column: string };
  type: string;
  direction: string;
}
// export interface Action {
//   type:
//     | "remove_table"
//     | "add_table"
//     | "update_table"
//     | "remove_column"
//     | "add_column"
//     | "update_column";
//   target: string;
//   table: string;
// }
