import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chats = await prisma.chatSession.findMany({
      where: {
        userEmail: session.user.email, // 🔥 filter by user
      },
      orderBy: {
        updatedAt: "desc", // 🔥 recent chats first
      },
      select: {
        id: true,
        title: true,
        lastMessage: true,
        updatedAt: true,
      },
    });

    return Response.json(chats);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to load chats" }, { status: 500 });
  }
}