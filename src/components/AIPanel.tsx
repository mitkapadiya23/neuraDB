"use client";

import React, { useState, useRef, useEffect, JSX } from "react";
import type { Edge, Node } from "reactflow";
import type { AIResponse } from "@/types/schema";
import ollama from "ollama";
import { Content } from "next/font/google";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "error";
  content: string;
  loading?: boolean;
  text?: string;
}

interface Prompt {
  role: "user" | "assistant" | "error";
  content: string;
}

interface AIPanelProps {
  onResult: (newSchema: AIResponse) => void;
}

export default function AIPanel({ onResult }: AIPanelProps): JSX.Element {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => scrollToBottom(), [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: `${Date.now()}`,
      role: "user",
      content: input.trim(),
      text: input.trim(),
    };

    const updatedMessages: ChatMessage[] = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");

    const assistantMsg: ChatMessage = {
      id: `${Date.now()}-assistant`,
      role: "assistant",
      content: "",
      loading: true,
    };
    setMessages((prev) => [...prev, assistantMsg]);

    const prompt: Prompt[] = updatedMessages.map((ele) => {
      return {
        role: ele.role,
        content: ele.content,
      };
    });

    try {
      const res = await fetch("/api/ai/schema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const ack = (await res.json()) as AIResponse;
      console.log({ ack });

      setMessages((msgs) =>
        msgs.map((m) =>
          m.id === assistantMsg.id
            ? {
                ...m,
                loading: false,
                content: ack.isSchemaRelated
                  ? JSON.stringify(ack, null, 2)
                  : JSON.stringify(ack.message, null, 2),
                text: JSON.stringify(ack.message, null, 2),
              }
            : m
        )
      );

      // console.log({ createNodes: createNodes(ack) });
      // console.log({ createEdges: createEdges(ack) });
      if (ack.isSchemaRelated) {
        onResult(ack);
      }
    } catch (e: any) {
      setMessages((msgs) =>
        msgs.map((m) =>
          m.id === assistantMsg.id
            ? {
                ...m,
                loading: false,
                role: "error",
                content: e.message || "Unknown error",
              }
            : m
        )
      );
    }
  };

  return (
    <aside className="flex flex-col w-96 bg-gray-850 border-l border-gray-700">
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-[80%] ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : msg.role === "assistant"
                  ? "bg-gray-700 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {msg.loading ? (
                <div className="w-16 h-4 bg-gray-600 rounded animate-pulse" />
              ) : (
                <code className="whitespace-pre-wrap block">{msg.text}</code>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-700">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={2}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none resize-none"
          placeholder="Type prompt and press Ctrl+Enter"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          className="mt-2 w-full py-2 bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50"
          disabled={!input.trim()}
        >
          Send
        </button>
      </div>
    </aside>
  );
}
