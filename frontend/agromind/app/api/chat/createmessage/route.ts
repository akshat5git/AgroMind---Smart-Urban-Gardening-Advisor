import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
type ChatContext = {
  location?: {
    lat: number;
    lon: number;
    name: string;
  };
  weather?: any;
  garden?: any;
};
export async function POST(req: Request) {

  try {
    const { chatId, message, context } = await req.json();

    if (!message) {
      return Response.json({ error: "Message required" }, { status: 400 });
    }

    const session = await getServerSession();

    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let finalChatId = chatId;

    // 🔥 1. CREATE CHAT (FIRST MESSAGE)
    if (!finalChatId) {
      const chat = await prisma.chatSession.create({
        data: {
          title: message.slice(0, 30),
          user: {
            connect: { email: session.user.email },
          },
          context: context || {},
        },
      });

      finalChatId = chat.id;
    }

    // 🔥 2. LOAD EXISTING CHAT (for context + validation)
    const chat = await prisma.chatSession.findFirst({
      where: {
        id: finalChatId,
        userEmail: session.user.email,
      },
    });

    if (!chat) {
      return Response.json({ error: "Chat not found" }, { status: 404 });
    }

    // 🔥 3. MERGE CONTEXT (IMPORTANT)
    const existingContext = (chat.context || {}) as ChatContext;
    const finalContext: ChatContext = {
      ...existingContext,
      ...context,
    };
    console.log("Merged Context:", finalContext);

    // 🔥 SAVE UPDATED CONTEXT
    await prisma.chatSession.update({
      where: { id: finalChatId },
      data: { context: finalContext },
    });

    // 🔥 4. SAVE USER MESSAGE
    await prisma.message.create({
      data: {
        chatId: finalChatId, // ✅ MUST BE CORRECT
        role: "USER",
        content: message,
      },
    });
    console.log("Saving message to chat:", finalChatId);

    // 🔥 5. LOAD LAST MESSAGES (MEMORY)
    const history = await prisma.message.findMany({
      where: { chatId: finalChatId },
      orderBy: { createdAt: "asc" },
      take: 10, // limit for performance
    });

    // 🔥 6. BUILD SYSTEM PROMPT (SMART)
    let systemPrompt = `
You are AgroMind AI 🌱 — an expert agriculture assistant.

Your job:
- Give practical farming advice
- Consider weather, location, and crops
- Suggest both organic & chemical treatments
- Be concise and actionable
`;

    if (finalContext?.location) {
      systemPrompt += `
📍 Location:
- ${finalContext.location.name}
(lat: ${finalContext.location.lat}, lon: ${finalContext.location.lon})
`;
    }

    if (finalContext?.weather) {
      systemPrompt += `
🌦️ Weather:
- Temp: ${finalContext.weather.main?.temp}°C
- Humidity: ${finalContext.weather.main?.humidity}%
- Condition: ${finalContext.weather.weather?.[0]?.description}
`;
    }

    if (finalContext?.garden) {
      systemPrompt += `
🌱 Garden:
- Name: ${finalContext.garden.name}
- Location: ${finalContext.garden.location}
- Plants: ${finalContext.garden.plantings?.length || 0}
- Crops: ${finalContext.garden.plantings
          ?.map((p: any) => p.crop)
          .join(", ") || "None"
        }
`;
    }

    // 🔥 7. FORMAT HISTORY FOR AI
    const messagesForAI = [
      { role: "system", content: systemPrompt },

      ...history.map((m) => ({
        role: m.role === "USER" ? "user" : "assistant",
        content: m.content,
      })),

      { role: "user", content: message },
    ];

    // 🔥 8. CALL AI
    const aiRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: messagesForAI,
        }),
      }
    );

    const data = await aiRes.json();

    const reply =
      data?.choices?.[0]?.message?.content || "No response";

    // 🔥 9. SAVE AI MESSAGE
    await prisma.message.create({
      data: {
        chatId: finalChatId,
        role: "ASSISTANT",
        content: reply,
      },
    });

    // 🔥 10. UPDATE CHAT
    const cleanPreview = reply
      .replace(/\n/g, " ")
      .slice(0, 80); // adjust length

    await prisma.chatSession.update({
      where: { id: finalChatId },
      data: {
        lastMessage: cleanPreview,
      },
    });

    return Response.json({
      chatId: finalChatId,
      reply,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "AI failed" }, { status: 500 });
  }
}