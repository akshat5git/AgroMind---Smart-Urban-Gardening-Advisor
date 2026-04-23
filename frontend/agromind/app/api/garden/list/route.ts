import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const gardens = await prisma.garden.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      include: {
        plantings: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(gardens);
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}