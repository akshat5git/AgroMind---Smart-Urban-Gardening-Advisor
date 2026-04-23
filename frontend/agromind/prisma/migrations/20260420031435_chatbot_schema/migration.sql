/*
  Warnings:

  - You are about to drop the `ChatbotMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatbotSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');

-- DropForeignKey
ALTER TABLE "ChatbotMessage" DROP CONSTRAINT "ChatbotMessage_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "ChatbotSession" DROP CONSTRAINT "ChatbotSession_userId_fkey";

-- DropTable
DROP TABLE "ChatbotMessage";

-- DropTable
DROP TABLE "ChatbotSession";

-- CreateTable
CREATE TABLE "ChatSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "context" JSONB,
    "lastMessage" TEXT,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meta" JSONB,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChatSession_userId_idx" ON "ChatSession"("userId");

-- CreateIndex
CREATE INDEX "ChatSession_updatedAt_idx" ON "ChatSession"("updatedAt");

-- CreateIndex
CREATE INDEX "Message_chatId_idx" ON "Message"("chatId");

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "ChatSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
