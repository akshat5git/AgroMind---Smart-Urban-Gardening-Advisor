import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { PrismaClient, SpaceType, Sunlight, Water } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Debug (optional)
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Loaded ✅" : "Missing ❌");

// Fix __dirname for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Prisma client
const prisma = new PrismaClient();

// JSON file path
const filePath = path.join(__dirname, "data", "p1.json");

// Check file exists
if (!fs.existsSync(filePath)) {
  console.error("❌ JSON file not found at:", filePath);
  process.exit(1);
}

// Read JSON
const plants: any[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// 🌞 Sunlight mapper
const mapSunlight = (value?: string): Sunlight => {
  if (!value) return "MEDIUM";

  const v = value.toLowerCase();

  if (v.includes("full") || v.includes("direct") || v.match(/[6-9]/)) {
    return "FULL";
  }

  if (v.includes("partial") || v.includes("moderate") || v.match(/[4-5]/)) {
    return "MEDIUM";
  }

  return "LOW";
};

// 💧 Water mapper
const mapWater = (value?: string): Water => {
  if (!value) return "MEDIUM";

  const v = value.toLowerCase();

  if (v.includes("high") || v.includes("frequent")) return "HIGH";
  if (v.includes("moderate") || v.includes("regular")) return "MEDIUM";

  return "LOW";
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

// 🚀 MAIN FUNCTION
async function main() {
  console.log("🌱 Seeding started...");

  for (const plant of plants) {
    if (!plant.plant_id) {
      console.warn("⚠️ Skipping invalid plant:", plant);
      continue;
    }

    await prisma.plant.upsert({
      where: { plantId: plant.plant_id },
      update: {},

      create: {
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

        category: plant.category,
        categoryType: plant.categoryType ?? null,

        cropType: plant.crop_type ?? null,
        lifeCycle: plant.life_cycle ?? null,
        origin: plant.origin ?? null,

        localNames: plant.local_names ?? null,
        suitableClimate: plant.suitable_climate ?? null,

        minTemp: plant.ideal_temperature_celsius?.min ?? 20,
        maxTemp: plant.ideal_temperature_celsius?.max ?? 30,

        soilType: plant.soil_type ?? null,

        sunlightRequirement: mapSunlight(plant.sunlight_requirement),
        wateringRequirement: mapWater(plant.watering_requirement),

        spaceType: getSpaceCompatibility(plant),

        growthStages: plant.growth_stages ?? null,
        nutrientRequirements: plant.nutrient_requirements ?? null,
        uses: plant.uses ?? null,
        commonIssues: plant.common_issues ?? null,

        isSupportedByModel: plant.is_supported_by_model ?? false,
        imageUrls: plant.image_urls ?? null,
      },
    });
  }

  console.log("✅ Seeding completed successfully");
}

// ▶️ RUN
main()
  .catch((err) => {
    console.error("❌ Error:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });