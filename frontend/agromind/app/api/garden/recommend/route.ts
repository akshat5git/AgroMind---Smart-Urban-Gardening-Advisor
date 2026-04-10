import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  console.log("req reached");
  const body = await req.json();

  const { temp, sunlight, water, spaceType } = body;

  try {
    const plants = await prisma.plant.findMany({
      where: {
        minTemp: { lte: temp },
        maxTemp: { gte: temp },

        spaceType: {
          has: spaceType,
        },
        wateringRequirement: water,
        sunlightRequirement: sunlight,
      },

    });

    return NextResponse.json(plants);
  }
  catch (e) {

  }
}
