import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});


const filePath = path.join(__dirname, "plants.json");
const plants = JSON.parse(fs.readFileSync(filePath, "utf-8"));

const mapSunlight = (value?: string): "LOW" | "MEDIUM" | "FULL" => {
  if (!value) return "MEDIUM";

  const v = value.toLowerCase();

  // FULL sunlight
  if (
    v.includes("full") ||
    v.includes("direct") ||
    v.includes("6") ||
    v.includes("7") ||
    v.includes("8")
  ) {
    return "FULL";
  }

  // MEDIUM sunlight
  if (
    v.includes("partial") ||
    v.includes("moderate") ||
    v.includes("4") ||
    v.includes("5")
  ) {
    return "MEDIUM";
  }

  // LOW sunlight
  return "LOW";
};

const mapWater = (value?: string): "LOW" | "MEDIUM" | "HIGH" => {
  if (!value) return "MEDIUM";

  const v = value.toLowerCase();

  if (v.includes("high") || v.includes("frequent")) return "HIGH";
  if (v.includes("moderate") || v.includes("regular")) return "MEDIUM";

  return "LOW";
};
const getSpaceCompatibility = (plant: any): ("BALCONY" | "TERRACE" | "INDOOR" | "BACKYARD" | "ROOFTOP" | "GREENHOUSE" | "FARM" | "COMMUNITY_GARDEN" | "VERTICAL_GARDEN")[] => {
  const name = plant.common_name?.toLowerCase() || "";
  const category = plant.category?.toLowerCase() || "";

  // 🌿 Herbs & leafy → small space
  if (category.includes("leafy") || category.includes("herb")) {
    return ["INDOOR", "BALCONY", "TERRACE"];
  }

  // 🌱 Normal vegetables
  if (category.includes("vegetable")) {
    return ["BALCONY", "TERRACE", "BACKYARD"];
  }

  // 🌾 Root crops (need soil depth)
  if (category.includes("root")) {
    return ["BACKYARD", "FARM"];
  }

  // 🌳 Trees / large plants
  if (plant.life_cycle?.toLowerCase().includes("perennial")) {
    return ["FARM", "BACKYARD"];
  }

  // Default fallback
  return ["BALCONY", "TERRACE"];
};
async function main() {
  for (const plant of plants) {
  await prisma.plant.upsert({
    where: { plantId: plant.plant_id },

    update: {},

    create: {
      plantId: plant.plant_id,
      commonName: plant.common_name,
      scientificName: plant.scientific_name,
      family: plant.family,
      genus: plant.genus,
      species: plant.species,
      order: plant.order,
      category: plant.category,
      cropType: plant.crop_type,
      lifeCycle: plant.life_cycle,
      className: plant.class,
      origin: plant.origin,
      division: plant.division,
      localNames: plant.local_names,
      suitableClimate: plant.suitable_climate,
      kingdom: plant.kingdom,
      minTemp: plant.ideal_temperature_celsius?.min,
      maxTemp: plant.ideal_temperature_celsius?.max,

      soilType: plant.soil_type,
      sunlightRequirement: mapSunlight(plant.sunlight_requirement),
      wateringRequirement: mapWater(plant.watering_requirement),
      spaceType : getSpaceCompatibility(plant),

      growthStages: plant.growth_stages,
      nutrientRequirements: plant.nutrient_requirements,
      uses: plant.uses,
      commonIssues: plant.common_issues,

      isSupportedByModel: plant.is_supported_by_model,
      imageUrls: plant.image_urls,
    },
  });
}
}

main()
  .then(() => console.log("✅ Data inserted"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());