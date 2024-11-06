/*
  Warnings:

  - You are about to drop the column `payPeriod` on the `PayRate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PayRate" DROP COLUMN "payPeriod";

-- CreateTable
CREATE TABLE "Payout" (
    "id" SERIAL NOT NULL,
    "employeeID" INTEGER NOT NULL,
    "payoutDate" TIMESTAMP(3) NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "payrollAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_employeeID_fkey" FOREIGN KEY ("employeeID") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
