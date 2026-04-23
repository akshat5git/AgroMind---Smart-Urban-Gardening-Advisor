/*
  Warnings:

  - You are about to drop the column `category_type` on the `Plant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plant" DROP COLUMN "category_type",
ADD COLUMN     "categorytype" TEXT;
