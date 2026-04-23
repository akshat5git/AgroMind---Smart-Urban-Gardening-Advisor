"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

type Message = {
  role: "USER" | "ASSISTANT";
  content: string;
};

type ChatbotModalProps = {
  onClose: () => void;
};

export default function ChatPage({ onClose }: ChatbotModalProps) {
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      role: "USER",
      content: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat/createmessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          message: userMsg.content,
        }),
      });

      const data = await res.json();

      if (!chatId) {
        setChatId(data.chatId);
      }

      const aiMsg: Message = {
        role: "ASSISTANT",
        content: data.reply,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="flex h-[min(720px,90vh)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-gray-100 shadow-2xl">
        <div className="flex items-center justify-between bg-green-600 p-4 font-semibold text-white">
          <span>AgroMind Assistant</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 transition hover:bg-white/10"
            aria-label="Close chatbot"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="mt-20 text-center text-gray-400">
              Ask about plants and garden care.
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-lg rounded-xl px-4 py-2 ${
                msg.role === "USER"
                  ? "ml-auto bg-green-500 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {msg.content}
            </div>
          ))}

          {loading && <div className="text-sm text-gray-500">Thinking...</div>}
        </div>

        <div className="flex gap-2 border-t bg-white p-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask something..."
            className="flex-1 rounded-lg border px-3 py-2 outline-none"
          />

          <button
            onClick={sendMessage}
            className="rounded-lg bg-green-600 px-4 py-2 text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
