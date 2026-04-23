"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Plus,
  Trash2,
  MessageSquare,
  Leaf,
  Menu,
  X,
  MapPin,
  Sprout,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/util";
import Location from "@/components/weather/location";
import { useWeatherStore } from "@/store/weatherStore";
import GardenSection from "@/components/GardenManager";
import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

type Message = {
  role: "USER" | "ASSISTANT";
  content: string;
};

type Chat = {
  id: string;
  title: string;
  lastMessage?: string;
};

export default function ChatPage() {

  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [attachedLocation, setAttachedLocation] = useState<any>(null);
  const [attachedGarden, setAttachedGarden] = useState<any>(null);
  const [openGardenPicker, setOpenGardenPicker] = useState(false);
  const [instanceKey, setInstanceKey] = useState(0);
  const weather = useWeatherStore((s) => s.weather);

  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const activeChatRef = useRef<string | null>(null);
  console.log("Rendering ChatPage with chatId:", chatId);
  console.log("Current messages:", messages);
  


  // 🔥 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 🔥 LOAD CHAT LIST
  const loadChats = async () => {
    const res = await fetch("/api/chat/list");
    const data = await res.json();
    setChats(data);
  };

  useEffect(() => {
    loadChats();
    setInstanceKey(prev => prev + 1);
  }, []);

  // 🔥 LOAD MESSAGES (FIXED 100%)
const loadMessages = async (id: string) => {
  abortRef.current?.abort();

  const controller = new AbortController();
  abortRef.current = controller;

  activeChatRef.current = id;
  setChatId(id);

  setMessages([]); // ✅ clear
  setLoadingMessages(true);

  try {
    const res = await fetch(`/api/chat/view/${id}`, {
      signal: controller.signal,
    });

    if (!res.ok) return;

    const data = await res.json();

    if (activeChatRef.current !== id) return;

    // 🔥 IMPORTANT: API RETURNS ARRAY, NOT {messages}
    setMessages(data.messages || []);
  } catch (err: any) {
    if (err.name !== "AbortError") {
      console.error(err);
    }
  } finally {
    if (activeChatRef.current === id) {
      setLoadingMessages(false);
    }
  }
};
  const suggestions = [
    {
      icon: "🌱",
      text: "How to care for tomatoes?",
    },
    {
      icon: "💧",
      text: "Best watering schedule",
    },
    {
      icon: "☀️",
      text: "Sunlight requirements",
    },
    {
      icon: "🌿",
      text: "When to plant seeds?",
    },
  ];
  const handleSuggestionClick = (text: string) => {
    setInput(text);

    // OPTIONAL AUTO SEND
    // sendMessage();
  };

  // 🔥 SEND MESSAGE
const sendMessage = async () => {
  if (!input.trim()) return;

  const currentChatId = chatId;

  const userMsg: Message = {
    role: "USER",
    content: input,
  };

  // ✅ optimistic UI
  setMessages(prev => [...prev, userMsg]);

  setInput("");
  setLoading(true);

  try {
    const res = await fetch("/api/chat/createmessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: currentChatId,
        message: userMsg.content,
        context: {
          location: attachedLocation,
          weather,
          garden: attachedGarden,
        },
      }),
    });

    const data = await res.json();

    // ✅ new chat created
    if (!currentChatId && data.chatId) {
      setChatId(data.chatId);
      activeChatRef.current = data.chatId;
    }

    // ✅ append ONLY AI reply
    setMessages(prev => [
      ...prev,
      { role: "ASSISTANT", content: data.reply },
    ]);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  // 🔥 DELETE CHAT
  const deleteChat = async (id: string) => {
    await fetch(`/api/chat/delete/${id}`, { method: "DELETE" });
    setChats((prev) => prev.filter((c) => c.id !== id));

    if (chatId === id) {
      setChatId(null);
      activeChatRef.current = null;
      setMessages([]);
    }
  };

  const handleNewChat = () => {
    activeChatRef.current = null;
    setChatId(null);
    setMessages([]);
  };

  return (
    <div key={instanceKey} className="h-screen w-screen overflow-hidden flex bg-gray-50">

      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-72 bg-white border-r flex-col h-full">

        <div className="p-4 font-bold text-green-700 flex items-center gap-2">
          <Leaf /> AgroMind
        </div>

        <div className="p-3">
          <Button onClick={handleNewChat} className="w-full">
            <Plus /> New Chat
          </Button>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto px-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "p-3 rounded-lg cursor-pointer flex justify-between hover:bg-gray-100",
                chatId === chat.id && "bg-green-100"
              )}
            >
              <div onClick={() => loadMessages(chat.id)} className="flex-1">
                <p className="text-sm font-medium">{chat.title}</p>
                <p className="text-xs text-gray-400">{chat.lastMessage?.slice(0, 60)}</p>
              </div>

              <button onClick={() => deleteChat(chat.id)}>
                <Trash2 size={14} className="text-red-500" />
              </button>
            </div>
          ))}
        </ScrollArea>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col h-full min-h-0">

        {/* HEADER */}
        <div className="bg-green-600 text-white p-4 font-semibold shrink-0">
          🌿 AgroMind Assistant
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">

          {/* LOADER */}
          {loadingMessages && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <div className="flex gap-2">
                <span className="dot"></span>
                <span className="dot delay-150"></span>
                <span className="dot delay-300"></span>
              </div>
            </div>
          )}

          {/* 🔥 EMPTY STATE (HOME UI) */}
          {!loadingMessages && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-20 text-center">

              {/* ICON */}
              <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center text-white text-3xl mb-4 shadow-lg">
                🌿
              </div>

              {/* TITLE */}
              <h2 className="text-2xl font-semibold text-green-700">
                Welcome to AgroMind
              </h2>

              <p className="text-gray-500 mt-2 max-w-md">
                Your AI-powered plant care assistant. Ask anything about gardening,
                crops, soil, or diseases.
              </p>

              {/* 🔥 SUGGESTION CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 w-full max-w-xl">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s.text)}
                    className="flex items-center gap-3 p-4 bg-white border rounded-xl shadow hover:shadow-md hover:bg-green-50 transition"
                  >
                    <div className="text-xl">{s.icon}</div>
                    <span className="text-sm font-medium text-gray-700">
                      {s.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 🔥 NORMAL CHAT */}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn("flex", msg.role === "USER" && "justify-end")}
            >
              <div
                className={cn(
                  "max-w-lg px-4 py-2 rounded-xl shadow",
                  msg.role === "USER"
                    ? "bg-green-500 text-white"
                    : "bg-white"
                )}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && <div className="text-gray-500">Thinking...</div>}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="p-3 bg-white border-t">

          <div className="flex gap-2 items-center border rounded-xl px-3 py-2 flex-wrap">

            {/* LOCATION */}
            <Location
              variant="icon"
              onLocation={(lat, lon) => {
                const weather = useWeatherStore.getState().weather;
                setAttachedLocation({
                  lat,
                  lon,
                  name: weather?.name || "Your location",
                });
              }}
            />

            {/* GARDEN */}
            <button onClick={() => setOpenGardenPicker(true)}>
              🌱
            </button>

            {/* ATTACHMENTS */}
            {attachedLocation && (
              <div className="chip">
                📍 {attachedLocation.name}
                <button onClick={() => setAttachedLocation(null)}>✕</button>
              </div>
            )}

            {attachedGarden && (
              <div className="chip">
                🌱 {attachedGarden.name}
                <button onClick={() => setAttachedGarden(null)}>✕</button>
              </div>
            )}

            {/* INPUT */}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about your plants..."
              className="flex-1 outline-none text-sm"
            />

            {/* SEND */}
            <button onClick={sendMessage} className="bg-green-600 text-white p-2 rounded-lg">
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* GARDEN MODAL */}
        {openGardenPicker && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-4 rounded-xl w-[600px]">
              <GardenSection
                selectable
                onSelect={(g) => {
                  setAttachedGarden(g);
                  setOpenGardenPicker(false);
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}