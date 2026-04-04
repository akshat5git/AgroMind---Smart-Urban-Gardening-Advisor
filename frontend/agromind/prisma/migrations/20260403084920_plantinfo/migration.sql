/*
  Warnings:

  - You are about to drop the column `name` on the `Plant` table. All the data in the column will be lost.
  - You are about to drop the column `season` on the `Plant` table. All the data in the column will be lost.
  - You are about to drop the column `spaceNeeded` on the `Plant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[plantId]` on the table `Plant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `commonName` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plantId` to the `Plant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plant" DROP COLUMN "name",
DROP COLUMN "season",
DROP COLUMN "spaceNeeded",
ADD COLUMN     "className" TEXT,
ADD COLUMN     "commonIssues" JSONB,
ADD COLUMN     "commonName" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "cropType" TEXT,
ADD COLUMN     "division" TEXT,
ADD COLUMN     "family" TEXT,
ADD COLUMN     "genus" TEXT,
ADD COLUMN     "growthStages" JSONB,
ADD COLUMN     "imageUrls" JSONB,
ADD COLUMN     "isSupportedByModel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kingdom" TEXT,
ADD COLUMN     "lifeCycle" TEXT,
ADD COLUMN     "localNames" JSONB,
ADD COLUMN     "nutrientRequirements" JSONB,
ADD COLUMN     "order" TEXT,
ADD COLUMN     "origin" TEXT,
ADD COLUMN     "plantId" TEXT NOT NULL,
ADD COLUMN     "scientificName" TEXT,
ADD COLUMN     "soilType" JSONB,
ADD COLUMN     "species" TEXT,
ADD COLUMN     "suitableClimate" JSONB,
ADD COLUMN     "sunlightRequirement" TEXT,
ADD COLUMN     "uses" JSONB,
ADD COLUMN     "wateringRequirement" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Plant_plantId_key" ON "Plant"("plantId");
