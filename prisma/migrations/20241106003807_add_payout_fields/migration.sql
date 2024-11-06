/*
  Warnings:

  - Added the required column `payoutMode` to the `Payout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payout" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "payoutFrequency" TEXT,
ADD COLUMN     "payoutMode" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3);
