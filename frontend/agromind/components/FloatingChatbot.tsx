import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import { useMemory } from "../context/MemoryContext";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const getQuickResponse = (msg: string): string => {
  const lower = msg.toLowerCase();
  
  if (lower.includes("yellow") && lower.includes("leaves")) {
    return "Yellow leaves often indicate nitrogen deficiency. Try adding compost or nitrogen-rich fertilizer and ensure you're not overwatering.";
  }
  if (lower.includes("water")) {
    return "Water deeply but less frequently. Most plants need 1-2 inches per week. Check soil moisture 2 inches deep before watering.";
  }
  if (lower.includes("pest") || lower.includes("bug")) {
    return "For organic pest control, use neem oil spray or insecticidal soap. Apply every 7-10 days until pests are gone.";
  }
  if (lower.includes("fertilizer")) {
    return "Use balanced NPK fertilizer (10-10-10) every 2-4 weeks during growing season. Organic compost is also excellent!";
  }
  
  return "I can help with plant diseases, watering schedules, pest control, and more. Visit the AI Assistant page for detailed conversations!";
};

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hi! I'm your quick plant care assistant. Ask me anything!",
    },
  ]);
  const [input, setInput] = useState("");
  const { addChat } = useMemory();

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);

    const response = getQuickResponse(input);
    const assistantMsg: Message = { role: "assistant", content: response };
    
    setTimeout(() => {
      setMessages((prev) => [...prev, assistantMsg]);
    }, 500);

    addChat(input, response);
    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="size-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all"
              size="icon"
            >
              <MessageCircle className="size-6" />
            </Button>
            <span className="absolute -top-1 -right-1 size-4 bg-red-500 rounded-full animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-96"
          >
            <Card className="shadow-2xl border-2 border-green-500">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-10 bg-white rounded-full flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <div>
                    <CardTitle className="text-white text-sm">AgroMind Bot</CardTitle>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="size-2 bg-green-300 rounded-full animate-pulse" />
                      <span className="text-green-100">Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="size-8 hover:bg-green-700 text-white"
                  >
                    <Minimize2 className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="size-8 hover:bg-green-700 text-white"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </CardHeader>

              {!isMinimized && (
                <CardContent className="p-0">
                  <ScrollArea className="h-[300px] sm:h-[400px] p-4">
                    <div className="space-y-3">
                      {messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                              msg.role === "user"
                                ? "bg-green-600 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="p-4 border-t bg-gray-50">
                    <div className="flex gap-2">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Ask about plant care..."
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="bg-green-600 hover:bg-green-700"
                        size="icon"
                      >
                        <Send className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
