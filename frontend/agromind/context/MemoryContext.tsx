import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "./UserContext";

interface PredictionHistory {
  type: "prediction";
  crop: string;
  disease: string;
  confidence: number;
  timestamp: string;
  image?: string;
  treatment?: string;
}

interface ChatHistory {
  type: "chat";
  message: string;
  response: string;
  timestamp: string;
}

interface PlantRecord {
  type: "plant_record";
  crop: string;
  plantedDate: string;
  status: string;
  notes: string;
}

interface CommunityPost {
  type: "community_post";
  postId: string;
  content: string;
  image?: string;
  timestamp: string;
}

type HistoryItem = PredictionHistory | ChatHistory | PlantRecord | CommunityPost;

interface MemoryContextType {
  history: HistoryItem[];
  addPrediction: (data: Omit<PredictionHistory, "type" | "timestamp">) => void;
  addChat: (message: string, response: string) => void;
  addPlantRecord: (data: Omit<PlantRecord, "type">) => void;
  addCommunityPost: (data: Omit<CommunityPost, "type" | "timestamp">) => void;
  getRecentPredictions: () => PredictionHistory[];
  getRecentChats: () => ChatHistory[];
  clearHistory: () => void;
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export function MemoryProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`agromind_history_${user.id}`);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    }
  }, [user]);

  // Save history to localStorage
  useEffect(() => {
    if (user && history.length > 0) {
      localStorage.setItem(`agromind_history_${user.id}`, JSON.stringify(history));
    }
  }, [history, user]);

  const addPrediction = (data: Omit<PredictionHistory, "type" | "timestamp">) => {
    const newItem: PredictionHistory = {
      ...data,
      type: "prediction",
      timestamp: new Date().toISOString(),
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  const addChat = (message: string, response: string) => {
    const newItem: ChatHistory = {
      type: "chat",
      message,
      response,
      timestamp: new Date().toISOString(),
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  const addPlantRecord = (data: Omit<PlantRecord, "type">) => {
    const newItem: PlantRecord = {
      ...data,
      type: "plant_record",
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  const addCommunityPost = (data: Omit<CommunityPost, "type" | "timestamp">) => {
    const newItem: CommunityPost = {
      ...data,
      type: "community_post",
      timestamp: new Date().toISOString(),
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  const getRecentPredictions = () => {
    return history.filter((item) => item.type === "prediction") as PredictionHistory[];
  };

  const getRecentChats = () => {
    return history.filter((item) => item.type === "chat") as ChatHistory[];
  };

  const clearHistory = () => {
    setHistory([]);
    if (user) {
      localStorage.removeItem(`agromind_history_${user.id}`);
    }
  };

  return (
    <MemoryContext.Provider
      value={{
        history,
        addPrediction,
        addChat,
        addPlantRecord,
        addCommunityPost,
        getRecentPredictions,
        getRecentChats,
        clearHistory,
      }}
    >
      {children}
    </MemoryContext.Provider>
  );
}

export function useMemory() {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error("useMemory must be used within MemoryProvider");
  }
  return context;
}
