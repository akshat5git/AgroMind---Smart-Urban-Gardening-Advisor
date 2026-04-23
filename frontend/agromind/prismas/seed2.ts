import { PrismaClient } from '@prisma/client'
import plants from './data/plants.json' assert { type: 'json' }
import diseases from './data/diseases.json' assert { type: 'json' }
import mappings from './data/mappings.json' assert { type: 'json' }

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding started...")

  // =========================
  // 1. Insert Plants
  // =========================
  console.log("📥 Inserting plants...")

  const plantMap = {} // PLT001 → DB ID

  for (const plant of plants) {
    const created = await prisma.plant.create({
      data: {
        plantId: plant.plant_id,
        commonName: plant.common_name,
        scientificName: plant.scientific_name,
        family: plant.family,
        category: plant.category,
        cropType: plant.crop_type,
        lifeCycle: plant.life_cycle,
        origin: plant.origin,

        localNames: plant.local_names,
        suitableClimate: plant.suitable_climate,
        minTemp: plant.ideal_temperature_celsius?.min,
        maxTemp: plant.ideal_temperature_celsius?.max,
        soilType: plant.soil_type,

        growthStages: plant.growth_stages,
        nutrientRequirements: plant.nutrient_requirements,
        uses: plant.uses,
        commonIssues: plant.common_issues,

        isSupportedByModel: plant.is_supported_by_model,
        imageUrls: plant.image_urls
      }
    })

    plantMap[plant.plant_id] = created.id
  }

  console.log("✅ Plants inserted")

  // =========================
  // 2. Insert Diseases
  // =========================
  console.log("🦠 Inserting diseases...")

  const diseaseMap = {} // DIS001 → DB ID

  for (const disease of diseases) {
    const created = await prisma.disease.create({
      data: {
        diseaseName: disease.diseaseName,
        scientificName: disease.scientificName,
        diseaseType: disease.diseaseType,

        plantCategories: disease.plantCategories,
        description: disease.description,

        affectedParts: disease.affectedParts,
        symptoms: disease.symptoms,
        causes: disease.causes,

        favorableMinTemp: disease.favorableMinTemp,
        favorableMaxTemp: disease.favorableMaxTemp,
        humidity: disease.humidity,
        seasons: disease.seasons,

        spreadMethods: disease.spreadMethods,
        severity: disease.severity,
        lifecycleStages: disease.lifecycleStages,

        organicTreatments: disease.organicTreatments,
        chemicalTreatments: disease.chemicalTreatments,
        biologicalTreatments: disease.biologicalTreatments,

        prevention: disease.prevention,
        economicImpact: disease.economicImpact,

        isModelDetectable: disease.isModelDetectable,
        imageUrls: disease.imageUrls
      }
    })

    diseaseMap[disease.diseaseId] = created.id
  }

  console.log("✅ Diseases inserted")

  // =========================
  // 3. Insert Plant-Disease Mapping
  // =========================
  console.log("🔗 Mapping plants ↔ diseases...")

  for (const map of mappings) {
    const plantId = plantMap[map.plantRef]
    const diseaseId = diseaseMap[map.diseaseRef]

    if (!plantId || !diseaseId) {
      console.warn("⚠️ Skipping invalid mapping:", map)
      continue
    }

    await prisma.plantDisease.create({
      data: {
        plantId,
        diseaseId,
        susceptibilityLevel: map.susceptibilityLevel,
        seasonalRisk: map.seasonalRisk,
        regionSpecific: map.regionSpecific
      }
    })
  }

  console.log("✅ Mapping completed")

  console.log("🎉 Seeding finished successfully")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
