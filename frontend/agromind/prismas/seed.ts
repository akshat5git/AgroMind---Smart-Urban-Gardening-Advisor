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

async function main() {
  for (const plant of plants) {
    await prisma.plant.create({
      data: {
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
        minTemp: plant.ideal_temperature_celsius.min,
        maxTemp: plant.ideal_temperature_celsius.max,

        soilType: plant.soil_type,
        sunlightRequirement: plant.sunlight_requirement,
        wateringRequirement: plant.watering_requirement,

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