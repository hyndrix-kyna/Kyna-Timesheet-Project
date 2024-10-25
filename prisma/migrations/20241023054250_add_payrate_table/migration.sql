-- CreateTable
CREATE TABLE "PayRate" (
    "id" SERIAL NOT NULL,
    "employeeID" INTEGER NOT NULL,
    "payPeriod" TEXT NOT NULL,
    "payRate" DOUBLE PRECISION NOT NULL,
    "payRateSchedule" TEXT NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayRate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PayRate" ADD CONSTRAINT "PayRate_employeeID_fkey" FOREIGN KEY ("employeeID") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
