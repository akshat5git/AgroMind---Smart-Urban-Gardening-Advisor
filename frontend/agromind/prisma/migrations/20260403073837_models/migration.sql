/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "Garden" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "spaceType" TEXT NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Garden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "minTemp" DOUBLE PRECISION NOT NULL,
    "maxTemp" DOUBLE PRECISION NOT NULL,
    "spaceNeeded" DOUBLE PRECISION NOT NULL,
    "season" TEXT NOT NULL,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Planting" (
    "id" TEXT NOT NULL,
    "plantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "gardenId" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,

    CONSTRAINT "Planting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareSchedule" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL,
    "lastDone" TIMESTAMP(3),
    "nextDue" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "plantingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CareSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantHealthReport" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "disease" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "plantingId" TEXT NOT NULL,
    "treatment" JSONB NOT NULL,
    "prevention" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlantHealthReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Weather" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Weather_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CropRecommendation" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "spaceType" TEXT NOT NULL,
    "recommended" JSONB NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CropRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatbotSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatbotSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatbotMessage" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatbotMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityPost" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Garden" ADD CONSTRAINT "Garden_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Planting" ADD CONSTRAINT "Planting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Planting" ADD CONSTRAINT "Planting_gardenId_fkey" FOREIGN KEY ("gardenId") REFERENCES "Garden"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Planting" ADD CONSTRAINT "Planting_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareSchedule" ADD CONSTRAINT "CareSchedule_plantingId_fkey" FOREIGN KEY ("plantingId") REFERENCES "Planting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantHealthReport" ADD CONSTRAINT "PlantHealthReport_plantingId_fkey" FOREIGN KEY ("plantingId") REFERENCES "Planting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CropRecommendation" ADD CONSTRAINT "CropRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatbotSession" ADD CONSTRAINT "ChatbotSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatbotMessage" ADD CONSTRAINT "ChatbotMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ChatbotSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
