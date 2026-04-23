import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// ESM fix
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Check DB
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL missing");
  process.exit(1);
}

console.log("DATABASE_URL:", process.env.DATABASE_URL);

// ✅ Prisma with adapter (REQUIRED for your setup)
const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

// 📂 Load JSON file
const filePath = path.join(__dirname, "data", "diseases.json");

if (!fs.existsSync(filePath)) {
  console.error("❌ diseases.json not found at:", filePath);
  process.exit(1);
}

const diseases = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// 🧠 Enum mappers
const mapDiseaseType = (type?: string): any => {
  if (!type) return "FUNGAL";

  const t = type.toLowerCase();

  if (t.includes("fung")) return "FUNGAL";
  if (t.includes("bacter")) return "BACTERIAL";
  if (t.includes("viral")) return "VIRAL";
  if (t.includes("pest")) return "PEST";
  if (t.includes("deficien")) return "DEFICIENCY";

  return "FUNGAL";
};

const mapSeverity = (level?: string): any => {
  if (!level) return "MEDIUM";

  const l = level.toLowerCase();

  if (l.includes("high")) return "HIGH";
  if (l.includes("low")) return "LOW";

  return "MEDIUM";
};

// 🌱 MAIN FUNCTION
async function main() {
  console.log("🦠 Seeding Diseases...");

  for (const disease of diseases) {
    if (!disease.diseaseName) {
      console.warn("⚠️ Skipping invalid entry:", disease);
      continue;
    }

    await prisma.disease.upsert({
      where: {
        diseaseName: disease.diseaseName, // must be @unique
      },

      update: {},

      create: {
        diseaseName: disease.diseaseName,
        scientificName: disease.scientificName || null,

        diseaseType: mapDiseaseType(disease.diseaseType),

        plantCategories: disease.plantCategories || [],
        description: disease.description || null,

        affectedParts: disease.affectedParts || [],
        symptoms: disease.symptoms || [],
        causes: disease.causes || [],

        favorableMinTemp: disease.favorableMinTemp ?? null,
        favorableMaxTemp: disease.favorableMaxTemp ?? null,
        humidity: disease.humidity || null,
        seasons: disease.seasons || [],

        spreadMethods: disease.spreadMethods || [],

        severity: mapSeverity(disease.severity),

        lifecycleStages: disease.lifecycleStages || [],

        organicTreatments: disease.organicTreatments || [],
        chemicalTreatments: disease.chemicalTreatments || [],
        biologicalTreatments: disease.biologicalTreatments || [],

        prevention: disease.prevention || [],

        economicImpact: disease.economicImpact || null,

        isModelDetectable: disease.isModelDetectable ?? true,

        imageUrls: disease.imageUrls || [],
      },
    });
  }

  console.log("✅ Disease data inserted successfully");
}

// 🚀 RUN
main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
