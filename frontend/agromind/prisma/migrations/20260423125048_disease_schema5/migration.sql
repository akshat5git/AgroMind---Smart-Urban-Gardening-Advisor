/*
  Warnings:

  - You are about to drop the column `categorytype` on the `Plant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plant" DROP COLUMN "categorytype",
ADD COLUMN     "categoryType" TEXT;
