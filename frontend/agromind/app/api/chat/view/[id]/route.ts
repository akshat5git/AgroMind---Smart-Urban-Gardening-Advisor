import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    // 🔥 security: ensure chat belongs to user
    const chat = await prisma.chatSession.findFirst({
      where: {
        id: id,
        userEmail: session.user.email,
      },
    });
    

    if (!chat) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: {
        chatId: id,
      },
      orderBy: {
        createdAt: "asc", // 🔥 correct chat order
      },
      select: {
        id: true,
        role: true,
        content: true,
        createdAt: true,
      },
    });
     console.log("Fetched Messages:", messages);
    return Response.json({ messages });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to load messages" }, { status: 500 });
  }
}
