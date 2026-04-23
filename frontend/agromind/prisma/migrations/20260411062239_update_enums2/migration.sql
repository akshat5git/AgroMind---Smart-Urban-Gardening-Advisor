/*
  Warnings:

  - You are about to drop the column `latitude` on the `Garden` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Garden` table. All the data in the column will be lost.
  - Added the required column `lat` to the `Garden` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lon` to the `Garden` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Garden" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lon" DOUBLE PRECISION NOT NULL;
