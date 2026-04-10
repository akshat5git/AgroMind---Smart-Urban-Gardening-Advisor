/*
  Warnings:

  - Changed the type of `spaceType` on the `Garden` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `sunlight` on the `Garden` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `water` on the `Garden` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SpaceType" ADD VALUE 'BACKYARD';
ALTER TYPE "SpaceType" ADD VALUE 'ROOFTOP';
ALTER TYPE "SpaceType" ADD VALUE 'GREENHOUSE';
ALTER TYPE "SpaceType" ADD VALUE 'COMMUNITY_GARDEN';
ALTER TYPE "SpaceType" ADD VALUE 'VERTICAL_GARDEN';

-- AlterTable
ALTER TABLE "Garden" DROP COLUMN "spaceType",
ADD COLUMN     "spaceType" "SpaceType" NOT NULL,
DROP COLUMN "sunlight",
ADD COLUMN     "sunlight" "Sunlight" NOT NULL,
DROP COLUMN "water",
ADD COLUMN     "water" "Water" NOT NULL;
