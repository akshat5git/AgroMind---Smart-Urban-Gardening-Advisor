-- CreateEnum
CREATE TYPE "DiseaseType" AS ENUM ('FUNGAL', 'BACTERIAL', 'VIRAL', 'PEST', 'DEFICIENCY');

-- CreateEnum
CREATE TYPE "SeverityLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "Season" AS ENUM ('KHARIF', 'RABI', 'ZAID');

-- CreateTable
CREATE TABLE "Disease" (
    "id" TEXT NOT NULL,
    "diseaseName" TEXT NOT NULL,
    "scientificName" TEXT,
    "diseaseType" "DiseaseType" NOT NULL,
    "plantCategories" TEXT[],
    "description" TEXT,
    "affectedParts" TEXT[],
    "symptoms" TEXT[],
    "causes" TEXT[],
    "favorableMinTemp" DOUBLE PRECISION,
    "favorableMaxTemp" DOUBLE PRECISION,
    "humidity" TEXT,
    "seasons" "Season"[],
    "spreadMethods" TEXT[],
    "severity" "SeverityLevel",
    "lifecycleStages" TEXT[],
    "organicTreatments" JSONB,
    "chemicalTreatments" JSONB,
    "biologicalTreatments" JSONB,
    "prevention" TEXT[],
    "economicImpact" TEXT,
    "isModelDetectable" BOOLEAN NOT NULL DEFAULT false,
    "imageUrls" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Disease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantDisease" (
    "id" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "diseaseId" TEXT NOT NULL,
    "susceptibilityLevel" "SeverityLevel",
    "seasonalRisk" "Season"[],
    "regionSpecific" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlantDisease_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlantDisease_plantId_diseaseId_key" ON "PlantDisease"("plantId", "diseaseId");

-- AddForeignKey
ALTER TABLE "PlantDisease" ADD CONSTRAINT "PlantDisease_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantDisease" ADD CONSTRAINT "PlantDisease_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "Disease"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
