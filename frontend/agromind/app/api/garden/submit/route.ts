import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { SpaceType, Sunlight, Water } from "@prisma/client";

// (optional but recommended) define input type
type CreateGardenBody = {
    name: string;
    spaceType: string;
    area: string | number;
    location: string;
    lat: number | null;
    lon: number | null;
    sunlight: string;
    water: string;
    planting: { id: string }[];
};


export async function POST(req: Request) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 } 
            );
        }

        const body: CreateGardenBody = await req.json();
        console.log(body)
        
        const {
            name,
            spaceType,
            area,
            location,
            lat,
            lon,
            sunlight,
            water,
            planting,
        } = body;

        // 🔥 VALIDATION
        if (
            !name ||
            !spaceType ||
            !area ||
            lat == null ||
            lon == null ||
            !planting?.length ||
            !sunlight ||
            !water
        ) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // 🔥  SAFE AREA PARSE
        const parsedArea =
            typeof area === "string" ? parseFloat(area) : area;

        if (isNaN(parsedArea)) {
            return NextResponse.json(
                { error: "Invalid area value" },
                { status: 400 }
            );
        }

        // 🔥 CREATE GARDEN + RELATIONS
        const garden = await prisma.garden.create({
            data: {
                name,
                spaceType: spaceType as SpaceType,
                area: parsedArea,
                location,
                lat,
                lon,
                sunlight: sunlight as Sunlight,
                water: water as Water,

                user: {
                    connect: {
                        email: session.user.email,
                    },
                },

                plantings: {
                    create: planting.map((p) => ({
                        user: {
                            connect: {
                                email: session.user.email!,
                            },
                        },
                        plant: {
                            connect: {
                                id: p.id,
                            },
                        },
                    })),
                },
            },
            include: {
                plantings: {
                    include: {
                        plant: true, // 🔥 useful for response
                    },
                },
            },
        });

        return NextResponse.json(garden, { status: 201 });
    } catch (err: any) {
        console.error("CREATE GARDEN ERROR:", err);

        return NextResponse.json(
            {
                error: "Failed to create garden",
                message: err?.message,
            },
            { status: 500 }
        );
    }
}