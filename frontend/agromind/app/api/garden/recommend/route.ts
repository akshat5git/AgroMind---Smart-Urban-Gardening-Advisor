import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  console.log("req reached");
  const body = await req.json();

  const { temp, sunlight, water, spaceType } = body;
  console.log(temp , sunlight, water, spaceType)
  try {
    const plants = await prisma.plant.findMany({
      

    });
    console.log(plants);

    return NextResponse.json(plants);
  }
  catch (e) {

  }
}
