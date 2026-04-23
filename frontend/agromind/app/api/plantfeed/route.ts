import { NextRequest, NextResponse } from "next/server";
import {
  PrismaClient,
  Prisma,
  SpaceType,
  Sunlight,
  Water,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// ✅ Prisma client (Neon compatible)
const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

// 🌞 Sunlight mapper
const mapSunlight = (value?: string): Sunlight => {
  if (!value) return Sunlight.MEDIUM;

  const v = value.toLowerCase();

  if (v.includes("full") || v.includes("direct") || v.match(/[6-9]/)) {
    return Sunlight.FULL;
  }

  if (v.includes("partial") || v.includes("moderate") || v.match(/[4-5]/)) {
    return Sunlight.MEDIUM;
  }

  return Sunlight.LOW;
};

// 💧 Water mapper
const mapWater = (value?: string): Water => {
  if (!value) return Water.MEDIUM;

  const v = value.toLowerCase();

  if (v.includes("high") || v.includes("frequent")) return Water.HIGH;
  if (v.includes("moderate") || v.includes("regular")) return Water.MEDIUM;

  return Water.LOW;
};

// 🏡 Space compatibility
const getSpaceCompatibility = (plant: any): SpaceType[] => {
  const category = plant.category?.toLowerCase() || "";
  const life = plant.life_cycle?.toLowerCase() || "";

  if (category.includes("leafy") || category.includes("herb")) {
    return [SpaceType.INDOOR, SpaceType.BALCONY, SpaceType.TERRACE];
  }

  if (category.includes("vegetable")) {
    return [SpaceType.BALCONY, SpaceType.TERRACE, SpaceType.BACKYARD];
  }

  if (category.includes("root")) {
    return [SpaceType.BACKYARD, SpaceType.FARM];
  }

  if (life.includes("perennial")) {
    return [SpaceType.FARM, SpaceType.BACKYARD];
  }

  return [SpaceType.BALCONY, SpaceType.TERRACE];
};

// 🚀 POST API
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // support single OR array
    const plants = Array.isArray(body) ? body : [body];

    const results = [];

    for (const plant of plants) {
      if (!plant.plant_id) {
        console.warn("⚠️ Skipping invalid plant:", plant);
        continue;
      }

      const created = await prisma.plant.upsert({
        where: { plantId: plant.plant_id },

        update: {},

        create: {
          // 🌱 BASIC
          plantId: plant.plant_id,
          commonName: plant.common_name,
          scientificName: plant.scientific_name ?? null,

          family: plant.family ?? null,
          genus: plant.genus ?? null,
          species: plant.species ?? null,
          order: plant.order ?? null,
          className: plant.class ?? null,
          division: plant.division ?? null,
          kingdom: plant.kingdom ?? null,

          // ✅ FIXED FIELD
          category: plant.category,
          categoryType: plant.categoryType ?? null,

          cropType: plant.crop_type ?? null,
          lifeCycle: plant.life_cycle ?? null,
          origin: plant.origin ?? null,

          // 🌍 JSON FIELDS
          localNames: plant.local_names ?? null,
          suitableClimate: plant.suitable_climate ?? null,

          // 🌡️ CLIMATE
          minTemp: plant.ideal_temperature_celsius?.min ?? 20,
          maxTemp: plant.ideal_temperature_celsius?.max ?? 30,

          soilType: plant.soil_type ?? null,

          // 🌞 ENUMS
          sunlightRequirement: mapSunlight(plant.sunlight_requirement),
          wateringRequirement: mapWater(plant.watering_requirement),

          // 🏡 ENUM ARRAY
          spaceType: getSpaceCompatibility(plant),

          // 🌱 GROWTH
          growthStages: plant.growth_stages ?? null,
          nutrientRequirements: plant.nutrient_requirements ?? null,
          uses: plant.uses ?? null,
          commonIssues: plant.common_issues ?? null,

          // 🤖 AI
          isSupportedByModel: plant.is_supported_by_model ?? false,

          // 🖼️ MEDIA
          imageUrls: plant.image_urls ?? null,
        },
      });

      results.push(created);
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("❌ ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to insert plants",
        error: String(error),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
