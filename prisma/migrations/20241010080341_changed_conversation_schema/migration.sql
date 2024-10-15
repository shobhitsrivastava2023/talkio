/*
  Warnings:

  - Added the required column `recieverId` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "recieverId" TEXT NOT NULL,
ADD COLUMN     "senderId" TEXT NOT NULL;
