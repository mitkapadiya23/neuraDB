// src/app/api/ai/schema/route.ts
import type { NextRequest } from "next/server";
import type { Node } from "reactflow";
import type { AIResponse } from "@/types/schema";
import ollama from "ollama";

interface Message {
  role: "user" | "assistant" | "error";
  content: string;
}

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  // TODO: Call your AI provider (OpenRouter / Together) here
  // For now, return an empty schema as placeholder:
  const AiRes = await ask(prompt);
  console.log({ AiRes: AiRes.message.content });

  // const nodes = [
  //   {
  //     id: generateRandomString(10),
  //     type: "default",
  //     position: { x: 200, y: 100 },
  //     data: { label: JSON.stringify(AiRes.message.content) },
  //   },
  // ];
  console.log(AiRes);
  // console.log(AiRes.message.content);

  const response: AIResponse = parseAISchemaString(AiRes.message.content);

  console.log(response);

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

async function ask(messages: Message[]) {
  // messages = messages.map((ele) => {
  //   ele.content = prompt(ele.content);
  //   return ele;
  // });

  const resp = await ollama.chat({
    model: process.env.OLLAMA_MODEL || "llama3.1:8b",
    // messages: [
    //   ...(history && Array.isArray(history) ? history : []),
    //   { role: "user", content: prompt(question) },
    // ],
    messages: [{ role: "system", content: systemPrompt() }, ...messages],
    stream: false,
  });
  return resp;
}

function systemPrompt() {
  return `You are a smart database assistant that can do two things:
          1. Create, modify, or remove schema structures (tables, columns, relationships)
          2. Answer general database questions or assist with queries

          You must detect the user's intention and ALWAYS respond in one of the following two formats:

          ---

          If the user wants to change the schema:
          Return the FULL schema in this format:

          {
            "isSchemaRelated": true,
            "message": "Describe what was done in simple language (e.g., 'Removed table comments', 'Added users table', etc.)",
            "tables": [
              {
                "id": "users",
                "name": "users",
                "position": { "x": 100, "y": 200 },
                "columns": [
                  { "name": "id", "type": "uuid", "isPrimaryKey": true },
                  { "name": "name", "type": "varchar", "nullable": false },
                  {
                    "name": "role_id",
                    "type": "uuid",
                    "nullable": false,
                    "isForeignKey": true,
                    "references": { "table": "roles", "column": "id" }
                  }
                ]
              },
              {
                "id": "roles",
                "name": "roles",
                "position": { "x": 400, "y": 200 },
                "columns": [
                  { "name": "id", "type": "uuid", "isPrimaryKey": true },
                  { "name": "name", "type": "varchar", "nullable": false }
                ]
              }
            ],
            "relationships": [
              {
                "from": { "table": "users", "column": "role_id" },
                "to": { "table": "roles", "column": "id" },
                "type": "MANY_TO_ONE",
                "direction": "users.role_id → roles.id"
              }
            ]
          }

          Rules:
          - You must always return the full updated schema (no diffs).
          - Add clear table 'id', 'position', and column structure.
          - Add foreign key 'references' and match relationships.
          - Always return a valid JSON object, not a string.
          - Do NOT stringify, escape quotes, or format as Markdown.
          - Your entire response should be a clean JSON object, suitable for JSON.parse()

          ---

          If the user is just asking a general question or wants help unrelated to schema modification:
          Respond in this format:

          {
            "isSchemaRelated": false,
            "message": "Answer the user’s question normally here."
          }

          Examples of when to use this:
          - "What is a foreign key?"
          - "Can you help me write a SQL query?"
          - "Explain normalization."
          - "What is Prisma?"

          ---

          ### Few-Shot Examples

          Input:
          "Add a table named orders with id, user_id, and total"

          Output:
          {
            "isSchemaRelated": true,
            "message": "Added orders table with foreign key to users",
            "tables": [
              {
                "id": "users",
                "name": "users",
                "position": { "x": 100, "y": 200 },
                "columns": [
                  { "name": "id", "type": "uuid", "isPrimaryKey": true },
                  { "name": "name", "type": "varchar", "nullable": false }
                ]
              },
              {
                "id": "orders",
                "name": "orders",
                "position": { "x": 400, "y": 200 },
                "columns": [
                  { "name": "id", "type": "uuid", "isPrimaryKey": true },
                  { "name": "user_id", "type": "uuid", "isForeignKey": true, "references": { "table": "users", "column": "id" } },
                  { "name": "total", "type": "decimal", "nullable": false }
                ]
              }
            ],
            "relationships": [
              {
                "from": { "table": "orders", "column": "user_id" },
                "to": { "table": "users", "column": "id" },
                "type": "MANY_TO_ONE",
                "direction": "orders.user_id → users.id"
              }
            ]
          }

          ---

          Input:
          "What is the difference between primary key and foreign key?"

          Output:
          {
            "isSchemaRelated": false,
            "message": "A primary key uniquely identifies each record in a table, while a foreign key establishes a link between two tables by referencing a primary key in another table."
          }`;
}

function parseAISchemaString(raw: string): any {
  try {
    // 1. Remove frontmatter like '---\n'
    let cleaned = raw.trim().replace(/---/g, "");

    // 2. Convert escaped newlines and quotes to real characters
    cleaned = cleaned
      .replace(/\\n/g, "\n") // Convert escaped \n to actual newline
      .replace(/\\"/g, '"') // Convert escaped quotes
      .replace(/\\'/g, "'"); // Convert escaped quotes

    // 3. Parse the cleaned string
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse AI schema string:", err.message);
    throw err;
  }
}

function generateRandomString(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
