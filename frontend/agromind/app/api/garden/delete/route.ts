import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await prisma.garden.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}