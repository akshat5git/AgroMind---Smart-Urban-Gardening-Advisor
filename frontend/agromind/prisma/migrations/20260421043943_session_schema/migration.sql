/*
  Warnings:

  - You are about to drop the column `userId` on the `ChatSession` table. All the data in the column will be lost.
  - Added the required column `userEmail` to the `ChatSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChatSession" DROP CONSTRAINT "ChatSession_userId_fkey";

-- DropIndex
DROP INDEX "ChatSession_userId_idx";

-- AlterTable
ALTER TABLE "ChatSession" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "ChatSession_userEmail_idx" ON "ChatSession"("userEmail");

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
