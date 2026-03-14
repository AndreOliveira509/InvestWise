/*
  Warnings:

  - You are about to drop the column `patrimonio` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "patrimonio",
ADD COLUMN     "renda_mensal" DECIMAL(65,30) NOT NULL DEFAULT 0;
