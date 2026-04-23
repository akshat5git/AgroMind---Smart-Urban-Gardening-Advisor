import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ chatId: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ FIX: await params
    const { chatId } = await context.params;


    if (!chatId) {
      return Response.json({ error: "ChatId missing" }, { status: 400 });
    }

    // 🔥 Check ownership
    const chat = await prisma.chatSession.findFirst({
      where: {
        id: chatId,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!chat) {
      return Response.json({ error: "Chat not found" }, { status: 404 });
    }

    // 🔥 Delete
    await prisma.chatSession.delete({
      where: { id: chatId },
    });

    return Response.json({ success: true });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Delete failed" }, { status: 500 });
  }
}