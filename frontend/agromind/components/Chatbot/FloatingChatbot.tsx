"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatbotModal from "./ChatbotModal";


export default function Chatbot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg"
      >
        <MessageCircle />
      
      </button>

      {/* Modal */}
      {open && <ChatbotModal onClose={() => setOpen(false)} />}
    </>
  );
}